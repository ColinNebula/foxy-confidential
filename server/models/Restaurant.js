const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');

class Restaurant {
  // Create a new restaurant
  static async create(restaurantData) {
    const connection = await beginTransaction();
    
    try {
      // Insert restaurant
      const sql = `
        INSERT INTO restaurants 
        (name, cuisine, description, address, city, state, zip_code, country, phone, email, website, 
         price_range, open_since, image_url, gallery_images, opening_hours, amenities, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        restaurantData.name,
        restaurantData.cuisine,
        restaurantData.description,
        restaurantData.address,
        restaurantData.city,
        restaurantData.state,
        restaurantData.zip_code,
        restaurantData.country || 'USA',
        restaurantData.phone,
        restaurantData.email,
        restaurantData.website,
        restaurantData.price_range,
        restaurantData.open_since,
        restaurantData.image_url,
        JSON.stringify(restaurantData.gallery_images || []),
        JSON.stringify(restaurantData.opening_hours || {}),
        JSON.stringify(restaurantData.amenities || []),
        restaurantData.created_by
      ];
      
      const [result] = await connection.execute(sql, params);
      const restaurantId = result.insertId;
      
      // Insert awards if provided
      if (restaurantData.awards && restaurantData.awards.length > 0) {
        for (const award of restaurantData.awards) {
          await connection.execute(
            'INSERT INTO restaurant_awards (restaurant_id, award_name, award_year, award_description) VALUES (?, ?, ?, ?)',
            [restaurantId, award.name, award.year, award.description]
          );
        }
      }
      
      // Insert highlights if provided
      if (restaurantData.highlights && restaurantData.highlights.length > 0) {
        for (const highlight of restaurantData.highlights) {
          await connection.execute(
            'INSERT INTO restaurant_highlights (restaurant_id, highlight) VALUES (?, ?)',
            [restaurantId, highlight]
          );
        }
      }
      
      await commitTransaction(connection);
      return restaurantId;
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }

  // Find restaurant by ID with all related data
  static async findById(id) {
    const sql = `
      SELECT r.*, 
             GROUP_CONCAT(DISTINCT ra.award_name) as awards,
             GROUP_CONCAT(DISTINCT rh.highlight) as highlights
      FROM restaurants r
      LEFT JOIN restaurant_awards ra ON r.id = ra.restaurant_id
      LEFT JOIN restaurant_highlights rh ON r.id = rh.restaurant_id
      WHERE r.id = ? AND r.is_active = TRUE
      GROUP BY r.id
    `;
    
    const result = await query(sql, [id]);
    const restaurant = result.rows[0];
    
    if (restaurant) {
      // Parse JSON fields
      restaurant.gallery_images = JSON.parse(restaurant.gallery_images || '[]');
      restaurant.opening_hours = JSON.parse(restaurant.opening_hours || '{}');
      restaurant.amenities = JSON.parse(restaurant.amenities || '[]');
      restaurant.awards = restaurant.awards ? restaurant.awards.split(',') : [];
      restaurant.highlights = restaurant.highlights ? restaurant.highlights.split(',') : [];
    }
    
    return restaurant || null;
  }

  // Get all restaurants with ratings and filters
  static async getAll(filters = {}) {
    let sql = `
      SELECT r.id, r.name, r.cuisine, r.description, r.city, r.price_range, r.image_url, r.featured,
             AVG(rv.overall_rating) as avg_rating,
             COUNT(rv.id) as review_count,
             GROUP_CONCAT(DISTINCT ra.award_name) as awards,
             GROUP_CONCAT(DISTINCT rh.highlight) as highlights
      FROM restaurants r
      LEFT JOIN reviews rv ON r.id = rv.restaurant_id AND rv.status = 'approved'
      LEFT JOIN restaurant_awards ra ON r.id = ra.restaurant_id
      LEFT JOIN restaurant_highlights rh ON r.id = rh.restaurant_id
      WHERE r.is_active = TRUE
    `;
    
    const params = [];
    
    // Apply filters
    if (filters.cuisine) {
      sql += ' AND r.cuisine = ?';
      params.push(filters.cuisine);
    }
    
    if (filters.city) {
      sql += ' AND r.city = ?';
      params.push(filters.city);
    }
    
    if (filters.price_range) {
      sql += ' AND r.price_range = ?';
      params.push(filters.price_range);
    }
    
    if (filters.featured) {
      sql += ' AND r.featured = TRUE';
    }
    
    if (filters.min_rating) {
      sql += ' AND r.id IN (SELECT restaurant_id FROM reviews WHERE overall_rating >= ? AND status = "approved")';
      params.push(filters.min_rating);
    }
    
    if (filters.search) {
      sql += ' AND (r.name LIKE ? OR r.description LIKE ? OR r.cuisine LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    sql += ' GROUP BY r.id';
    
    // Apply sorting
    if (filters.sort_by === 'rating') {
      sql += ' ORDER BY avg_rating DESC';
    } else if (filters.sort_by === 'reviews') {
      sql += ' ORDER BY review_count DESC';
    } else if (filters.sort_by === 'name') {
      sql += ' ORDER BY r.name ASC';
    } else {
      sql += ' ORDER BY r.created_at DESC';
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const result = await query(sql, params);
    const restaurants = result.rows.map(restaurant => ({
      ...restaurant,
      awards: restaurant.awards ? restaurant.awards.split(',') : [],
      highlights: restaurant.highlights ? restaurant.highlights.split(',') : [],
      avg_rating: parseFloat(restaurant.avg_rating) || 0
    }));
    
    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM restaurants r WHERE r.is_active = TRUE';
    let countParams = [];
    
    // Apply same filters for count
    if (filters.cuisine) {
      countSql += ' AND r.cuisine = ?';
      countParams.push(filters.cuisine);
    }
    
    if (filters.city) {
      countSql += ' AND r.city = ?';
      countParams.push(filters.city);
    }
    
    if (filters.price_range) {
      countSql += ' AND r.price_range = ?';
      countParams.push(filters.price_range);
    }
    
    if (filters.featured) {
      countSql += ' AND r.featured = TRUE';
    }
    
    if (filters.search) {
      countSql += ' AND (r.name LIKE ? OR r.description LIKE ? OR r.cuisine LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    const countResult = await query(countSql, countParams);
    
    return {
      restaurants,
      total: countResult.rows[0].total,
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  // Update restaurant
  static async update(id, updateData) {
    const connection = await beginTransaction();
    
    try {
      // Update main restaurant data
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined && !['awards', 'highlights'].includes(key)) {
          if (['gallery_images', 'opening_hours', 'amenities'].includes(key)) {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(value));
          } else {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        }
      }
      
      if (fields.length > 0) {
        values.push(id);
        const sql = `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`;
        await connection.execute(sql, values);
      }
      
      // Update awards if provided
      if (updateData.awards) {
        await connection.execute('DELETE FROM restaurant_awards WHERE restaurant_id = ?', [id]);
        for (const award of updateData.awards) {
          await connection.execute(
            'INSERT INTO restaurant_awards (restaurant_id, award_name, award_year, award_description) VALUES (?, ?, ?, ?)',
            [id, award.name, award.year, award.description]
          );
        }
      }
      
      // Update highlights if provided
      if (updateData.highlights) {
        await connection.execute('DELETE FROM restaurant_highlights WHERE restaurant_id = ?', [id]);
        for (const highlight of updateData.highlights) {
          await connection.execute(
            'INSERT INTO restaurant_highlights (restaurant_id, highlight) VALUES (?, ?)',
            [id, highlight]
          );
        }
      }
      
      await commitTransaction(connection);
      return true;
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }

  // Delete restaurant (soft delete)
  static async delete(id) {
    const sql = 'UPDATE restaurants SET is_active = FALSE WHERE id = ?';
    const result = await query(sql, [id]);
    return result.rows.affectedRows > 0;
  }

  // Get featured restaurants
  static async getFeatured(limit = 5) {
    const sql = `
      SELECT r.*, AVG(rv.overall_rating) as avg_rating, COUNT(rv.id) as review_count
      FROM restaurants r
      LEFT JOIN reviews rv ON r.id = rv.restaurant_id AND rv.status = 'approved'
      WHERE r.featured = TRUE AND r.is_active = TRUE
      GROUP BY r.id
      ORDER BY avg_rating DESC
      LIMIT ?
    `;
    
    const result = await query(sql, [limit]);
    return result.rows.map(restaurant => ({
      ...restaurant,
      avg_rating: parseFloat(restaurant.avg_rating) || 0
    }));
  }

  // Get top rated restaurants
  static async getTopRated(limit = 10) {
    const sql = `
      SELECT r.*, AVG(rv.overall_rating) as avg_rating, COUNT(rv.id) as review_count
      FROM restaurants r
      INNER JOIN reviews rv ON r.id = rv.restaurant_id AND rv.status = 'approved'
      WHERE r.is_active = TRUE
      GROUP BY r.id
      HAVING COUNT(rv.id) >= 3
      ORDER BY avg_rating DESC
      LIMIT ?
    `;
    
    const result = await query(sql, [limit]);
    return result.rows.map(restaurant => ({
      ...restaurant,
      avg_rating: parseFloat(restaurant.avg_rating) || 0
    }));
  }

  // Get restaurants by cuisine
  static async getByCuisine(cuisine, limit = 10) {
    const sql = `
      SELECT r.*, AVG(rv.overall_rating) as avg_rating, COUNT(rv.id) as review_count
      FROM restaurants r
      LEFT JOIN reviews rv ON r.id = rv.restaurant_id AND rv.status = 'approved'
      WHERE r.cuisine = ? AND r.is_active = TRUE
      GROUP BY r.id
      ORDER BY avg_rating DESC
      LIMIT ?
    `;
    
    const result = await query(sql, [cuisine, limit]);
    return result.rows.map(restaurant => ({
      ...restaurant,
      avg_rating: parseFloat(restaurant.avg_rating) || 0
    }));
  }
}

module.exports = Restaurant;
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');

class Review {
  // Create a new review
  static async create(reviewData) {
    const sql = `
      INSERT INTO reviews 
      (restaurant_id, user_id, title, content, food_rating, taste_rating, ambiance_rating, 
       creativity_rating, uniqueness_rating, visit_date, images, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      reviewData.restaurant_id,
      reviewData.user_id,
      reviewData.title,
      reviewData.content,
      reviewData.food_rating,
      reviewData.taste_rating,
      reviewData.ambiance_rating,
      reviewData.creativity_rating,
      reviewData.uniqueness_rating,
      reviewData.visit_date,
      JSON.stringify(reviewData.images || []),
      reviewData.status || 'pending'
    ];
    
    const result = await query(sql, params);
    return result.rows.insertId;
  }

  // Find review by ID
  static async findById(id) {
    const sql = `
      SELECT r.*, u.username, u.first_name, u.last_name, u.avatar_url,
             rest.name as restaurant_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE r.id = ?
    `;
    
    const result = await query(sql, [id]);
    const review = result.rows[0];
    
    if (review) {
      review.images = JSON.parse(review.images || '[]');
    }
    
    return review || null;
  }

  // Get reviews for a restaurant
  static async getByRestaurant(restaurantId, filters = {}) {
    let sql = `
      SELECT r.*, u.username, u.first_name, u.last_name, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.restaurant_id = ? AND r.status = 'approved'
    `;
    
    const params = [restaurantId];
    
    // Apply filters
    if (filters.min_rating) {
      sql += ' AND r.overall_rating >= ?';
      params.push(filters.min_rating);
    }
    
    if (filters.user_id) {
      sql += ' AND r.user_id = ?';
      params.push(filters.user_id);
    }
    
    // Apply sorting
    if (filters.sort_by === 'rating_desc') {
      sql += ' ORDER BY r.overall_rating DESC';
    } else if (filters.sort_by === 'rating_asc') {
      sql += ' ORDER BY r.overall_rating ASC';
    } else if (filters.sort_by === 'helpful') {
      sql += ' ORDER BY r.helpful_count DESC';
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
    const reviews = result.rows.map(review => ({
      ...review,
      images: JSON.parse(review.images || '[]')
    }));
    
    // Get total count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM reviews r 
      WHERE r.restaurant_id = ? AND r.status = 'approved'
      ${filters.min_rating ? 'AND r.overall_rating >= ?' : ''}
      ${filters.user_id ? 'AND r.user_id = ?' : ''}
    `;
    
    let countParams = [restaurantId];
    if (filters.min_rating) countParams.push(filters.min_rating);
    if (filters.user_id) countParams.push(filters.user_id);
    
    const countResult = await query(countSql, countParams);
    
    return {
      reviews,
      total: countResult.rows[0].total,
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  // Get reviews by user
  static async getByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT r.*, rest.name as restaurant_name, rest.cuisine
      FROM reviews r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await query(sql, [userId, limit, offset]);
    const reviews = result.rows.map(review => ({
      ...review,
      images: JSON.parse(review.images || '[]')
    }));
    
    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM reviews WHERE user_id = ?',
      [userId]
    );
    
    return {
      reviews,
      total: countResult.rows[0].total,
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  // Update review
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        if (key === 'images') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const sql = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, values);
    return result.rows.affectedRows > 0;
  }

  // Delete review
  static async delete(id) {
    const sql = 'DELETE FROM reviews WHERE id = ?';
    const result = await query(sql, [id]);
    return result.rows.affectedRows > 0;
  }

  // Add reaction to review
  static async addReaction(reviewId, userId, reactionType) {
    const connection = await beginTransaction();
    
    try {
      // Remove existing reaction from this user
      await connection.execute(
        'DELETE FROM review_reactions WHERE review_id = ? AND user_id = ?',
        [reviewId, userId]
      );
      
      // Add new reaction
      await connection.execute(
        'INSERT INTO review_reactions (review_id, user_id, reaction_type) VALUES (?, ?, ?)',
        [reviewId, userId, reactionType]
      );
      
      // Update reaction counts
      const [helpfulResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM review_reactions WHERE review_id = ? AND reaction_type = "helpful"',
        [reviewId]
      );
      
      const [unhelpfulResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM review_reactions WHERE review_id = ? AND reaction_type = "unhelpful"',
        [reviewId]
      );
      
      await connection.execute(
        'UPDATE reviews SET helpful_count = ?, unhelpful_count = ? WHERE id = ?',
        [helpfulResult[0].count, unhelpfulResult[0].count, reviewId]
      );
      
      await commitTransaction(connection);
      return true;
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }

  // Remove reaction from review
  static async removeReaction(reviewId, userId) {
    const connection = await beginTransaction();
    
    try {
      // Remove reaction
      await connection.execute(
        'DELETE FROM review_reactions WHERE review_id = ? AND user_id = ?',
        [reviewId, userId]
      );
      
      // Update reaction counts
      const [helpfulResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM review_reactions WHERE review_id = ? AND reaction_type = "helpful"',
        [reviewId]
      );
      
      const [unhelpfulResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM review_reactions WHERE review_id = ? AND reaction_type = "unhelpful"',
        [reviewId]
      );
      
      await connection.execute(
        'UPDATE reviews SET helpful_count = ?, unhelpful_count = ? WHERE id = ?',
        [helpfulResult[0].count, unhelpfulResult[0].count, reviewId]
      );
      
      await commitTransaction(connection);
      return true;
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }

  // Get user's reaction to a review
  static async getUserReaction(reviewId, userId) {
    const sql = 'SELECT reaction_type FROM review_reactions WHERE review_id = ? AND user_id = ?';
    const result = await query(sql, [reviewId, userId]);
    return result.rows[0]?.reaction_type || null;
  }

  // Get pending reviews for moderation
  static async getPendingReviews(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT r.*, u.username, u.first_name, u.last_name, rest.name as restaurant_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at ASC
      LIMIT ? OFFSET ?
    `;
    
    const result = await query(sql, [limit, offset]);
    const reviews = result.rows.map(review => ({
      ...review,
      images: JSON.parse(review.images || '[]')
    }));
    
    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM reviews WHERE status = "pending"'
    );
    
    return {
      reviews,
      total: countResult.rows[0].total,
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  // Moderate review (approve/reject)
  static async moderate(id, status, moderatedBy) {
    const sql = 'UPDATE reviews SET status = ?, moderated_by = ?, moderated_at = NOW() WHERE id = ?';
    const result = await query(sql, [status, moderatedBy, id]);
    return result.rows.affectedRows > 0;
  }

  // Get restaurant rating statistics
  static async getRestaurantStats(restaurantId) {
    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(overall_rating) as avg_overall_rating,
        AVG(food_rating) as avg_food_rating,
        AVG(taste_rating) as avg_taste_rating,
        AVG(ambiance_rating) as avg_ambiance_rating,
        AVG(creativity_rating) as avg_creativity_rating,
        AVG(uniqueness_rating) as avg_uniqueness_rating,
        COUNT(CASE WHEN overall_rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN overall_rating = 4 THEN 1 END) as four_star_count,
        COUNT(CASE WHEN overall_rating = 3 THEN 1 END) as three_star_count,
        COUNT(CASE WHEN overall_rating = 2 THEN 1 END) as two_star_count,
        COUNT(CASE WHEN overall_rating = 1 THEN 1 END) as one_star_count
      FROM reviews 
      WHERE restaurant_id = ? AND status = 'approved'
    `;
    
    const result = await query(sql, [restaurantId]);
    const stats = result.rows[0];
    
    // Calculate percentages
    if (stats.total_reviews > 0) {
      stats.five_star_percentage = (stats.five_star_count / stats.total_reviews) * 100;
      stats.four_star_percentage = (stats.four_star_count / stats.total_reviews) * 100;
      stats.three_star_percentage = (stats.three_star_count / stats.total_reviews) * 100;
      stats.two_star_percentage = (stats.two_star_count / stats.total_reviews) * 100;
      stats.one_star_percentage = (stats.one_star_count / stats.total_reviews) * 100;
    }
    
    return stats;
  }
}

module.exports = Review;
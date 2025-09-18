const { query } = require('../config/database');

class Admin {
  // Create admin
  static async create(userId, role = 'admin', permissions = {}) {
    const sql = 'INSERT INTO admins (user_id, role, permissions) VALUES (?, ?, ?)';
    const result = await query(sql, [userId, role, JSON.stringify(permissions)]);
    return result.rows.insertId;
  }

  // Find admin by user ID
  static async findByUserId(userId) {
    const sql = `
      SELECT a.*, u.username, u.email, u.first_name, u.last_name
      FROM admins a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ? AND u.is_active = TRUE
    `;
    const result = await query(sql, [userId]);
    const admin = result.rows[0];
    
    if (admin) {
      admin.permissions = JSON.parse(admin.permissions || '{}');
    }
    
    return admin || null;
  }

  // Check if user is admin
  static async isAdmin(userId) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM admins a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ? AND u.is_active = TRUE
    `;
    const result = await query(sql, [userId]);
    return result.rows[0].count > 0;
  }

  // Check if user has specific permission
  static async hasPermission(userId, resource, action) {
    const admin = await this.findByUserId(userId);
    if (!admin) return false;
    
    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;
    
    // Check specific permissions
    const resourcePermissions = admin.permissions[resource];
    if (!resourcePermissions) return false;
    
    return resourcePermissions.includes(action);
  }

  // Get all admins
  static async getAll() {
    const sql = `
      SELECT a.*, u.username, u.email, u.first_name, u.last_name, u.last_login, u.created_at
      FROM admins a
      JOIN users u ON a.user_id = u.id
      WHERE u.is_active = TRUE
      ORDER BY a.created_at DESC
    `;
    const result = await query(sql);
    
    return result.rows.map(admin => ({
      ...admin,
      permissions: JSON.parse(admin.permissions || '{}')
    }));
  }

  // Update admin permissions
  static async updatePermissions(userId, permissions) {
    const sql = 'UPDATE admins SET permissions = ? WHERE user_id = ?';
    const result = await query(sql, [JSON.stringify(permissions), userId]);
    return result.rows.affectedRows > 0;
  }

  // Update admin role
  static async updateRole(userId, role) {
    const sql = 'UPDATE admins SET role = ? WHERE user_id = ?';
    const result = await query(sql, [role, userId]);
    return result.rows.affectedRows > 0;
  }

  // Remove admin privileges
  static async remove(userId) {
    const sql = 'DELETE FROM admins WHERE user_id = ?';
    const result = await query(sql, [userId]);
    return result.rows.affectedRows > 0;
  }

  // Get admin dashboard statistics
  static async getDashboardStats() {
    const stats = {};
    
    // Total users
    const userResult = await query('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
    stats.total_users = userResult.rows[0].count;
    
    // Total restaurants
    const restaurantResult = await query('SELECT COUNT(*) as count FROM restaurants WHERE is_active = TRUE');
    stats.total_restaurants = restaurantResult.rows[0].count;
    
    // Total reviews
    const reviewResult = await query('SELECT COUNT(*) as count FROM reviews WHERE status = "approved"');
    stats.total_reviews = reviewResult.rows[0].count;
    
    // Pending reviews
    const pendingResult = await query('SELECT COUNT(*) as count FROM reviews WHERE status = "pending"');
    stats.pending_reviews = pendingResult.rows[0].count;
    
    // Recent activity
    const recentUsersResult = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_active = TRUE
    `);
    stats.new_users_30_days = recentUsersResult.rows[0].count;
    
    const recentReviewsResult = await query(`
      SELECT COUNT(*) as count 
      FROM reviews 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    stats.new_reviews_30_days = recentReviewsResult.rows[0].count;
    
    // Top rated restaurants
    const topRestaurantsResult = await query(`
      SELECT r.name, AVG(rv.overall_rating) as avg_rating, COUNT(rv.id) as review_count
      FROM restaurants r
      JOIN reviews rv ON r.id = rv.restaurant_id
      WHERE rv.status = 'approved' AND r.is_active = TRUE
      GROUP BY r.id, r.name
      HAVING COUNT(rv.id) >= 3
      ORDER BY avg_rating DESC
      LIMIT 5
    `);
    stats.top_restaurants = topRestaurantsResult.rows;
    
    // Rating distribution
    const ratingDistResult = await query(`
      SELECT 
        overall_rating,
        COUNT(*) as count
      FROM reviews 
      WHERE status = 'approved'
      GROUP BY overall_rating
      ORDER BY overall_rating DESC
    `);
    stats.rating_distribution = ratingDistResult.rows;
    
    return stats;
  }
}

module.exports = Admin;
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');

class User {
  // Create a new user
  static async create(userData) {
    const sql = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name,
      userData.avatar_url || null
    ];
    
    const result = await query(sql, params);
    return result.rows.insertId;
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const result = await query(sql, [email]);
    return result.rows[0] || null;
  }

  // Find user by username
  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
    const result = await query(sql, [username]);
    return result.rows[0] || null;
  }

  // Update user
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, values);
    return result.rows.affectedRows > 0;
  }

  // Delete user (soft delete)
  static async delete(id) {
    const sql = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    const result = await query(sql, [id]);
    return result.rows.affectedRows > 0;
  }

  // Get all users with pagination
  static async getAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let sql = 'SELECT id, username, email, first_name, last_name, avatar_url, last_login, created_at FROM users WHERE is_active = TRUE';
    let params = [];

    if (search) {
      sql += ' AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE is_active = TRUE';
    let countParams = [];
    
    if (search) {
      countSql += ' AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    const countResult = await query(countSql, countParams);
    
    return {
      users: result.rows,
      total: countResult.rows[0].total,
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  // Update last login
  static async updateLastLogin(id) {
    const sql = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    await query(sql, [id]);
  }

  // Set email verification token
  static async setEmailVerificationToken(id, token) {
    const sql = 'UPDATE users SET email_verification_token = ? WHERE id = ?';
    await query(sql, [token, id]);
  }

  // Verify email
  static async verifyEmail(token) {
    const sql = 'UPDATE users SET email_verified = TRUE, email_verification_token = NULL WHERE email_verification_token = ?';
    const result = await query(sql, [token]);
    return result.rows.affectedRows > 0;
  }

  // Set password reset token
  static async setPasswordResetToken(email, token, expires) {
    const sql = 'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?';
    await query(sql, [token, expires, email]);
  }

  // Reset password
  static async resetPassword(token, newPasswordHash) {
    const sql = `
      UPDATE users 
      SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL 
      WHERE reset_password_token = ? AND reset_password_expires > NOW()
    `;
    const result = await query(sql, [newPasswordHash, token]);
    return result.rows.affectedRows > 0;
  }
}

module.exports = User;
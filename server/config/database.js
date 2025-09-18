const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foxy_confidential',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+00:00'
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database with schema if needed
const initializeDatabase = async () => {
  try {
    // Check if database exists and has tables
    const [rows] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME || 'foxy_confidential']
    );
    
    if (rows[0].count === 0) {
      console.log('📋 Database is empty. Please run the SQL schema file manually.');
    } else {
      console.log(`✅ Database initialized with ${rows[0].count} tables`);
    }
  } catch (error) {
    console.error('❌ Database initialization check failed:', error.message);
  }
};

// Execute raw SQL query
const query = async (sql, params = []) => {
  try {
    const [rows, fields] = await promisePool.execute(sql, params);
    return { rows, fields };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Begin transaction
const beginTransaction = async () => {
  const connection = await promisePool.getConnection();
  await connection.beginTransaction();
  return connection;
};

// Commit transaction
const commitTransaction = async (connection) => {
  await connection.commit();
  connection.release();
};

// Rollback transaction
const rollbackTransaction = async (connection) => {
  await connection.rollback();
  connection.release();
};

module.exports = {
  pool,
  promisePool,
  testConnection,
  initializeDatabase,
  query,
  beginTransaction,
  commitTransaction,
  rollbackTransaction
};
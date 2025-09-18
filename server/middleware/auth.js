const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (userId, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    // First authenticate as user
    await authenticate(req, res, () => {});
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Check if user is admin
    const isAdmin = await Admin.isAdmin(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    // Get admin details
    const admin = await Admin.findByUserId(req.user.id);
    req.admin = admin;
    
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin authentication.'
    });
  }
};

// Permission-based middleware
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required.'
        });
      }

      const hasPermission = await Admin.hasPermission(req.user.id, resource, action);
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Permission denied. Required: ${action} on ${resource}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during permission check.'
      });
    }
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if there's an error
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authenticateAdmin,
  requirePermission,
  optionalAuth
};
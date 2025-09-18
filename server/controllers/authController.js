const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = await User.create({
      username,
      email,
      password_hash,
      first_name,
      last_name
    });

    // Generate email verification token
    const verificationToken = uuidv4();
    await User.setEmailVerificationToken(userId, verificationToken);

    // Generate JWT token
    const token = generateToken(userId);

    // Get user data (without password)
    const user = await User.findById(userId);
    delete user.password_hash;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
        verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = generateToken(user.id);

    // Check if user is admin
    const isAdmin = await Admin.isAdmin(user.id);
    let adminData = null;
    if (isAdmin) {
      adminData = await Admin.findByUserId(user.id);
    }

    // Remove password from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
        isAdmin,
        adminData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = { ...req.user };
    delete user.password_hash;

    // Check if user is admin
    const isAdmin = await Admin.isAdmin(user.id);
    let adminData = null;
    if (isAdmin) {
      adminData = await Admin.findByUserId(user.id);
    }

    res.json({
      success: true,
      data: {
        user,
        isAdmin,
        adminData
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, username, avatar_url } = req.body;
    const userId = req.user.id;

    // Check if username is taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Update user
    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (username !== undefined) updateData.username = username;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    const updated = await User.update(userId, updateData);
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'No changes made'
      });
    }

    // Get updated user data
    const user = await User.findById(userId);
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, req.user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await User.update(userId, { password_hash });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const verified = await User.verifyEmail(token);
    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal whether user exists
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await User.setPasswordResetToken(email, resetToken, resetExpires);

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    // Hash new password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(new_password, saltRounds);

    const reset = await User.resetPassword(token, password_hash);
    if (!reset) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  requestPasswordReset,
  resetPassword
};
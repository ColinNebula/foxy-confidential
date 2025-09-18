const express = require('express');
const router = express.Router();

// Simple routes for now - can be expanded later
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Admin endpoint - coming soon'
  });
});

module.exports = router;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Foxy Confidential API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;
  
  // Simulate validation
  if (!username || !email || !password || !first_name || !last_name) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
      errors: []
    });
  }

  // Mock successful registration
  res.status(201).json({
    success: true,
    message: 'User registered successfully (MOCK)',
    data: {
      user: {
        id: 1,
        username,
        email,
        first_name,
        last_name,
        created_at: new Date().toISOString()
      },
      token: 'mock_jwt_token_12345'
    }
  });
});

// Mock restaurants endpoint
app.get('/api/restaurants', (req, res) => {
  const mockRestaurants = [
    {
      id: 1,
      name: "Le Bernardin",
      cuisine: "French Seafood",
      description: "An absolute masterpiece of culinary excellence. Chef Eric Ripert's innovative approach to seafood creates an unforgettable dining experience.",
      city: "New York",
      price_range: "$$$$",
      avg_rating: 4.8,
      review_count: 150,
      awards: ["Michelin 3-Star", "James Beard Award"],
      highlights: ["Fresh Seafood", "Innovative Techniques", "Fine Dining"]
    },
    {
      id: 2,
      name: "Eleven Madison Park",
      cuisine: "Contemporary American",
      description: "A plant-based fine dining experience that redefines modern American cuisine with creativity and precision.",
      city: "New York",
      price_range: "$$$$",
      avg_rating: 4.7,
      review_count: 89,
      awards: ["Michelin 3-Star", "World's 50 Best"],
      highlights: ["Plant-Based", "Creative", "Artistic Presentation"]
    },
    {
      id: 3,
      name: "The French Laundry",
      cuisine: "French Contemporary",
      description: "Thomas Keller's culinary masterpiece in Napa Valley, offering an unparalleled fine dining experience.",
      city: "Yountville",
      price_range: "$$$$",
      avg_rating: 4.9,
      review_count: 203,
      awards: ["Michelin 3-Star", "AAA Five Diamond"],
      highlights: ["Wine Pairing", "Garden-to-Table", "Exceptional Service"]
    }
  ];

  res.json({
    success: true,
    data: {
      restaurants: mockRestaurants,
      total: mockRestaurants.length,
      page: 1,
      totalPages: 1
    }
  });
});

// Mock featured restaurants
app.get('/api/restaurants/featured', (req, res) => {
  const featuredRestaurants = [
    {
      id: 1,
      name: "Le Bernardin",
      cuisine: "French Seafood",
      avg_rating: 4.8,
      review_count: 150
    }
  ];

  res.json({
    success: true,
    data: { restaurants: featuredRestaurants }
  });
});

// Mock reviews endpoint
app.get('/api/reviews', (req, res) => {
  res.json({
    success: true,
    message: 'Reviews endpoint - working with mock data',
    data: {
      reviews: [],
      total: 0
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🦊 Foxy Confidential API Server (TEST MODE)
==========================================
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Database: MOCK DATA (no database required)
⏰ Started at: ${new Date().toISOString()}

API Endpoints:
- Health Check: http://localhost:${PORT}/health
- Register User: POST http://localhost:${PORT}/api/auth/register
- Get Restaurants: http://localhost:${PORT}/api/restaurants
- Get Featured: http://localhost:${PORT}/api/restaurants/featured
- Get Reviews: http://localhost:${PORT}/api/reviews
  `);
});

module.exports = app;
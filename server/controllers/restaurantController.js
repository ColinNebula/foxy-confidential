const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');

// Get all restaurants with filters
const getAllRestaurants = async (req, res) => {
  try {
    const filters = {
      cuisine: req.query.cuisine,
      city: req.query.city,
      price_range: req.query.price_range,
      featured: req.query.featured === 'true',
      min_rating: parseFloat(req.query.min_rating) || undefined,
      search: req.query.search,
      sort_by: req.query.sort_by,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    const result = await Restaurant.getAll(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting restaurants'
    });
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get restaurant rating statistics
    const stats = await Review.getRestaurantStats(id);

    res.json({
      success: true,
      data: {
        restaurant,
        stats
      }
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting restaurant'
    });
  }
};

// Create new restaurant (admin only)
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      created_by: req.user.id
    };

    const restaurantId = await Restaurant.create(restaurantData);

    const restaurant = await Restaurant.findById(restaurantId);

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: { restaurant }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating restaurant'
    });
  }
};

// Update restaurant (admin only)
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const updated = await Restaurant.update(id, updateData);
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'No changes made'
      });
    }

    const updatedRestaurant = await Restaurant.findById(id);

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: { restaurant: updatedRestaurant }
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating restaurant'
    });
  }
};

// Delete restaurant (admin only)
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const deleted = await Restaurant.delete(id);
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete restaurant'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting restaurant'
    });
  }
};

// Get featured restaurants
const getFeaturedRestaurants = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const restaurants = await Restaurant.getFeatured(limit);

    res.json({
      success: true,
      data: { restaurants }
    });
  } catch (error) {
    console.error('Get featured restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting featured restaurants'
    });
  }
};

// Get top rated restaurants
const getTopRatedRestaurants = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const restaurants = await Restaurant.getTopRated(limit);

    res.json({
      success: true,
      data: { restaurants }
    });
  } catch (error) {
    console.error('Get top rated restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting top rated restaurants'
    });
  }
};

// Get restaurants by cuisine
const getRestaurantsByCuisine = async (req, res) => {
  try {
    const { cuisine } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const restaurants = await Restaurant.getByCuisine(cuisine, limit);

    res.json({
      success: true,
      data: { restaurants }
    });
  } catch (error) {
    console.error('Get restaurants by cuisine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting restaurants by cuisine'
    });
  }
};

// Toggle restaurant featured status (admin only)
const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const updated = await Restaurant.update(id, { featured: !restaurant.featured });
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update featured status'
      });
    }

    res.json({
      success: true,
      message: `Restaurant ${restaurant.featured ? 'unfeatured' : 'featured'} successfully`
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling featured status'
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFeaturedRestaurants,
  getTopRatedRestaurants,
  getRestaurantsByCuisine,
  toggleFeatured
};
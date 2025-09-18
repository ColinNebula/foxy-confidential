const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFeaturedRestaurants,
  getTopRatedRestaurants,
  getRestaurantsByCuisine,
  toggleFeatured
} = require('../controllers/restaurantController');

const { optionalAuth, authenticateAdmin, requirePermission } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');

// Validation rules
const createRestaurantValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Restaurant name is required and must be less than 100 characters'),
  body('cuisine')
    .isLength({ min: 1, max: 50 })
    .withMessage('Cuisine is required and must be less than 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),
  body('city')
    .optional()
    .isLength({ max: 50 })
    .withMessage('City must be less than 50 characters'),
  body('state')
    .optional()
    .isLength({ max: 50 })
    .withMessage('State must be less than 50 characters'),
  body('zip_code')
    .optional()
    .isLength({ max: 10 })
    .withMessage('ZIP code must be less than 10 characters'),
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone must be less than 20 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Must be a valid URL'),
  body('price_range')
    .isIn(['$', '$$', '$$$', '$$$$'])
    .withMessage('Price range must be $, $$, $$$, or $$$$'),
  body('open_since')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Open since must be a valid year'),
  body('gallery_images')
    .optional()
    .isArray()
    .withMessage('Gallery images must be an array'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  body('awards')
    .optional()
    .isArray()
    .withMessage('Awards must be an array'),
  body('highlights')
    .optional()
    .isArray()
    .withMessage('Highlights must be an array')
];

const updateRestaurantValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Restaurant name must be less than 100 characters'),
  body('cuisine')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cuisine must be less than 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('price_range')
    .optional()
    .isIn(['$', '$$', '$$$', '$$$$'])
    .withMessage('Price range must be $, $$, $$$, or $$$$'),
  body('open_since')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Open since must be a valid year'),
  body('gallery_images')
    .optional()
    .isArray()
    .withMessage('Gallery images must be an array'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  body('awards')
    .optional()
    .isArray()
    .withMessage('Awards must be an array'),
  body('highlights')
    .optional()
    .isArray()
    .withMessage('Highlights must be an array')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

const cuisineValidation = [
  param('cuisine')
    .isLength({ min: 1, max: 50 })
    .withMessage('Cuisine must be provided and less than 50 characters')
];

// Public routes
router.get('/', optionalAuth, getAllRestaurants);
router.get('/featured', optionalAuth, getFeaturedRestaurants);
router.get('/top-rated', optionalAuth, getTopRatedRestaurants);
router.get('/cuisine/:cuisine', cuisineValidation, handleValidationErrors, optionalAuth, getRestaurantsByCuisine);
router.get('/:id', idValidation, handleValidationErrors, optionalAuth, getRestaurantById);

// Admin routes
router.post('/', 
  authenticateAdmin, 
  requirePermission('restaurants', 'create'),
  createRestaurantValidation, 
  handleValidationErrors, 
  createRestaurant
);

router.put('/:id', 
  idValidation,
  authenticateAdmin, 
  requirePermission('restaurants', 'update'),
  updateRestaurantValidation, 
  handleValidationErrors, 
  updateRestaurant
);

router.delete('/:id', 
  idValidation,
  handleValidationErrors,
  authenticateAdmin, 
  requirePermission('restaurants', 'delete'),
  deleteRestaurant
);

router.patch('/:id/toggle-featured', 
  idValidation,
  handleValidationErrors,
  authenticateAdmin, 
  requirePermission('restaurants', 'update'),
  toggleFeatured
);

module.exports = router;
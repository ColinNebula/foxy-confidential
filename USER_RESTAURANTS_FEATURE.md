# User-Added Restaurants Feature

This feature allows users to add their own restaurants to the Foxy Confidential app, making them accessible on the map and in the restaurant list.

## Features

### 1. Add Restaurant Modal
- Beautiful gradient-styled modal with form validation
- Fields included:
  - Restaurant Name* (required)
  - Description
  - Cuisine Type
  - Price Range (1-4 dollar signs, visual slider)
  - Address* (required)
  - Phone Number
  - Website URL
  - Location (auto-populated with current map center, or manual lat/lng)

### 2. Floating Action Button
- Fixed position button in bottom-right corner
- Gradient purple design with pulsing animation
- Opens the Add Restaurant Modal on click

### 3. localStorage Persistence
- User-added restaurants are saved to browser localStorage
- Persist across sessions with key: `foxyConfidential_userRestaurants`
- Automatic sync on add/remove/update

### 4. Visual Indicators
- **Map Markers**: User-added restaurants have a special gradient purple marker with a gold star
- **Restaurant Cards**: Display "✨ My Restaurant" badge with gradient background
- **Popup Info**: Shows special badge in map popup windows

### 5. Integration with Existing Features
- User restaurants merge seamlessly with fetched restaurants
- Full support for:
  - Distance calculation (if user location available)
  - Filtering by cuisine, rating, price, radius
  - Search functionality
  - Sorting options
  - Favorites system
  - Map display with custom markers

## Usage

### Adding a Restaurant

1. Click the floating purple "+" button in the bottom-right corner
2. Fill in the restaurant details:
   - **Name** and **Address** are required
   - Other fields are optional
3. Choose location:
   - Check "Use current map location" to use the map center
   - Or uncheck and manually enter latitude/longitude
4. Adjust the price range slider (1-4 dollar signs)
5. Click "Add Restaurant" to save

### Viewing User Restaurants

- User-added restaurants appear in the main restaurant list with "✨ My Restaurant" badge
- On the map, they have a special gradient purple marker with a gold star
- They can be filtered, searched, and sorted like any other restaurant
- Compatible with favorites system

### Data Management

**Storage Location**: `localStorage['foxyConfidential_userRestaurants']`

**Data Structure**:
```javascript
{
  id: 'user_1234567890',
  name: 'My Restaurant',
  description: 'Description',
  cuisine: 'Italian',
  address: '123 Main St',
  phone: '(555) 123-4567',
  website: 'https://example.com',
  priceLevel: 2,
  rating: 0,
  reviewCount: 0,
  location: { lat: 40.7580, lng: -73.9855 },
  photos: [],
  isUserAdded: true,
  addedAt: '2025-11-16T12:00:00.000Z'
}
```

## Implementation Details

### Files Created/Modified

**New Files**:
- `src/hooks/useUserRestaurants.js` - Custom hook for managing user restaurants
- `src/components/AddRestaurantModal/index.js` - Restaurant form modal component
- `src/components/AddRestaurantModal/AddRestaurantModal.css` - Modal styling

**Modified Files**:
- `src/components/Dashboard/index.js` - Integration with dashboard, floating button
- `src/components/Dashboard/Dashboard.css` - Floating button styles and animations
- `src/components/Dashboard/LeafletMap.js` - Custom marker for user restaurants

### Custom Hook: useUserRestaurants

**Exports**:
- `userRestaurants` - Array of user-added restaurants
- `addUserRestaurant(restaurant)` - Add new restaurant
- `removeUserRestaurant(id)` - Remove restaurant by ID
- `updateUserRestaurant(id, updates)` - Update restaurant details
- `clearUserRestaurants()` - Remove all user restaurants
- `userRestaurantsCount` - Number of user restaurants

### Validation Rules

- **Name**: Required, must not be empty
- **Address**: Required, must not be empty
- **Phone**: Optional, accepts any format
- **Website**: Optional, should be valid URL format
- **Price Range**: 1-4 scale (converted to $ symbols)
- **Location**: Uses map center by default, can manually set coordinates

## Future Enhancements

Potential additions:
- Upload photos for user restaurants
- Edit existing user restaurants
- Share user restaurants with friends
- Import/export restaurant lists
- Categories/tags for organization
- Add user ratings and reviews
- Sync across devices (requires backend)

## Technical Notes

- Uses React Bootstrap for UI components
- Form validation on client-side
- Distance calculation integrated automatically
- Compatible with all existing filters and search
- Responsive design for mobile and desktop
- Accessible with proper ARIA labels and keyboard navigation

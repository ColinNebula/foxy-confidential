# Location Detection & Restaurant Proximity Feature

## Overview

The Foxy Confidential app now includes intelligent location detection that automatically determines if a user is at a restaurant when they load the app. This feature provides a seamless experience by offering contextual options based on the user's location.

## Features

### 1. **Automatic Location Detection on App Load**
- When the app loads (after the splash screen), it automatically requests the user's location
- Uses high-accuracy geolocation with proper error handling
- Respects user privacy - location permission must be granted

### 2. **Restaurant Proximity Detection**
- Checks if the user is within 100 meters of a known restaurant
- Uses the Haversine formula for accurate distance calculation
- Works with both real Google Places API data and mock restaurant data

### 3. **Smart User Prompt**
When a user is detected at a restaurant, they see an attractive modal with two clear options:

#### Option 1: Quick Rating ⭐
- Direct access to rate the restaurant they're currently at
- Ideal for users who want to share their dining experience immediately
- Navigates to the restaurant detail page with rating interface

#### Option 2: Find Restaurants 🔍
- Browse nearby restaurants in the area
- Perfect for users planning their next meal or looking for alternatives
- Opens the Dashboard with location-based restaurant listings

### 4. **Enhanced User Experience**
- Visual feedback during location detection with loading spinner
- Distance display showing how far the user is from the detected restaurant
- Beautiful gradient UI with hover effects
- Helpful tips and clear call-to-action buttons

## Implementation Details

### Components Modified

#### 1. **App.js** (Main Application)
- Added global location detection modal
- Integrated `useLocationDetection` custom hook
- Triggers location check after splash screen
- Handles navigation to restaurant rating or dashboard

#### 2. **Dashboard Component**
- Enhanced with improved location detection
- Better error handling with specific error messages
- Updated proximity threshold to 100 meters (more realistic)
- Improved modal UI with distance display
- Added loading states and user feedback

#### 3. **useLocationDetection Hook** (New)
Location: `src/hooks/useLocationDetection.js`

A reusable React hook that provides:
- `userLocation` - Current user coordinates
- `detectedRestaurant` - Restaurant user is currently at (if any)
- `isLoading` - Loading state for location request
- `isChecking` - Checking state for restaurant proximity
- `error` - Error messages from geolocation API
- `getUserLocation()` - Function to manually trigger location check
- `clearDetectedRestaurant()` - Clear detected restaurant state
- `reset()` - Reset all states

### Technical Specifications

**Proximity Threshold:** 100 meters (0.1 km)
- More realistic than 50m for detecting restaurant presence
- Accounts for large restaurants and shopping centers
- Reduces false positives while maintaining accuracy

**Geolocation Options:**
```javascript
{
  enableHighAccuracy: true,  // Use GPS for better accuracy
  timeout: 10000,            // 10 second timeout
  maximumAge: 0              // Don't use cached location
}
```

**Distance Calculation:**
- Uses Haversine formula from `googlePlacesService.js`
- Calculates great-circle distance between two coordinates
- Returns distance in kilometers with precision to 1 decimal place

## User Flow

```
1. User opens app
   ↓
2. Splash screen displays
   ↓
3. App loads, requests location permission
   ↓
4. Location acquired ✓
   ↓
5. Check proximity to restaurants
   ↓
6a. At a restaurant? → Show modal with Quick Rating / Find Restaurants options
6b. Not at a restaurant → Continue to home screen normally
```

## Error Handling

The feature gracefully handles various error scenarios:

- **Permission Denied**: Clear message asking user to enable location services
- **Position Unavailable**: Suggests checking device settings
- **Timeout**: Prompts user to try again
- **Browser Not Supported**: Informs user that geolocation is unavailable
- **API Errors**: Falls back to mock data if real API fails

## Privacy & Permissions

- Location data is only used for proximity detection
- No location data is stored or transmitted to external servers
- Users must explicitly grant location permission
- Location detection can be dismissed at any time
- Works without location permission (falls back to browse mode)

## Future Enhancements

Potential improvements for this feature:

1. **Background Location Updates**: Periodically check if user enters/leaves restaurant
2. **Notification System**: Alert users when they're near highly-rated restaurants
3. **Location History**: Remember visited restaurants
4. **Geofencing**: Create virtual boundaries around restaurants for better detection
5. **Real-time Integration**: Connect with Google Places API for live restaurant data
6. **Smart Suggestions**: Recommend restaurants based on user's location patterns

## Testing

### Manual Testing Steps

1. **Test at Mock Restaurant Location**:
   - Modify your browser's geolocation to coordinates near a mock restaurant
   - Chrome DevTools → Sensors → Override geolocation
   - Use coordinates: `40.7580, -73.9855` (Bella Vista Restaurant)

2. **Test Permission Denial**:
   - Block location permission in browser
   - Verify error message displays correctly

3. **Test Outside Restaurant**:
   - Use coordinates far from any restaurant
   - Verify no modal appears

4. **Test UI Interactions**:
   - Click "Quick Rating" → Should navigate to restaurant page
   - Click "Find Restaurants" → Should open dashboard
   - Close modal → Should dismiss without errors

## Browser Compatibility

- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support (requires HTTPS)
- ⚠️ IE11 - Limited support (geolocation API available but degraded UX)

**Note**: HTTPS is required for geolocation API in production environments.

## Dependencies

- React 18+
- React Bootstrap 2+
- React Icons (FaMapMarkerAlt, FaStar, FaSearch, etc.)
- Custom `googlePlacesService.js` for distance calculations

## Configuration

No additional configuration required. The feature works out of the box with:
- Mock restaurant data (development)
- Google Places API integration (production - requires API key)

## Support

For issues or questions about this feature:
1. Check browser console for detailed error messages
2. Verify HTTPS is enabled in production
3. Ensure location services are enabled on the device
4. Check browser location permissions for the app

---

**Version**: 1.0.0  
**Last Updated**: November 5, 2025  
**Author**: Foxy Confidential Development Team

# Google Places API Integration

This document explains how the Google Places API is integrated into the Foxy Confidential Dashboard.

## Features

### 1. **Real-Time Restaurant Data**
- Fetches live restaurant data from Google Places API
- Shows nearby restaurants based on user's location
- Displays real ratings, reviews, photos, and details

### 2. **Search Functionality**
- **Text Search**: Search for specific restaurants or cuisines
- **Nearby Search**: Find restaurants within a specified radius
- **Filters**: Filter by cuisine, rating, price range, and distance

### 3. **Interactive Map**
- Shows restaurant locations with markers
- Click markers to view restaurant details
- Get directions directly from the info window
- Marker clustering for better performance with many results

### 4. **Place Details**
- Restaurant name and cuisine type
- Star ratings and review counts
- Price level ($ to $$$$)
- Address and phone number
- Opening hours
- Photos
- Customer reviews

## How It Works

### Service Layer (`src/services/googlePlacesService.js`)

The service provides three main functions:

```javascript
// 1. Fetch nearby restaurants
fetchNearbyRestaurantsWithMap(map, location, radius, keyword)

// 2. Search restaurants by text query
searchRestaurants(map, query, location)

// 3. Get detailed information about a place
fetchPlaceDetails(map, placeId)
```

### Dashboard Component

The Dashboard component uses these services to:

1. **On Load**: 
   - Get user's location via geolocation API
   - Fetch nearby restaurants within default radius (5km)
   - Display results on map or in list view

2. **On Search**:
   - Use Google Places Text Search API
   - Filter results based on user criteria
   - Update map markers and list view

3. **On Filter Change**:
   - Apply local filters to fetched results
   - No additional API calls needed for basic filtering

## API Limits & Quotas

Google Places API has usage limits:

- **Free tier**: $200 credit per month
- **Nearby Search**: ~$32 per 1,000 requests
- **Text Search**: ~$32 per 1,000 requests
- **Place Details**: ~$17 per 1,000 requests
- **Photos**: Free when using photo reference

### Cost Optimization

To minimize API costs, the app:

1. **Caches results** - No redundant API calls for same search
2. **Client-side filtering** - Filters applied locally after initial fetch
3. **Lazy loading** - Details fetched only when needed
4. **Mock data toggle** - Switch to mock data for development
5. **Radius control** - Limit search area to reduce results

## Toggle Between Mock and Real Data

The Dashboard includes a toggle button:
- **Real Data** (🌐): Uses Google Places API
- **Mock Data** (📝): Uses local mock data (no API calls)

Switch to mock data when:
- Developing/testing features
- Avoiding API costs
- API quota exceeded
- Offline development

## Usage Tips

### 1. **First Load**
```javascript
// Automatically fetches when:
- Component mounts
- Map loads successfully
- User location is obtained
```

### 2. **Search**
```javascript
// Type query and click search button or press Enter
// Examples:
- "pizza"
- "Italian restaurants"
- "sushi near Times Square"
```

### 3. **Filters**
```javascript
// Apply after initial search:
- Cuisine type (extracted from Google place types)
- Minimum rating (4.0+, 4.5+, etc.)
- Price range ($, $$, $$$, $$$$)
- Distance radius (5km, 10km, 20km)
```

### 4. **Refresh Data**
```javascript
// Click "Update Location" button to:
- Get current GPS position
- Fetch new restaurants for new location
- Update map center
```

## Error Handling

The integration includes comprehensive error handling:

### 1. **API Key Missing**
- Shows configuration instructions
- Falls back to list view
- Provides setup guide

### 2. **Places Library Not Loaded**
- Displays loading state
- Retries on failure
- Shows error message with details

### 3. **Geolocation Denied**
- Uses default location (NYC)
- Shows warning message
- Still functional with manual search

### 4. **API Request Failed**
- Falls back to mock data automatically
- Displays error message to user
- Logs detailed error for debugging

### 5. **No Results Found**
- Shows helpful empty state
- Suggests clearing filters
- Provides reset button

## Data Transformation

Google Places API responses are transformed to match our app's data structure:

```javascript
// Google Place → App Restaurant
{
  id: place.place_id,
  name: place.name,
  cuisine: getCuisineFromTypes(place.types),  // Mapped from types
  rating: place.rating || 0,
  priceRange: getPriceRange(place.price_level),  // $ to $$$$
  address: place.vicinity || place.formatted_address,
  phone: place.formatted_phone_number,
  position: { lat, lng },
  reviews: place.user_ratings_total || 0,
  image: place.photos[0].getUrl({ maxWidth: 400 }),
  openNow: place.opening_hours?.open_now,
  description: place.types.slice(0, 3).join(', ')
}
```

## Cuisine Type Mapping

The service maps Google place types to cuisine categories:

```javascript
'italian_restaurant' → 'Italian'
'japanese_restaurant' → 'Japanese'
'chinese_restaurant' → 'Chinese'
// ... and more
```

## Distance Calculation

Uses the Haversine formula to calculate distance between coordinates:

```javascript
calculateDistance(userLocation, restaurantLocation)
// Returns: distance in kilometers (rounded to 1 decimal)
```

## Performance Optimizations

1. **Marker Clustering**: Groups nearby markers when zoomed out
2. **Lazy Loading**: Details fetched only when info window opens
3. **Debounced Search**: Prevents excessive API calls while typing
4. **Result Caching**: Stores results to avoid duplicate requests
5. **Selective Fields**: Only requests necessary fields to reduce costs

## Future Enhancements

Potential improvements:

- [ ] Autocomplete for search input
- [ ] Save favorite restaurants
- [ ] Advanced filters (dietary restrictions, outdoor seating, etc.)
- [ ] Review sentiment analysis
- [ ] Price comparison
- [ ] Reservation integration
- [ ] User-generated photos
- [ ] Social sharing

## Troubleshooting

### Issue: "Google Maps not configured"
**Solution**: Check that `.env` file has valid API key

### Issue: "No restaurants found"
**Solution**: 
- Widen search radius
- Clear filters
- Try different search query
- Check if location is correct

### Issue: "API request failed"
**Solution**:
- Verify API key is valid
- Check API quotas in Google Cloud Console
- Enable Places API in Google Cloud
- Check browser console for detailed errors

### Issue: Photos not loading
**Solution**:
- Photos require valid API key
- Some places may not have photos
- Falls back to placeholder images

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API key configuration
3. Check Google Cloud Console quotas
4. Review API documentation: https://developers.google.com/maps/documentation/places/web-service

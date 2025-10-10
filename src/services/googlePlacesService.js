/**
 * Google Places API Service
 * Handles all API calls to Google Places for restaurant data
 */

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

/**
 * Fetch nearby restaurants using Google Places Nearby Search
 * @param {Object} location - { lat, lng }
 * @param {Number} radius - Search radius in meters (default: 5000m = 5km)
 * @param {String} type - Place type (default: 'restaurant')
 * @returns {Promise<Array>} Array of restaurant objects
 */
export const fetchNearbyRestaurants = async (location, radius = 5000, type = 'restaurant') => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key is not configured');
  }

  try {
    // Using Google Places API Nearby Search
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
    
    // Note: Direct API calls from browser will fail due to CORS.
    // We need to use a proxy or the Places library from @react-google-maps/api
    
    // For now, we'll use the Places Service from the loaded Google Maps library
    // This will be called from the component with the map instance
    
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        reject(new Error('Google Maps Places library not loaded'));
        return;
      }

      // This requires a map instance, so we'll export a function factory
      reject(new Error('Use fetchNearbyRestaurantsWithMap instead'));
    });
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    throw error;
  }
};

/**
 * Fetch nearby restaurants using Google Places Service (requires map instance)
 * @param {google.maps.Map} map - Google Maps instance
 * @param {Object} location - { lat, lng }
 * @param {Number} radius - Search radius in meters
 * @param {String} keyword - Search keyword (optional)
 * @returns {Promise<Array>} Array of restaurant objects
 */
export const fetchNearbyRestaurantsWithMap = (map, location, radius = 5000, keyword = '') => {
  return new Promise((resolve, reject) => {
    if (!map || !window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error('Google Maps or Places library not available'));
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);
    
    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: radius,
      type: ['restaurant'],
      ...(keyword && { keyword })
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const restaurants = results.map(place => ({
          id: place.place_id,
          name: place.name,
          cuisine: getCuisineFromTypes(place.types),
          rating: place.rating || 0,
          priceRange: getPriceRange(place.price_level),
          address: place.vicinity,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          reviews: place.user_ratings_total || 0,
          image: place.photos && place.photos.length > 0 
            ? place.photos[0].getUrl({ maxWidth: 400 })
            : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          openNow: place.opening_hours?.open_now ?? null,
          description: place.types?.slice(0, 3).join(', ') || 'Restaurant',
          placeId: place.place_id
        }));
        
        resolve(restaurants);
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });
};

/**
 * Fetch detailed information about a specific place
 * @param {google.maps.Map} map - Google Maps instance
 * @param {String} placeId - Google Place ID
 * @returns {Promise<Object>} Detailed place information
 */
export const fetchPlaceDetails = (map, placeId) => {
  return new Promise((resolve, reject) => {
    if (!map || !window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error('Google Maps or Places library not available'));
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);
    
    const request = {
      placeId: placeId,
      fields: [
        'name',
        'rating',
        'formatted_phone_number',
        'formatted_address',
        'opening_hours',
        'website',
        'photos',
        'reviews',
        'price_level',
        'types',
        'geometry'
      ]
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const details = {
          id: place.place_id,
          name: place.name,
          cuisine: getCuisineFromTypes(place.types),
          rating: place.rating || 0,
          priceRange: getPriceRange(place.price_level),
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          website: place.website,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          openingHours: place.opening_hours?.weekday_text || [],
          openNow: place.opening_hours?.open_now ?? null,
          photos: place.photos?.map(photo => photo.getUrl({ maxWidth: 800 })) || [],
          reviews: place.reviews?.map(review => ({
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.relative_time_description,
            profilePhoto: review.profile_photo_url
          })) || []
        };
        
        resolve(details);
      } else {
        reject(new Error(`Place details fetch failed: ${status}`));
      }
    });
  });
};

/**
 * Search for restaurants by text query
 * @param {google.maps.Map} map - Google Maps instance
 * @param {String} query - Search query
 * @param {Object} location - { lat, lng } (optional, for biasing results)
 * @returns {Promise<Array>} Array of restaurant objects
 */
export const searchRestaurants = (map, query, location = null) => {
  return new Promise((resolve, reject) => {
    if (!map || !window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error('Google Maps or Places library not available'));
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);
    
    const request = {
      query: `${query} restaurant`,
      type: ['restaurant'],
      ...(location && { 
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 10000 
      })
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const restaurants = results.map(place => ({
          id: place.place_id,
          name: place.name,
          cuisine: getCuisineFromTypes(place.types),
          rating: place.rating || 0,
          priceRange: getPriceRange(place.price_level),
          address: place.formatted_address,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          reviews: place.user_ratings_total || 0,
          image: place.photos && place.photos.length > 0 
            ? place.photos[0].getUrl({ maxWidth: 400 })
            : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          openNow: place.opening_hours?.open_now ?? null,
          description: place.types?.slice(0, 3).join(', ') || 'Restaurant',
          placeId: place.place_id
        }));
        
        resolve(restaurants);
      } else {
        reject(new Error(`Text search failed: ${status}`));
      }
    });
  });
};

/**
 * Helper function to determine cuisine type from Google place types
 */
const getCuisineFromTypes = (types) => {
  if (!types || !Array.isArray(types)) return 'Restaurant';
  
  const cuisineMap = {
    'italian': 'Italian',
    'japanese': 'Japanese',
    'chinese': 'Chinese',
    'mexican': 'Mexican',
    'french': 'French',
    'indian': 'Indian',
    'thai': 'Thai',
    'greek': 'Greek',
    'spanish': 'Spanish',
    'korean': 'Korean',
    'vietnamese': 'Vietnamese',
    'mediterranean': 'Mediterranean',
    'american': 'American',
    'steakhouse': 'Steakhouse',
    'seafood': 'Seafood',
    'vegetarian': 'Vegetarian',
    'vegan': 'Vegan',
    'bakery': 'Bakery',
    'cafe': 'Cafe',
    'bar': 'Bar & Grill'
  };

  for (const type of types) {
    const normalized = type.toLowerCase();
    if (cuisineMap[normalized]) {
      return cuisineMap[normalized];
    }
  }

  return 'Restaurant';
};

/**
 * Helper function to convert Google price level to symbols
 */
const getPriceRange = (priceLevel) => {
  if (priceLevel === undefined || priceLevel === null) return '$$';
  
  const priceMap = {
    0: '$',
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$'
  };

  return priceMap[priceLevel] || '$$';
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Object} coord1 - { lat, lng }
 * @param {Object} coord2 - { lat, lng }
 * @returns {Number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Custom React Hook for Location Detection
 * Detects user location and checks if they are at a restaurant
 */

import { useState, useEffect, useCallback } from 'react';
import { calculateDistance } from '../services/googlePlacesService';

const useLocationDetection = (autoDetect = true, restaurantList = []) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [detectedRestaurant, setDetectedRestaurant] = useState(null);

  // Proximity threshold in kilometers (100 meters)
  const PROXIMITY_THRESHOLD = 0.1;

  /**
   * Check if user is at a restaurant
   */
  const checkIfAtRestaurant = useCallback((userPos, restaurants) => {
    if (!userPos || !restaurants || restaurants.length === 0) {
      return null;
    }

    console.log('📏 Calculating distances from user position:', userPos);
    const distances = [];

    for (const restaurant of restaurants) {
      if (!restaurant.position || !restaurant.position.lat || !restaurant.position.lng) {
        continue;
      }

      const distance = calculateDistance(
        { lat: userPos.lat, lng: userPos.lng },
        { lat: restaurant.position.lat, lng: restaurant.position.lng }
      );

      distances.push({
        name: restaurant.name,
        distance: distance,
        withinThreshold: distance <= PROXIMITY_THRESHOLD
      });

      console.log(`   ${distance <= PROXIMITY_THRESHOLD ? '✅' : '❌'} ${restaurant.name}: ${distance.toFixed(3)} km (${(distance * 1000).toFixed(0)}m)`);

      if (distance <= PROXIMITY_THRESHOLD) {
        console.log(`   🎯 MATCH! Within ${PROXIMITY_THRESHOLD * 1000}m threshold`);
        return { ...restaurant, detectedDistance: distance };
      }
    }
    
    console.log(`   ℹ️ Threshold is ${PROXIMITY_THRESHOLD * 1000}m (${PROXIMITY_THRESHOLD} km)`);
    console.log('   💡 TIP: Use DevTools Sensors to override location to one of these coordinates:');
    restaurants.forEach(r => {
      console.log(`      - ${r.name}: ${r.position.lat}, ${r.position.lng}`);
    });
    
    return null;
  }, []);

  /**
   * Get user's current location
   */
  const getUserLocation = useCallback(async (restaurants = []) => {
    console.log('🌍 getUserLocation called with', restaurants.length, 'restaurants');
    setIsLoading(true);
    setError('');
    setDetectedRestaurant(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser.';
        console.error('❌', errorMsg);
        alert('❌ Geolocation not supported in this browser!');
        setError(errorMsg);
        setIsLoading(false);
        reject(new Error(errorMsg));
        return;
      }

      console.log('📡 Requesting geolocation...');
      console.log('⚠️ LOCATION PERMISSION PROMPT SHOULD APPEAR NOW');
      console.log('🔍 If you don\'t see a prompt, check:');
      console.log('   1. Browser address bar for blocked location icon');
      console.log('   2. Browser settings -> Site permissions -> Location');
      console.log('   3. Try HTTPS instead of HTTP (some browsers require it)');
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      console.log('🎯 Calling navigator.geolocation.getCurrentPosition with options:', options);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          console.log('✅ Got user position:', userPos);
          setUserLocation(userPos);
          setIsLoading(false);

          // Check if user is at a restaurant
          if (restaurants.length > 0) {
            console.log('🔍 Checking proximity to', restaurants.length, 'restaurants...');
            setIsChecking(true);
            const atRestaurant = checkIfAtRestaurant(userPos, restaurants);
            
            if (atRestaurant) {
              console.log('🎯 FOUND! User is at restaurant:', atRestaurant.name);
              setDetectedRestaurant(atRestaurant);
            } else {
              console.log('📍 User is not at any restaurant (threshold: 100m)');
            }
            setIsChecking(false);
          }

          resolve({
            location: userPos,
            detectedRestaurant: restaurants.length > 0 
              ? checkIfAtRestaurant(userPos, restaurants) 
              : null
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location.';
          
          console.error('❌ Geolocation error:', error);
          console.error('   Error code:', error.code);
          console.error('   Error message:', error.message);
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings.';
              console.error('🚫 PERMISSION_DENIED - User blocked location access');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              console.error('📍 POSITION_UNAVAILABLE - Cannot determine location');
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              console.error('⏱️ TIMEOUT - Request took too long');
              break;
            default:
              errorMessage = 'An unknown error occurred while getting your location.';
              console.error('❓ UNKNOWN ERROR');
          }

          setError(errorMessage);
          setIsLoading(false);
          setIsChecking(false);
          
          reject(error);
        },
        options
      );
    });
  }, [checkIfAtRestaurant]);

  /**
   * Auto-detect location on mount if enabled
   */
  useEffect(() => {
    if (autoDetect && restaurantList.length > 0) {
      getUserLocation(restaurantList).catch(err => {
        console.error('Auto location detection failed:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDetect]); // Only run on mount - getUserLocation and restaurantList intentionally excluded

  /**
   * Manually refresh location
   */
  const refreshLocation = useCallback(async (restaurants = restaurantList) => {
    return getUserLocation(restaurants);
  }, [getUserLocation, restaurantList]);

  /**
   * Clear detected restaurant
   */
  const clearDetectedRestaurant = useCallback(() => {
    setDetectedRestaurant(null);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setUserLocation(null);
    setDetectedRestaurant(null);
    setError('');
    setIsLoading(false);
    setIsChecking(false);
  }, []);

  return {
    userLocation,
    detectedRestaurant,
    isLoading,
    isChecking,
    error,
    getUserLocation: refreshLocation,
    clearDetectedRestaurant,
    reset,
    checkIfAtRestaurant
  };
};

export default useLocationDetection;

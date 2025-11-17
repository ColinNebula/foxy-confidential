import { useState, useEffect } from 'react';

const USER_RESTAURANTS_STORAGE_KEY = 'foxyConfidential_userRestaurants';

export const useUserRestaurants = () => {
  const [userRestaurants, setUserRestaurants] = useState([]);

  // Load user restaurants from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_RESTAURANTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserRestaurants(parsed);
        console.log('✅ Loaded user restaurants:', parsed.length);
      }
    } catch (error) {
      console.error('Error loading user restaurants:', error);
    }
  }, []);

  // Save user restaurants to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(USER_RESTAURANTS_STORAGE_KEY, JSON.stringify(userRestaurants));
    } catch (error) {
      console.error('Error saving user restaurants:', error);
    }
  }, [userRestaurants]);

  const addUserRestaurant = (restaurant) => {
    const newRestaurant = {
      ...restaurant,
      id: `user_${Date.now()}`,
      addedAt: new Date().toISOString(),
      isUserAdded: true
    };
    const newUserRestaurants = [...userRestaurants, newRestaurant];
    setUserRestaurants(newUserRestaurants);
    console.log('➕ Added user restaurant:', newRestaurant.name);
    return newRestaurant;
  };

  const removeUserRestaurant = (restaurantId) => {
    const newUserRestaurants = userRestaurants.filter(r => r.id !== restaurantId);
    setUserRestaurants(newUserRestaurants);
    console.log('➖ Removed user restaurant:', restaurantId);
    return true;
  };

  const updateUserRestaurant = (restaurantId, updates) => {
    const newUserRestaurants = userRestaurants.map(r => 
      r.id === restaurantId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    setUserRestaurants(newUserRestaurants);
    console.log('✏️ Updated user restaurant:', restaurantId);
    return true;
  };

  const clearUserRestaurants = () => {
    setUserRestaurants([]);
    console.log('🗑️ Cleared all user restaurants');
  };

  return {
    userRestaurants,
    addUserRestaurant,
    removeUserRestaurant,
    updateUserRestaurant,
    clearUserRestaurants,
    userRestaurantsCount: userRestaurants.length
  };
};

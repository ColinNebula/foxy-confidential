import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'foxyConfidential_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        console.log('✅ Loaded favorites:', parsed.length);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const addFavorite = (restaurant) => {
    if (!isFavorite(restaurant.id)) {
      const newFavorites = [...favorites, { ...restaurant, favoritedAt: new Date().toISOString() }];
      setFavorites(newFavorites);
      console.log('❤️ Added to favorites:', restaurant.name);
      return true;
    }
    return false;
  };

  const removeFavorite = (restaurantId) => {
    const newFavorites = favorites.filter(fav => fav.id !== restaurantId);
    setFavorites(newFavorites);
    console.log('💔 Removed from favorites:', restaurantId);
    return true;
  };

  const toggleFavorite = (restaurant) => {
    if (isFavorite(restaurant.id)) {
      removeFavorite(restaurant.id);
      return false;
    } else {
      addFavorite(restaurant);
      return true;
    }
  };

  const isFavorite = (restaurantId) => {
    return favorites.some(fav => fav.id === restaurantId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    console.log('🗑️ Cleared all favorites');
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};

// Sample restaurant data with comprehensive ratings
export const restaurantData = [
  {
    id: 1,
    name: "Le Bernardin",
    cuisine: "French Seafood",
    location: "Midtown Manhattan",
    priceRange: "$$$$",
    image: "/assets/images/food/food3.png",
    ratings: {
      food: 4.9,
      taste: 4.8,
      ambiance: 4.7,
      creativity: 4.9,
      uniqueness: 4.6
    },
    review: "An absolute masterpiece of culinary excellence. Chef Eric Ripert's innovative approach to seafood creates an unforgettable dining experience that redefines French cuisine.",
    highlights: ["Michelin 3-Star", "Fresh Seafood", "Innovative Techniques", "Elegant Service"],
    awards: ["James Beard Award", "Michelin 3 Stars", "World's 50 Best"],
    openSince: "1986",
    featured: true
  },
  {
    id: 2,
    name: "Momofuku Noodle Bar",
    cuisine: "Asian Fusion",
    location: "East Village",
    priceRange: "$$",
    image: "/assets/images/food/food2.png",
    ratings: {
      food: 4.4,
      taste: 4.6,
      ambiance: 4.0,
      creativity: 4.7,
      uniqueness: 4.8
    },
    review: "David Chang's revolutionary take on Asian comfort food. The famous pork buns and ramen bowls showcase incredible creativity with bold, unforgettable flavors.",
    highlights: ["Famous Pork Buns", "Creative Ramen", "Casual Atmosphere", "Bold Flavors"],
    awards: ["James Beard Award", "Michelin Starred"],
    openSince: "2004",
    featured: false
  },
  {
    id: 3,
    name: "Peter Luger Steak House",
    cuisine: "American Steakhouse",
    location: "Brooklyn",
    priceRange: "$$$",
    image: "/assets/images/food/food6.png",
    ratings: {
      food: 4.6,
      taste: 4.8,
      ambiance: 4.3,
      creativity: 3.8,
      uniqueness: 4.2
    },
    review: "A Brooklyn institution serving the finest dry-aged steaks since 1887. Traditional preparation meets exceptional quality in this legendary steakhouse.",
    highlights: ["Dry-Aged Steaks", "Historic Location", "Traditional Methods", "Cash Only"],
    awards: ["James Beard Outstanding Restaurant", "NYC Institution"],
    openSince: "1887",
    featured: true
  },
  {
    id: 4,
    name: "Eleven Madison Park",
    cuisine: "Contemporary American",
    location: "Flatiron District",
    priceRange: "$$$$",
    image: "/assets/images/food/food1.png",
    ratings: {
      food: 4.7,
      taste: 4.6,
      ambiance: 4.9,
      creativity: 4.8,
      uniqueness: 4.7
    },
    review: "A plant-based culinary revolution in an Art Deco masterpiece. Every dish tells a story, creating an immersive dining experience that challenges perceptions.",
    highlights: ["Plant-Based Menu", "Art Deco Setting", "Storytelling Cuisine", "World-Class Service"],
    awards: ["World's #1 Restaurant 2017", "Michelin 3 Stars", "Green Star"],
    openSince: "1998",
    featured: true
  },
  {
    id: 5,
    name: "Joe's Pizza",
    cuisine: "Italian-American",
    location: "Multiple Locations",
    priceRange: "$",
    image: "/assets/images/food/food3.png",
    ratings: {
      food: 4.2,
      taste: 4.5,
      ambiance: 3.5,
      creativity: 3.2,
      uniqueness: 3.8
    },
    review: "The quintessential New York slice. Simple, authentic, and perfectly executed. Sometimes the best things in life are the most straightforward.",
    highlights: ["Classic NY Slice", "Quick Service", "Affordable", "Local Favorite"],
    awards: ["NYC Pizza Hall of Fame", "Tourist Favorite"],
    openSince: "1975",
    featured: false
  },
  {
    id: 6,
    name: "Atoboy",
    cuisine: "Korean Modern",
    location: "NoMad",
    priceRange: "$$$",
    image: "/assets/images/food/food2.png",
    ratings: {
      food: 4.5,
      taste: 4.7,
      ambiance: 4.4,
      creativity: 4.6,
      uniqueness: 4.8
    },
    review: "Modern Korean cuisine that respects tradition while embracing innovation. Chef Junghyun Park creates dishes that are both familiar and surprising.",
    highlights: ["Modern Korean", "Innovative Banchan", "Seasonal Menu", "Intimate Setting"],
    awards: ["Michelin Star", "James Beard Nominee"],
    openSince: "2016",
    featured: false
  }
];

// Helper functions for restaurant data
export const getRestaurantById = (id) => {
  return restaurantData.find(restaurant => restaurant.id === id);
};

export const getFeaturedRestaurants = () => {
  return restaurantData.filter(restaurant => restaurant.featured);
};

export const getRestaurantsByRating = (minRating = 0) => {
  return restaurantData.filter(restaurant => {
    const avgRating = calculateOverallRating(restaurant.ratings);
    return avgRating >= minRating;
  }).sort((a, b) => calculateOverallRating(b.ratings) - calculateOverallRating(a.ratings));
};

export const getRestaurantsByCuisine = (cuisine) => {
  return restaurantData.filter(restaurant => 
    restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
  );
};

export const getRestaurantsByPriceRange = (priceRange) => {
  return restaurantData.filter(restaurant => restaurant.priceRange === priceRange);
};

export const calculateOverallRating = (ratings) => {
  if (!ratings) return 0;
  return (ratings.food + ratings.taste + ratings.ambiance + ratings.creativity + ratings.uniqueness) / 5;
};

export const getRatingCategory = (rating) => {
  if (rating >= 4.5) return { label: 'Exceptional', color: 'success' };
  if (rating >= 4.0) return { label: 'Excellent', color: 'primary' };
  if (rating >= 3.5) return { label: 'Very Good', color: 'warning' };
  if (rating >= 3.0) return { label: 'Good', color: 'info' };
  return { label: 'Fair', color: 'secondary' };
};

export const cuisineTypes = [
  'French Seafood',
  'Asian Fusion', 
  'American Steakhouse',
  'Contemporary American',
  'Italian-American',
  'Korean Modern'
];

export const priceRanges = {
  '$': 'Budget-Friendly ($15-30)',
  '$$': 'Moderate ($30-60)', 
  '$$$': 'Upscale ($60-120)',
  '$$$$': 'Fine Dining ($120+)'
};
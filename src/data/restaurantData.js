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

// Sample user reviews data
export const userReviewsData = {
  1: [ // Le Bernardin
    {
      id: 1,
      title: "Absolutely Phenomenal Experience",
      content: "This was hands down the most incredible dining experience of my life. Every dish was a work of art, and the service was impeccable. The tasting menu was worth every penny.",
      ratings: {
        food: 5,
        taste: 5,
        ambiance: 5,
        creativity: 5,
        uniqueness: 4
      },
      userName: "Sarah Mitchell",
      date: "2024-01-15T19:30:00Z",
      visitDate: "2024-01-10",
      overallRating: 4.8,
      helpful: 12,
      verified: true,
      wouldRecommend: true
    },
    {
      id: 2,
      title: "Expensive but Worth It",
      content: "The quality of the seafood here is unmatched. While it's definitely a splurge, the precision and technique in every dish justifies the price. The lobster course was unforgettable.",
      ratings: {
        food: 5,
        taste: 5,
        ambiance: 4,
        creativity: 4,
        uniqueness: 4
      },
      userName: "Marcus Chen",
      date: "2024-01-20T20:15:00Z",
      visitDate: "2024-01-18",
      overallRating: 4.4,
      helpful: 8,
      verified: true,
      wouldRecommend: true
    }
  ],
  2: [ // Momofuku Noodle Bar
    {
      id: 3,
      title: "Innovative and Delicious",
      content: "David Chang's creativity really shines here. The pork buns are legendary for a reason, and the ramen is some of the best in the city. Great casual atmosphere too.",
      ratings: {
        food: 4,
        taste: 5,
        ambiance: 4,
        creativity: 5,
        uniqueness: 5
      },
      userName: "Alex Rodriguez",
      date: "2024-01-25T18:45:00Z",
      visitDate: "2024-01-22",
      overallRating: 4.6,
      helpful: 15,
      verified: true,
      wouldRecommend: true
    },
    {
      id: 4,
      title: "Good but Overhyped",
      content: "The food is definitely good, but I expected more given the reputation. The pork buns were tasty but not life-changing. Service was friendly though.",
      ratings: {
        food: 3,
        taste: 4,
        ambiance: 3,
        creativity: 4,
        uniqueness: 4
      },
      userName: "Jennifer Walsh",
      date: "2024-02-01T19:20:00Z",
      visitDate: "2024-01-30",
      overallRating: 3.6,
      helpful: 5,
      verified: true,
      wouldRecommend: false
    }
  ],
  3: [ // Peter Luger
    {
      id: 5,
      title: "Classic Steakhouse Excellence",
      content: "This place is a Brooklyn institution for a reason. The porterhouse is incredible - perfectly aged and cooked to perfection. Cash only is annoying but the steak makes up for it.",
      ratings: {
        food: 5,
        taste: 5,
        ambiance: 4,
        creativity: 2,
        uniqueness: 3
      },
      userName: "Robert Johnson",
      date: "2024-02-05T20:00:00Z",
      visitDate: "2024-02-03",
      overallRating: 3.8,
      helpful: 9,
      verified: true,
      wouldRecommend: true
    }
  ],
  4: [ // Eleven Madison Park
    {
      id: 6,
      title: "Plant-Based Perfection",
      content: "The transition to plant-based has been remarkable. Each course tells a story and the creativity is off the charts. The service is theatrical in the best way possible.",
      ratings: {
        food: 5,
        taste: 4,
        ambiance: 5,
        creativity: 5,
        uniqueness: 5
      },
      userName: "Emma Thompson",
      date: "2024-02-10T19:45:00Z",
      visitDate: "2024-02-08",
      overallRating: 4.8,
      helpful: 11,
      verified: true,
      wouldRecommend: true
    }
  ],
  5: [ // Joe's Pizza
    {
      id: 7,
      title: "Best Slice in NYC",
      content: "Simple, no-frills pizza done perfectly. The cheese is perfectly melted, the sauce has great flavor, and the crust has the perfect chew. This is what NYC pizza should be.",
      ratings: {
        food: 4,
        taste: 5,
        ambiance: 2,
        creativity: 2,
        uniqueness: 3
      },
      userName: "Tony Soprano",
      date: "2024-02-12T13:30:00Z",
      visitDate: "2024-02-12",
      overallRating: 3.2,
      helpful: 20,
      verified: true,
      wouldRecommend: true
    }
  ],
  6: [ // Atoboy
    {
      id: 8,
      title: "Modern Korean at Its Best",
      content: "Chef Park's modern take on Korean flavors is brilliant. The banchan selection is creative and each dish builds on traditional techniques with contemporary flair.",
      ratings: {
        food: 4,
        taste: 5,
        ambiance: 4,
        creativity: 5,
        uniqueness: 5
      },
      userName: "Lily Kim",
      date: "2024-02-15T20:30:00Z",
      visitDate: "2024-02-14",
      overallRating: 4.6,
      helpful: 7,
      verified: true,
      wouldRecommend: true
    }
  ]
};

// Helper function to get reviews for a restaurant
export const getRestaurantReviews = (restaurantId) => {
  return userReviewsData[restaurantId] || [];
};

// Helper function to add a new review
export const addReview = (restaurantId, review) => {
  if (!userReviewsData[restaurantId]) {
    userReviewsData[restaurantId] = [];
  }
  userReviewsData[restaurantId].push(review);
  return userReviewsData[restaurantId];
};

// Helper function to update a review
export const updateReview = (restaurantId, reviewId, updatedReview) => {
  if (userReviewsData[restaurantId]) {
    const index = userReviewsData[restaurantId].findIndex(r => r.id === reviewId);
    if (index !== -1) {
      userReviewsData[restaurantId][index] = updatedReview;
    }
  }
  return userReviewsData[restaurantId];
};

// Helper function to delete a review
export const deleteReview = (restaurantId, reviewId) => {
  if (userReviewsData[restaurantId]) {
    userReviewsData[restaurantId] = userReviewsData[restaurantId].filter(r => r.id !== reviewId);
  }
  return userReviewsData[restaurantId];
};
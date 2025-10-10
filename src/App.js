// Imports

import Header from './components/Header';
import React, { useState } from 'react';
import Home from './components/Home';
import Lifestyle from './components/Lifestyle';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Blog from './components/Blog';
import Reviews from './components/Reviews';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import ParticlesBackground from './components/config/ParticlesBackground';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Mock data for Reviews component
  const mockRestaurant = {
    id: 1,
    name: "Bella Vista Restaurant",
    cuisine: "Italian",
    location: "Downtown",
    rating: 4.5
  };

  const mockReviews = [
    {
      id: 1,
      title: "Absolutely Amazing Experience!",
      content: "Had the most wonderful dinner here last night. The pasta was perfectly cooked and the service was exceptional. The ambiance really made the evening special. Would definitely recommend this place to anyone looking for authentic Italian cuisine.",
      ratings: {
        food: 5,
        taste: 5,
        ambiance: 4,
        creativity: 4,
        uniqueness: 3
      },
      userName: "Sarah Johnson",
      date: new Date('2024-09-15'),
      visitDate: new Date('2024-09-14'),
      wouldRecommend: true,
      verified: true,
      helpful: 8,
      dishes: "Spaghetti Carbonara, Tiramisu",
      priceRange: "$$",
      serviceRatings: {
        speed: 4,
        friendliness: 5,
        knowledge: 4,
        attentiveness: 5
      },
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400"
      ]
    },
    {
      id: 2,
      title: "Good but not exceptional",
      content: "The food was decent and the atmosphere was nice, but nothing really stood out. Service was a bit slow and the portions could be larger for the price. It's an okay place but there are better options in the area.",
      ratings: {
        food: 3,
        taste: 3,
        ambiance: 4,
        creativity: 2,
        uniqueness: 2
      },
      userName: "Mike Chen",
      date: new Date('2024-09-10'),
      visitDate: new Date('2024-09-09'),
      wouldRecommend: false,
      verified: false,
      helpful: 3,
      dishes: "Margherita Pizza, Caesar Salad",
      priceRange: "$$$",
      serviceRatings: {
        speed: 2,
        friendliness: 3,
        knowledge: 3,
        attentiveness: 2
      },
      images: []
    },
    {
      id: 3,
      title: "Perfect Date Night Spot",
      content: "My partner and I had such a romantic evening here. The lighting was perfect, the wine selection was excellent, and our server was very knowledgeable about the menu. The seafood risotto was to die for!",
      ratings: {
        food: 5,
        taste: 5,
        ambiance: 5,
        creativity: 4,
        uniqueness: 4
      },
      userName: "Emily Rodriguez",
      date: new Date('2024-09-12'),
      visitDate: new Date('2024-09-11'),
      wouldRecommend: true,
      verified: true,
      helpful: 12,
      dishes: "Seafood Risotto, Chocolate Lava Cake",
      priceRange: "$$$$",
      serviceRatings: {
        speed: 4,
        friendliness: 5,
        knowledge: 5,
        attentiveness: 4
      },
      images: [
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
      ]
    }
  ];

  const handleAddReview = (newReview) => {
    console.log('New review added:', newReview);
    // In a real app, this would update the reviews state
  };

  const handleUpdateReview = (reviewId, updatedReview) => {
    console.log('Review updated:', reviewId, updatedReview);
    // In a real app, this would update the specific review
  };

  const handleDeleteReview = (reviewId) => {
    console.log('Review deleted:', reviewId);
    // In a real app, this would remove the review from state
  };



  const renderTab = () => {

    switch (currentTab) {
      case "home":
          return <Home />;

      case "blog":
        return <Blog />;

      case "lifestyle":
        return <Lifestyle />;

      case "gallery":
        return <Gallery />;

      case "reviews":
        return <Reviews 
          restaurant={mockRestaurant}
          userReviews={mockReviews}
          onAddReview={handleAddReview}
          onUpdateReview={handleUpdateReview}
          onDeleteReview={handleDeleteReview}
        />;

      case "dashboard":
        return <Dashboard />;
        
      case "login":
      return <Login />;

      default:
        return null;
    }
  };
  return (
    <>
      {isLoading ? (
        <SplashScreen onLoadComplete={handleLoadComplete} />
      ) : (
        <div className="app-bg">
          <ParticlesBackground />
          <div className="app-container">
            <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <main className="app-main">{renderTab()}</main>
          </div>
          {currentTab !== "login" && <Footer />}
        </div>
      )}
    </>
  );
}


export default App;

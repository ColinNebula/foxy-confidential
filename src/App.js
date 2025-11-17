// Imports
import Header from './components/Header';
import React, { useState, lazy, Suspense, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ParticlesBackground from './components/config/ParticlesBackground';
import { Modal, Button, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { FaMapMarkerAlt, FaStar, FaSearch, FaUtensils, FaLocationArrow } from 'react-icons/fa';
import useLocationDetection from './hooks/useLocationDetection';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home'));
const Lifestyle = lazy(() => import('./components/Lifestyle'));
const Gallery = lazy(() => import('./components/Gallery'));
const Login = lazy(() => import('./components/Login'));
const Blog = lazy(() => import('./components/Blog'));
const Reviews = lazy(() => import('./components/Reviews'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Restaurant = lazy(() => import('./components/Restaurant'));
const Footer = lazy(() => import('./components/Footer'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
    color: 'white'
  }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);


function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [userReviews, setUserReviews] = useState(() => {
    // Load reviews from localStorage on initial mount
    try {
      const savedReviews = localStorage.getItem('foxyConfidential_reviews');
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews);
        console.log('✅ Loaded', parsed.length, 'reviews from localStorage');
        return parsed;
      }
    } catch (error) {
      console.error('Error loading reviews from localStorage:', error);
    }
    return [];
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAskUserModal, setShowAskUserModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [restaurantToReview, setRestaurantToReview] = useState(null);

  // Mock restaurant data for location detection - defined at component level
  const mockRestaurants = [
    {
      id: 1,
      name: "Bella Vista Restaurant",
      cuisine: "Italian",
      rating: 4.5,
      priceRange: "$$",
      address: "123 Main St, New York, NY",
      position: { lat: 40.7580, lng: -73.9855 }
    },
    {
      id: 2,
      name: "Sakura Sushi Bar",
      cuisine: "Japanese",
      rating: 4.7,
      priceRange: "$$$",
      address: "456 Park Ave, New York, NY",
      position: { lat: 40.7614, lng: -73.9776 }
    },
    {
      id: 3,
      name: "Burger Haven",
      cuisine: "American",
      rating: 4.2,
      priceRange: "$",
      address: "789 Broadway, New York, NY",
      position: { lat: 40.7489, lng: -73.9680 }
    }
  ];

  // Use location detection hook (disabled auto-detect, we'll manually trigger)
  const {
    userLocation,
    detectedRestaurant,
    isLoading: isLocationLoading,
    isChecking,
    error: locationError,
    getUserLocation,
    clearDetectedRestaurant
  } = useLocationDetection(false, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('foxyConfidential_reviews', JSON.stringify(userReviews));
      console.log('💾 Saved', userReviews.length, 'reviews to localStorage');
    } catch (error) {
      console.error('Error saving reviews to localStorage:', error);
    }
  }, [userReviews]);

  // Handle opening review modal globally
  const handleOpenReviewModal = (restaurant) => {
    console.log('🎯 [App.js] Opening review modal for:', restaurant?.name);
    console.log('📦 [App.js] Restaurant data:', restaurant);
    setRestaurantToReview(restaurant);
    setShowReviewModal(true);
    console.log('✅ [App.js] Modal state updated - showReviewModal: true');
    console.log('✅ [App.js] restaurantToReview set to:', restaurant?.name);
  };

  const handleLoadComplete = () => {
    console.log('✨ SPLASH SCREEN COMPLETE - Starting location detection');
    setIsLoading(false);
    // After splash screen, check user location
    setTimeout(() => {
      console.log('⏰ Timeout complete, calling checkUserLocationOnLoad');
      checkUserLocationOnLoad();
    }, 100); // Small delay to ensure state is updated
  };

  // Check user location when app loads
  const checkUserLocationOnLoad = async () => {
    console.log('🔍 Starting location detection...');
    console.log('📍 Mock restaurants:', mockRestaurants);
    
    // First, ask the user directly if they're at a restaurant
    setTimeout(() => {
      setShowAskUserModal(true);
    }, 500);
    
    try {
      // Also try GPS detection in the background
      const result = await getUserLocation(mockRestaurants);
      console.log('✅ Location detection result:', result);
      
      // If GPS detected a restaurant, close the ask modal and show detected restaurant
      if (result.detectedRestaurant) {
        setShowAskUserModal(false);
      }
    } catch (error) {
      console.error('❌ Location detection failed:', error);
      // If GPS fails, the ask modal is already showing
    }
  };

  // Show modal when restaurant is detected
  useEffect(() => {
    if (detectedRestaurant && !isLoading) {
      console.log('🎉 RESTAURANT DETECTED! Opening modal for:', detectedRestaurant.name);
      setShowLocationModal(true);
    } else if (!isLoading) {
      console.log('📍 No restaurant detected - user location too far from mock restaurants');
    }
  }, [detectedRestaurant, isLoading]);

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
      overallRating: 4.2,
      userName: "Sarah Johnson",
      date: new Date('2024-09-15').toISOString(),
      visitDate: new Date('2024-09-14').toISOString(),
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
      overallRating: 2.8,
      userName: "Mike Chen",
      date: new Date('2024-09-10').toISOString(),
      visitDate: new Date('2024-09-09').toISOString(),
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
      overallRating: 4.6,
      userName: "Emily Rodriguez",
      date: new Date('2024-09-12').toISOString(),
      visitDate: new Date('2024-09-11').toISOString(),
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
    // Associate review with current restaurant if available
    const reviewWithRestaurant = {
      ...newReview,
      restaurantId: selectedRestaurant?.id || null,
      restaurantName: selectedRestaurant?.name || 'Unknown Restaurant'
    };
    console.log('✅ New review added:', reviewWithRestaurant);
    setUserReviews(prevReviews => [reviewWithRestaurant, ...prevReviews]);
  };

  const handleUpdateReview = (updatedReview) => {
    console.log('✏️ Review updated:', updatedReview);
    setUserReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const handleDeleteReview = (reviewId) => {
    console.log('🗑️ Review deleted:', reviewId);
    setUserReviews(prevReviews => 
      prevReviews.filter(review => review.id !== reviewId)
    );
  };



  const renderTab = () => {

    switch (currentTab) {
      case "home":
          return <Home onRestaurantClick={(restaurant) => {
            console.log('🏠 Home -> Restaurant navigation triggered');
            console.log('📦 Restaurant data:', restaurant);
            setSelectedRestaurant(restaurant);
            setCurrentTab("restaurant");
            console.log('✅ Tab changed to: restaurant');
          }} />;

      case "blog":
        return <Blog />;

      case "lifestyle":
        return <Lifestyle />;

      case "gallery":
        return <Gallery />;

      case "reviews":
        return <Reviews 
          restaurant={mockRestaurant}
          userReviews={[...mockReviews, ...userReviews]}
          onAddReview={handleAddReview}
          onUpdateReview={handleUpdateReview}
          onDeleteReview={handleDeleteReview}
        />;

      case "dashboard":
        return <Dashboard 
          onRestaurantClick={(restaurant) => {
            setSelectedRestaurant(restaurant);
            setCurrentTab("restaurant");
          }}
          onOpenReviewModal={handleOpenReviewModal}
        />;

      case "restaurant":
        console.log('🍽️ Rendering Restaurant tab');
        console.log('📦 Selected restaurant:', selectedRestaurant);
        if (!selectedRestaurant) {
          console.warn('⚠️ No restaurant selected, redirecting to home');
          setCurrentTab("home");
          return <Home onRestaurantClick={(restaurant) => {
            console.log('🏠 Home -> Restaurant navigation triggered');
            console.log('📦 Restaurant data:', restaurant);
            setSelectedRestaurant(restaurant);
            setCurrentTab("restaurant");
            console.log('✅ Tab changed to: restaurant');
          }} />;
        }
        return <Restaurant 
          restaurant={selectedRestaurant}
          onBack={() => setCurrentTab("home")}
        />;
        
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
            <main className="app-main">
              <Suspense fallback={<LoadingFallback />}>
                {renderTab()}
              </Suspense>
            </main>
          </div>
          {currentTab !== "login" && (
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          )}

          {/* Global Location Detection Modal */}
          <Modal 
            show={showLocationModal} 
            onHide={() => {
              setShowLocationModal(false);
              clearDetectedRestaurant();
            }}
            centered
            size="lg"
            backdrop="static"
          >
            <Modal.Header closeButton style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none'
            }}>
              <Modal.Title>
                <FaMapMarkerAlt className="me-2" />
                Welcome! You're at a Restaurant
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '2rem' }}>
              {detectedRestaurant && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '1rem' }}>
                      {detectedRestaurant.name}
                    </h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <Badge bg="primary" className="me-2" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        <FaUtensils className="me-1" />
                        {detectedRestaurant.cuisine}
                      </Badge>
                      <Badge bg="warning" text="dark" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        <FaStar className="me-1" /> {detectedRestaurant.rating}
                      </Badge>
                      {detectedRestaurant.detectedDistance !== undefined && (
                        <Badge bg="success" className="ms-2" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                          <FaLocationArrow className="me-1" />
                          {(detectedRestaurant.detectedDistance * 1000).toFixed(0)}m away
                        </Badge>
                      )}
                    </div>
                    <p style={{ 
                      marginTop: '0.5rem', 
                      color: '#6c757d',
                      fontSize: '0.95rem'
                    }}>
                      <FaMapMarkerAlt className="me-1" />
                      {detectedRestaurant.address}
                    </p>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    border: '2px solid #667eea'
                  }}>
                    <h5 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      What would you like to do?
                    </h5>
                    <p style={{ color: '#6c757d', marginBottom: 0, fontSize: '0.95rem' }}>
                      We've detected you're currently at this location
                    </p>
                  </div>

                  <Row className="g-3">
                    <Col md={6}>
                      <Button
                        variant="primary"
                        size="lg"
                        style={{
                          width: '100%',
                          padding: '1.25rem 1rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                        }}
                        onClick={() => {
                          setSelectedRestaurant(detectedRestaurant);
                          setShowLocationModal(false);
                          clearDetectedRestaurant();
                          setCurrentTab("restaurant");
                        }}
                      >
                        <FaStar className="me-2" style={{ fontSize: '1.3rem' }} />
                        Quick Rating
                        <div style={{ fontSize: '0.75rem', marginTop: '0.3rem', opacity: 0.95, fontWeight: 'normal' }}>
                          Share your dining experience
                        </div>
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        variant="outline-primary"
                        size="lg"
                        style={{
                          width: '100%',
                          padding: '1.25rem 1rem',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          borderWidth: '2px',
                          borderColor: '#667eea',
                          color: '#667eea',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={() => {
                          setShowLocationModal(false);
                          clearDetectedRestaurant();
                          setCurrentTab("dashboard");
                        }}
                      >
                        <FaSearch className="me-2" style={{ fontSize: '1.3rem' }} />
                        Find Restaurants
                        <div style={{ fontSize: '0.75rem', marginTop: '0.3rem', opacity: 0.9, fontWeight: 'normal' }}>
                          Explore nearby dining options
                        </div>
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Modal.Body>
          </Modal>
        </div>
      )}

      {/* Loading Modal for Location Check */}
      <Modal 
        show={isChecking && !showLocationModal && !showAskUserModal} 
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body style={{ padding: '2rem', textAlign: 'center' }}>
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <h5 style={{ marginTop: '1rem', color: '#667eea' }}>
            Checking your location...
          </h5>
          <p style={{ color: '#6c757d', marginBottom: 0 }}>
            Detecting if you're at a restaurant
          </p>
        </Modal.Body>
      </Modal>

      {/* Ask User Modal */}
      <Modal 
        show={showAskUserModal} 
        onHide={() => setShowAskUserModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title>
            <FaUtensils className="me-2" />
            Welcome to Foxy Confidential!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
              Are you currently at a restaurant?
            </h4>
            <p style={{ color: '#6c757d', fontSize: '1rem', marginBottom: 0 }}>
              We'd love to help you rate your dining experience or find great restaurants nearby
            </p>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Button
                variant="primary"
                size="lg"
                style={{
                  width: '100%',
                  padding: '1.5rem 1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
                onClick={async () => {
                  console.log('🎯 User clicked "Yes, I\'m Here!" - Detecting restaurant...');
                  setShowAskUserModal(false);
                  
                  // Ensure we're on home tab so user has something to see when modal closes
                  if (currentTab === 'home') {
                    // Already on home, just detect and open modal
                  } else {
                    setCurrentTab("home");
                  }
                  
                  // Try to detect which restaurant user is at
                  try {
                    const result = await getUserLocation(mockRestaurants);
                    if (result.detectedRestaurant) {
                      console.log('✅ Restaurant detected:', result.detectedRestaurant.name);
                      handleOpenReviewModal(result.detectedRestaurant);
                    } else {
                      console.log('⚠️ No restaurant detected, opening dashboard');
                      // If we can't detect restaurant, show dashboard
                      setCurrentTab("dashboard");
                    }
                  } catch (error) {
                    console.error('❌ Error detecting restaurant:', error);
                    // On error, show dashboard as fallback
                    setCurrentTab("dashboard");
                  }
                }}
              >
                <FaStar className="me-2" style={{ fontSize: '1.3rem' }} />
                Yes, I'm Here!
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.95, fontWeight: 'normal' }}>
                  Rate my current restaurant
                </div>
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="outline-primary"
                size="lg"
                style={{
                  width: '100%',
                  padding: '1.5rem 1rem',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderWidth: '2px',
                  borderColor: '#667eea',
                  color: '#667eea',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => {
                  setShowAskUserModal(false);
                  setCurrentTab("dashboard");
                }}
              >
                <FaSearch className="me-2" style={{ fontSize: '1.3rem' }} />
                No, Find One
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.9, fontWeight: 'normal' }}>
                  Explore nearby restaurants
                </div>
              </Button>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Button
              variant="link"
              style={{ color: '#6c757d', textDecoration: 'none' }}
              onClick={() => {
                setShowAskUserModal(false);
                setCurrentTab("home");
              }}
            >
              Skip for now
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Global Review Modal */}
      <Modal 
        show={showReviewModal} 
        onHide={() => {
          console.log('🚪 Closing review modal');
          setShowReviewModal(false);
          setRestaurantToReview(null);
          // Don't change the current tab - stay on whatever page user was on
        }}
        centered
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title>
            <img src={process.env.PUBLIC_URL + '/foxy-tail.png'} alt="rate" style={{ width: '24px', height: '24px' }} className="me-2" />
            Rate Your Experience
            {restaurantToReview && (
              <div style={{ fontSize: '0.9rem', marginTop: '0.3rem', opacity: 0.95, fontWeight: 'normal' }}>
                {restaurantToReview.name}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {restaurantToReview ? (
            <Suspense fallback={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading review form...</p>
              </div>
            }>
              {console.log('📝 [App.js] Rendering Reviews component with:', { 
                restaurant: restaurantToReview?.name, 
                autoShowForm: true, 
                inlineForm: true 
              })}
              <Reviews 
                restaurant={restaurantToReview}
                userReviews={[]}
                onAddReview={handleAddReview}
                autoShowForm={true}
                inlineForm={true}
              />
            </Suspense>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Detecting restaurant...</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}


export default App;

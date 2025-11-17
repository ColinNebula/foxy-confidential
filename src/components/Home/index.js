import React, { useState, useMemo, useCallback, memo } from 'react'
import { Card, Container, Button, Col, Row, Modal, Badge, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { FaStar, FaUtensils, FaHeart, FaAward, FaClock, FaMapMarkerAlt, FaEye, FaFilter, FaTrophy, FaFire } from 'react-icons/fa';
import StarRating from '../StarRating';
import RestaurantRating from '../RestaurantRating';
import Reviews from '../Reviews';
import { restaurantData, getFeaturedRestaurants, calculateOverallRating, getRestaurantsByRating, getRestaurantReviews, addReview, updateReview, deleteReview } from '../../data/restaurantData';
import food1 from '../../assets/images/food1.png';
import food2 from '../../assets/images/food2.png';
import food3 from '../../assets/images/food3.png';
import food6 from '../../assets/images/food6.png';
import './Home.css';

// Memoized restaurant card component for better performance
const RestaurantCard = memo(({ restaurant, index, onViewRestaurant }) => {
  const images = [food3, food2, food6];
  const overallRating = useMemo(() => calculateOverallRating(restaurant.ratings), [restaurant.ratings]);
  const hasMichelin = useMemo(() => restaurant.awards.some(award => award.includes('Michelin')), [restaurant.awards]);
  
  return (
    <Col xs={12}>
      <Card className="restaurant-card-modern h-100">
        <div className="card-image-container">
          <Card.Img 
            variant="top" 
            src={images[index % 3]} 
            className="restaurant-card-image"
            loading="lazy"
            alt={restaurant.name}
          />
          <div className="card-overlay">
            <Badge bg="success" className="rating-badge">
              <FaStar className="me-1" />
              {overallRating.toFixed(1)}
            </Badge>
            {hasMichelin && (
              <Badge bg="warning" className="michelin-star-badge">
                <FaStar className="me-1" />
                Michelin
              </Badge>
            )}
          </div>
        </div>
        
        <Card.Body className="restaurant-card-body">
          <div className="restaurant-header">
            <div className="cuisine-type">
              <FaUtensils className="me-2" />
              {restaurant.cuisine}
            </div>
            <div className="price-indicator">{restaurant.priceRange}</div>
          </div>
          
          <Card.Title className="restaurant-title">{restaurant.name}</Card.Title>
          <Card.Text className="restaurant-excerpt">
            {restaurant.review.substring(0, 120)}...
          </Card.Text>
          
          <div className="quick-ratings">
            {Object.entries(restaurant.ratings).slice(0, 3).map(([key, value]) => (
              <div key={key} className="quick-rating-item">
                <span className="rating-category">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <StarRating rating={value} size="small" showValue={false} />
              </div>
            ))}
          </div>
          
          <div className="restaurant-tags">
            {restaurant.highlights.slice(0, 2).map((highlight, idx) => (
              <span key={idx} className="tag-item">{highlight}</span>
            ))}
          </div>
          
          <div className="restaurant-footer">
            <div className="location-info">
              <FaMapMarkerAlt className="me-1" />
              <small>{restaurant.location}</small>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              className="view-details-btn"
              onClick={() => onViewRestaurant(restaurant)}
            >
              View Details
              <FaEye className="ms-2" />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

function Home({ onRestaurantClick }) {
  const [lgShow, setLgShow] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('rating');
  const [userReviews, setUserReviews] = useState({});
  
  // Memoize expensive calculations
  const featuredRestaurants = useMemo(() => getFeaturedRestaurants().slice(0, 3), []);
  const featuredRestaurant = useMemo(() => restaurantData[3], []); // Eleven Madison Park
  const topRatedRestaurants = useMemo(() => getRestaurantsByRating(4.5), []);
  
  // Category filters
  const categories = useMemo(() => [
    { key: 'all', label: 'All Restaurants', icon: <FaUtensils /> },
    { key: 'michelin', label: 'Michelin Starred', icon: <FaStar /> },
    { key: 'creative', label: 'Most Creative', icon: <FaAward /> },
    { key: 'popular', label: 'Fan Favorites', icon: <FaFire /> }
  ], []);
  
  // Memoize filtered restaurants
  const filteredRestaurants = useMemo(() => {
    switch(activeCategory) {
      case 'michelin':
        return restaurantData.filter(r => r.awards.some(award => award.includes('Michelin')));
      case 'creative':
        return restaurantData.filter(r => r.ratings.creativity >= 4.5);
      case 'popular':
        return restaurantData.filter(r => calculateOverallRating(r.ratings) >= 4.3);
      default:
        return featuredRestaurants;
    }
  }, [activeCategory, featuredRestaurants]);
  
  const handleViewRestaurant = useCallback((restaurant) => {
    console.log('🍽️ View Restaurant clicked:', restaurant?.name);
    console.log('📍 onRestaurantClick prop:', onRestaurantClick ? 'Available' : 'Missing');
    
    if (onRestaurantClick && restaurant) {
      // Navigate to restaurant detail page
      console.log('✅ Navigating to restaurant detail page');
      onRestaurantClick(restaurant);
    } else {
      // Fallback to modal view
      console.log('📋 Opening modal view instead');
      setSelectedRestaurant(restaurant);
      setActiveTab('rating');
      // Load reviews for this restaurant
      if (restaurant) {
        const reviews = getRestaurantReviews(restaurant.id);
        setUserReviews(prev => ({
          ...prev,
          [restaurant.id]: reviews
        }));
      }
      setLgShow(true);
    }
  }, [onRestaurantClick]);

  const scrollToRestaurants = useCallback(() => {
    const restaurantSection = document.querySelector('.restaurant-grid-section');
    if (restaurantSection) {
      restaurantSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleAddReview = useCallback((restaurantId, review) => {
    const updatedReviews = addReview(restaurantId, review);
    setUserReviews(prev => ({
      ...prev,
      [restaurantId]: updatedReviews
    }));
  }, []);

  const handleUpdateReview = useCallback((restaurantId, review) => {
    const updatedReviews = updateReview(restaurantId, review.id, review);
    setUserReviews(prev => ({
      ...prev,
      [restaurantId]: updatedReviews
    }));
  }, []);

  const handleDeleteReview = useCallback((restaurantId, reviewId) => {
    const updatedReviews = deleteReview(restaurantId, reviewId);
    setUserReviews(prev => ({
      ...prev,
      [restaurantId]: updatedReviews
    }));
  }, []);
  
  const getFilteredRestaurants = useCallback(() => {
    return filteredRestaurants;
  }, [filteredRestaurants]);
  
  return (
    <Container className="home-container">
      {/* Enhanced Modal with Tabs */}
      <Modal
        size="xl"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="restaurant-modal-title"
        className="restaurant-detail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="restaurant-modal-title">
            {selectedRestaurant ? (
              <div className="d-flex align-items-center">
                <span>{selectedRestaurant.name}</span>
                <Badge bg="primary" className="ms-2">
                  {selectedRestaurant.cuisine}
                </Badge>
                <Badge bg="success" className="ms-2">
                  <FaStar className="me-1" />
                  {calculateOverallRating(selectedRestaurant.ratings).toFixed(1)}
                </Badge>
              </div>
            ) : "Restaurant Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRestaurant ? (
            <Tabs
              id="restaurant-tabs"
              activeKey={activeTab}
              onSelect={(tab) => setActiveTab(tab)}
              className="mb-3"
            >
              <Tab eventKey="rating" title="Rating & Details">
                <RestaurantRating 
                  restaurant={selectedRestaurant} 
                  showDetailed={true}
                  layout="horizontal"
                />
              </Tab>
              <Tab 
                eventKey="reviews" 
                title={`Reviews (${userReviews[selectedRestaurant.id]?.length || 0})`}
              >
                <Reviews
                  restaurant={selectedRestaurant}
                  userReviews={userReviews[selectedRestaurant.id] || []}
                  onAddReview={(review) => handleAddReview(selectedRestaurant.id, review)}
                  onUpdateReview={(review) => handleUpdateReview(selectedRestaurant.id, review)}
                  onDeleteReview={(reviewId) => handleDeleteReview(selectedRestaurant.id, reviewId)}
                />
              </Tab>
            </Tabs>
          ) : (
            <div>
              <h5>Welcome to Foxy Confidential!</h5>
              <p>
                Your ultimate guide to the best restaurants in the city. We rate each establishment across five key categories:
              </p>
              <ul>
                <li><strong>Food Quality</strong> - Ingredient freshness and preparation</li>
                <li><strong>Taste</strong> - Flavor profiles and culinary execution</li>
                <li><strong>Ambiance</strong> - Atmosphere, decor, and overall vibe</li>
                <li><strong>Creativity</strong> - Innovation and unique approach</li>
                <li><strong>Uniqueness</strong> - What makes this place special</li>
              </ul>
              <p>Each category is rated on a 5-star scale, giving you the complete picture!</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Hero Section */}
      <div className="hero-section-wrapper">
        <Row className="hero-section">
          <Col xs={12}>
            <div className="hero-content text-center">
              <div className="hero-badge mb-3">
                <Badge bg="warning" className="hero-label">
                  <FaStar className="me-2" />
                  Premium Restaurant Reviews
                </Badge>
              </div>
              <h1 className="hero-title">Discover Extraordinary Dining</h1>
              <p className="hero-subtitle">
                Expert reviews and ratings for the finest restaurants
              </p>
              <p className="hero-description">
                We evaluate restaurants across five comprehensive categories: Food Quality, Taste, 
                Ambiance, Creativity, and Uniqueness. Make informed dining decisions with our 
                detailed, professional ratings.
              </p>
              <div className="hero-buttons">
                <Button variant="primary" size="lg" className="hero-cta" onClick={scrollToRestaurants}>
                  <FaUtensils className="me-2" />
                  Explore Restaurants
                </Button>
                <Button variant="outline-light" size="lg" className="hero-cta-secondary" onClick={() => handleViewRestaurant(null)}>
                  Learn More
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Statistics Section */}
      <Container className="stats-container">
        <Row className="stats-section">
          <Col xs={6} md={3} className="stat-col">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaUtensils className="stat-icon" />
              </div>
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Reviewed Restaurants</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="stat-col">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaAward className="stat-icon" />
              </div>
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Michelin Stars</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="stat-col">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaHeart className="stat-icon" />
              </div>
              <h3 className="stat-number">10K+</h3>
              <p className="stat-label">Community Members</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="stat-col">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaStar className="stat-icon" />
              </div>
              <h3 className="stat-number">4.9</h3>
              <p className="stat-label">Average Rating</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Featured Section */}
      <Row className="featured-section mb-5">
        <Col xs={12} lg={10} className="mx-auto">
          <Card className="featured-card bg-dark text-white shadow-lg">
            <Card.Img src={food1} className="featured-image" alt={featuredRestaurant.name} />
            <Card.ImgOverlay className="featured-overlay">
              <Badge bg="warning" className="featured-badge mb-2">
                <FaStar className="me-1" />
                Featured Restaurant
              </Badge>
              <Card.Title className="featured-title">{featuredRestaurant.name}</Card.Title>
              <Card.Text className="featured-text">
                {featuredRestaurant.review.substring(0, 120)}...
              </Card.Text>
              <div className="featured-rating mb-3">
                <StarRating 
                  rating={calculateOverallRating(featuredRestaurant.ratings)} 
                  size="large"
                  color="primary"
                  showValue={true}
                />
              </div>
              <div className="featured-meta mb-3">
                <span className="featured-location">
                  <FaMapMarkerAlt className="me-1" />
                  {featuredRestaurant.location}
                </span>
                <span className="featured-time ms-3">
                  <FaClock className="me-1" />
                  {featuredRestaurant.cuisine}
                </span>
              </div>
              <Button variant="warning" onClick={() => handleViewRestaurant(featuredRestaurant)} className="featured-btn">
                <FaEye className="me-2" />
                View Full Rating
              </Button>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>

      {/* Rating Categories Breakdown */}
      <Row className="categories-section mb-5">
        <Col xs={12}>
          <div className="section-header text-center mb-4">
            <h2 className="section-title">Our Rating Categories</h2>
            <p className="section-description">
              How we evaluate every restaurant across 5 key dimensions
            </p>
          </div>
          
          <Row>
            {[
              { name: 'Food Quality', icon: <FaUtensils />, description: 'Ingredient freshness, preparation techniques, and presentation', color: 'primary' },
              { name: 'Taste', icon: <FaHeart />, description: 'Flavor profiles, seasoning, and overall deliciousness', color: 'danger' },
              { name: 'Ambiance', icon: <FaMapMarkerAlt />, description: 'Atmosphere, decor, music, and overall dining environment', color: 'success' },
              { name: 'Creativity', icon: <FaAward />, description: 'Innovation, unique approaches, and artistic presentation', color: 'warning' },
              { name: 'Uniqueness', icon: <FaStar />, description: 'What makes this place special and memorable', color: 'info' }
            ].map((category, index) => (
              <Col xs={12} sm={6} xl={4} xxl={4} key={index} className="mb-4 d-flex">
                <Card className="category-card w-100">
                  <Card.Body className="text-center">
                    <div className={`category-icon-wrapper bg-${category.color} text-white mb-3`}>
                      {category.icon}
                    </div>
                    <h5 className="category-title">{category.name}</h5>
                    <p className="category-description">{category.description}</p>
                    <ProgressBar 
                      variant={category.color} 
                      now={85 + (index * 3)} 
                      className="category-progress"
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Featured Restaurants Section */}
      <section className="featured-restaurants-section">
        <div className="section-header text-center">
          <h2 className="section-title">Featured Restaurants</h2>
          <p className="section-description">
            Hand-picked establishments that exemplify culinary excellence
          </p>
          <div className="section-divider"></div>
        </div>
        
        {/* Category Filter Buttons */}
        <div className="category-filters-wrapper">
          <Row className="g-3 justify-content-center">
            {categories.map(category => (
              <Col xs={6} sm={6} md={3} lg={3} key={category.key}>
                <div
                  className={`filter-card ${activeCategory === category.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.key)}
                >
                  <div className="filter-icon">{category.icon}</div>
                  <div className="filter-label">{category.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Restaurant Cards Grid */}
      <section className="restaurant-grid-section">
        <Row className="g-4">
          {getFilteredRestaurants().map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
              onViewRestaurant={handleViewRestaurant}
            />
          ))}
        </Row>
      </section>
    </Container>
  );
}

export default Home;
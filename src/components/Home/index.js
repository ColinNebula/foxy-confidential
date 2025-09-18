import React, { useState } from 'react'
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


function Home() {
  const [lgShow, setLgShow] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('rating');
  const [userReviews, setUserReviews] = useState({});
  
  // Get featured restaurants from data
  const featuredRestaurants = getFeaturedRestaurants().slice(0, 3);
  const featuredRestaurant = restaurantData[3]; // Eleven Madison Park
  const topRatedRestaurants = getRestaurantsByRating(4.5);
  
  // Category filters
  const categories = [
    { key: 'all', label: 'All Restaurants', icon: <FaUtensils /> },
    { key: 'michelin', label: 'Michelin Starred', icon: <FaStar /> },
    { key: 'creative', label: 'Most Creative', icon: <FaAward /> },
    { key: 'popular', label: 'Fan Favorites', icon: <FaFire /> }
  ];
  
  const handleViewRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setActiveTab('rating');
    // Load reviews for this restaurant
    const reviews = getRestaurantReviews(restaurant.id);
    setUserReviews(prev => ({
      ...prev,
      [restaurant.id]: reviews
    }));
    setLgShow(true);
  };

  const handleAddReview = (restaurantId, review) => {
    const updatedReviews = addReview(restaurantId, review);
    setUserReviews(prev => ({
      ...prev,
      [restaurantId]: updatedReviews
    }));
  };

  const handleUpdateReview = (restaurantId, review) => {
    const updatedReviews = updateReview(restaurantId, review.id, review);
    setUserReviews(prev => ({
      ...prev,
      [restaurantId]: updatedReviews
    }));
  };

  const handleDeleteReview = (restaurantId, reviewId) => {
    const updatedReviews = deleteReview(restaurantId, reviewId);
    setUserReviews(prev => ({
      ...prev,
      [restaurantId]: updatedReviews
    }));
  };
  
  const getFilteredRestaurants = () => {
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
  };
  
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
      <Row className="hero-section mb-5">
        <Col xs={12}>
          <div className="hero-content text-center">
            <div className="hero-emoji mb-3">
              <span role="img" aria-label="fox">🦊</span>
              <span role="img" aria-label="sparkles">✨</span>
              <span role="img" aria-label="fox">🦊</span>
            </div>
            <h1 className="hero-title">Welcome to Foxy Confidential</h1>
            <p className="hero-subtitle mb-4">
              Your premier destination for restaurant discovery and ratings
            </p>
            <p className="hero-description mb-4">
              Welcome to Foxy Confidential - where culinary excellence meets honest reviews! We rate restaurants across 5 key categories: 
              Food Quality, Taste, Ambiance, Creativity, and Uniqueness. Discover your next amazing dining experience with our 
              comprehensive 🦊-approved rating system.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" size="lg" className="me-3 hero-cta">
                <FaUtensils className="me-2" />
                Explore Now
              </Button>
              <Button variant="outline-primary" size="lg" onClick={() => handleViewRestaurant(null)}>
                <FaHeart className="me-2" />
                How We Rate
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Section */}
      <Row className="stats-section mb-5">
        <Col xs={12}>
          <Row className="text-center">
            <Col xs={6} md={3} className="mb-3">
              <div className="stat-item">
                <FaUtensils className="stat-icon" />
                <h3 className="stat-number">500+</h3>
                <p className="stat-label">Restaurants</p>
              </div>
            </Col>
            <Col xs={6} md={3} className="mb-3">
              <div className="stat-item">
                <FaAward className="stat-icon" />
                <h3 className="stat-number">50+</h3>
                <p className="stat-label">Awards</p>
              </div>
            </Col>
            <Col xs={6} md={3} className="mb-3">
              <div className="stat-item">
                <FaHeart className="stat-icon" />
                <h3 className="stat-number">10K+</h3>
                <p className="stat-label">Happy Customers</p>
              </div>
            </Col>
            <Col xs={6} md={3} className="mb-3">
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <h3 className="stat-number">4.9</h3>
                <p className="stat-label">Average Rating</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

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
              <Col xs={12} sm={6} lg={4} xl={4} key={index} className="mb-4">
                <Card className="category-card h-100">
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

      {/* Content Section with Filters */}
      <Row className="content-section mb-5">
        <Col xs={12}>
          <div className="text-center mb-4">
            <h2 className="section-title">
              <FaFilter className="me-2" />
              Browse by Category
            </h2>
            <p className="section-description">
              Filter restaurants by what matters most to you
            </p>
          </div>
          
          {/* Category Filter Buttons */}
          <div className="category-filters text-center mb-4">
            <Row className="g-2">
              {categories.map(category => (
                <Col xs={12} sm={6} md={3} key={category.key}>
                  <Button
                    variant={activeCategory === category.key ? 'primary' : 'outline-primary'}
                    className="filter-btn w-100"
                    onClick={() => setActiveCategory(category.key)}
                  >
                    {category.icon}
                    <span className="ms-2 d-none d-sm-inline">{category.label}</span>
                    <span className="ms-2 d-sm-none">{category.label.split(' ')[0]}</span>
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>

      {/* Cards Section */}
      <Row className="cards-section">
        {getFilteredRestaurants().map((restaurant, index) => {
          const images = [food3, food2, food6];
          const overallRating = calculateOverallRating(restaurant.ratings);
          
          return (
            <Col xs={12} className="mb-4" key={restaurant.id}>
              <Card className="h-100 shadow-sm content-card restaurant-card">
                <Row className="g-0">
                  <Col md={4} lg={3}>
                    <div className="card-image-wrapper">
                      <Card.Img src={images[index % 3]} className="card-image-horizontal" />
                      <Badge bg="success" className="card-badge">
                        <FaStar className="me-1" />
                        {overallRating.toFixed(1)}
                      </Badge>
                      {restaurant.awards.some(award => award.includes('Michelin')) && (
                        <Badge bg="warning" className="michelin-badge">
                          <FaStar className="me-1" />
                          <span className="d-none d-sm-inline">Michelin</span>
                          <span className="d-sm-none">⭐</span>
                        </Badge>
                      )}
                    </div>
                  </Col>
                  <Col md={8} lg={9}>
                    <Card.Body className="d-flex flex-column">
                      <div className="card-header-info mb-2">
                        <FaUtensils className="card-icon" />
                        <span className="card-category">{restaurant.cuisine}</span>
                        <span className="ms-auto price-range">{restaurant.priceRange}</span>
                      </div>
                      <Card.Title className="restaurant-name">{restaurant.name}</Card.Title>
                      <Card.Text className="flex-grow-1 restaurant-description">
                        {restaurant.review.substring(0, 180)}...
                      </Card.Text>
                      
                      {/* Rating Breakdown Preview */}
                      <div className="rating-preview mb-3">
                        <Row className="g-1">
                          <Col xs={4} className="rating-item">
                            <span className="rating-label">Food:</span>
                            <StarRating rating={restaurant.ratings.food} size="small" showValue={false} />
                          </Col>
                          <Col xs={4} className="rating-item">
                            <span className="rating-label">Taste:</span>
                            <StarRating rating={restaurant.ratings.taste} size="small" showValue={false} />
                          </Col>
                          <Col xs={4} className="rating-item">
                            <span className="rating-label">Ambiance:</span>
                            <StarRating rating={restaurant.ratings.ambiance} size="small" showValue={false} />
                          </Col>
                        </Row>
                      </div>

                      <div className="restaurant-highlights mb-3">
                        {restaurant.highlights.slice(0, 3).map((highlight, idx) => (
                          <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="card-meta mb-3">
                        <small className="text-muted">
                          <FaMapMarkerAlt className="me-1" />
                          {restaurant.location}
                        </small>
                        <small className="text-muted ms-3">
                          <FaClock className="me-1" />
                          Since {restaurant.openSince}
                        </small>
                      </div>
                      
                      <div className="mt-auto card-actions">
                        <Button variant="primary" onClick={() => handleViewRestaurant(restaurant)} className="me-2">
                          <FaEye className="me-1" />
                          <span className="d-none d-sm-inline">Full Rating</span>
                          <span className="d-sm-none">Rating</span>
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <FaHeart />
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })}

      </Row>
    </Container>
  );
}

export default Home;
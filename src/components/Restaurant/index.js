import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tab, Tabs, Image, ListGroup, ProgressBar } from 'react-bootstrap';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaUtensils, 
  FaDollarSign,
  FaHeart,
  FaShare,
  FaDirections,
  FaInfoCircle,
  FaImages,
  FaComments,
  FaListAlt,
  FaCheckCircle,
  FaWifi,
  FaParking,
  FaCreditCard,
  FaGlassMartini,
  FaWheelchair
} from 'react-icons/fa';
import Reviews from '../Reviews';
import './Restaurant.css';

const Restaurant = ({ restaurant, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Default restaurant data if none provided
  const defaultRestaurant = {
    id: 1,
    name: "Bella Vista Restaurant",
    cuisine: "Italian",
    rating: 4.5,
    totalReviews: 342,
    priceRange: "$$",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "10:00 AM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    description: "Experience authentic Italian cuisine in an elegant atmosphere. Our family-owned restaurant has been serving the finest pasta, pizza, and traditional Italian dishes for over 20 years.",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800"
    ],
    specialties: [
      "Homemade Pasta",
      "Wood-Fired Pizza",
      "Fresh Seafood",
      "Imported Wines"
    ],
    amenities: [
      { icon: FaWifi, name: "Free WiFi" },
      { icon: FaParking, name: "Valet Parking" },
      { icon: FaCreditCard, name: "Credit Cards" },
      { icon: FaGlassMartini, name: "Full Bar" },
      { icon: FaWheelchair, name: "Wheelchair Accessible" }
    ],
    menu: {
      appetizers: [
        { name: "Bruschetta", price: "$8.99", description: "Toasted bread with tomatoes, garlic, and basil" },
        { name: "Calamari Fritti", price: "$12.99", description: "Crispy fried squid with marinara sauce" },
        { name: "Caprese Salad", price: "$10.99", description: "Fresh mozzarella, tomatoes, and basil" }
      ],
      mainCourses: [
        { name: "Spaghetti Carbonara", price: "$16.99", description: "Classic pasta with pancetta and egg" },
        { name: "Margherita Pizza", price: "$14.99", description: "Traditional pizza with fresh mozzarella" },
        { name: "Osso Buco", price: "$28.99", description: "Braised veal shanks in wine sauce" },
        { name: "Seafood Risotto", price: "$24.99", description: "Creamy rice with mixed seafood" }
      ],
      desserts: [
        { name: "Tiramisu", price: "$7.99", description: "Classic Italian dessert with coffee and mascarpone" },
        { name: "Panna Cotta", price: "$6.99", description: "Creamy vanilla custard with berry sauce" },
        { name: "Gelato", price: "$5.99", description: "Italian ice cream, various flavors" }
      ]
    },
    ratingBreakdown: {
      5: 215,
      4: 89,
      3: 28,
      2: 7,
      1: 3
    }
  };

  const restaurantData = restaurant || defaultRestaurant;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurantData.name,
        text: `Check out ${restaurantData.name} - ${restaurantData.cuisine} cuisine`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  const getDirections = () => {
    const address = encodeURIComponent(restaurantData.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const calculateRatingPercentage = (stars) => {
    const total = Object.values(restaurantData.ratingBreakdown).reduce((a, b) => a + b, 0);
    return ((restaurantData.ratingBreakdown[stars] / total) * 100).toFixed(0);
  };

  return (
    <div className="restaurant-page">
      <Container fluid className="px-0">
        {/* Hero Section */}
        <div className="restaurant-hero" style={{ backgroundImage: `url(${restaurantData.images[0]})` }}>
          <div className="hero-overlay">
            <Container>
              <Row className="align-items-center">
                <Col>
                  {onBack && (
                    <Button variant="light" className="mb-3" onClick={onBack}>
                      ← Back to Search
                    </Button>
                  )}
                  <h1 className="restaurant-name-hero">{restaurantData.name}</h1>
                  <div className="restaurant-meta-hero">
                    <Badge bg="primary" className="me-2">{restaurantData.cuisine}</Badge>
                    <Badge bg="success" className="me-2">{restaurantData.priceRange}</Badge>
                    <span className="rating-badge">
                      <FaStar className="text-warning me-1" />
                      {restaurantData.rating} ({restaurantData.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="hero-actions mt-3">
                    <Button 
                      variant={isFavorite ? "danger" : "outline-light"} 
                      className="me-2"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <FaHeart className="me-2" />
                      {isFavorite ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline-light" className="me-2" onClick={handleShare}>
                      <FaShare className="me-2" />
                      Share
                    </Button>
                    <Button variant="outline-light" onClick={getDirections}>
                      <FaDirections className="me-2" />
                      Directions
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>

        {/* Main Content */}
        <Container className="restaurant-content py-4">
          {/* Quick Info Bar */}
          <Card className="info-bar mb-4">
            <Card.Body>
              <Row className="text-center">
                <Col md={4} className="border-end">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-label">Address</div>
                  <div className="info-value">{restaurantData.address}</div>
                </Col>
                <Col md={4} className="border-end">
                  <FaPhone className="info-icon" />
                  <div className="info-label">Phone</div>
                  <div className="info-value">{restaurantData.phone}</div>
                </Col>
                <Col md={4}>
                  <FaClock className="info-icon" />
                  <div className="info-label">Hours Today</div>
                  <div className="info-value text-success">Open Now</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabs Section */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="restaurant-tabs mb-4"
          >
            {/* Overview Tab */}
            <Tab eventKey="overview" title={<span><FaInfoCircle className="me-2" />Overview</span>}>
              <Row>
                <Col lg={8}>
                  <Card className="content-card mb-4">
                    <Card.Body>
                      <h3>About {restaurantData.name}</h3>
                      <p className="restaurant-description">{restaurantData.description}</p>
                      
                      <h4 className="mt-4">Specialties</h4>
                      <div className="specialties-list">
                        {restaurantData.specialties.map((specialty, index) => (
                          <Badge key={index} bg="secondary" className="me-2 mb-2 specialty-badge">
                            <FaCheckCircle className="me-1" />
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <h4 className="mt-4">Amenities</h4>
                      <Row className="amenities-grid">
                        {restaurantData.amenities.map((amenity, index) => (
                          <Col xs={6} md={4} key={index} className="amenity-item mb-3">
                            <amenity.icon className="amenity-icon me-2" />
                            {amenity.name}
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="content-card mb-4">
                    <Card.Body>
                      <h4>Hours of Operation</h4>
                      <ListGroup variant="flush">
                        {Object.entries(restaurantData.hours).map(([day, hours]) => (
                          <ListGroup.Item key={day} className="d-flex justify-content-between">
                            <span className="text-capitalize fw-bold">{day}</span>
                            <span>{hours}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>

                  <Card className="content-card">
                    <Card.Body>
                      <h4>Rating Breakdown</h4>
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="rating-breakdown-item mb-2">
                          <div className="d-flex justify-content-between mb-1">
                            <span>{stars} <FaStar className="text-warning" size={12} /></span>
                            <span>{calculateRatingPercentage(stars)}%</span>
                          </div>
                          <ProgressBar 
                            now={calculateRatingPercentage(stars)} 
                            variant={stars >= 4 ? "success" : stars >= 3 ? "warning" : "danger"}
                          />
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Menu Tab */}
            <Tab eventKey="menu" title={<span><FaListAlt className="me-2" />Menu</span>}>
              <Card className="content-card">
                <Card.Body>
                  <div className="menu-section mb-4">
                    <h3 className="menu-category">
                      <FaUtensils className="me-2 text-primary" />
                      Appetizers
                    </h3>
                    <ListGroup>
                      {restaurantData.menu.appetizers.map((item, index) => (
                        <ListGroup.Item key={index} className="menu-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="menu-item-name">{item.name}</h5>
                              <p className="menu-item-description">{item.description}</p>
                            </div>
                            <span className="menu-item-price">{item.price}</span>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>

                  <div className="menu-section mb-4">
                    <h3 className="menu-category">
                      <FaUtensils className="me-2 text-primary" />
                      Main Courses
                    </h3>
                    <ListGroup>
                      {restaurantData.menu.mainCourses.map((item, index) => (
                        <ListGroup.Item key={index} className="menu-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="menu-item-name">{item.name}</h5>
                              <p className="menu-item-description">{item.description}</p>
                            </div>
                            <span className="menu-item-price">{item.price}</span>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>

                  <div className="menu-section">
                    <h3 className="menu-category">
                      <FaUtensils className="me-2 text-primary" />
                      Desserts
                    </h3>
                    <ListGroup>
                      {restaurantData.menu.desserts.map((item, index) => (
                        <ListGroup.Item key={index} className="menu-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="menu-item-name">{item.name}</h5>
                              <p className="menu-item-description">{item.description}</p>
                            </div>
                            <span className="menu-item-price">{item.price}</span>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Photos Tab */}
            <Tab eventKey="photos" title={<span><FaImages className="me-2" />Photos</span>}>
              <Row>
                {restaurantData.images.map((image, index) => (
                  <Col md={6} lg={4} key={index} className="mb-4">
                    <Card className="photo-card">
                      <Card.Img 
                        variant="top" 
                        src={image} 
                        alt={`${restaurantData.name} - Photo ${index + 1}`}
                        className="restaurant-photo"
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            {/* Reviews Tab */}
            <Tab eventKey="reviews" title={<span><FaComments className="me-2" />Reviews</span>}>
              <Reviews 
                restaurant={restaurantData}
                userReviews={[]}
                onAddReview={(review) => console.log('Review added:', review)}
                onUpdateReview={(id, review) => console.log('Review updated:', id, review)}
                onDeleteReview={(id) => console.log('Review deleted:', id)}
              />
            </Tab>
          </Tabs>
        </Container>
      </Container>
    </div>
  );
};

export default Restaurant;

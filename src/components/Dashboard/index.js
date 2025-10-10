import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaUtensils, 
  FaLocationArrow,
  FaLayerGroup,
  FaList,
  FaMap
} from 'react-icons/fa';
import LeafletMap from './LeafletMap';
import { 
  fetchNearbyRestaurantsWithMap, 
  searchRestaurants, 
  calculateDistance 
} from '../../services/googlePlacesService';
import './Dashboard.css';

const Dashboard = ({ onRestaurantClick }) => {
  // State management
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [radiusFilter, setRadiusFilter] = useState(10); // km
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating', 'name'
  const [viewMode, setViewMode] = useState('list'); // 'map' or 'list' - start with list
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [useRealData, setUseRealData] = useState(true); // Toggle between real API and mock data

  const defaultCenter = {
    lat: 40.7128, // New York City default
    lng: -74.0060
  };

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);

  // Mock restaurant data with locations
  const mockRestaurants = [
    {
      id: 1,
      name: "Bella Vista Restaurant",
      cuisine: "Italian",
      rating: 4.5,
      priceRange: "$$",
      address: "123 Main St, New York, NY",
      phone: "(212) 555-0101",
      position: { lat: 40.7580, lng: -73.9855 },
      reviews: 142,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      openNow: true,
      description: "Authentic Italian cuisine with a modern twist"
    },
    {
      id: 2,
      name: "Sakura Sushi Bar",
      cuisine: "Japanese",
      rating: 4.7,
      priceRange: "$$$",
      address: "456 Park Ave, New York, NY",
      phone: "(212) 555-0102",
      position: { lat: 40.7614, lng: -73.9776 },
      reviews: 98,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
      openNow: true,
      description: "Fresh sushi and traditional Japanese dishes"
    },
    {
      id: 3,
      name: "Burger Haven",
      cuisine: "American",
      rating: 4.2,
      priceRange: "$",
      address: "789 Broadway, New York, NY",
      phone: "(212) 555-0103",
      position: { lat: 40.7489, lng: -73.9680 },
      reviews: 215,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      openNow: true,
      description: "Gourmet burgers and craft beers"
    },
    {
      id: 4,
      name: "Dragon Palace",
      cuisine: "Chinese",
      rating: 4.4,
      priceRange: "$$",
      address: "321 5th Ave, New York, NY",
      phone: "(212) 555-0104",
      position: { lat: 40.7516, lng: -73.9755 },
      reviews: 167,
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
      openNow: false,
      description: "Traditional Chinese cuisine and dim sum"
    },
    {
      id: 5,
      name: "Le Petit Bistro",
      cuisine: "French",
      rating: 4.8,
      priceRange: "$$$$",
      address: "654 Madison Ave, New York, NY",
      phone: "(212) 555-0105",
      position: { lat: 40.7639, lng: -73.9719 },
      reviews: 89,
      image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
      openNow: true,
      description: "Fine French dining experience"
    },
    {
      id: 6,
      name: "Taco Fiesta",
      cuisine: "Mexican",
      rating: 4.3,
      priceRange: "$",
      address: "987 Lexington Ave, New York, NY",
      phone: "(212) 555-0106",
      position: { lat: 40.7527, lng: -73.9640 },
      reviews: 203,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
      openNow: true,
      description: "Authentic Mexican street food"
    },
    {
      id: 7,
      name: "Curry House",
      cuisine: "Indian",
      rating: 4.6,
      priceRange: "$$",
      address: "147 3rd Ave, New York, NY",
      phone: "(212) 555-0107",
      position: { lat: 40.7444, lng: -73.9782 },
      reviews: 134,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      openNow: true,
      description: "Aromatic Indian curries and tandoori"
    },
    {
      id: 8,
      name: "Mediterranean Delight",
      cuisine: "Mediterranean",
      rating: 4.5,
      priceRange: "$$",
      address: "258 7th Ave, New York, NY",
      phone: "(212) 555-0108",
      position: { lat: 40.7502, lng: -73.9925 },
      reviews: 176,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
      openNow: true,
      description: "Fresh Mediterranean flavors"
    },
    {
      id: 9,
      name: "Steakhouse Prime",
      cuisine: "Steakhouse",
      rating: 4.7,
      priceRange: "$$$$",
      address: "369 Park Ave South, New York, NY",
      phone: "(212) 555-0109",
      position: { lat: 40.7450, lng: -73.9845 },
      reviews: 112,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
      openNow: false,
      description: "Premium cuts and fine wines"
    },
    {
      id: 10,
      name: "Vegan Garden",
      cuisine: "Vegan",
      rating: 4.4,
      priceRange: "$$",
      address: "753 Amsterdam Ave, New York, NY",
      phone: "(212) 555-0110",
      position: { lat: 40.7851, lng: -73.9763 },
      reviews: 95,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      openNow: true,
      description: "Plant-based culinary excellence"
    },
    {
      id: 11,
      name: "Thai Orchid",
      cuisine: "Thai",
      rating: 4.5,
      priceRange: "$",
      address: "159 2nd Ave, New York, NY",
      phone: "(212) 555-0111",
      position: { lat: 40.7312, lng: -73.9866 },
      reviews: 188,
      image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
      openNow: true,
      description: "Authentic Thai street food"
    },
    {
      id: 12,
      name: "Greek Taverna",
      cuisine: "Greek",
      rating: 4.6,
      priceRange: "$$",
      address: "842 9th Ave, New York, NY",
      phone: "(212) 555-0112",
      position: { lat: 40.7628, lng: -73.9889 },
      reviews: 156,
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
      openNow: true,
      description: "Traditional Greek specialties"
    }
  ];

  // Get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          setMapZoom(14);
          setIsLoadingLocation(false);
        },
        (error) => {
          setLocationError('Unable to get your location. Using default location.');
          setIsLoadingLocation(false);
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
    }
  };





  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistanceLocal = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Load initial mock data and request user location
  useEffect(() => {
    setRestaurants(mockRestaurants);
    setFilteredRestaurants(mockRestaurants);
    // Request user location on mount for better experience
    getUserLocation();
  }, []);

  // Filter restaurants based on criteria
  useEffect(() => {
    let filtered = [...mockRestaurants];

    // Add distance to each restaurant if user location is available
    if (userLocation) {
      filtered = filtered.map(r => ({
        ...r,
        distance: calculateDistanceLocal(
          userLocation.lat,
          userLocation.lng,
          r.position.lat,
          r.position.lng
        )
      }));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (cuisineFilter !== 'all') {
      filtered = filtered.filter(r => r.cuisine === cuisineFilter);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(r => r.rating >= minRating);
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(r => r.priceRange === priceFilter);
    }

    // Radius filter (if user location is available)
    if (userLocation && radiusFilter) {
      filtered = filtered.filter(r => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          r.position.lat,
          r.position.lng
        );
        return distance <= radiusFilter;
      });
    }

    // Add distance to each restaurant
    if (userLocation) {
      filtered = filtered.map(r => ({
        ...r,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          r.position.lat,
          r.position.lng
        ).toFixed(1)
      }));
      // Sort by distance
      filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    setFilteredRestaurants(filtered);
    setRestaurants(mockRestaurants);
  }, [searchQuery, cuisineFilter, ratingFilter, priceFilter, radiusFilter, userLocation]);

  // Check for API key and initialize
  // Handle marker click
  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMapCenter(restaurant.position);
    setMapZoom(15);
  };

  // Handle list item click
  const handleListItemClick = (restaurant) => {
    if (onRestaurantClick) {
      // Navigate to restaurant detail page
      onRestaurantClick(restaurant);
    } else {
      // Fallback to map view
      setSelectedRestaurant(restaurant);
      setMapCenter(restaurant.position);
      setMapZoom(15);
      setViewMode('map');
    }
  };

  // Get unique cuisines for filter
  const uniqueCuisines = [...new Set(mockRestaurants.map(r => r.cuisine))].sort();

  return (
    <div className="dashboard-container">
      <Container fluid>
        {/* Header */}
        <div className="dashboard-header">
          <Row className="align-items-center mb-4">
            <Col md={8}>
              <h1 className="dashboard-title">
                <FaMapMarkerAlt className="me-3" />
                Restaurant Discovery Dashboard
              </h1>
              <p className="dashboard-subtitle">
                Explore {filteredRestaurants.length} restaurants in your area
              </p>
            </Col>
            <Col md={4} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={() => setUseRealData(!useRealData)}
                className="me-2"
                size="sm"
              >
                {useRealData ? '🌐 Real Data' : '📝 Mock Data'}
              </Button>
              <Button
                variant={userLocation ? "success" : "primary"}
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                className="location-btn"
              >
                {isLoadingLocation ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Getting Location...
                  </>
                ) : userLocation ? (
                  <>
                    <FaLocationArrow className="me-2" />
                    Location Active
                  </>
                ) : (
                  <>
                    <FaLocationArrow className="me-2" />
                    Use My Location
                  </>
                )}
              </Button>
            </Col>
          </Row>

          {locationError && (
            <Alert variant="warning" dismissible onClose={() => setLocationError('')}>
              <strong>Location Not Available:</strong> {locationError}
              <br />
              <small>You can still browse restaurants, but they won't be sorted by distance.</small>
            </Alert>
          )}
          
          {userLocation && (
            <Alert variant="success" className="mb-0 mt-2">
              <FaMapMarkerAlt className="me-2" />
              <strong>Location Active!</strong> Restaurants are now sorted by distance from your location 
              (Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)})
            </Alert>
          )}
          
          {!userLocation && !locationError && !isLoadingLocation && (
            <Alert variant="info" className="mb-0 mt-2">
              <FaLocationArrow className="me-2" />
              <strong>Tip:</strong> Click "Use My Location" to find restaurants near you and see distances!
            </Alert>
          )}
        </div>

        {/* Filters Section */}
        <Card className="filters-card mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    <FaSearch className="me-2" />
                    Search
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Restaurant name, cuisine..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="filter-input"
                      disabled={isLoadingRestaurants}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    <FaUtensils className="me-2" />
                    Cuisine
                  </Form.Label>
                  <Form.Select
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Cuisines</option>
                    {uniqueCuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    <FaStar className="me-2" />
                    Rating
                  </Form.Label>
                  <Form.Select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    <FaFilter className="me-2" />
                    Price
                  </Form.Label>
                  <Form.Select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Prices</option>
                    <option value="$">$ - Budget</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Expensive</option>
                    <option value="$$$$">$$$$ - Fine Dining</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    <FaLayerGroup className="me-2" />
                    Radius: {radiusFilter} km {userLocation && <small className="text-success">(from your location)</small>}
                  </Form.Label>
                  <Form.Range
                    min="1"
                    max="50"
                    value={radiusFilter}
                    onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
                    className="filter-range"
                    disabled={!userLocation}
                  />
                  {!userLocation && (
                    <Form.Text className="text-muted">
                      Enable location to use radius filter
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* View Toggle */}
        <div className="view-toggle mb-3">
          <Button
            variant={viewMode === 'map' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('map')}
            className="me-2"
          >
            <FaMap className="me-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
          >
            <FaList className="me-2" />
            List View
          </Button>
        </div>

        {/* Map and List View */}
        <Row>
          {viewMode === 'map' ? (
            <Col lg={12}>
              <div className="map-card" style={{ minHeight: '600px' }}>
                <div style={{ 
                  padding: 0, 
                  height: '600px', 
                  minHeight: '600px',
                  width: '100%',
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Free OpenStreetMap - No API Key Required! */}
                  <LeafletMap
                    center={mapCenter}
                    zoom={mapZoom}
                    restaurants={filteredRestaurants}
                    selectedRestaurant={selectedRestaurant}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              </div>
            </Col>
          ) : (
            <Col lg={12}>
              {isLoadingRestaurants ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                  <h4 className="mt-3" style={{ color: '#ff6b6b' }}>Loading restaurants...</h4>
                  <p className="text-white">Fetching data from Google Places API</p>
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <Card className="text-center py-5">
                  <Card.Body>
                    <FaUtensils size={60} className="mb-3" style={{ color: '#ff6b6b', opacity: 0.5 }} />
                    <h3>No restaurants found</h3>
                    <p className="text-muted">Try adjusting your filters or search query</p>
                    <Button variant="primary" onClick={() => {
                      setSearchQuery('');
                      setCuisineFilter('all');
                      setRatingFilter('all');
                      setPriceFilter('all');
                    }}>
                      Clear Filters
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
              <Row>
                {filteredRestaurants.map((restaurant) => (
                  <Col xxl={4} xl={4} lg={6} md={6} sm={12} key={restaurant.id} className="mb-4 d-flex">
                    <Card 
                      className="restaurant-card w-100"
                      onClick={() => handleListItemClick(restaurant)}
                    >
                      <div className="restaurant-card-image-container">
                        <Card.Img
                          variant="top"
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="restaurant-card-image"
                        />
                        {restaurant.openNow ? (
                          <Badge bg="success" className="status-badge">Open Now</Badge>
                        ) : (
                          <Badge bg="danger" className="status-badge">Closed</Badge>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title className="restaurant-card-title">
                          {restaurant.name}
                        </Card.Title>
                        <div className="restaurant-card-meta mb-2">
                          <Badge bg="primary" className="me-2">{restaurant.cuisine}</Badge>
                          <Badge bg="warning" text="dark">
                            <FaStar /> {restaurant.rating}
                          </Badge>
                          <Badge bg="success" className="ms-2">{restaurant.priceRange}</Badge>
                          {restaurant.distance && (
                            <Badge bg="info" className="ms-2">
                              <FaLocationArrow className="me-1" />
                              {restaurant.distance} km
                            </Badge>
                          )}
                        </div>
                        <Card.Text className="restaurant-card-description">
                          {restaurant.description}
                        </Card.Text>
                        <div className="restaurant-card-info">
                          <small className="text-muted">
                            <FaMapMarkerAlt className="me-1" />
                            {restaurant.distance ? `${restaurant.distance} km away` : restaurant.address}
                          </small>
                          <small className="text-muted ms-3">
                            {restaurant.reviews} reviews
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              )}
            </Col>
          )}
        </Row>

        {/* Statistics Footer */}
        <div className="stats-card mt-4">
          <div className="stats-card-body">
            <Row className="text-center">
              <Col md={3}>
                <div className="stat-item">
                  <div className="stat-number">{filteredRestaurants.length}</div>
                  <div className="stat-label">Restaurants Found</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-item">
                  <div className="stat-number">{uniqueCuisines.length}</div>
                  <div className="stat-label">Cuisine Types</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-item">
                  <div className="stat-number">
                    {(filteredRestaurants.reduce((sum, r) => sum + r.rating, 0) / filteredRestaurants.length || 0).toFixed(1)}
                  </div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-item">
                  <div className="stat-number">
                    {filteredRestaurants.filter(r => r.openNow).length}
                  </div>
                  <div className="stat-label">Open Now</div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;

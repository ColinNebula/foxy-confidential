import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Alert, Spinner, Modal } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter, 
  FaUtensils, 
  FaLocationArrow,
  FaLayerGroup,
  FaList,
  FaMap,
  FaHeart,
  FaRegHeart,
  FaPlus
} from 'react-icons/fa';
import LeafletMap from './LeafletMap';
import { 
  fetchNearbyRestaurantsWithMap, 
  searchRestaurants, 
  calculateDistance 
} from '../../services/googlePlacesService';
import { useFavorites } from '../../hooks/useFavorites';
import { useUserRestaurants } from '../../hooks/useUserRestaurants';
import AddRestaurantModal from '../AddRestaurantModal';
import './Dashboard.css';

const Dashboard = ({ onRestaurantClick, onOpenReviewModal }) => {
  // State management
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [radiusFilter, setRadiusFilter] = useState(50); // km - increased default radius
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating', 'name'
  const [viewMode, setViewMode] = useState('split'); // Always show split view with map
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [useRealData, setUseRealData] = useState(false); // Default to mock data - set to true when Google Maps API is available
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [detectedRestaurant, setDetectedRestaurant] = useState(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [isMapInfoCollapsed, setIsMapInfoCollapsed] = useState(false);
  
  // Favorites hook
  const { favorites, toggleFavorite, isFavorite, favoritesCount } = useFavorites();
  
  // User restaurants hook
  const { userRestaurants, addUserRestaurant, userRestaurantsCount } = useUserRestaurants();

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

  // Check if user is currently at a restaurant
  const checkIfAtRestaurant = (userPos, restaurantList) => {
    const PROXIMITY_THRESHOLD = 0.1; // km (100 meters) - reasonable proximity for "at a restaurant"
    
    for (const restaurant of restaurantList) {
      const distance = calculateDistance(
        { lat: userPos.lat, lng: userPos.lng },
        { lat: restaurant.position.lat, lng: restaurant.position.lng }
      );
      
      if (distance <= PROXIMITY_THRESHOLD) {
        return { ...restaurant, detectedDistance: distance };
      }
    }
    return null;
  };

  // Get user's current location and check if at a restaurant
  const getUserLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          setMapZoom(14);
          setIsLoadingLocation(false);
          
          // Check if user is at a restaurant after getting location
          setIsCheckingLocation(true);
          
          try {
            // Fetch nearby restaurants first (within 500m for initial detection)
            let nearbyRestaurants = [];
            if (useRealData) {
              try {
                const data = await fetchNearbyRestaurantsWithMap(userPos.lat, userPos.lng, 500);
                nearbyRestaurants = data.restaurants || [];
              } catch (error) {
                console.error('Error fetching real restaurant data:', error);
                // Fall back to mock data
                nearbyRestaurants = mockRestaurants;
              }
            } else {
              nearbyRestaurants = mockRestaurants;
            }
            
            // Check if user is at any of the nearby restaurants
            const atRestaurant = checkIfAtRestaurant(userPos, nearbyRestaurants);
            
            if (atRestaurant) {
              setDetectedRestaurant(atRestaurant);
              setShowLocationModal(true);
            }
          } catch (error) {
            console.error('Error checking restaurant proximity:', error);
          } finally {
            setIsCheckingLocation(false);
          }
        },
        (error) => {
          let errorMessage = 'Unable to get your location.';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred getting your location.';
          }
          setLocationError(errorMessage);
          setIsLoadingLocation(false);
          setIsCheckingLocation(false);
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
      setIsCheckingLocation(false);
    }
  };





  const calculateOverallRating = (ratings) => {
    const sum = Object.values(ratings).reduce((acc, rating) => acc + rating, 0);
    return sum / Object.keys(ratings).length;
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
    console.log('🗺️ Dashboard mounted - Loading map and data');
    setRestaurants(mockRestaurants);
    setFilteredRestaurants(mockRestaurants);
    
    // Set initial map center to default location (NYC)
    setMapCenter(defaultCenter);
    setMapZoom(12);
    
    // Request user location on mount for better experience
    getUserLocation();
  }, []);

  // Handle adding user restaurant
  const handleAddUserRestaurant = (restaurantData) => {
    const newRestaurant = addUserRestaurant(restaurantData);
    console.log('✅ Restaurant added successfully:', newRestaurant.name);
    setShowAddRestaurantModal(false);
  };

  // Handle opening review modal
  const handleOpenReviewModal = (restaurant) => {
    console.log('🎯 Dashboard: Opening review modal for:', restaurant?.name);
    if (onOpenReviewModal) {
      onOpenReviewModal(restaurant);
      setShowLocationModal(false);
    } else {
      console.warn('⚠️ onOpenReviewModal prop not provided to Dashboard');
    }
  };

  // Filter restaurants based on criteria
  useEffect(() => {
    // Merge user restaurants with mock restaurants
    let allRestaurants = [...mockRestaurants];
    
    // Add user restaurants with distance calculation if location available
    if (userRestaurants.length > 0) {
      const enrichedUserRestaurants = userRestaurants.map(ur => {
        const restaurantData = {
          ...ur,
          position: ur.location,
          priceRange: '$'.repeat(ur.priceLevel || 2),
          reviews: ur.reviewCount || 0
        };
        
        if (userLocation && ur.location) {
          restaurantData.distance = parseFloat(
            calculateDistance(
              { lat: userLocation.lat, lng: userLocation.lng },
              { lat: ur.location.lat, lng: ur.location.lng }
            ).toFixed(1)
          );
        }
        
        return restaurantData;
      });
      allRestaurants = [...allRestaurants, ...enrichedUserRestaurants];
      console.log('🏪 Added', enrichedUserRestaurants.length, 'user restaurants to list');
    }
    
    let filtered = [...allRestaurants];

    // Calculate distance for all restaurants if user location is available
    if (userLocation) {
      filtered = filtered.map(r => {
        const distance = calculateDistance(
          { lat: userLocation.lat, lng: userLocation.lng },
          { lat: r.position.lat, lng: r.position.lng }
        );
        return {
          ...r,
          distance: parseFloat(distance.toFixed(1))
        };
      });
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

    // Radius filter (only if user location is available AND radius is set)
    if (userLocation && radiusFilter && radiusFilter > 0) {
      filtered = filtered.filter(r => r.distance <= radiusFilter);
    }
    
    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(r => isFavorite(r.id));
    }

    // Sort by selected criteria
    if (userLocation && sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    console.log('🔍 Filtered restaurants:', filtered.length, 'of', allRestaurants.length);
    console.log('📍 User location:', userLocation);
    console.log('📏 Radius filter:', radiusFilter, 'km');
    
    setFilteredRestaurants(filtered);
    setRestaurants(allRestaurants);
  }, [searchQuery, cuisineFilter, ratingFilter, priceFilter, radiusFilter, userLocation, sortBy, showFavoritesOnly, isFavorite, userRestaurants]);

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
                variant={useRealData ? "info" : "outline-secondary"}
                onClick={() => setUseRealData(!useRealData)}
                className="me-2"
                size="sm"
                title={useRealData ? "Using Google Places API (requires API key)" : "Using sample restaurant data"}
              >
                {useRealData ? '🌐 Live API' : '📝 Demo Mode'}
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
          
          {!useRealData && !userLocation && (
            <Alert variant="info" className="mb-0 mt-2" dismissible>
              <div className="d-flex align-items-center">
                <span className="me-2">📝</span>
                <div>
                  <strong>Demo Mode Active</strong> - Showing sample restaurant data. 
                  <br />
                  <small>
                    Click "Live API" to use Google Places (requires API key) or "Use My Location" to enable location-based features.
                  </small>
                </div>
              </div>
            </Alert>
          )}
          
          {userLocation && (
            <Alert variant="success" className="mb-0 mt-2" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              borderRadius: '12px'
            }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    <FaMapMarkerAlt style={{ fontSize: '1.2rem', animation: 'pulse 2s infinite' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                      🎯 Location Active!
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
                      📍 Showing restaurants near you • {filteredRestaurants.length} found within {radiusFilter}km
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.25rem' }}>
                      Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <Badge bg="light" text="dark" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                    <FaLocationArrow className="me-1" />
                    GPS Enabled
                  </Badge>
                  {filteredRestaurants.length > 0 && filteredRestaurants[0].distance && (
                    <div style={{ fontSize: '0.85rem', opacity: 0.95 }}>
                      Nearest: <strong>{filteredRestaurants[0].distance}km</strong>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}
          
          {!userLocation && !locationError && !isLoadingLocation && useRealData && (
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
                    🦊 Rating
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
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    📊 Sort By
                  </Form.Label>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="distance">📍 Distance</option>
                    <option value="rating">⭐ Rating</option>
                    <option value="name">🔤 Name (A-Z)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="filter-label">
                    <FaLayerGroup className="me-2" />
                    Radius: {radiusFilter} km
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
            
            {/* Quick Filter Chips */}
            <Row className="mt-3">
              <Col>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <small className="text-muted me-2">Quick Filters:</small>
                  <Button
                    size="sm"
                    variant={cuisineFilter === 'all' && ratingFilter === 'all' && priceFilter === 'all' ? 'secondary' : 'outline-secondary'}
                    onClick={() => {
                      setCuisineFilter('all');
                      setRatingFilter('all');
                      setPriceFilter('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    variant={ratingFilter === '4.5' ? 'warning' : 'outline-warning'}
                    onClick={() => setRatingFilter(ratingFilter === '4.5' ? 'all' : '4.5')}
                  >
                    ⭐ Top Rated
                  </Button>
                  <Button
                    size="sm"
                    variant={priceFilter === '$' ? 'success' : 'outline-success'}
                    onClick={() => setPriceFilter(priceFilter === '$' ? 'all' : '$')}
                  >
                    💰 Budget Friendly
                  </Button>
                  <Button
                    size="sm"
                    variant={showFavoritesOnly ? 'danger' : 'outline-danger'}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    {showFavoritesOnly ? <FaHeart /> : <FaRegHeart />} Favorites ({favoritesCount})
                  </Button>
                  {userLocation && (
                    <Button
                      size="sm"
                      variant={radiusFilter <= 5 ? 'primary' : 'outline-primary'}
                      onClick={() => setRadiusFilter(radiusFilter <= 5 ? 50 : 5)}
                    >
                      📍 Nearby (&lt; 5km)
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline-info"
                    disabled
                  >
                    🟢 {filteredRestaurants.filter(r => r.openNow).length} Open Now
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Results Summary Bar */}
        {filteredRestaurants.length > 0 && (
          <div className="results-summary mb-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <Badge bg="primary" style={{ fontSize: '0.95rem', padding: '0.5rem 1rem' }}>
                <FaMapMarkerAlt className="me-2" />
                {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Restaurant' : 'Restaurants'}
              </Badge>
              {userLocation && (
                <small className="text-muted" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Sorted by {sortBy === 'distance' ? '📍 Distance' : sortBy === 'rating' ? '⭐ Rating' : '🔤 Name'}
                </small>
              )}
            </div>
          </div>
        )}

        {/* Map Section - Full Width */}
        <Row className="mb-4">
          <Col xs={12}>
            <div className="map-container-modern">
              {/* Map Info Overlay */}
              <div 
                className="map-info-overlay" 
                style={{ 
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'all 0.3s ease',
                  height: isMapInfoCollapsed ? '50px' : 'auto',
                  overflow: 'hidden'
                }}
                onClick={() => setIsMapInfoCollapsed(!isMapInfoCollapsed)}
              >
                <div className="map-info-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="map-info-title">
                      🗺️ {filteredRestaurants.length} Restaurants
                    </div>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      transition: 'transform 0.3s ease',
                      transform: isMapInfoCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </div>
                  {!isMapInfoCollapsed && (
                    <div className="map-info-subtitle">
                      {userLocation ? '📍 Your location marked in blue' : '💡 Enable location'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="map-wrapper">
                <LeafletMap
                  center={mapCenter}
                  zoom={mapZoom}
                  restaurants={filteredRestaurants}
                  selectedRestaurant={selectedRestaurant}
                  onMarkerClick={handleMarkerClick}
                  userLocation={userLocation}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Restaurant List - Below Map */}
        {isLoadingRestaurants ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <h4 className="mt-3" style={{ color: '#ff6b6b' }}>Loading restaurants...</h4>
            <p className="text-white">Fetching data from Google Places API</p>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <Row className="g-4">
            {filteredRestaurants.map((restaurant) => (
              <Col xxl={3} xl={4} lg={4} md={6} sm={12} key={restaurant.id}>
                    <Card 
                      className="restaurant-card"
                      onClick={() => handleListItemClick(restaurant)}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(0,0,0,0.125)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                        e.currentTarget.style.borderColor = '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.125)';
                      }}
                    >
                      <div className="restaurant-card-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
                        <Card.Img
                          variant="top"
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="restaurant-card-image"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {/* Favorite Button */}
                        <Button
                          variant={isFavorite(restaurant.id) ? 'danger' : 'light'}
                          size="sm"
                          className="favorite-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(restaurant);
                          }}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            border: '2px solid white',
                            transition: 'all 0.3s ease',
                            zIndex: 10
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {isFavorite(restaurant.id) ? (
                            <FaHeart style={{ fontSize: '18px', color: 'white' }} />
                          ) : (
                            <FaRegHeart style={{ fontSize: '18px' }} />
                          )}
                        </Button>
                        {restaurant.openNow ? (
                          <Badge bg="success" className="status-badge" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>🟢 Open Now</Badge>
                        ) : (
                          <Badge bg="danger" className="status-badge" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>🔴 Closed</Badge>
                        )}
                        {restaurant.distance && restaurant.distance <= 1 && (
                          <Badge bg="info" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                            📍 Very Close!
                          </Badge>
                        )}
                        {restaurant.isUserAdded && (
                          <Badge 
                            bg="dark" 
                            style={{ 
                              position: 'absolute', 
                              bottom: '10px', 
                              left: '10px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: '2px solid white',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                              padding: '5px 10px'
                            }}
                          >
                            ✨ My Restaurant
                          </Badge>
                        )}
                      </div>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="restaurant-card-title mb-0" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {restaurant.name}
                          </Card.Title>
                          {restaurant.rating >= 4.5 && (
                            <span style={{ fontSize: '1.5rem' }}>🏆</span>
                          )}
                        </div>
                        <div className="restaurant-card-meta mb-3">
                          <Badge bg="primary" className="me-2">{restaurant.cuisine}</Badge>
                          <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1">
                            <img src={process.env.PUBLIC_URL + '/foxy-tail.png'} alt="rating" style={{ width: '14px', height: '14px' }} />
                            {restaurant.rating}
                          </Badge>
                          <Badge bg="success" className="ms-2">{restaurant.priceRange}</Badge>
                          {restaurant.distance && (
                            <Badge bg="info" className="ms-2">
                              <FaLocationArrow className="me-1" />
                              {restaurant.distance} km
                            </Badge>
                          )}
                        </div>
                        <Card.Text className="restaurant-card-description" style={{ 
                          fontSize: '0.9rem',
                          color: '#666',
                          minHeight: '40px'
                        }}>
                          {restaurant.description}
                        </Card.Text>
                        <hr style={{ margin: '0.75rem 0' }} />
                        <div className="restaurant-card-info">
                          <div style={{ marginBottom: '0.5rem' }}>
                            <small className="text-muted">
                              <FaMapMarkerAlt className="me-1" style={{ color: '#667eea' }} />
                              {restaurant.distance ? `${restaurant.distance} km away` : restaurant.address}
                            </small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              💬 {restaurant.reviews} reviews
                            </small>
                            {restaurant.phone && (
                              <small className="text-muted">
                                📞 Available
                              </small>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
        ) : (
          <Row className="mt-3">
            <Col>
              <Card className="text-center py-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 15px 50px rgba(102, 126, 234, 0.4)'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ color: 'white', fontWeight: 'bold' }}>No restaurants found</h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="light" 
                      size="lg"
                      onClick={() => {
                        setSearchQuery('');
                        setCuisineFilter('all');
                        setRatingFilter('all');
                        setPriceFilter('all');
                      }}
                      style={{ fontWeight: 'bold' }}
                    >
                      🔄 Clear All Filters
                    </Button>
                  </div>
                  {!userLocation && (
                    <div className="mt-3">
                      <Button 
                        variant="outline-light"
                        onClick={getUserLocation}
                      >
                        📍 Enable Location to Find Nearby Restaurants
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        
        {/* Enhanced Statistics Footer */}
        {filteredRestaurants.length > 0 && (
          <div className="stats-card mt-4" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
          }}>
            <Row className="text-center">
              <Col md={3} sm={6} className="mb-3 mb-md-0">
                <div className="stat-item">
                  <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                    {filteredRestaurants.length}
                  </div>
                  <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                    🍽️ Restaurants Found
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-3 mb-md-0">
                <div className="stat-item">
                  <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                    {uniqueCuisines.length}
                  </div>
                  <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                    🌍 Cuisine Types
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6}>
                <div className="stat-item">
                  <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                    ⭐ {(filteredRestaurants.reduce((sum, r) => sum + r.rating, 0) / filteredRestaurants.length || 0).toFixed(1)}
                  </div>
                  <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                    Average Rating
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6}>
                <div className="stat-item">
                  <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                    {filteredRestaurants.filter(r => r.openNow).length}
                  </div>
                  <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                    🟢 Open Now
                  </div>
                </div>
              </Col>
            </Row>
            {userLocation && filteredRestaurants.some(r => r.distance) && (
              <Row className="mt-3">
                <Col className="text-center">
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                    📍 Nearest: <strong style={{ color: 'white' }}>
                      {filteredRestaurants[0]?.name}
                    </strong> ({filteredRestaurants[0]?.distance} km away)
                  </div>
                </Col>
              </Row>
            )}
          </div>
        )}
      </Container>

      {/* Location-Based Restaurant Detection Modal */}
      <Modal 
        show={showLocationModal} 
        onHide={() => setShowLocationModal(false)}
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
                  <Badge bg="warning" text="dark" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }} className="d-flex align-items-center gap-1">
                    <img src={process.env.PUBLIC_URL + '/foxy-tail.png'} alt="rating" style={{ width: '16px', height: '16px' }} />
                    {detectedRestaurant.rating}
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
                    onClick={() => handleOpenReviewModal(detectedRestaurant)}
                  >
                    <img src={process.env.PUBLIC_URL + '/foxy-tail.png'} alt="rate" style={{ width: '20px', height: '20px' }} className="me-2" />
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
                      // Keep current restaurants list showing
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
              
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <small style={{ color: '#6c757d' }}>
                  💡 Tip: You can always access the dashboard to browse all restaurants
                </small>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Loading Modal for Location Check */}
      <Modal 
        show={isCheckingLocation} 
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

      {/* Add Restaurant Modal */}
      <AddRestaurantModal 
        show={showAddRestaurantModal}
        onHide={() => setShowAddRestaurantModal(false)}
        onAddRestaurant={handleAddUserRestaurant}
        userLocation={mapCenter}
      />

      {/* Floating Action Button to Add Restaurant */}
      <Button
        className="floating-add-btn"
        onClick={() => setShowAddRestaurantModal(true)}
        title="Add New Restaurant"
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default Dashboard;

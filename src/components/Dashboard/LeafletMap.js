import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import { FaMapMarkerAlt, FaPhone, FaDirections, FaSearch, FaCompass, FaLayerGroup, FaTimes } from 'react-icons/fa';
import { Badge, Form, InputGroup } from 'react-bootstrap';

// Import marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icon for restaurants
const restaurantIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="11" fill="#ff6b6b" stroke="white" stroke-width="2"/>
      <path d="M8 6v6h1v5a1 1 0 002 0v-5h1V6H8zm5 0v5.5l2-2V6h2v4l-3 3v4a1 1 0 002 0v-3l1.5-1.5V6h1v7l-2.5 2.5V18a2 2 0 01-4 0v-4.5L11 12V6h2z" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom marker icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <circle cx="12" cy="12" r="11" fill="#667eea" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="#667eea" stroke-width="1" opacity="0.3"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Custom marker icon for user-added restaurants
const userAddedRestaurantIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="11" fill="url(#grad1)" stroke="white" stroke-width="2"/>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M8 6v6h1v5a1 1 0 002 0v-5h1V6H8zm5 0v5.5l2-2V6h2v4l-3 3v4a1 1 0 002 0v-3l1.5-1.5V6h1v7l-2.5 2.5V18a2 2 0 01-4 0v-4.5L11 12V6h2z" fill="white"/>
      <circle cx="12" cy="4" r="2" fill="#FFD700" stroke="white" stroke-width="1"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to handle map center changes
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const LeafletMap = ({ 
  center, 
  zoom, 
  restaurants, 
  selectedRestaurant, 
  onMarkerClick,
  userLocation // Add user location prop
}) => {
  const position = center ? [center.lat, center.lng] : [40.7128, -74.0060];
  const mapZoom = zoom || 12;
  const [mapStyle, setMapStyle] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const mapRef = useRef(null);

  console.log('=== LeafletMap Render ===');
  console.log('Position:', position);
  console.log('Zoom:', mapZoom);
  console.log('Restaurants count:', restaurants?.length);
  console.log('User location:', userLocation);

  // Filter restaurants based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  const handleRecenter = () => {
    if (mapRef.current && position) {
      mapRef.current.setView(position, mapZoom);
    }
  };

  const handleFlyToRestaurant = (restaurant) => {
    if (mapRef.current) {
      mapRef.current.flyTo([restaurant.position.lat, restaurant.position.lng], 16, {
        duration: 1.5
      });
      onMarkerClick && onMarkerClick(restaurant);
    }
  };

  if (!position || !position[0] || !position[1]) {
    console.error('Invalid position:', position);
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading map...
      </div>
    );
  }

  // Different tile layer options
  const tileLayerUrls = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  const tileAttribution = {
    standard: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a>'
  };

  if (!position || !position[0] || !position[1]) {
    return <div>Invalid position data</div>;
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
    }}>
      {/* Search Bar */}
      {showSearch && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          minWidth: '300px',
          animation: 'slideInLeft 0.3s ease'
        }}>
          <InputGroup size="sm">
            <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
              <FaSearch style={{ color: '#667eea' }} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
            {searchQuery && (
              <InputGroup.Text 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              >
                <FaTimes style={{ color: '#999' }} />
              </InputGroup.Text>
            )}
          </InputGroup>
          {searchQuery && filteredRestaurants.length > 0 && (
            <div style={{
              marginTop: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              borderTop: '1px solid #eee',
              paddingTop: '8px'
            }}>
              {filteredRestaurants.map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    handleFlyToRestaurant(r);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    fontSize: '13px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: '600', color: '#333' }}>{r.name}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{r.cuisine} • {r.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Map Style Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255,255,255,0.95)',
          padding: '8px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          {Object.keys(tileLayerUrls).map(style => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '8px',
                background: mapStyle === style ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: mapStyle === style ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
                boxShadow: mapStyle === style ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (mapStyle !== style) {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (mapStyle !== style) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255,255,255,0.95)',
          padding: '8px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setShowSearch(!showSearch)}
            title="Search"
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: showSearch ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: showSearch ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FaSearch />
          </button>
          <button
            onClick={handleRecenter}
            title="Re-center Map"
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent',
              color: '#333',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <FaCompass />
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            title="Toggle Legend"
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: showLegend ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: showLegend ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FaLayerGroup />
          </button>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          fontSize: '12px',
          animation: 'slideInLeft 0.3s ease'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px', color: '#333', fontSize: '13px' }}>Map Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ff6b6b',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <span style={{ color: '#555' }}>Restaurant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FFD700',
                  border: '1px solid white'
                }}></div>
              </div>
              <span style={{ color: '#555' }}>My Restaurant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#667eea',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'white'
                }}></div>
              </div>
              <span style={{ color: '#555' }}>Your Location</span>
            </div>
          </div>
        </div>
      )}
      
      <MapContainer
        center={position}
        zoom={mapZoom}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        keyboard={true}
        ref={mapRef}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '20px',
          cursor: 'grab'
        }}
        zoomControlOptions={{
          position: 'bottomright'
        }}
      >
        <ChangeMapView center={position} zoom={mapZoom} />
      
      {/* Dynamic Tile Layer */}
      <TileLayer
        attribution={tileAttribution[mapStyle]}
        url={tileLayerUrls[mapStyle]}
        maxZoom={19}
        minZoom={3}
      />

      {/* User Location Circle (Accuracy Radius) */}
      {userLocation && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={100}
          pathOptions={{
            color: '#667eea',
            fillColor: '#667eea',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 5'
          }}
        />
      )}

      {/* Restaurant Markers */}
      {filteredRestaurants && filteredRestaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.position.lat, restaurant.position.lng]}
          icon={restaurant.isUserAdded ? userAddedRestaurantIcon : restaurantIcon}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(restaurant),
          }}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h6 style={{ 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: '#333'
              }}>
                {restaurant.name}
                {restaurant.isUserAdded && (
                  <Badge 
                    bg="primary" 
                    className="ms-2" 
                    style={{ 
                      fontSize: '0.7rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    ✨ My Restaurant
                  </Badge>
                )}
              </h6>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <Badge bg="primary" className="me-2">{restaurant.cuisine}</Badge>
                <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1" style={{ display: 'inline-flex !important' }}>
                  <img src={process.env.PUBLIC_URL + '/foxy-tail.png'} alt="rating" style={{ width: '14px', height: '14px' }} />
                  {restaurant.rating}
                </Badge>
              </div>

              {restaurant.description && (
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  {restaurant.description}
                </p>
              )}

              <div style={{ fontSize: '0.85rem', color: '#888' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <FaMapMarkerAlt className="me-1" />
                  {restaurant.address}
                </div>
                {restaurant.phone && (
                  <div style={{ marginBottom: '0.25rem' }}>
                    <FaPhone className="me-1" />
                    {restaurant.phone}
                  </div>
                )}
                {restaurant.distance && (
                  <div>
                    📍 {restaurant.distance} km away
                  </div>
                )}
              </div>

              <button
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  width: '100%'
                }}
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${restaurant.position.lat},${restaurant.position.lng}`,
                    '_blank'
                  );
                }}
              >
                <FaDirections className="me-2" />
                Get Directions
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User Location Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        >
          <Popup>
            <div style={{ minWidth: '150px', textAlign: 'center' }}>
              <h6 style={{ 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: '#667eea'
              }}>
                📍 Your Location
              </h6>
              <p style={{ 
                fontSize: '0.85rem', 
                color: '#666',
                marginBottom: 0
              }}>
                You are here
              </p>
            </div>
          </Popup>
        </Marker>
      )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

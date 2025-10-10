import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import { FaStar, FaMapMarkerAlt, FaPhone, FaDirections } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';

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
  onMarkerClick 
}) => {
  const position = center ? [center.lat, center.lng] : [40.7128, -74.0060];
  const mapZoom = zoom || 12;

  console.log('=== LeafletMap Render ===');
  console.log('Position:', position);
  console.log('Zoom:', mapZoom);
  console.log('Restaurants count:', restaurants?.length);

  if (!position || !position[0] || !position[1]) {
    return <div>Invalid position data</div>;
  }

  return (
    <div style={{
      width: '100%',
      height: '600px',
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <MapContainer
        center={position}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '20px'
        }}
      >
        <ChangeMapView center={position} zoom={mapZoom} />
      
      {/* OpenStreetMap Tiles - Completely Free! */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        minZoom={3}
      />

      {/* Restaurant Markers */}
      {restaurants && restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.position.lat, restaurant.position.lng]}
          icon={restaurantIcon}
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
              </h6>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <Badge bg="primary" className="me-2">{restaurant.cuisine}</Badge>
                <Badge bg="warning" text="dark">
                  <FaStar className="me-1" />
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
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

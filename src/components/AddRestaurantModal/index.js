import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaPlus, FaMapMarkerAlt, FaUtensils, FaPhone, FaGlobe, FaDollarSign } from 'react-icons/fa';
import './AddRestaurantModal.css';

const AddRestaurantModal = ({ show, onHide, onAddRestaurant, userLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: '',
    phone: '',
    website: '',
    priceRange: 2,
    latitude: userLocation?.lat || 40.7580,
    longitude: userLocation?.lng || -73.9855
  });
  const [error, setError] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handlePriceRangeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      priceRange: parseInt(e.target.value)
    }));
  };

  const handleLocationToggle = (e) => {
    const checked = e.target.checked;
    setUseCurrentLocation(checked);
    if (checked && userLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lng
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Restaurant name is required');
      return;
    }
    
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    // Create restaurant object
    const newRestaurant = {
      name: formData.name.trim(),
      description: formData.description.trim() || 'User-added restaurant',
      cuisine: formData.cuisine.trim() || 'Various',
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      website: formData.website.trim(),
      priceLevel: formData.priceRange,
      rating: 0,
      reviewCount: 0,
      location: {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude)
      },
      photos: [],
      isUserAdded: true
    };

    onAddRestaurant(newRestaurant);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      description: '',
      cuisine: '',
      address: '',
      phone: '',
      website: '',
      priceRange: 2,
      latitude: userLocation?.lat || 40.7580,
      longitude: userLocation?.lng || -73.9855
    });
    setError('');
    setUseCurrentLocation(true);
    onHide();
  };

  const renderPriceRange = (level) => {
    return (
      <div className="price-range-display">
        {[1, 2, 3, 4].map(i => (
          <FaDollarSign 
            key={i} 
            className={i <= level ? 'active' : 'inactive'} 
          />
        ))}
      </div>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="add-restaurant-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="d-flex align-items-center">
          <FaPlus className="me-2" style={{ color: '#ff6b35' }} />
          Add New Restaurant
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              <FaUtensils className="me-2 text-primary" />
              Restaurant Name *
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter restaurant name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the restaurant"
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Cuisine Type</Form.Label>
                <Form.Control
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  placeholder="e.g., Italian, Japanese, Mexican"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaDollarSign className="me-2 text-success" />
                  Price Range
                </Form.Label>
                <Form.Range
                  name="priceRange"
                  min="1"
                  max="4"
                  value={formData.priceRange}
                  onChange={handlePriceRangeChange}
                />
                {renderPriceRange(formData.priceRange)}
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              <FaMapMarkerAlt className="me-2 text-danger" />
              Address *
            </Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full address"
              required
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaPhone className="me-2 text-info" />
                  Phone Number
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaGlobe className="me-2 text-primary" />
                  Website
                </Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </Form.Group>
            </div>
          </div>

          <div className="location-section mb-3">
            <Form.Check
              type="checkbox"
              id="use-current-location"
              label="Use current map location"
              checked={useCurrentLocation}
              onChange={handleLocationToggle}
              className="mb-2"
            />
            
            {!useCurrentLocation && (
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="40.7580"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="-73.9855"
                    />
                  </Form.Group>
                </div>
              </div>
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="add-restaurant-btn">
          <FaPlus className="me-2" />
          Add Restaurant
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRestaurantModal;

import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import StarRating from '../StarRating';
import { FaUtensils, FaPalette, FaLightbulb, FaGem, FaHeart } from 'react-icons/fa';
import './RestaurantRating.css';

const RestaurantRating = ({ 
  restaurant,
  showDetailed = false,
  size = 'medium',
  layout = 'vertical' // vertical or horizontal
}) => {
  if (!restaurant || !restaurant.ratings) {
    return null;
  }

  const { ratings } = restaurant;
  
  // Calculate overall rating
  const overallRating = (
    ratings.food + 
    ratings.taste + 
    ratings.ambiance + 
    ratings.creativity + 
    ratings.uniqueness
  ) / 5;

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 4.0) return 'primary';
    if (rating >= 3.5) return 'warning';
    if (rating >= 3.0) return 'info';
    return 'secondary';
  };

  const getRatingBadge = (rating) => {
    if (rating >= 4.5) return { text: 'Exceptional', variant: 'success' };
    if (rating >= 4.0) return { text: 'Excellent', variant: 'primary' };
    if (rating >= 3.5) return { text: 'Very Good', variant: 'warning' };
    if (rating >= 3.0) return { text: 'Good', variant: 'info' };
    return { text: 'Fair', variant: 'secondary' };
  };

  const categoryIcons = {
    food: <FaUtensils />,
    taste: <FaHeart />,
    ambiance: <FaPalette />,
    creativity: <FaLightbulb />,
    uniqueness: <FaGem />
  };

  const categoryLabels = {
    food: 'Food Quality',
    taste: 'Taste',
    ambiance: 'Ambiance',
    creativity: 'Creativity',
    uniqueness: 'Uniqueness'
  };

  if (!showDetailed) {
    // Simple rating display
    return (
      <div className="restaurant-rating-simple">
        <div className="overall-rating">
          <StarRating 
            rating={overallRating} 
            size={size}
            color={getRatingColor(overallRating)}
            showValue={true}
          />
          <Badge bg={getRatingBadge(overallRating).variant} className="ms-2">
            {getRatingBadge(overallRating).text}
          </Badge>
        </div>
      </div>
    );
  }

  // Detailed rating display
  return (
    <Card className="restaurant-rating-detailed">
      <Card.Header className="rating-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Foxy Rating Breakdown</h5>
          <div className="overall-score">
            <span className="overall-number">{overallRating.toFixed(1)}</span>
            <StarRating 
              rating={overallRating} 
              size="large"
              color={getRatingColor(overallRating)}
              showValue={false}
            />
          </div>
        </div>
        <Badge bg={getRatingBadge(overallRating).variant} className="mt-2">
          {getRatingBadge(overallRating).text} Restaurant
        </Badge>
      </Card.Header>
      
      <Card.Body>
        <Row className="rating-categories">
          {Object.entries(ratings).map(([category, rating]) => (
            <Col xs={12} md={layout === 'horizontal' ? 6 : 12} key={category} className="mb-3">
              <div className="category-rating">
                <div className="category-header">
                  <span className="category-icon">
                    {categoryIcons[category]}
                  </span>
                  <span className="category-name">
                    {categoryLabels[category]}
                  </span>
                </div>
                <StarRating 
                  rating={rating} 
                  size={size}
                  color={getRatingColor(rating)}
                  showValue={true}
                />
              </div>
            </Col>
          ))}
        </Row>

        {restaurant.review && (
          <div className="rating-review mt-3">
            <h6 className="review-title">
              <FaHeart className="me-2" />
              Foxy's Take
            </h6>
            <p className="review-text">{restaurant.review}</p>
          </div>
        )}

        {restaurant.highlights && restaurant.highlights.length > 0 && (
          <div className="rating-highlights mt-3">
            <h6 className="highlights-title">Top Highlights</h6>
            <div className="highlights-tags">
              {restaurant.highlights.map((highlight, index) => (
                <Badge key={index} bg="outline-primary" className="me-2 mb-1">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RestaurantRating;
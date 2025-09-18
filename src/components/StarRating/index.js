import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  maxStars = 5, 
  showValue = true, 
  size = 'medium',
  interactive = false,
  onRatingChange = null,
  category = '',
  color = 'primary'
}) => {
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxStars; i++) {
      if (rating >= i) {
        // Full star
        stars.push(
          <FaStar 
            key={i} 
            className={`star star-filled star-${size} star-${color} ${interactive ? 'star-interactive' : ''}`}
            onClick={interactive ? () => onRatingChange && onRatingChange(i) : undefined}
          />
        );
      } else if (rating >= i - 0.5) {
        // Half star
        stars.push(
          <FaStarHalfAlt 
            key={i} 
            className={`star star-half star-${size} star-${color} ${interactive ? 'star-interactive' : ''}`}
            onClick={interactive ? () => onRatingChange && onRatingChange(i - 0.5) : undefined}
          />
        );
      } else {
        // Empty star
        stars.push(
          <FaRegStar 
            key={i} 
            className={`star star-empty star-${size} star-${color} ${interactive ? 'star-interactive' : ''}`}
            onClick={interactive ? () => onRatingChange && onRatingChange(i) : undefined}
          />
        );
      }
    }
    
    return stars;
  };

  return (
    <div className={`star-rating ${category ? 'star-rating-category' : ''}`}>
      {category && <span className="rating-category">{category}:</span>}
      <div className="stars-container">
        {renderStars()}
      </div>
      {showValue && (
        <span className={`rating-value rating-value-${size}`}>
          {rating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;
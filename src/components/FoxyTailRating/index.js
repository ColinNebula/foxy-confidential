import React from 'react';
import './FoxyTailRating.css';

const FoxyTailRating = ({ 
  rating = 0, 
  maxTails = 5, 
  showValue = true, 
  size = 'medium',
  interactive = false,
  onRatingChange = null,
  category = '',
  color = 'primary'
}) => {
  const renderTails = () => {
    const tails = [];
    
    for (let i = 1; i <= maxTails; i++) {
      const opacity = rating >= i ? 1 : rating >= i - 0.5 ? 0.5 : 0.2;
      const isFilled = rating >= i;
      const isHalf = !isFilled && rating >= i - 0.5;
      
      tails.push(
        <div
          key={i}
          className={`foxy-tail foxy-tail-${size} ${isFilled ? 'foxy-tail-filled' : isHalf ? 'foxy-tail-half' : 'foxy-tail-empty'} ${interactive ? 'foxy-tail-interactive' : ''}`}
          onClick={interactive ? () => onRatingChange && onRatingChange(i) : undefined}
          style={{ opacity: interactive ? 1 : opacity }}
        >
          <img
            src={process.env.PUBLIC_URL + '/foxy-tail.png'}
            alt="Foxy Tail"
            className="foxy-tail-image"
          />
        </div>
      );
    }
    
    return tails;
  };

  return (
    <div className={`foxy-tail-rating ${category ? 'foxy-tail-rating-category' : ''}`}>
      {category && <span className="rating-category">{category}:</span>}
      <div className="tails-container">
        {renderTails()}
      </div>
      {showValue && (
        <span className={`rating-value rating-value-${size}`}>
          {rating.toFixed(1)}/{maxTails}
        </span>
      )}
    </div>
  );
};

export default FoxyTailRating;

import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, totalReviews }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star">
          &#9733;
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty${i}`} className="empty-star">
          &#9734;
        </span>
      );
    }

    return stars;
  };

  return (
    <div>
      {renderStars()}
      <span className="rating">
        {rating} / 5 ({totalReviews})
      </span>
    </div>
  );
};

export default StarRating;

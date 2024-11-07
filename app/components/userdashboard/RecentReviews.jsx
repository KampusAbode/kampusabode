import React from "react";
import reviews from "../../fetch/data/reviews";

const RecentReviews = ({ user }) => {
  const userType = user?.userType;
  const filteredReviews = reviews.filter((views) => views.author === user?.id);
  return (
    <div className="reviews-container">
      <h4>
        {userType === "student"
          ? "Your Reviews"
          : "Your Feedback"}
      </h4>
      <ul className="reviews-list">
        {filteredReviews.length === 0 ? (
          <li>No reviews available.</li>
        ) : (
          filteredReviews.map((review, index) => (
            <li key={index} className="review-item">
              <div className="review-author">
                <strong>{review.author}</strong> - {review.date}
              </div>
              <div className="review-content">{review.content}</div>
              <div className="review-rating">Rating: {review.rating} ★</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentReviews;

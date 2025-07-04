import { useState, useEffect } from "react";
import { fetchReviewsByAuthor } from "../../utils";
import toast from "react-hot-toast";
import ReviewType from "../../fetch/types";

const RecentReviews = ({ user }) => {
  const [reviews, setReviews] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await fetchReviewsByAuthor(user?.id);
        setReviews(fetchedReviews);
       
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to fetch reviews.");
        toast.error("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReviews();
    }
  }, [user?.id]);

  const userType = user?.userType;

  return (
    <div className="reviews-container">
      <h5>{userType === "student" ? "Your Reviews" : "Your Feedback"}</h5>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul className="reviews-list">
          {reviews.map((review, index) => (
            <li key={index} className="review-item" style={{marginBottom: '1rem'}}>
              <div className="review-author">
                <strong>{review.date}</strong>
              </div>
              <p className="review-content">{review.content}</p>
              <span className="review-rating">Rating: {review.rating}★</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentReviews;

import { useState, useEffect } from "react";
import { fetchReviewsByAuthor } from "../../utils";
import toast from "react-hot-toast";

const RecentReviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await fetchReviewsByAuthor(user?.id);
        setReviews(fetchedReviews);
        toast.success("Reviews loaded successfully!");
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
      <h4>{userType === "student" ? "Your Reviews" : "Your Feedback"}</h4>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul className="reviews-list">
          {reviews.map((review, index) => (
            <li key={index} className="review-item">
              <div className="review-author">
                <strong>{review.author}</strong> - {review.date}
              </div>
              <div className="review-content">{review.content}</div>
              <div className="review-rating">Rating: {review.rating} ★</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentReviews;

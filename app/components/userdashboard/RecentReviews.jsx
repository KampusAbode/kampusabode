
import {fetchReviewsByAuthor} from "../../utils"
import toast from "react-hot-toast";


const RecentReviews = ({ user }) => {
  const userType = user?.userType;
  let setPropReviews;
   (() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await fetchReviewsByAuthor(user?.id);
        
        setPropReviews = fetchedReviews;
      } catch {
        toast.error("Failed to fetch reviews.");
      }
    };
    fetchReviews();
  });
  return (
    <div className="reviews-container">
      <h4>
        {userType === "student"
          ? "Your Reviews"
          : "Your Feedback"}
      </h4>
      <ul className="reviews-list">
        {setPropReviews.length === 0 ? (
          <li>No reviews available.</li>
        ) : (
          setPropReviews.map((review, index) => (
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

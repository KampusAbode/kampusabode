import { fetchReviewsByAgentId } from "../../utils";
import toast from "react-hot-toast";

const StudentReviews = ({ user }) => {
  // Filter reviews by userId
  let setPropReviews;
  () => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await fetchReviewsByAgentId(user?.id);

        setPropReviews = fetchedReviews;
      } catch {
        toast.error("Failed to fetch reviews.");
      }
    };
    fetchReviews();
  };

  return (
    <div className="student-reviews">
      <h3>Student Reviews</h3>
      <ul>
        {setPropReviews.length > 0 ? (
          setPropReviews.map((review) => (
            <li key={review.id}>
              {review.content} - {review.author}
            </li>
          ))
        ) : (
          <li>No reviews found.</li>
        )}
      </ul>
    </div>
  );
};

export default StudentReviews;

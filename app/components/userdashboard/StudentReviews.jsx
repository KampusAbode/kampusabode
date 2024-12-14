import reviews from "../../fetch/data/reviews";

const StudentReviews = ({ user }) => {
  const { author } = user;

  // Filter reviews by userId
  const filteredReviews = reviews.filter((review) => review.author === author);

  return (
    <div className="student-reviews">
      <h3>Student Reviews</h3>
      <ul>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => <li key={review.id}></li>)
        ) : (
          <li>No reviews found for this user?.</li>
        )}
      </ul>
    </div>
  );
};

export default StudentReviews;

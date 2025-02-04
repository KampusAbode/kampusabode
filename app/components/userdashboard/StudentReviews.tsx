"use client";

import { useState, useEffect } from "react";
import { fetchReviewsByAgentId } from "../../utils";
import toast from "react-hot-toast";

const StudentReviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true); 
        setError(null); 

        if (user?.id) {
          const fetchedReviews = await fetchReviewsByAgentId(user.id);
          setReviews(fetchedReviews);
        } else {
          setReviews([]);
          toast.error("User ID is missing. Unable to fetch reviews.");
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching reviews:", errorMessage);
        setError(errorMessage);
        toast.error("Failed to fetch reviews.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchReviews();
  }, [user]);

  return (
    <div className="student-reviews">
      <h4>Student Reviews</h4>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              {review.content} <br /> - {review.author.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default StudentReviews;

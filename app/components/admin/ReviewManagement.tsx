"use client";

import { useState, useEffect } from "react";
import { fetchReviews } from "../../utils";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const reviewData = await fetchReviews();
        setReviews(reviewData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchReviewsData();
  }, []);

  // Function to approve or delete a review
  const moderateReview = async (reviewId, action) => {
    try {
      if (action === "approve") {
        const reviewRef = doc(db, "reviews", reviewId);
        await updateDoc(reviewRef, { approved: true });

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId ? { ...review, approved: true } : review
          )
        );
      } else if (action === "delete") {
        const reviewRef = doc(db, "reviews", reviewId);
        await deleteDoc(reviewRef);

        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
      }
    } catch (error) {
      console.error(`Error trying to ${action} review:`, error.message);
    }
  };

  return (
    <div className="review-management">
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.id}>
              {review.content} - {review.rating} stars{" "}
              {review.approved ? (
                <span className="approved">✅ Approved</span>
              ) : (
                <>
                  <button onClick={() => moderateReview(review.id, "approve")}>
                    Approve
                  </button>
                  <button onClick={() => moderateReview(review.id, "delete")}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No review yet
          </p>
        )}
      </ul>
    </div>
  );
};

export default ReviewManagement;

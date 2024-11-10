// "use client";

// import { useState, useEffect } from "react";
// import { fetchReviews } from "../../utils/api";

// const ReviewManagement = () => {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     const fetchReviewsData = async () => {
//       try {
//         const reviewData = await fetchReviews();
//         setReviews(reviewData);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };
//     fetchReviewsData();
//   }, []);

//   // Function to moderate a review (approve or delete)
//   const moderateReview = async (reviewId, action) => {
//     const API_BASE_URL = "http://your-api-url.com/api"; // Replace with your actual API base URL

//     try {
//       // Define the endpoint based on the action
//       const endpoint =
//         action === "approve"
//           ? `${API_BASE_URL}/reviews/approve/${reviewId}`
//           : `${API_BASE_URL}/reviews/delete/${reviewId}`;

//       const response = await fetch(endpoint, {
//         method: action === "approve" ? "POST" : "DELETE", // Use POST for approve and DELETE for delete
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${action} review`);
//       }

//       const result = await response.json();
//       // Optionally, update the state to reflect the changes in the UI
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   // Example usage of the moderateReview function
//   // Assuming you want to approve a review with ID 123
//   //   moderateReview(123, "approve");

//   // Assuming you want to delete a review with ID 456
//   //   moderateReview(456, "delete");

//   return (
//     <div className="review-management">
//       <h3>Review Management</h3>
//       <ul>
//         {reviews.map((review) => (
//           <li key={review.id}>
//             {review.content} - {review.rating} stars
//             <button
//               onClick={() => moderateReview(review.id, "approve")}
//               disabled>
//               Approve
//             </button>
//             <button
//               onClick={() => moderateReview(review.id, "delete")}
//               disabled>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ReviewManagement;

"use client";

import "./ReviewForm.css";
import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { sendReview } from "../../../utils/reviews"; // update this path if needed
import { FaStar, FaTimes } from "react-icons/fa";

type ReviewFormProps = {
  isOpen: boolean;
  onClose: () => void;
  apartmentId?: string;
  author: { id: string; name: string; avatar: string };
  agentId?: string;
  onSuccess?: () => void;
};

const ReviewForm = ({
  isOpen,
  apartmentId,
  agentId,
  author,
  onClose,
  onSuccess,
}: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      toast.error("Please provide both a rating and a review.");
      return;
    }

    setLoading(true);
    try {
      const result = await sendReview({
        author,
        propertyId: apartmentId || "",
        agentId: agentId || "",
        content: review.trim(),
        rating,
      });

      if (result.success) {
        toast.success(result.message);
        setReview("");
        setRating(0);
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="review-modal">
        <div className="modal-top">
          <h5 className="review-header">Leave a Review</h5>

          <FaTimes />
        </div>
        <div className="modal-body">
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={20}
                className="cursor-pointer"
                fill={star <= rating ? "#facc15" : "none"}
                stroke="#facc15"
                onClick={() => setRating(star)}
              />
            ))}
            <div className="rate" onClick={() => onClose()}>
              {rating}
            </div>
          </div>
          <textarea
            placeholder="What was your experience?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-neutral">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;

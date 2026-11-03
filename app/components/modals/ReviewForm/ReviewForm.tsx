"use client";

import "./ReviewForm.css";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Star, X } from "lucide-react";
import { notify } from "@/app/lib/notifications/notify";
import { sendReview } from "../../../utils/reviews"; // update this path if needed
import { Button } from "../../button/Button";
import IconButton from "../../button/IconButton";
import DialogFrame from "../../notifications/DialogFrame";

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

  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      notify.error("Please provide both a rating and a review.");
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
        notify.success(result.message);
        setReview("");
        setRating(0);
        onSuccess?.();
        onClose();
      } else {
        notify.error(result.message);
      }
    } catch (error) {
      notify.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    console.log('clicked')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogFrame
          id="review-form"
          labelledBy="review-form-title"
          closeOnBackdrop={false}
          onClose={handleClose}
          panelClassName="review-modal">
          <div className="modal-top">
            <h2 id="review-form-title" className="review-header">
              Leave a Review
            </h2>

            <IconButton
              type="button"
              aria-label="Close review form"
              onClick={handleClose}
            >
              <X aria-hidden="true" size={20} strokeWidth={1.75} />
            </IconButton>
          </div>
          <div className="modal-body">
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} stars`}
                  aria-pressed={rating === star}
                  onClick={() => setRating(star)}>
                  <Star
                    size={20}
                    strokeWidth={1.75}
                    fill={star <= rating ? "#facc15" : "none"}
                    stroke="#facc15"
                    aria-hidden="true"
                  />
                </IconButton>
              ))}
              <div className="rate">{rating}</div>
            </div>
            <textarea
              placeholder="What was your experience?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFrame>
      )}
    </AnimatePresence>
  );
};

export default ReviewForm;

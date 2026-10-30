"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Import toast
import { Share2 } from "lucide-react";
import { Button } from "../../button/Button";
import "./sharebutton.css";

function ShareButton() {
  const [shareData, setShareData] = useState({ title: "", text: "", url: "" });

  useEffect(() => {
    const title = document.title;
    const url = window.location.href;
    const text = `Check out this apartment:\n\n${title}`;
    setShareData({ title, text, url });
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Property shared successfully!", {
          id: "prop-upload-success",
        }); // Success toast
      } catch (error) {
        toast.error("Failed to share. Please try again."); // Error toast
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!", {
          id: "prop-upload-success",
        }); // Success toast
      } catch (error) {
        toast.error("Failed to copy the link. Please try again."); // Error toast
      }
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="share-button"
      onClick={handleShare}
      aria-label="Share this property"
      leftIcon={<Share2 />}
    />
  );
}

export default ShareButton;

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Import toast
import { FaShareAlt } from "react-icons/fa";
import "./sharebutton.css";

function ShareButton() {
  const [shareData, setShareData] = useState({ title: "", text: "", url: "" });

  useEffect(() => {
    const title = document.title;
    const url = window.location.href;
    const text = `Check out this property: ${title}`;
    setShareData({ title, text, url });
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Property shared successfully!"); // Success toast
      } catch (error) {
        toast.error("Failed to share. Please try again."); // Error toast
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!"); // Success toast
      } catch (error) {
        toast.error("Failed to copy the link. Please try again."); // Error toast
      }
    }
  };

  return (
    <div
      className="share-button"
      onClick={handleShare}
      aria-label="Share this property">
      <FaShareAlt />
    </div>
  );
}

export default ShareButton;

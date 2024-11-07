"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Import toast

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
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className="share"
        onClick={handleShare}
        fill="#fff"
        aria-label="Share this property">
        <path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" />
      </svg>
    </>
  );
}

export default ShareButton;

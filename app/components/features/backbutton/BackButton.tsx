"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa"; // Import the left arrow icon
import './backbutton.css';

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="back">
      <div className="container">
        <span
          onClick={handleBack}
          className="back-button"
          aria-label="Go Back"
          style={{ cursor: "pointer" }}>
          <FaArrowLeft /> Back
        </span>
      </div>
    </div>
  );
};

export default BackButton;

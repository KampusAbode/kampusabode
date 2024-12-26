"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa"; // Import the left arrow icon
import "./backbutton.css";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div onClick={handleBack} className="back-button" aria-label="Go Back">
      <FaAngleLeft />
    </div>
  );
};

export default BackButton;

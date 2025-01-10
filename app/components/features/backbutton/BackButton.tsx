"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import "./backbutton.css";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div onClick={handleBack} className="back-button" aria-label="Go Back">
      <FaArrowLeftLong />
    </div>
  );
};

export default BackButton;

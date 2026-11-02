"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import IconButton from "../../button/IconButton";
import "./backbutton.css";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <IconButton
      type="button"
      className="back-button"
      onClick={handleBack}
      aria-label="Go Back"
    >
      <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.75} />
    </IconButton>
  );
};

export default BackButton;

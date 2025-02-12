"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./WelcomeMessage.css";

function WelcomeMessage() {
  const [activeWelcome, setActiveWelcome] = useState(false);

  useEffect(() => {
    // Check if the welcome message has already been shown
    const hasSeenWelcome = JSON.parse(localStorage.getItem("hasSeenWelcome"));

    if (!hasSeenWelcome) {
      setActiveWelcome(true);

      // After 2 seconds, hide the welcome message and store the flag in localStorage
      setTimeout(() => {
        setActiveWelcome(false);
        localStorage.setItem("hasSeenWelcome", JSON.stringify(true)); // Store flag to avoid showing again
      }, 2000);
    }
  }, []);

  return activeWelcome ? (
    <div className="welcome-container">
      <Image
        priority
        src={"/LOGO/RED_LOGO_T.png"}
        width={500}
        height={500}
        priority
        alt="logo"
      />
    </div>
  ) : null;
}

export default WelcomeMessage;

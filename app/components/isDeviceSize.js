'use client'

import { useState, useEffect } from "react";

const IsDeviceSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is below a certain threshold (e.g., 768 pixels)
      setIsMobile(window.innerWidth < 768);
      
    };

    // Initial check on component mount
    handleResize();

    // Add event listener to monitor window resize
    window.addEventListener("resize", handleResize);

    // Cleanup: Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window]); // Empty dependency array to run this effect only once on mount

  return isMobile
}


export default IsDeviceSize;

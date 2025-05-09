import { useState, useEffect } from "react";

const BREAKPOINTS = {
  mobile: 580,
  tablet: 1024,
};

/**
 * useDeviceSize
 * Returns:
 *   width, height: current viewport dimensions
 *   device: one of "mobile" | "tablet" | "desktop"
 */
export default function useDeviceSize() {
  const getDeviceInfo = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let device = "desktop";

    if (width < BREAKPOINTS.mobile) {
      device = "mobile";
    } else if (width < BREAKPOINTS.tablet) {
      device = "tablet";
    }

    return { width, height, device };
  };

  const [deviceInfo, setDeviceInfo] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    device: "desktop",
  });

  useEffect(() => {
    // Handler to call on resize
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    // Set initial size/device
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceInfo;
}

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  FaBookmark,
  FaBookReader,
  FaShoppingCart,
  FaSearchLocation,
} from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import toast from "react-hot-toast";
import "./navigation.css";

export default function Navigation() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user?.isAuthenticated
  );
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay to wait for user authentication status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Render the header only if the pathname contains any of the excluded paths
  const excludedPaths = ["login", "signup", "chat", "adminchatroom", "about"];
  const isExcludedPath = excludedPaths.some((path) => pathname.includes(path));

  // If the current path is excluded or still loading, do not render the navigation
  if (isExcludedPath || loading) {
    return null;
  }

  // Define page availability (true means available, false means not available)
  const pageAvailability = {
    "/properties": true,
    "/messages": false,
    "/trends": false,
    "/saved": false,
    "/marketplace": true,
    "/auth/login": true,
  };

  // Handle navigation with page availability check
  const handleNavigation = (href: string) => {
    if (pageAvailability[href] === false) {
      toast.error("🚧 Page not available", {
        position: "top-center",
        duration: 3000,
      });
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="navigation">
      <ul className={isAuthenticated ? "grid" : "flex"}>
        <li className={pathname === "/properties" ? "active" : ""}>
          <button onClick={() => handleNavigation("/properties")}>
            <FaSearchLocation />
            <span>properties</span>
          </button>
        </li>

        {isAuthenticated && (
          <li className={pathname === "/messages" ? "active" : ""}>
            <button onClick={() => handleNavigation("/messages")}>
              <IoChatboxEllipses />
              <span>messages</span>
            </button>
          </li>
        )}

        <li className={pathname === "/trends" ? "active" : ""}>
          <button onClick={() => handleNavigation("/trends")}>
            <FaBookReader />
            <span>trends</span>
          </button>
        </li>

        {isAuthenticated && (
          <li className={pathname === "/saved" ? "active" : ""}>
            <button onClick={() => handleNavigation("/saved")}>
              <FaBookmark />
              <span>saved</span>
            </button>
          </li>
        )}

        <li
          className={
            pathname === "/auth/login" || pathname === "/marketplace"
              ? "active"
              : ""
          }>
          <button
            onClick={() =>
              handleNavigation(isAuthenticated ? "/marketplace" : "/auth/login")
            }>
            {isAuthenticated ? <FaShoppingCart /> : <FaUser />}
            {isAuthenticated ? <span>market</span> : <span>login</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}

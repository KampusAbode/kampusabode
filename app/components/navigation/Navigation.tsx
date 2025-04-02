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
import { getAllMessages } from "../../utils"; // adjust the path as needed

export default function Navigation() {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = user?.isAuthenticated;
  const userId = user?.id; // Ensure your Redux store provides the user's id
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay to wait for user authentication status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for unread messages (only for authenticated users)
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    // Subscribe to all conversations from Firebase
    const unsubscribe = getAllMessages((allConversations) => {
      // Filter for conversations where the logged in user is the receiver and the message is unread
      const unreadMessages = allConversations.filter(
        (convo) => convo.receiverId === userId && !convo.read
      );
      setUnreadCount(unreadMessages.length);
    });

    return () => unsubscribe();
  }, [isAuthenticated, userId]);

  // Exclude navigation on certain paths
  const excludedPaths = [
    "login",
    "signup",
    "chat",
    "adminchatroom",
    "about",
    "properties/",
  ];
  const isExcludedPath = excludedPaths.some((path) => pathname.includes(path));

  if (isExcludedPath || loading) {
    return null;
  }

  // Define page availability (true means available, false means not available)
  const pageAvailability = {
    "/properties": true,
    "/messages": true,
    "/trends": true,
    "/saved": true,
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
              {unreadCount > 0 && <div className="unread">{unreadCount}</div>}
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

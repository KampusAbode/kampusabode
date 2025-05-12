"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { getAllMessages } from "../../utils";
import { useUserStore } from "../../store/userStore";

export default function Navigation() {
  const user = useUserStore((state) => state.user);
  const id = user?.id;
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay to wait for user authentication status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for unread messages (only for authenticated users)
  useEffect(() => {
    if (!id) return;

    // Subscribe to all conversations from Firebase
    const unsubscribe = getAllMessages((allConversations) => {
      // Filter for conversations where the logged in user is the receiver and the message is unread
      const unreadMessages = allConversations.filter(
        (convo) => convo.receiverId === id && !convo.read
      );
      setUnreadCount(unreadMessages.length);
    });

    return () => unsubscribe();
  }, [id]);

  // Exclude navigation on certain paths
  const excludedPaths = [
    "chat",
    "adminchatroom",
    "about",
    "apartment/",
    "auth",
  ];
  const isExcludedPath = excludedPaths.some((path) => pathname.includes(path));

  if (isExcludedPath || loading) {
    return null;
  }

  const pageAvailability = {
    "/apartment": true,
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
      <ul className={id ? "grid" : "flex"}>
        <li className={pathname === "/apartment" ? "active" : ""}>
          <button title="Apartments"  onClick={() => handleNavigation("/apartment")}>
            <FaSearchLocation />
            <span>apartments</span>
          </button>
        </li>

        {id && (
          <li className={pathname === "/messages" ? "active" : ""}>
            <button title="Messages" onClick={() => handleNavigation("/messages")}>
              <IoChatboxEllipses />
              <span>messages</span>
              {unreadCount > 0 && <div className="unread">{unreadCount}</div>}
            </button>
          </li>
        )}

        <li className={pathname === "/trends" ? "active" : ""}>
          <button title="Trends" onClick={() => handleNavigation("/trends")}>
            <FaBookReader />
            <span>trends</span>
          </button>
        </li>

        {id && (
          <li className={pathname === "/saved" ? "active" : ""}>
            <button title="Saved" onClick={() => handleNavigation("/saved") }>
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
            title="Marketplace"
            onClick={() =>
              handleNavigation(id ? "/marketplace" : "/auth/login")
            }>
            {id ? <FaShoppingCart /> : <FaUser />}
            {id ? <span>market</span> : <span>login</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}

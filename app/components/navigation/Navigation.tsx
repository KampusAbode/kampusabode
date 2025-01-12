"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { FaBookmark, FaShoppingCart, FaSearchLocation } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import "./navigation.css";

export default function Navigation() {
  const user = useSelector((state: RootState) => state.user?.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Simulate a delay to wait for user authentication status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Render the header only if the pathname contains any of the excluded paths
  const excludedPaths = ["login", "signup", "chat", "adminchatroom", "about"];

  // Check if the current pathname is in the excluded paths
  const isExcludedPath = excludedPaths.some((path) => pathname.includes(path));

  // If the current path is excluded or still loading, do not render the navigation
  if (isExcludedPath || loading) {
    return null;
  }

  return (
    <nav className="navigation">
      <ul className={` ${user ? "grid" : "flex"}`}>
        <li>
          <Link
            href="/properties"
            className={pathname === "/properties" ? "active" : ""}>
            <FaSearchLocation />
            <span>properties</span>
          </Link>
        </li>

        {user ? (
          <li>
            <Link
              href="/messages"
              className={pathname === "/messages" ? "active" : ""}>
              <IoChatboxEllipses />
              <span>messages</span>
            </Link>
          </li>
        ) : null}

        <li>
          <Link
            href="/trends"
            className={pathname === "/trends" ? "active" : ""}>
            <FaBookmark />
            <span>trends</span>
          </Link>
        </li>

        {user ? (
          <li>
            <Link
              href={"/saved"}
              className={pathname === "/saved" ? "active" : ""}>
              <CiBookmark />
              <span>saved</span>
            </Link>
          </li>
        ) : null}

        <li>
          <Link
            href={user ? "/marketplace" : "/auth/login"}
            className={
              pathname === "/auth/login" || pathname === "/marketplace"
                ? "active"
                : ""
            }>
            {user ? <FaShoppingCart /> : <FaUser />}

            {user ? <span>market</span> : <span>login</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

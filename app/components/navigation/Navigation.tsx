"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import "./navigation.css";
import { FaBookReader, FaSearch, FaShoppingCart } from "react-icons/fa";
import { FaBookmark, FaMessage, FaPerson, FaUser } from "react-icons/fa6";

export default function Navigation() {
  const user = useSelector((state: RootState) => state.user?.isAuthenticated);
  const pathname = usePathname();

  // Render the header only if the pathname contains any of the excluded paths
  const excludedPaths = [
    "login",
    "signup",
    "chat",
    "adminchatroom",
    "about",
  ];

  if (excludedPaths.some((path) => pathname.includes(`/${path}`))) {
    return null;
  }

  return (
    <nav className="navigation">
      <ul className={` ${user ? "grid" : "flex"}`}>
        <li>
          <Link
            href="/properties"
            className={pathname === "/properties" ? "active" : ""}>
            <FaSearch />

            <span>properties</span>
          </Link>
        </li>

        {user ? (
          <li>
            <Link
              href="/messages"
              className={pathname === "/messages" ? "active" : ""}>
              <FaMessage />

              <span>messages</span>
            </Link>
          </li>
        ) : null}

        <li>
          <Link
            href="/trends"
            className={pathname === "/trends" ? "active" : ""}>
            <FaBookReader />

            <span>trends</span>
          </Link>
        </li>

        {user ? (
          <li>
            <Link
              href={"/saved"}
              className={pathname === "/saved" ? "active" : ""}>
              <FaBookmark />

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

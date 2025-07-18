"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaBookmark,
  FaBookReader,
  FaShoppingCart,
  FaSearchLocation,
} from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import "./navigation.css";
import { getAllMessages } from "../../utils";
import { useUserStore } from "../../store/userStore";

export default function Navigation() {
  const user = useUserStore((state) => state.user);
  const id = user?.id;
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to messages if user is logged in
  useEffect(() => {
    if (!id) return;

    const unsubscribe = getAllMessages((allConversations) => {
      const unread = allConversations.filter(
        (convo) => convo.receiverId === id && !convo.read
      );
      setUnreadCount(unread.length);
    });

    return () => unsubscribe();
  }, [id]);

  const excludedPaths = [
    "/chat",
    "/adminchatroom",
    "/about",
    "/auth",
    "/apartment/",
    "/profile/",
  ];
  const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));
  if (isExcluded) return null;

  const navLinks = [
    {
      href: "/apartment",
      icon: <FaSearchLocation />,
      label: "apartments",
      authOnly: false,
    },
    {
      href: "/messages",
      icon: <IoChatboxEllipses />,
      label: "messages",
      authOnly: true,
      hasBadge: true,
    },
    {
      href: "/trends",
      icon: <FaBookReader />,
      label: "trends",
      authOnly: false,
    },
    {
      href: "/saved",
      icon: <FaBookmark />,
      label: "saved",
      authOnly: true,
    },
  ];

  return (
    <nav className="navigation">
      <ul className={id ? "grid" : "flex"}>
        {navLinks.map(({ href, icon, label, authOnly, hasBadge }) => {
          if (authOnly && !id) return null;

          return (
            <li key={href} className={pathname === href ? "active" : ""}>
              <Link prefetch href={href}>
                <div title={label}>
                  {icon}
                  <span>{label}</span>
                  {hasBadge && unreadCount > 0 && (
                    <div className="unread">{unreadCount}</div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}

        <li
          className={
            pathname === "/marketplace" || pathname === "/auth/login"
              ? "active"
              : ""
          }>
          <Link prefetch href={id ? "/marketplace" : "/auth/login"}>
            <div title={id ? "Marketplace" : "Login"}>
              {id ? <FaShoppingCart /> : <FaUser />}
              <span>{id ? "market" : "login"}</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

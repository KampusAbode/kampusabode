"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpenText,
  Heart,
  MessageSquare,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";
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
    "/roomie-match/",
  ];
  const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));
  if (isExcluded) return null;

  const navLinks = [
    {
      href: "/apartment",
      icon: <Search aria-hidden="true" size={20} strokeWidth={1.75} />,
      label: "apartments",
      authOnly: false,
    },
    {
      href: "/messages",
      icon: <MessageSquare aria-hidden="true" size={20} strokeWidth={1.75} />,
      label: "messages",
      authOnly: true,
      hasBadge: true,
    },
    {
      href: "/trends",
      icon: <BookOpenText aria-hidden="true" size={20} strokeWidth={1.75} />,
      label: "trends",
      authOnly: false,
    },
    {
      href: "/saved",
      icon: <Heart aria-hidden="true" size={20} strokeWidth={1.75} />,
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
              {id ? (
                <ShoppingBag aria-hidden="true" size={20} strokeWidth={1.75} />
              ) : (
                <UserRound aria-hidden="true" size={20} strokeWidth={1.75} />
              )}
              <span>{id ? "market" : "login"}</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

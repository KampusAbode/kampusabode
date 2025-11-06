"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { TbHomeSearch } from "react-icons/tb";
import { CiHome } from "react-icons/ci";
import {
  LuCircleUserRound,
  LuLayoutDashboard,
  LuLogOut,
  LuMessagesSquare,
  LuUsers,
} from "react-icons/lu";
import { IoChatbubblesOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import "./nav.css";
import useNavStore from "../../store/menuStore";
import { useUserStore } from "../../store/userStore";
import Prompt from "../modals/prompt/Prompt";
import { logoutUser } from "../../utils/auth";
import { checkIsAdmin } from "../../utils";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore((state) => state);
  const { isNavOpen, toggleNav } = useNavStore();
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogoutClick = () => setShowPrompt(true);

  const confirmLogout = async () => {
    setShowPrompt(false);
    try {
      await logoutUser();
      toggleNav();
      router.push("/apartment");
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  const cancelLogout = () => setShowPrompt(false);

  useEffect(() => {
    async function checkUserPermissions(userId: string) {
      try {
        const adminCheck = await checkIsAdmin(userId);
        if (adminCheck) setIsAdmin(true);
      } catch (error) {
        console.error("Failed to check user permissions:", error);
      }
    }
    if (user?.id) checkUserPermissions(user.id);
    setLoading(false);
  }, [user]);

  // 👇 Swipe to CLOSE (on the nav)
  const closeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (isNavOpen) toggleNav();
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  // 👇 Swipe to OPEN (on the screen edge)
  const openHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isNavOpen) toggleNav();
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  if (loading) return null;

  return (
    <>
      {!isNavOpen && (
        <div
          {...openHandlers}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "40px",
            height: "100vh",
            zIndex: 500,
            background: "transparent",
          }}
        />
      )}

      
      <div
        {...closeHandlers}
        className={`nav-menu ${user ? "sideNav" : "notlogged"} ${
          isNavOpen ? "fadeIn" : "fadeOut"
        }`}
      >
        <div className="container">
          <div className="top">
            <div className="nav-header">
              <div className="close-div">
                <div className="logo">
                  <Link prefetch href="/" onClick={toggleNav}>
                    <Image
                      src="/LOGO/WHITE_LOGO-T.png"
                      width={500}
                      height={500}
                      alt="logo"
                      priority
                    />
                  </Link>
                </div>
                <div className="close" onClick={toggleNav}>
                  <FaTimes />
                </div>
              </div>

              <div className="nav-btns">
                {user?.userType === "agent" && isAdmin && (
                  <Link
                    href={`/apartment/c/${user.id}`}
                    className="btn"
                    title="Button"
                    onClick={toggleNav}
                  >
                    new listing
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin/users"
                    className="btn"
                    title="Button"
                    onClick={toggleNav}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>

            <ul>
              <li
                title={user ? "Dashboard" : "Home"}
                className={
                  pathname === `/dashboard/${user?.id}` || pathname === "/"
                    ? "active"
                    : ""
                }
              >
                <Link
                  prefetch
                  href={user ? `/dashboard/${user?.id}` : "/"}
                  onClick={toggleNav}
                >
                  {user ? <LuLayoutDashboard /> : <CiHome />}
                  {user ? "dashboard" : "home"}
                </Link>
              </li>

              <li
                title="Apartment"
                className={pathname === "/apartment" ? "active" : ""}
              >
                <Link prefetch href="/apartment" onClick={toggleNav}>
                  <TbHomeSearch />
                  Apartment
                </Link>
              </li>

              <li
                title="Apartment"
                className={pathname === "/roomie-match" ? "active" : ""}
              >
                <Link prefetch href="/roomie-match" onClick={toggleNav}>
                  <LuUsers />
                  Roomie Match
                </Link>
              </li>

              {isAdmin && (
                <li
                  title="Admin Chat"
                  className={pathname === "/adminchatroom" ? "active" : ""}
                >
                  <Link prefetch href="/adminchatroom" onClick={toggleNav}>
                    <LuMessagesSquare />
                    User Messages
                  </Link>
                </li>
              )}

              <li
                title="Profile"
                className={pathname === "/profile" ? "active" : ""}
              >
                <Link prefetch href="/profile" onClick={toggleNav}>
                  <LuCircleUserRound />
                  profile
                </Link>
              </li>

              {user && (
                <li
                  title="Chat"
                  className={
                    pathname === `/chat/${user.id}/${user.name}`
                      ? "active"
                      : ""
                  }
                >
                  <Link
                    href={`/chat/${user.id}/${user.name}`}
                    onClick={toggleNav}
                  >
                    <IoChatbubblesOutline />
                    chat
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="logout">
            <span>
              ©️ 2025. All rights reserved.
              {user ? (
                <button
                  className="btn btn-secondary"
                  title="Logout"
                  onClick={handleLogoutClick}
                >
                  Logout
                  <LuLogOut />
                </button>
              ) : (
                <Link prefetch href="/auth/login" onClick={toggleNav}>
                  <button className="btn btn-secondary" title="Login">
                    Login
                  </button>
                </Link>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Logout confirmation prompt */}
      <Prompt
        message="Are you sure you want to logout?"
        isOpen={showPrompt}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}

export default Nav;

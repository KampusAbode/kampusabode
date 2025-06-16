"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaTimes, FaRegUserCircle, FaSearchLocation } from "react-icons/fa";
import { CiViewBoard, CiHome } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { IoChatbubblesOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import "./nav.css";
import useNavStore from "../../store/menuStore";
import { useUserStore } from "../../store/userStore";
import Prompt from "../modals/prompt/Prompt";
import { logoutUser } from "../../utils/auth";
import { checkIsAdmin } from "../../utils/user";

function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore((state) => state);
  const { isNavOpen, toggleNav } = useNavStore();
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleLogoutClick = () => {
    setShowPrompt(true);
  };

  const confirmLogout = async () => {
    setShowPrompt(false);
    try {
      await logoutUser();
      toast.success("Logged out successfully 👌");
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  const cancelLogout = () => {
    setShowPrompt(false);
  };

  useEffect(() => {
    setLoading(false);
  }, [user]);

  if (loading) return null;

  return (
    <>
      <div
        className={`nav-menu ${user ? "sideNav" : "notlogged"} ${
          isNavOpen ? "fadeIn" : "fadeOut"
        }`}>
        <div className="container">
        <div className="top">
          <div className="nav-header">
          <div className="close-div" >
            <div className="logo">
              <Link href="/" onClick={toggleNav}>
                <img
                  src="/LOGO/RED_LOGO_T.png"
                  width={500}
                  height={500}
                  alt="logo"
                />
              </Link>
            </div>
            <div className="close" onClick={toggleNav}>
              <FaTimes />
            </div>
          </div>

         <div className="nav-btns">
         {user?.userType === "agent" && checkIsAdmin(user.id) && (
            <Link
              href={`/apartment/c/${user.id}`}
              className="btn"
              title="Button"
              onClick={toggleNav}>
              upload property
            </Link>
          )}

           {checkIsAdmin(user?.id || "") && (
              <Link
                href="/admin"
                className="btn"
                title="Button"
                onClick={toggleNav}>
                Admin Dashboard
              </Link>
            )}
         </div>
          </div>

          <ul>
            <li
              title="Apartment"
              className={pathname === "/apartment" ? "active" : ""}>
              <Link href="/apartment" onClick={toggleNav}>
                <FaSearchLocation />
                Apartment
              </Link>
            </li>

            {checkIsAdmin(user?.id || "") && (
              <li
                title="Admin Chat"
                className={pathname === "/adminchatroom" ? "active" : ""}>
                <Link href="/adminchatroom" onClick={toggleNav}>
                  <GrUserAdmin />
                  User Messages
                </Link>
              </li>
            )}

            <li
              title={user ? "Dashboard" : "Home"}
              className={
                pathname === "/dashboard" || pathname === "/" ? "active" : ""
              }>
              <Link href={user ? "/dashboard" : "/"} onClick={toggleNav}>
                {user ? <CiViewBoard /> : <CiHome />}
                {user ? "dashboard" : "home"}
              </Link>
            </li>

            <li
              title="Profile"
              className={pathname === "/profile" ? "active" : ""}>
              <Link href="/profile" onClick={toggleNav}>
                <FaRegUserCircle />
                profile
              </Link>
            </li>

            {user && (
              <li
                title="Chat"
                className={
                  pathname === `/chat/${user.id}/${user.name}` ? "active" : ""
                }>
                <Link
                  href={`/chat/${user.id}/${user.name}`}
                  onClick={toggleNav}>
                  <IoChatbubblesOutline />
                  chat
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="logout">
          <span>
            ©️ 2024. All rights reserved.
            {user ? (
              <button
                className="btn btn-secondary"
                title="Logout"
                onClick={handleLogoutClick}>
                Logout
              </button>
            ) : (
              <Link href="/auth/login" onClick={toggleNav}>
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

"use client";

import { useState, useEffect } from "react";
import "./header.css";
import data from "../../fetch/contents";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BackButton from "../features/backbutton/BackButton";
import { useUserStore } from "../../store/userStore";
import useNavStore from "../../store/menuStore";
import Prompt from "../modals/prompt/Prompt";
import { logoutUser } from "../../utils/auth";

const { links } = data;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useUserStore((state) => state);
  const { isNavOpen, toggleNav } = useNavStore((state) => state);

  const [isHeader, setIsHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  // const handleScroll = () => {
  //   window.requestAnimationFrame(() => {
  //     setIsHeader(window.scrollY <= lastScrollY);

  //     setLastScrollY(window.scrollY);
  //   });
  // };

  const confirmLogout = async () => {
    setShowPrompt(false);
    try {
      await logoutUser();
      toggleNav();
      router.push("/apartment");
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  const handleLogoutClick = () => {
    setShowPrompt(true);
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [lastScrollY, isNavOpen]);

  const pagesWithBackButton = [
    "profile",
    "apartment/",
    "messages",
    "saved",
    "chat",
    "adminchatroom",
    "dashboard",
    "marketplace",
    "about",
    "trends",
    "auth/login",
    "auth/signup",
  ];
  const showBackButton = pagesWithBackButton.some((path) =>
    pathname.includes(`/${path}`)
  );
  const excludedPaths = ["login", "signup"];
  if (excludedPaths.some((path) => pathname.includes(`/${path}`))) {
    return null;
  }

  return (
    <>
      <header className={!isHeader ? "hide" : ""}>
        <div className="container">
          {showBackButton ? (
            <BackButton />
          ) : (
            <div className={`logo ${!user ? "loggedIn" : ""}`}>
              <Link prefetch href="/">
                <Image
                  src="/LOGO/WHITE_LOGO-T.png"
                  width={500}
                  height={500}
                  alt="logo"
                  priority
                />
              </Link>
            </div>
          )}

          <nav>
            <ul className="nav-links">
              {links.map((link) => (
                <li key={link.to}>
                  <Link prefetch href={link.direct} className="active">
                    {link.to}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="cta">
              <Link
                href={user ? "/contact" : "/auth/signup"}
                className="btn btn-secondary"
                title="Button">
                {user ? "get in touch" : "signup"}
              </Link>
              {user ? (
                user.userType === "student" ? (
                  <span
                    className="btn"
                    title="Button"
                    onClick={handleLogoutClick}>
                    logout
                  </span>
                ) : user.userType === "agent" ? (
                  <Link
                    href={`/apartment/c/${user.id}`}
                    className="sign-up-btn btn">
                    upload
                  </Link>
                ) : null
              ) : (
                <Link prefetch href="/auth/login" className="sign-up-btn btn">
                  login
                </Link>
              )}
            </div>
          </nav>

          <div className="menu" onClick={toggleNav}>
            <Image
              src={`${user ? user?.avatar : "/assets/user_avatar.jpg"}`}
              width={500}
              height={500}
              alt="logo"
              priority
            />
          </div>
        </div>
      </header>

      {/* Logout confirmation prompt */}
      <Prompt
        message="Are you sure you want to logout?"
        isOpen={showPrompt}
        onConfirm={confirmLogout}
        onCancel={() => setShowPrompt(false)}
      />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import "./header.css";
import data from "../../fetch/contents";
import Link from "next/link";
// import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { openMenu, closeMenu } from "../../redux/stateSlice/menuSlice";
import { FaTimes, FaBars, FaArrowLeft } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BackButton from "../features/backbutton/BackButton";
import { useUserStore } from "../../store/userStore";
import useNavStore from "../../store/menuStore";

const { links } = data;

export default function Header() {
  const pathname = usePathname();

  const dispatch = useDispatch();

  const { user, logoutUser } = useUserStore((state) => state);
  const { isNavOpen, toggleNav } = useNavStore((state) => state);
  // Move the useRouter hook here (at the top of the component)
  const router = useRouter();

  const [isHeader, setIsHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    window.requestAnimationFrame(() => {
      setIsHeader(window.scrollY <= lastScrollY);
      if (isNavOpen) toggleNav();
      setLastScrollY(window.scrollY);
    });
  };

  const logOut = async () => {
    try {
      const response = await logoutUser();
      toast.success(`logged out successfully 👌`);
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isNavOpen]);

  // Pages where the header will show the back button and page name
  const pagesWithBackButton = [
    "profile",
    "properties/",
    "chat",
    "adminchatroom",
    "dashboard",
    "marketplace",
    "about",
    "trends",
  ];

  const showBackButton = pagesWithBackButton.some((path) =>
    pathname.includes(`/${path}`)
  );

  const pageName =
    pagesWithBackButton.find((path) => pathname.includes(`/${path}`)) || "";

  // Render the header only if the pathname contains any of the excluded paths
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
              <Link href="/">
                <img
                  src={"/LOGO/RED_LOGO_T.png"}
                  width={500}
                  height={500}
                  alt="logo"
                />
              </Link>
            </div>
          )}

          <nav>
            <ul className="nav-links">
              {links.map((link) => (
                <li key={link.to}>
                  <Link href={link.direct} className="active">
                    {link.to}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="cta">
              <Link
                href={user ? "/contact" : "/auth/signup"}
                className="btn btn-secondary">
                {user ? "get in touch" : "signup"}
              </Link>
              {user ? (
                user?.userType === "student" ? (
                  <span className="btn" onClick={() => logOut()}>
                    logout
                  </span>
                ) : user?.userType === "agent" ? (
                  <Link href="/properties/upload" className="sign-up-btn btn">
                    upload
                  </Link>
                ) : null
              ) : (
                <Link href="/auth/login" className="sign-up-btn btn">
                  login
                </Link>
              )}
            </div>
          </nav>

          <div className="menu" onClick={() => toggleNav()}>
            <FaBars />
          </div>
        </div>
      </header>
    </>
  );
}

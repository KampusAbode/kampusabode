"use client";

import { useState, useEffect } from "react";
import "./header.css";
import data from "../../fetch/contents";
import Link from "next/link";
// import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/stateSlice/userSlice";
import { logoutUser } from "../../utils/api";
import { FaTimes, FaBars } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RootState } from "../../redux/store";

const { links } = data;

export default function Header() {
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const userData = useSelector((state: RootState) => state.userdata);

  // Move the useRouter hook here (at the top of the component)
  const router = useRouter();

  const [isHeader, setIsHeader] = useState(true);
  const [navMenu, setNavMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    window.requestAnimationFrame(() => {
      setIsHeader(window.scrollY <= lastScrollY);
      if (navMenu) setNavMenu(false);
      setLastScrollY(window.scrollY);
    });
  };

  const logOut = async () => {
    try {
      const response = await logoutUser();
      toast.success(`${response.message} 👌`);
      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, navMenu]);

  // Render the header only if the pathname contains any of the excluded paths
  const excludedPaths = ["login", "signup", "dashboard", "chat"];
  if (excludedPaths.some((path) => pathname.includes(`/${path}`))) {
    return null;
  }

  return (
    <>
      <header className={isHeader ? "show" : "hide"}>
        <div className="container">
          <div className="logo">
            <Link href="/">
              <img
                src={"/LOGO/logo_O.png"}
                width={150}
                height={150}
                alt="logo"
              />
            </Link>
          </div>
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
                href={user.isAuthenticated ? "/contact" : "/auth/signup"}
                className="btn btn-secondary">
                {user.isAuthenticated ? "get in touch" : "signup"}
              </Link>
              {user.isAuthenticated ? (
                userData.userType === "student" ? (
                  <span className="btn" onClick={() => logOut()}>
                    logout
                  </span>
                ) : userData.userType === "agent" ? (
                  <Link href="/upload" className="sign-up-btn btn">
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
          <div className="menu" onClick={() => setNavMenu(!navMenu)}>
            <FaBars />
          </div>
        </div>
      </header>

      <div className={`nav-menu ${navMenu ? "open" : ""}`}>
        <div className="close" onClick={() => setNavMenu(false)}>
          <FaTimes />
        </div>
        <ul>
          <li>
            <Link
              href={user.isAuthenticated ? "/dashboard" : "/"}
              onClick={() => {
                setNavMenu(false);
              }}>
              {user.isAuthenticated ? "dashboard" : "home"}
            </Link>
          </li>
          <li>
            <Link
              href={"/profile"}
              onClick={() => {
                setNavMenu(false);
              }}>
              profile
            </Link>
          </li>

          <li>
            <Link
              href={"/about"}
              onClick={() => {
                setNavMenu(false);
              }}>
              about
            </Link>
          </li>
          <li>
            <Link
              href={`/chat/${userData.id}/${userData.name}`}
              onClick={() => {
                setNavMenu(false);
              }}>
              chat
            </Link>
          </li>
          <li>
            <Link
              href={"/legal/faqs"}
              onClick={() => {
                setNavMenu(false);
              }}>
              FAQs
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
              onClick={() => {
                setNavMenu(false);
              }}>
              contact
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link
              href={"/legal/policies"}
              onClick={() => {
                setNavMenu(false);
              }}>
              policies
            </Link>
          </li>
          <li>
            <Link
              href={"/legal/termsandconditions"}
              onClick={() => {
                setNavMenu(false);
              }}>
              terms
            </Link>
          </li>
          <li>
            <Link
              href={"/legal/disclaimer"}
              onClick={() => {
                setNavMenu(false);
              }}>
              disclaimer
            </Link>
          </li>
          <li>
            <Link
              href={"/legal/useragreement"}
              onClick={() => {
                setNavMenu(false);
              }}>
              agreement
            </Link>
          </li>
        </ul>

        <hr />

        <div className="logout">
          <span>
            ©️ copyright 2024 Kampusabode. All right reserved.{" "}
            {user.isAuthenticated ? (
              <span
                onClick={() => {
                  logOut();
                  setNavMenu(false);
                }}>
                Logout
              </span>
            ) : (
              <Link
                href={"/auth/login"}
                onClick={() => {
                  setNavMenu(false);
                }}>
                Login
              </Link>
            )}
          </span>
        </div>
      </div>
    </>
  );
}

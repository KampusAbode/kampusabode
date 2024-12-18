"use client";

import { useState, useEffect } from "react";
import "./header.css";
import data from "../../fetch/contents";
import Link from "next/link";
// import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/stateSlice/userSlice";
import { logoutUser } from "../../utils/api";
import { FaTimes, FaBars, FaArrowLeft } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RootState } from "../../redux/store";
import BackButton from "../features/backbutton/BackButton";

const { links } = data;

export default function Header() {
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

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

  // Pages where the header will show the back button and page name
  const pagesWithBackButton = [
    "profile",
    "chat",
    "adminchatroom",
    "dashboard",
    "marketplace",
    "about",
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
      <header className={isHeader ? "show" : "hide"}>
        <div className="container">
          {showBackButton ? (
            <>
              <BackButton />
              <div className="page-title">{pageName}</div>
            </>
          ) : (
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
                href={user?.isAuthenticated ? "/contact" : "/auth/signup"}
                className="btn btn-secondary">
                {user?.isAuthenticated ? "get in touch" : "signup"}
              </Link>
              {user?.isAuthenticated ? (
                user?.userType === "student" ? (
                  <span className="btn" onClick={() => logOut()}>
                    logout
                  </span>
                ) : user?.userType === "agent" ? (
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
          <span>
            <FaTimes />
          </span>
        </div>
        <ul>
          {user?.isAuthenticated ? (
            user?.id === "PlcpjfOsQ5NYUBgqC3DMMVj2kRj2" ||
            "P9IfqO0q3ZXTCOVS77ytSd8k8Oo2" ? (
              <li className={pathname === "/adminchatroom" && "active"}>
                <Link
                  href="/adminchatroom"
                  onClick={() => {
                    setNavMenu(false);
                  }}>
                  adminchatroom
                </Link>
              </li>
            ) : null
          ) : null}

          <li className={pathname === "/properties" && "active"}>
            <Link
              href={"/properties"}
              onClick={() => {
                setNavMenu(false);
              }}>
              properties
            </Link>
          </li>
          <li
            className={`${
              pathname === "/dashboard" || pathname === "/" ? "active" : ""
            }`}>
            <Link
              href={user?.isAuthenticated ? "/dashboard" : "/"}
              onClick={() => {
                setNavMenu(false);
              }}>
              {user?.isAuthenticated ? "dashboard" : "home"}
            </Link>
          </li>
          <li className={pathname === "/profile" && "active"}>
            <Link
              href={"/profile"}
              onClick={() => {
                setNavMenu(false);
              }}>
              profile
            </Link>
          </li>

          <li className={pathname === "/about" && "active"}>
            <Link
              href={"/about"}
              onClick={() => {
                setNavMenu(false);
              }}>
              about
            </Link>
          </li>
          {user?.isAuthenticated ? (
            <li
              className={
                pathname === `/chat/${user?.id}/${user?.username}` && "active"
              }>
              <Link
                href={`/chat/${user?.id}/${user?.username}`}
                onClick={() => {
                  setNavMenu(false);
                }}>
                chat
              </Link>
            </li>
          ) : null}
          <li className={pathname === "/legal/faqs" && "active"}>
            <Link
              href={"/legal/faqs"}
              onClick={() => {
                setNavMenu(false);
              }}>
              FAQs
            </Link>
          </li>
          <li className={pathname === "/contact" && "active"}>
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
          <li className={pathname === "/legal/policies" && "active"}>
            <Link
              href={"/legal/policies"}
              onClick={() => {
                setNavMenu(false);
              }}>
              policies
            </Link>
          </li>
          <li className={pathname === "/legal/termsandconditions" && "active"}>
            <Link
              href={"/legal/termsandconditions"}
              onClick={() => {
                setNavMenu(false);
              }}>
              terms
            </Link>
          </li>
          <li className={pathname === "/legal/disclaimer" && "active"}>
            <Link
              href={"/legal/disclaimer"}
              onClick={() => {
                setNavMenu(false);
              }}>
              disclaimer
            </Link>
          </li>
          <li className={pathname === "/legal/useragreement" && "active"}>
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
            {user?.isAuthenticated ? (
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

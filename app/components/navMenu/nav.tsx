"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimes, FaRegUserCircle, FaSearchLocation } from "react-icons/fa";
import { CiViewBoard, CiHome } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { IoChatbubblesOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import "./nav.css";
import useNavStore from "../../store/menuStore";
import { useUserStore } from "../../store/userStore";

const pageAvailability = {
  "/adminchatroom": true,
  "/properties/upload": true,
  "/admin": true,
  "/dashboard": true,
  "/profile": true,
  "/properties": true,
  "/chat": false,
};

function Nav() {
  const pathname = usePathname();
  const {user, logoutUser} = useUserStore((state) => state);
  const {   isNavOpen, toggleNav } = useNavStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logOut = async () => {
    try {
      logoutUser();
      toast.success(`logged out successfully 👌`);
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleNavigation = (href: string) => {
    if (pageAvailability[href] === false) {
      toast.error("🚧 Page not available", {
        position: "top-center",
        duration: 3000,
      });
    } else {
      router.push(href);
      toggleNav()
    }
  };

  if (loading) {
    return;
  }

  return (
    <div
      className={`nav-menu ${user ? "sideNav" : "notlogged"} 
      ${isNavOpen ? "fadeIn" : "fadeOut"}`}>
      <div>
        <div className="close-div" onClick={() => toggleNav()}>
          <div className="logo">
            <button onClick={() => handleNavigation("/")}>
              <img
                src={"/LOGO/RED_LOGO_T.png"}
                width={500}
                height={500}
                alt="logo"
              />
            </button>
          </div>
          <div className="close">
            <FaTimes />
          </div>
        </div>
        {user?.userType === "agent" && (
          <button
            onClick={() => handleNavigation("/properties/upload")}
            className="btn">
            upload property
          </button>
        )}
        {user?.userType === "agent" &&
          user?.id === process.env.NEXT_PUBLIC_ADMINS && (
            <button onClick={() => handleNavigation("/admin")} className="btn">
              Admin Portal
            </button>
          )}
        <ul>
          <li className={pathname === "/properties" ? "active" : ""}>
            <button onClick={() => handleNavigation("/properties")}>
              <FaSearchLocation />
              properties
            </button>
          </li>
          {user && user?.id === process.env.NEXT_PUBLIC_ADMINS && (
            <li className={pathname === "/adminchatroom" ? "active" : ""}>
              <button onClick={() => handleNavigation("/adminchatroom")}>
                <GrUserAdmin />
                admin
              </button>
            </li>
          )}
          <li
            className={`$ {pathname === "/dashboard" || pathname === "/" ? "active" : ""}`}>
            <button onClick={() => handleNavigation(user ? "/dashboard" : "/")}>
              {user ? <CiViewBoard /> : <CiHome />}
              {user ? "dashboard" : "home"}
            </button>
          </li>
          <li className={pathname === "/profile" ? "active" : ""}>
            <button onClick={() => handleNavigation("/profile")}>
              <FaRegUserCircle />
              profile
            </button>
          </li>
          {user && (
            <li
              className={
                pathname === `/chat/${user?.id}/${user?.name}`
                  ? "active"
                  : ""
              }>
              <button
                onClick={() =>
                  handleNavigation(`/chat/${user?.id}/${user?.name}`)
                }>
                <IoChatbubblesOutline />
                chat
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className="logout">
        <span>
          ©️ 2024. All rights reserved.
          {user ? (
            <button className="btn btn-secondary" onClick={logOut}>
              Logout
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => handleNavigation("/auth/login")}>
              Login
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

export default Nav;

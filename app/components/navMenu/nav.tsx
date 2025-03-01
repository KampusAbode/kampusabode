"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimes, FaRegUserCircle, FaSearchLocation } from "react-icons/fa";
import { CiViewBoard, CiHome } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { IoChatbubblesOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logoutUser } from "../../utils";
import toast from "react-hot-toast";
import { clearUser } from "../../redux/stateSlice/userSlice";
import { closeMenu } from "../../redux/stateSlice/menuSlice";
import "./nav.css";

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
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isMenu = useSelector((state: RootState) => state.menu);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    setLoading(false);
  }, [user]);

  const handleNavigation = (href) => {
    if (pageAvailability[href] === false) {
      toast.error("🚧 Page not available", {
        position: "top-center",
        duration: 3000,
      });
    } else {
      router.push(href);
      dispatch(closeMenu());
    }
  };

  if (loading) {
    return;
  }

  return (
    <div
      className={`nav-menu ${user?.isAuthenticated ? "sideNav" : "notlogged"} 
      ${isMenu ? "fadeIn" : "fadeOut"}`}>
      <div>
        <div className="close-div" onClick={() => dispatch(closeMenu())}>
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
          {user?.isAuthenticated &&
            user?.id === process.env.NEXT_PUBLIC_ADMINS && (
              <li className={pathname === "/adminchatroom" ? "active" : ""}>
                <button onClick={() => handleNavigation("/adminchatroom")}>
                  <GrUserAdmin />
                  admin
                </button>
              </li>
            )}
          <li
            className={`$ {pathname === "/dashboard" || pathname === "/" ? "active" : ""}`}>
            <button
              onClick={() =>
                handleNavigation(user?.isAuthenticated ? "/dashboard" : "/")
              }>
              {user?.isAuthenticated ? <CiViewBoard /> : <CiHome />}
              {user?.isAuthenticated ? "dashboard" : "home"}
            </button>
          </li>
          <li className={pathname === "/profile" ? "active" : ""}>
            <button onClick={() => handleNavigation("/profile")}>
              <FaRegUserCircle />
              profile
            </button>
          </li>
          <li className={pathname === "/properties" ? "active" : ""}>
            <button onClick={() => handleNavigation("/properties")}>
              <FaSearchLocation />
              properties
            </button>
          </li>
          {user?.isAuthenticated && (
            <li
              className={
                pathname === `/chat/${user?.id}/${user?.username}`
                  ? "active"
                  : ""
              }>
              <button
                onClick={() =>
                  handleNavigation(`/chat/${user?.id}/${user?.username}`)
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
          ©️ copyright 2024 Kampusabode. All rights reserved.
          {user?.isAuthenticated ? (
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

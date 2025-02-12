"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

function Nav() {
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isMenu = useSelector((state: RootState) => state.menu);
  const [loading, setLoading] = useState(true);

  // Move the useRouter hook here (at the top of the component)
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

  if (loading) {
    return;
  } else {
  }

  return (
    <div
      className={`nav-menu ${user?.isAuthenticated ? "sideNav" : "notlogged"} 
      ${isMenu ? "fadeIn" : "fadeOut"}`}>
      <div>
        <div className="close-div" onClick={() => dispatch(closeMenu())}>
          <div className="logo">
            <Link href="/">
              <img
                src={"/LOGO/RED_LOGO_T.png"}
                width={500}
                height={500}
                alt="logo"
              />
            </Link>
          </div>
          <div className="close">
            <FaTimes />
          </div>
        </div>
        {user?.userType === "agent" ? (
          <Link
            href="/properties/upload"
            onClick={() => {
              dispatch(closeMenu());
            }}
            className="btn">
            upload property
          </Link>
        ) : null}
        <ul>
          {user?.isAuthenticated ? (
            user?.id === "P9IfqO0q3ZXTCOVS77ytSd8k8Oo2" ? (
              <li className={pathname === "/adminchatroom" ? "active" : ""}>
                <Link
                  href="/adminchatroom"
                  onClick={() => {
                    dispatch(closeMenu());
                  }}>
                  <GrUserAdmin />
                  admin
                </Link>
              </li>
            ) : null
          ) : null}
          <li
            className={`${
              pathname === "/dashboard" || pathname === "/" ? "active" : ""
            }`}>
            <Link
              href={user?.isAuthenticated ? "/dashboard" : "/"}
              onClick={() => {
                dispatch(closeMenu());
              }}>
              {user?.isAuthenticated ? <CiViewBoard /> : <CiHome />}

              {user?.isAuthenticated ? "dashboard" : "home"}
            </Link>
          </li>
          <li className={pathname === "/profile" ? "active" : ""}>
            <Link
              href={"/profile"}
              onClick={() => {
                dispatch(closeMenu());
              }}>
              <FaRegUserCircle />
              profile
            </Link>
          </li>
          <li className={pathname === "/properties" ? "active" : ""}>
            <Link
              href={"/properties"}
              onClick={() => {
                dispatch(closeMenu());
              }}>
              <FaSearchLocation />
              properties
            </Link>
          </li>
          {user?.isAuthenticated ? (
            <li
              className={
                pathname === `/chat/${user?.id}/${user?.username}`
                  ? "active"
                  : ""
              }>
              <Link
                href={`/chat/${user?.id}/${user?.username}`}
                onClick={() => {
                  dispatch(closeMenu());
                }}>
                <IoChatbubblesOutline />
                chat
              </Link>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="logout">
        <span>
          ©️ copyright 2024 Kampusabode. All right reserved.{" "}
          {user?.isAuthenticated ? (
            <span
              className="btn btn-secondary"
              onClick={() => {
                logOut();
                dispatch(closeMenu());
              }}>
              Logout
            </span>
          ) : (
            <Link
              className="btn btn-secondary"
              href={"/auth/login"}
              onClick={() => {
                dispatch(closeMenu());
              }}>
              Login
            </Link>
          )}
        </span>
      </div>
    </div>
  );
}

export default Nav;

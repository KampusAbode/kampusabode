"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logoutUser } from "../../utils";
import toast from "react-hot-toast";
import { clearUser } from "../../redux/stateSlice/userSlice";
import { openMenu, closeMenu } from "../../redux/stateSlice/menuSlice";
import "./nav.css";

function Nav() {
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user) as {
    isAuthenticated: boolean;
    id: string;
    username: string;
    userType: string;
  };
  const isMenu = useSelector((state: RootState) => state.menu);
  const [loading, setLoading] = useState(true);

  // Move the useRouter hook here (at the top of the component)
  const router = useRouter();

  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    window.requestAnimationFrame(() => {
      //    setIsHeader(window.scrollY <= lastScrollY);
      if (isMenu) dispatch(closeMenu());
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
  }, [lastScrollY, isMenu]);

  useEffect(() => {
    setLoading(false);
  }, [user]);

  if (loading) {
    return;
  } else {
  }

  return (
    <div
      className={`nav-menu ${user?.isAuthenticated ? "sideNav" : "loggedIn"} 
      ${isMenu ? "fadeIn" : "fadeOut"}`}>
      <div>
        <div className="close-div" onClick={() => dispatch(closeMenu())}>
          <div className="logo">
            <Link href="/">
              <img
                src={"/LOGO/WHITE_BOX_LOGO.png"}
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
        <ul>
          {user?.userType === "agent" ? (
            <li className="btn">
              <Link
                href="/upload"
                onClick={() => {
                  dispatch(closeMenu());
                }}>
                upload property
              </Link>
            </li>
          ) : null}
          {user?.isAuthenticated ? (
            user?.id === "P9IfqO0q3ZXTCOVS77ytSd8k8Oo2" ? (
              <li className={pathname === "/adminchatroom" ? "active" : ""}>
                <Link
                  href="/adminchatroom"
                  onClick={() => {
                    dispatch(closeMenu());
                  }}>
                  adminchatroom
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
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M14.825 19.4583H5.17496C2.89163 19.4583 1.04163 17.6 1.04163 15.3167V9.14166C1.04163 8.00833 1.74163 6.58333 2.64163 5.88333L7.13329 2.38333C8.48329 1.33333 10.6416 1.28333 12.0416 2.26667L17.1916 5.875C18.1833 6.56666 18.9583 8.05 18.9583 9.25833V15.325C18.9583 17.6 17.1083 19.4583 14.825 19.4583ZM7.89996 3.36667L3.40829 6.86666C2.81663 7.33333 2.29163 8.39166 2.29163 9.14166V15.3167C2.29163 16.9083 3.58329 18.2083 5.17496 18.2083H14.825C16.4166 18.2083 17.7083 16.9167 17.7083 15.325V9.25833C17.7083 8.45833 17.1333 7.35 16.475 6.9L11.325 3.29167C10.375 2.625 8.80829 2.65833 7.89996 3.36667Z" />
                <path d="M10 16.125C9.65833 16.125 9.375 15.8417 9.375 15.5V13C9.375 12.6583 9.65833 12.375 10 12.375C10.3417 12.375 10.625 12.6583 10.625 13V15.5C10.625 15.8417 10.3417 16.125 10 16.125Z" />
              </svg>

              {user?.isAuthenticated ? "dashboard" : "home"}
            </Link>
          </li>
          <li className={pathname === "/profile" ? "active" : ""}>
            <Link
              href={"/profile"}
              onClick={() => {
                dispatch(closeMenu());
              }}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.8521 15.948C14.0036 13.6785 11.8154 12.0626 9.2498 12.0626C6.6842 12.0626 4.49602 13.6785 3.64746 15.948M14.8521 15.948C16.653 14.382 17.7915 12.074 17.7915 9.50009C17.7915 4.78265 13.9672 0.95842 9.2498 0.95842C4.53236 0.95842 0.70813 4.78265 0.70813 9.50009C0.70813 12.074 1.8466 14.382 3.64746 15.948M14.8521 15.948C13.3524 17.2522 11.3933 18.0418 9.2498 18.0418C7.10628 18.0418 5.14718 17.2522 3.64746 15.948M11.8123 6.93759C11.8123 8.35282 10.665 9.50009 9.2498 9.50009C7.83457 9.50009 6.6873 8.35282 6.6873 6.93759C6.6873 5.52236 7.83457 4.37509 9.2498 4.37509C10.665 4.37509 11.8123 5.52236 11.8123 6.93759Z"
                  strokeLinejoin="round"
                />
              </svg>
              profile
            </Link>
          </li>
          <li className={pathname === "/properties" ? "active" : ""}>
            <Link
              href={"/properties"}
              onClick={() => {
                dispatch(closeMenu());
              }}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.5 1.40625C5.02995 1.40625 1.40625 5.02995 1.40625 9.5C1.40625 13.9701 5.02995 17.5938 9.5 17.5938C13.9701 17.5938 17.5938 13.9701 17.5938 9.5C17.5938 5.02995 13.9701 1.40625 9.5 1.40625ZM0.09375 9.5C0.09375 4.30507 4.30507 0.09375 9.5 0.09375C14.6949 0.09375 18.9062 4.30507 18.9062 9.5C18.9062 14.6949 14.6949 18.9062 9.5 18.9062C4.30507 18.9062 0.09375 14.6949 0.09375 9.5Z"
                  fill="#718096"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9624 7.03762L8.26881 8.26881L7.03762 11.9624L10.7312 10.7312L11.9624 7.03762ZM12.6265 5.43276C13.2079 5.23895 13.761 5.79211 13.5672 6.37354L11.8864 11.416C11.8124 11.6381 11.6381 11.8124 11.416 11.8864L6.37354 13.5672C5.79211 13.761 5.23895 13.2079 5.43276 12.6265L7.11359 7.58398C7.18762 7.36189 7.36189 7.18762 7.58398 7.11359L12.6265 5.43276Z"
                  fill="#718096"
                />
              </svg>
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
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.66663 19.75V7.83333C3.66663 7.10398 3.95636 6.40451 4.47208 5.88878C4.98781 5.37306 5.68728 5.08333 6.41663 5.08333H15.5833C16.3126 5.08333 17.0121 5.37306 17.5278 5.88878C18.0436 6.40451 18.3333 7.10398 18.3333 7.83333V13.3333C18.3333 14.0627 18.0436 14.7621 17.5278 15.2779C17.0121 15.7936 16.3126 16.0833 15.5833 16.0833H7.33329L3.66663 19.75Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.33325 8.75H14.6666"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.33325 12.4167H12.8333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
              onClick={() => {
                logOut();
                dispatch(closeMenu());
              }}>
              Logout
            </span>
          ) : (
            <Link
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

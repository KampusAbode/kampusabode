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

function Nav() {
  const pathname = usePathname();
  const { user, logoutUser } = useUserStore((state) => state);
  const { isNavOpen, toggleNav } = useNavStore();
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

  if (loading) return null;

  return (
    <div
      className={`nav-menu ${user ? "sideNav" : "notlogged"} ${
        isNavOpen ? "fadeIn" : "fadeOut"
      }`}>
      <div>
        <div className="close-div" onClick={toggleNav}>
          <div className="logo">
            <Link href="/" onClick={toggleNav}>
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

        {user?.userType === "agent" && (
          <Link href="/apartment/c/upload" className="btn" onClick={toggleNav}>
            upload property
          </Link>
        )}

        {user?.userType === "agent" &&
          user?.id === process.env.NEXT_PUBLIC_ADMIN_ID && (
            <Link href="/admin" className="btn" onClick={toggleNav}>
              Admin Dashboard
            </Link>
          )}

        <ul>
          <li className={pathname === "/apartment" ? "active" : ""}>
            <Link href="/apartment" onClick={toggleNav}>
              <FaSearchLocation />
              properties
            </Link>
          </li>

          {user?.id === process.env.NEXT_PUBLIC_ADMIN_ID && (
            <li className={pathname === "/adminchatroom" ? "active" : ""}>
              <Link href="/adminchatroom" onClick={toggleNav}>
                <GrUserAdmin />
                User Messages
              </Link>
            </li>
          )}

          <li
            className={
              pathname === "/dashboard" || pathname === "/" ? "active" : ""
            }>
            <Link href={user ? "/dashboard" : "/"} onClick={toggleNav}>
              {user ? <CiViewBoard /> : <CiHome />}
              {user ? "dashboard" : "home"}
            </Link>
          </li>

          <li className={pathname === "/profile" ? "active" : ""}>
            <Link href="/profile" onClick={toggleNav}>
              <FaRegUserCircle />
              profile
            </Link>
          </li>

          {user && (
            <li
              className={
                pathname === `/chat/${user.id}/${user.name}` ? "active" : ""
              }>
              <Link href={`/chat/${user.id}/${user.name}`} onClick={toggleNav}>
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
            <button className="btn btn-secondary" onClick={logOut}>
              Logout
            </button>
          ) : (
            <Link href="/auth/login" onClick={toggleNav}>
              <button className="btn btn-secondary">Login</button>
            </Link>
          )}
        </span>
      </div>
    </div>
  );
}

export default Nav;

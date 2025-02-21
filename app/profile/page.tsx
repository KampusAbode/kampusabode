"use client";

import React from "react";
import ProfileOverview from "../components/userdashboard/ProfileOverview";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "./profile.css";
import Link from "next/link";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.userdata);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user?.isAuthenticated
  );
  return (
    <section className="profile-page">
      <div className="container">
        {isAuthenticated ? (
          <>
            <ProfileOverview user={user} />

            <div className="cp">
              <Link href={`/profile/${user.id}`} className="btn">
                edit profile
              </Link>
            </div>
          </>
        ) : (
          <p style={{ marginTop: "1rem" }}>
            Login to access your profile page. <br />
            <Link
              className="btn"
              style={{ marginTop: "1rem" }}
              href={"/auth/login"}>
              login
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;

"use client";

import React from "react";
import ProfileOverview from "../components/userdashboard/ProfileOverview";
import "./profile.css";
import Link from "next/link";
import { useUserStore } from "../store/userStore";

const ProfilePage = () => {
  const {user} = useUserStore((state) => state);


  return (
    <section className="profile-page">
      <div className="container">
        {user ? (
          <>
            <ProfileOverview  />

            <div className="cp">
              <Link href={`/profile/@${user.name}`} className="btn">
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

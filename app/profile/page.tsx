"use client";

import React from "react";
import ProfileOverview from "../components/userdashboard/ProfileOverview";
import "./profile.css";
import Link from "next/link";
import { useUserStore } from "../store/userStore";
import { useRequireUser } from "../hooks/useRequireUser";
import Loader from "../components/loader/Loader";

const ProfilePage = () => {
  const { user } = useUserStore((state) => state);
  const { authenticated, checking } = useRequireUser();

  if (checking) {
    return <Loader />;
  }
  if (!authenticated) {
    return (
      <section className="profile-page">
        <div className="container">
          <h4 className="page-heading">Profile</h4>
          <p>Please log in to access your profile page.</p>
          <Link href="/auth/login">Log in</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="container">
        <ProfileOverview />

        <div className="cp">
          <Link href={`/profile/@${user.name}`} className="btn">
            edit profile
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;

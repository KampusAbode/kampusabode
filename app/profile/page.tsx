'use client'

import React from "react";
import ProfileOverview from "../components/userdashboard/ProfileOverview";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "./profile.css";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.userdata);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return (
    <section className="profile-page">
      <div className="container">
        <h2>Profile</h2>
        {isAuthenticated ? (
          <>
            <ProfileOverview user={user} />

            <div className="cp">
              <div className="btn">create profile</div>
            </div>
          </>
        ) : (
          <p>login to access your profile page</p>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;

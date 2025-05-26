"use client";

import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  getAuth,
  User as FirebaseUser,
} from "firebase/auth";
import ProfileOverview from "../components/userdashboard/ProfileOverview";
import "./profile.css";
import Link from "next/link";
import { useUserStore } from "../store/userStore";

const ProfilePage = () => {
  const { user } = useUserStore((state) => state);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setFirebaseUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user || !firebaseUser) {
    return (
      <section className="profile-page">
        <div className="container">
          <h4 className="page-heading">Profile</h4>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p>Please log in to access your profile.</p>
            <Link href="/auth/login" style={{ textDecoration: "underline" }}>
              Log in
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="container">
        <ProfileOverview userdata={firebaseUser} />

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

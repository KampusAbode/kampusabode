"use client";

import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  getAuth,
  User as FirebaseUser,
  sendEmailVerification,
} from "firebase/auth";
import ProfileOverview from "../components/userdashboard/ProfileOverview";
import "./profile.css";
import Link from "next/link";
import { useUserStore } from "../store/userStore";
import { MdErrorOutline, MdVerified } from "react-icons/md";

const ProfilePage = () => {
  const { user } = useUserStore((state) => state);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setFirebaseUser(authUser);
      setVerificationSent(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const handleResendVerification = async () => {
    if (!firebaseUser) return;
    setSendingVerification(true);
    setError(null);

    const actionCodeSettings = {
  url: "https://kampusabode.com/profile",
  handleCodeInApp: true,
  dynamicLinkDomain: "www.kampusabode.com",
};
    

    try {
      await sendEmailVerification(firebaseUser, actionCodeSettings);
      setVerificationSent(true);
    } catch (err) {
      setError("Failed to send verification email. Please try again later.");
    } finally {
      setSendingVerification(false);
    }
  };

  if (!user || !firebaseUser) {
    return (
      <section className="profile-page">
        <div className="container">
          <h4 className="page-heading">Profile</h4>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p>Please log in to access your profile.</p>
            <Link
              prefetch
              href="/auth/login"
              style={{ textDecoration: "underline" }}>
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

        <div className="email-status">
          {!firebaseUser.emailVerified && (
            <div style={{ marginTop: "8px" }}>
              <button
                onClick={handleResendVerification}
                disabled={sendingVerification}
                className="btn btn-secondary">
                {sendingVerification
                  ? "Sending..."
                  : "Resend Verification Email"}
              </button>
              {verificationSent && (
                <p style={{ color: "#27ae60", marginTop: "8px" }}>
                  Verification email sent! Please check your inbox.
                </p>
              )}
              {error && (
                <p style={{ color: "#e74c3c", marginTop: "8px" }}>{error}</p>
              )}
            </div>
          )}
        </div>

        <div className="cp">
          <Link prefetch href={`/profile/${user.name}`} className="btn">
            edit profile
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;

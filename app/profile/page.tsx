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
import { Button, ButtonLink } from "../components/button/Button";

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

          <div className="profile-login-prompt">
            <p>Please log in to access your profile.</p>
            <Link
              prefetch
              href="/auth/login"
              className="profile-login-link">
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
            <div className="email-status__actions">
              <Button
                variant="secondary"
                size="md"
                onClick={handleResendVerification}
                disabled={sendingVerification}>
                {sendingVerification
                  ? "Sending..."
                  : "Resend Verification Email"}
              </Button>
              {verificationSent && (
                <p className="email-status__success">
                  Verification email sent! Please check your inbox.
                </p>
              )}
              {error && (
                <p className="email-status__error">{error}</p>
              )}
            </div>
          )}
        </div>

        <div className="cp">
          <ButtonLink
            prefetch
            href={`/profile/${user.name}`}
            variant="primary"
            size="md">
            edit profile
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;

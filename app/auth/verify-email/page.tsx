"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ButtonLink } from "../../components/button/Button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [gmailLink, setGmailLink] = useState(
    "https://mail.google.com/mail/u/0/#inbox"
  );

  useEffect(() => {
    // Platform detection for Gmail app link
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      setGmailLink(
        "intent://#Intent;package=com.google.android.gm;scheme=mailto;end"
      );
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window)) {
      setGmailLink("googlegmail://");
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const checkVerification = async (user: User) => {
      await user.reload();
      if (user.emailVerified) {
        router.push("/auth/login");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkVerification(user);

        intervalId = setInterval(() => {
          checkVerification(user);
        }, 5000);
      }
    });

    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  return (
    <div className="verify-email">
      <h2>📩 Check your email</h2>
      <p>
        We’ve sent a verification link to your email. Please check your inbox
        and click the link to verify your account.
      </p>

      <ButtonLink
        href={gmailLink}
        target="_blank"
        rel="noopener noreferrer"
        className="open-gmail-btn"
        variant="primary"
        size="md">
        Open Gmail App
      </ButtonLink>
    </div>
  );
}

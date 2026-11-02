// app/auth/forgot-password/page.tsx

"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import { Button } from "../../components/button/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="forgot-password">
      <div className="container">
        <h4>Forgot Password</h4>
        {sent ? (
          <p className="forgot-password__sent">
            ✅ A reset link has been sent to your email.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" size="md">
              Send Reset Link
            </Button>
          </form>
        )}
        {error && <p className="forgot-password__error">{error}</p>}
      </div>
    </div>
  );
}

// app/auth/forgot-password/page.tsx

"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";

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
    <div
      className="forgot-password"
      style={{ marginTop: "5rem", textAlign: "center" }}>
      <div className="container" style={{ marginTop: "8rem" }}>
        <h4 style={{ marginBlock: "2rem" }}>Forgot Password</h4>
        {sent ? (
          <p style={{ marginTop: "4rem" }}>
            ✅ A reset link has been sent to your email.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyItems: "center",
              alignItems: "center",
              maxWidth: "900px",
            }}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBlock: "3rem" }}
            />
            <button
              type="submit"
              className="btn"
              style={{ width: "fit-content" }}>
              Send Reset Link
            </button>
          </form>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

import * as React from "react";

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
    <div
      style={{
        backgroundColor: "#4F46E5",
        padding: "20px",
        textAlign: "center",
      }}>
      <h1 style={{ color: "white", margin: 0 }}>Welcome to Kampus Abode</h1>
    </div>
    <div style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
      <p style={{ fontSize: "16px", color: "#374151" }}>Hi {userName},</p>
      <p style={{ fontSize: "16px", color: "#374151" }}>
        Welcome to Kampus Abode! We're excited to help you find your perfect
        accommodation, discover essential information, and access our student
        marketplace.
      </p>
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href="https://kampusabode.com/apartment"
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "6px",
            display: "inline-block",
          }}>
          Browse Accommodations
        </a>
      </div>
      <p style={{ fontSize: "14px", color: "#6B7280" }}>
        Best regards,
        <br />
        The Kampus Abode Team
      </p>
    </div>
  </div>
);

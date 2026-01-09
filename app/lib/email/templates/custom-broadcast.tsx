import * as React from "react";

interface CustomBroadcastEmailProps {
  subject: string;
  content: string;
  recipientName?: string;
}

export const CustomBroadcastEmail: React.FC<CustomBroadcastEmailProps> = ({
  subject,
  content,
  recipientName,
}) => (
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
      <h1 style={{ color: "white", margin: 0 }}>Kampus Abode</h1>
    </div>
    <div style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
      {recipientName && (
        <p style={{ fontSize: "16px", color: "#374151" }}>
          Hi {recipientName},
        </p>
      )}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "15px",
          whiteSpace: "pre-wrap",
          color: "#374151",
          lineHeight: "1.6",
        }}>
        {content}
      </div>
      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #E5E7EB",
        }}>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: "5px 0" }}>
          Best regards,
          <br />
          The Kampus Abode Team
        </p>
        <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "15px" }}>
          You received this email because you're a member of Kampus Abode.
        </p>
      </div>
    </div>
  </div>
);

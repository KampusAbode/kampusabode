interface PropertyInquiryEmailProps {
  userName: string;
  userEmail: string;
  propertyTitle: string;
  message: string;
}

export const PropertyInquiryEmail: React.FC<PropertyInquiryEmailProps> = ({
  userName,
  userEmail,
  propertyTitle,
  message,
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
      <h1 style={{ color: "white", margin: 0 }}>New Property Inquiry</h1>
    </div>
    <div style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
      <h2 style={{ color: "#111827", fontSize: "20px" }}>
        Property: {propertyTitle}
      </h2>
      <div
        style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "6px",
          marginTop: "15px",
        }}>
        <p style={{ margin: "5px 0", color: "#374151" }}>
          <strong>From:</strong> {userName}
        </p>
        <p style={{ margin: "5px 0", color: "#374151" }}>
          <strong>Email:</strong> {userEmail}
        </p>
        <p style={{ margin: "15px 0 5px 0", color: "#374151" }}>
          <strong>Message:</strong>
        </p>
        <p style={{ color: "#6B7280", whiteSpace: "pre-wrap" }}>{message}</p>
      </div>
    </div>
  </div>
);

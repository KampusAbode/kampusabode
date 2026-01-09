interface TeamNotificationEmailProps {
  subject: string;
  content: string;
  metadata?: Record<string, any>;
}

export const TeamNotificationEmail: React.FC<TeamNotificationEmailProps> = ({
  subject,
  content,
  metadata,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
    <div
      style={{
        backgroundColor: "#DC2626",
        padding: "20px",
        textAlign: "center",
      }}>
      <h1 style={{ color: "white", margin: 0 }}>Team Notification</h1>
    </div>
    <div style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
      <h2 style={{ color: "#111827", fontSize: "20px" }}>{subject}</h2>
      <div
        style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "6px",
          marginTop: "15px",
        }}>
        <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>{content}</p>
        {metadata && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #E5E7EB",
              paddingTop: "15px",
            }}>
            <strong style={{ color: "#111827" }}>Additional Details:</strong>
            <pre
              style={{
                backgroundColor: "#F3F4F6",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}>
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  </div>
);

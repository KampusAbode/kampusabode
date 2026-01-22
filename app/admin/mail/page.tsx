"use client";

import { useState, useMemo } from "react";
import { useUsersStore } from "../../store/usersStore";
import { UserType } from "../../fetch/types";
import "./mail.css"
import toast from "react-hot-toast";

export default function AdminMailPage() {
  const { users } = useUsersStore();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleUserToggle = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === filteredUsers.length);
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in both subject and content");
      return;
    }

    if (selectedUsers.size === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    const confirmed = confirm(
      `Send email to ${selectedUsers.size} user(s)?\n\nSubject: ${subject}`
    );
    if (!confirmed) return;

    setSending(true);
    setResult(null);

    try {
      const recipients = Array.from(selectedUsers)
        .map((id) => users.find((u) => u.id === id))
        .filter((u): u is UserType => !!u?.email)
        .map((u) => u.email!);

      const recipientNames = Array.from(selectedUsers).reduce(
        (acc, id) => {
          const user = users.find((u) => u.id === id);
          if (user?.email && user?.name) {
            acc[user.email] = user.name;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "broadcast",
          data: { recipients, subject, content, recipientNames },
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(
          `Email sent successfully!\n\nSuccessful: ${data.results.successful}\nFailed: ${data.results.failed}`
        );
        setSubject("");
        setContent("");
        setSelectedUsers(new Set());
        setSelectAll(false);
      } else {
        toast.error("Failed to send emails. Check console for details.");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("An error occurred while sending emails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-mail">
      <div className="mail-header">
        <h2>Send Email to Users</h2>
        <p>
          Compose and send custom emails to selected users or all users at once.
        </p>
      </div>

      <div className="mail-compose">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={sending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Message</label>
          <textarea
            id="content"
            placeholder="Enter your message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            disabled={sending}
          />
        </div>
      </div>

      <div className="mail-recipients">
        <div className="recipients-header">
          <h3>Select Recipients ({selectedUsers.size} selected)</h3>
          <div className="recipients-actions">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSelectAll} className="btn-secondary">
              {selectAll ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        <div className="recipients-list">
          {filteredUsers.length === 0 ? (
            <p className="no-users">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="recipient-item">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                  disabled={sending}
                />
                <label htmlFor={`user-${user.id}`}>
                  <div className="user-info">
                    <span className="user-name">{user.name || "Unknown"}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mail-actions">
        <button
          onClick={handleSendEmail}
          disabled={sending || selectedUsers.size === 0}
          className="btn-primary">
          {sending ? "Sending..." : `Send to ${selectedUsers.size} User(s)`}
        </button>
      </div>

      {result && (
        <div className={`mail-result ${result.success ? "success" : "error"}`}>
          <h4>{result.success ? "✓ Success" : "✗ Error"}</h4>
          {result.results && (
            <p>
              Total: {result.results.total} | Successful:{" "}
              {result.results.successful} | Failed: {result.results.failed}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

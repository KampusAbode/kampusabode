"use client";

import { useState, useEffect } from "react";
import { assignUserRole, checkIsWriter } from "../../utils";
import { UserType, StudentUserInfo } from "../../fetch/types";
import Image from "next/image";
import { useUserStore } from "../../store/userStore";
import Prompt from "../../components/modals/prompt/Prompt";
import { useUsersStore } from "../../store/usersStore";
import toast from "react-hot-toast";

const WritersManagement = () => {
  const { users } = useUsersStore();
  const [writers, setWriters] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});
  const user = useUserStore((state) => state.user);

  // Filter for search
  const filterUsers = (users: UserType[]) =>
    users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Show confirmation prompt
  const showPrompt = (message: string, confirmCallback: () => void) => {
    setPromptMessage(message);
    setOnConfirmAction(() => confirmCallback);
    setPromptOpen(true);
  };

  // Load writers
  useEffect(() => {
    const loadWriters = async () => {
      const writerUsers: UserType[] = [];

      for (const u of users) {
        if (u.userType === "student") {
          const isWriter = await checkIsWriter(u.id);
          if (isWriter) {
            writerUsers.push(u);
          }
        }
      }

      setWriters(writerUsers);
    };

    if (users.length > 0) loadWriters();
  }, [users]);

  // Toggle writer role
  const toggleWriterRole = async (student: UserType) => {
    try {
      const isWriter = await checkIsWriter(student.id);

      if (isWriter) {
        // remove writer role
        await assignUserRole(student.name, student.id, "writer", user.name);
        toast.success(`${student.name} is no longer a writer`);
        setWriters((prev) => prev.filter((w) => w.id !== student.id));
      } else {
        // add writer role
        await assignUserRole(student.name, student.id, "writer", user.name);
        toast.success(`${student.name} is now a writer`);
        setWriters((prev) => [...prev, student]);
      }
    } catch (error) {
      toast.error("Failed to toggle writer role");
      console.error("Error toggling writer role:", error);
    }
  };

  return (
    <div className="writers-management">
      {/* Prompt Modal */}
      <Prompt
        message={promptMessage}
        isOpen={promptOpen}
        onCancel={() => setPromptOpen(false)}
        onConfirm={() => {
          onConfirmAction();
          setPromptOpen(false);
        }}
      />

      {/* Search Bar */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{width: "100%"}}
        />
      </div>

      {/* Writers List */}
      <h6>Writers ({writers.length})</h6>
      {writers.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "8rem" }}>
          No writers found.
        </p>
      ) : (
        <ul>
          {filterUsers(writers).map((writer) => {
            const writerInfo = writer.userInfo as StudentUserInfo;
            return (
              <li key={writer.id}>
                <div>
                  <div className="pic">
                    <Image
                      priority
                      src={writer.avatar || "/assets/user_avatar.jpg"}
                      width={1000}
                      height={1000}
                      alt={`${writer.name}`}
                    />
                  </div>
                  <div className="details">
                    <span>
                      <strong>{writer.name}</strong>
                    </span>
                    <span>ID: {writer.id}</span>
                    <span>Email: {writer.email}</span>
                    <span>University: {writer.university}</span>
                    <span>Dept: {writerInfo.department}</span>
                    <span>Views: {writerInfo.viewedProperties.length}</span>
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() =>
                      showPrompt(
                        `Are you sure you want to ${
                          writers.find((w) => w.id === writer.id)
                            ? "remove"
                            : "add"
                        } ${writer.name} as writer?`,
                        () => toggleWriterRole(writer)
                      )
                    }>
                    {writers.find((w) => w.id === writer.id)
                      ? "Remove Writer"
                      : "Add Writer"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WritersManagement;

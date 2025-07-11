"use client";

import { useState, useEffect } from "react";
import {
  assignUserRole,
  checkIsAdmin,
  checkIsWriter,
  getUserRole,
} from "../../utils";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";
import Image from "next/image";
import { useUserStore } from "../../store/userStore";
import Link from "next/link";
import Prompt from "../modals/prompt/Prompt";
import { useUsersStore } from "../../store/usersStore";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { users } = useUsersStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});
  const user = useUserStore((state) => state.user);



  const filterUsers = (users: UserType[]) =>
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const showPrompt = (message: string, confirmCallback: () => void) => {
    setPromptMessage(message);
    setOnConfirmAction(() => confirmCallback);
    setPromptOpen(true);
  };

  const assignRole = async (
    username: string,
    userId: string,
    role: "admin" | "writer",
    assignedBy: string
  ) => {
    try {
      await assignUserRole(username, userId, role, assignedBy);
      toast.success(`Successfully assigned ${role} role to ${username}`);
      console.log(`Successfully assigned ${role} role to user ${userId}`);
    } catch (error) {
      toast.error(`Failed to assign ${role} role to ${username}`);
      console.error(`Error assigning ${role} role to user ${userId}:`, error);
    }
  };

  const fetchWriter = async (student) => {
    const isWriter = await checkIsWriter(student?.id);
    // console.log(`${student?.name} is Writer:`, isWriter);
    return isWriter;
  };
  const fetchAdmin = async (student) => {
    const isAdmin = await checkIsAdmin(student?.id);
    // console.log(`${student?.name} is Admin:`, isAdmin);
    return isAdmin;
  };

  return (
    <div className="user-management">
      <Prompt
        message={promptMessage}
        isOpen={promptOpen}
        onCancel={() => setPromptOpen(false)}
        onConfirm={() => {
          onConfirmAction();
          setPromptOpen(false);
        }}
      />

      <div className="input-box">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h6>
        Students{" "}
        {`(${users.filter((user) => user.userType === "student").length})`}
      </h6>
      {users.filter((user) => user.userType === "student").length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No students found.
        </p>
      ) : (
        <ul>
          {filterUsers(users.filter((user) => user.userType === "student")).map(
            (student) => {
              const studentInfo = student.userInfo as StudentUserInfo;
              // Fetch roles for the student
              return (
                <li key={student.id}>
                  <div>
                    <div className="pic">
                      <Image
                        src={student.avatar || "/assets/user_avatar.jpg"}
                        width={1500}
                        height={1500}
                        alt={`${student.name}`}
                      />
                    </div>
                    <div className="details">
                      <span>
                        <strong>{student.name}</strong>
                      </span>
                      <span>Email: {student.email}</span>
                      <span>University: {student.university}</span>
                      <span>Dept: {studentInfo.department}</span>
                      <span>Year: {studentInfo.currentYear}</span>
                      <span>Views: {studentInfo.viewedProperties.length}</span>
                    </div>
                  </div>
                  {/* <div className="actions">
                  <Link
                    href={`/adminchatroom/${student.name}/${student.id}`}
                    className="action-btn"
                    title="Chat with user">
                    Chat
                  </Link>

                  <button
                    className={`action-btn`}
                    type="button"
                    onClick={() =>
                      showPrompt(
                        `Are you sure you want to add ${student.name} as admin?`,
                        () => assignRole(student.name, student.id, "admin", user.name)
                      )
                    }>
                    {fetchAdmin(student.id) ? "Remove" : "Add"} as admin
                  </button>

                  <button
                    className={`action-btn`}
                    type="button"
                    onClick={() =>
                      showPrompt(
                        `Are you sure you want to add ${student.name} as writer?`,
                        () => assignRole(student.name, student.id, "writer", user.name)
                      )
                    }>
                    {fetchWriter(student.id) ? "Remove" : "Add"} as writer
                  </button>
                </div> */}
                </li>
              );
            }
          )}
        </ul>
      )}

      <h6>
        Agents {`(${users.filter((user) => user.userType === "agent").length})`}
      </h6>
      {users.filter((user) => user.userType === "agent").length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <ul>
          {filterUsers(users.filter((user) => user.userType === "agent")).map(
            (agent) => {
              const agentInfo = agent.userInfo as AgentUserInfo;
              return (
                <li key={agent.id}>
                  <div>
                    <div className="pic">
                      <Image
                        src={agent.avatar || "/assets/user_avatar.jpg"}
                        width={1500}
                        height={1500}
                        alt={`${agent.name}`}
                      />
                    </div>
                    <div className="details">
                      <span>
                        <strong>{agent.name}</strong>
                      </span>
                      <span>Email: {agent.email}</span>
                      <span>University: {agent.university}</span>
                    </div>
                  </div>
                  {/* <div className="actions">
                  <Link
                    href={`/adminchatroom/${agent.name}/${agent.id}`}
                    className="action-btn"
                    title="Chat with user">
                    Chat
                  </Link>

                  <button
                    className={`action-btn`}
                    type="button"
                    onClick={() =>
                      showPrompt(
                        `Are you sure you want to add ${agent.name} as admin?`,
                        () => assignRole(agent.name, agent.id, "admin", user.name)
                      )
                    }>
                    {fetchAdmin(agent.id) ? "Remove" : "Add"} as admin
                  </button>

                  <button
                    className={`action-btn`}
                    type="button"
                    onClick={() =>
                      showPrompt(
                        `Are you sure you want to add ${agent.name} as writer?`,
                        () => assignRole(agent.name, agent.id, "writer", user.name)
                      )
                    }>
                    {fetchWriter(agent.id) ? "Remove" : "Add"} as writer
                  </button>
                </div> */}
                </li>
              );
            }
          )}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;

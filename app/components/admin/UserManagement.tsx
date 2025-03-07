"use client";

import { useState, useEffect } from "react";
import { fetchAllUsers } from "../../utils";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";

const UserManagement = () => {
  const [students, setStudents] = useState<UserType[]>([]);
  const [agents, setAgents] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();

        // Filter users based on userType
        const studentUsers = allUsers.filter(
          (user) => user.userType === "student"
        );
        const agentUsers = allUsers.filter((user) => user.userType === "agent");

        setStudents(studentUsers);
        setAgents(agentUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to filter users based on search query
  const filterUsers = (users: UserType[]) => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="user-management">
      <h3>User Management</h3>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Students Section */}
      <h5>Students</h5>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {filterUsers(students).map((student) => {
            const studentInfo = student.userInfo as StudentUserInfo;
            return (
              <li key={student.id}>
                <strong>{student.name}</strong> - {student.email} <br />
                <em>{student.university}</em> | Dept: {studentInfo.department} |
                Year: {studentInfo.currentYear}
              </li>
            );
          })}
        </ul>
      )}

      {/* Agents Section */}
      <h5>Agents</h5>
      {agents.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <ul>
          {filterUsers(agents).map((agent) => {
            const agentInfo = agent.userInfo as AgentUserInfo;
            return (
              <li key={agent.id}>
                <strong>{agent.name}</strong> - {agent.email} <br />
                <em>{agent.university}</em> | Agency: {agentInfo.agencyName}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;

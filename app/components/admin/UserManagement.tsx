"use client";

import { useState, useEffect } from "react";
import { fetchAllUsers } from "../../utils";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";
import Image from "next/image";

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
      {/* Search Input */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Students Section */}
      <h6>Students {`(${students.length})`}</h6>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {filterUsers(students).map((student) => {
            const studentInfo = student.userInfo as StudentUserInfo;
            return (
              <li key={student.id}>
                <div className="pic">
                  <Image
                    src={student.avatar}
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
              </li>
            );
          })}
        </ul>
      )}

      {/* Agents Section */}
      <h6>Agents {`(${agents.length})`}</h6>
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

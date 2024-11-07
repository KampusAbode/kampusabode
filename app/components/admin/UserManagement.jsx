"use client";

import { useState, useEffect } from "react";
import { fetchStudents, fetchAgents } from "../../utils/api";

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const studentData = await fetchStudents();
        const agentData = await fetchAgents();
        setStudents(studentData);
        setAgents(agentData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-management">
      <h3>User Management</h3>
      <h4>Students</h4>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.email}
          </li>
        ))}
      </ul>
      <h4>Agents</h4>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>
            {agent.name} - {agent.email}
          </li>
        ))}
      </ul>
      {/* Add functionality to add/edit users */}
    </div>
  );
};

export default UserManagement;

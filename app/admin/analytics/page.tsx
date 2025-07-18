"use client";

import { useEffect, useState } from "react";
import { useUsersStore } from "../../store/usersStore";
import { usePropertiesStore } from "../../store/propertiesStore";
// import { fetchAnalytics } from "../../utils";


const Analytics = () => {
  const { users } = useUsersStore();
  const { allProperties } = usePropertiesStore();
  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "5rem" }}>
        Loading analytics...
      </p>
    );

  return (
    <div className="analytics">
      <ul>
        <li>
          <p>{users?.length}</p>
          <span>Total Users</span>
        </li>
        <li>
          <p>{allProperties?.length}</p>
          <span>Total Linstings </span>
        </li>
        <li>
          <p>{users.filter((user) => user.userType === "agent").length}</p>
          <span>Total Agents</span>
        </li>
        <li>
          <p>{users.filter((user) => user.userType === "student").length}</p>
          <span>Total Students </span>
        </li>
      </ul>
    </div>
  );
};

export default Analytics;

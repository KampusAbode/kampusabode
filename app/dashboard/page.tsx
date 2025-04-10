"use client";
import React from "react";
import StudentDashboard from "../components/userdashboard/StudentDashboard";
import AgentDashboard from "../components/userdashboard/AgentDashboard";
import { UserType } from "../fetch/types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Image from "next/image";
import "./dashboard.css";
import Loader from "../components/loader/Loader";

const Dashboard = () => {
  const userData = useSelector((state: RootState) => state.userdata);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user?.isAuthenticated
  );

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ marginTop: "16px" }}>
        User not found
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container" style={{ marginTop: "16px" }}>
        <Loader/>
      </div>
    );
  }

  const userRole = userData.userType;

  return (
    <section className="dashboard">
      <div className="container">
        <div className="welcome">
          <Image
            priority
            src={"/assets/person3.jpg"}
            width={800}
            height={800}
            alt="profile picture"
          />
          <h5>Hi, {userData.name} 👋</h5>
        </div>

        {userRole === "student" ? (
          <StudentDashboard user={userData as UserType} />
        ) : userRole === "agent" ? (
          <AgentDashboard user={userData as UserType} />
        ) : (
          <div>Unknown user role</div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;

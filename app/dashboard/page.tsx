"use client";
import React from "react";
import StudentDashboard from "../components/userdashboard/StudentDashboard";
import AgentDashboard from "../components/userdashboard/AgentDashboard";
import { UserType } from "../fetch/types";
import Image from "next/image";
import "./dashboard.css";
import Loader from "../components/loader/Loader";
import { useUserStore } from "../store/userStore";

const Dashboard = () => {
  const {user} = useUserStore((state) => state);

  if (!user) {
    return (
      <div className="container" style={{ marginTop: "5rem" }}>
        User not found
      </div>
    );
  }



  return (
    <section className="dashboard">
      <div className="container">
        <div className="welcome">
          <Image
            priority
            src={user?.avatar || "/assets/user_avatar.jpg"}
            width={400}
            height={400}
            alt="profile picture"
          />
          <h5>Hi, {user.name} 👋</h5>
        </div>

        {user.userType === "student" ? (
          <StudentDashboard user={user as UserType} />
        ) : user.userType === "agent" ? (
          <AgentDashboard user={user as UserType} />
        ) : (
          <div>Unknown user role</div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;

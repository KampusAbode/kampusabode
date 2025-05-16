"use client";
import React from "react";
import StudentDashboard from "../components/userdashboard/StudentDashboard";
import AgentDashboard from "../components/userdashboard/AgentDashboard";
import { UserType } from "../fetch/types";
import Image from "next/image";
import "./dashboard.css";
import Loader from "../components/loader/Loader";
import { useUserStore } from "../store/userStore";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useUserStore((state) => state);



  if (!user) {
    return (
      <section className="dashboard">
        <div className="container">
          <h4 className="page-heading">Dashboard</h4>
         
          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p>Please log in to access your dashboard.</p>
            <Link href="/auth/login" style={{textDecoration: "underline"}}>Log in</Link>
          </div>
        </div>
      </section>
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
          <h5>Hi, {user?.name} 👋</h5>
        </div>

        {user?.userType === "student" ? (
          <StudentDashboard user={user as UserType} />
        ) : user?.userType === "agent" ? (
          <AgentDashboard user={user as UserType} />
        ) : (
          <div>Unknown user role</div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;

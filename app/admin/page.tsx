"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";

import Loader from "../components/loader/Loader";
import UserManagement from "../components/admin/UserManagement";
import PropertyManagement from "../components/admin/PropertyManagement";
import ReviewManagement from "../components/admin/ReviewManagement";
import Analytics from "../components/admin/Analytics";
import Notifications from "../components/admin/Notifications";
import AgentList from "../components/admin/AgentList";
import Trends from "../components/admin/TrendManagement";

import { checkIsAdmin } from "../utils";
import { useUserStore } from "../store/userStore";
import "./admin.css";
import { useUsersStore } from "../store/usersStore";

const pages = [
  "users",
  "properties",
  "reviews",
  "analytics",
  "notifications",
  "agents",
  "trends",
];

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = searchParams.get("page") || "users";
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  useEffect(() => {
    router.push(`/admin?page=${currentPage}`);
  }, [currentPage, router]);

  return (
    <section className="admin-dashboard">
        <section className="dashboard-content">
          {currentPage === "users" && <UserManagement />}
        </section>
    </section>
  );
}

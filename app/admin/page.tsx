"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../components/loader/Loader";
import UserManagement from "../components/admin/UserManagement";
import PropertyManagement from "../components/admin/PropertyManagement";
import ReviewManagement from "../components/admin/ReviewManagement";
import Analytics from "../components/admin/Analytics";
import Notifications from "../components/admin/Notifications";
import AgentList from "../components/admin/AgentList";
import { checkIsAdmin } from "../utils";
import "./admin.css";
import { useUserStore } from "../store/userStore";
import { useUsersStore } from "../store/usersStore";
import Trends from "../components/admin/TrendManagement";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useUserStore((state) => state);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function checkUserPermissions(userId: string) {
      try {
        const admin = await checkIsAdmin(userId);

        if (admin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to check user permissions:", error);
      }
    }
    checkUserPermissions(user?.id);

    // Redirect away if not admin
    if (isAdmin) {
      router.push("/apartment");
      return;
    }

    setLoading(false);
  }, []);

  // Whenever currentPage changes, update the URL query parameter
  useEffect(() => {
    router.push(`/admin?page=${currentPage}`);
  }, [currentPage, router]);

  if (loading) return <Loader />;
  if (!isAdmin) return null;

  return (
    <section className="admin-dashboard">
      <div className="container">
        <h4>Admin Dashboard</h4>
        <nav className="dashboard-navigation">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "active" : ""}>
              {page}
            </button>
          ))}
        </nav>
        <section className="dashboard-content">
          {currentPage === "users" && <UserManagement />}
          {currentPage === "properties" && <PropertyManagement />}
          {currentPage === "reviews" && <ReviewManagement />}
          {currentPage === "analytics" && <Analytics />}
          {currentPage === "notifications" && <Notifications />}
          {currentPage === "agents" && <AgentList />}
          {currentPage === "trends" && <Trends />}
        </section>
      </div>
    </section>
  );
}

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useUserStore((state) => state);
  const { setUsers } = useUsersStore((state) => state);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function checkUserPermissions(userId: string) {
      try {
        const admin = await checkIsAdmin(userId);
        if (admin) setIsAdmin(true);
      } catch (error) {
        console.error("Failed to check user permissions:", error);
      }
    }

    checkUserPermissions(user?.id);

    if (!isAdmin) {
      router.push("/apartment");
      return;
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = setUsers();

    return () => {
      if (unsubscribe) unsubscribe(); 
    };
  }, []);
  
  
  

  useEffect(() => {
    router.push(`/admin?page=${currentPage}`);
  }, [currentPage, router]);

  // Swipe logic
  const currentIndex = pages.indexOf(currentPage);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < pages.length - 1) {
        setCurrentPage(pages[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentPage(pages[currentIndex - 1]);
      }
    },
    trackMouse: true,
  });

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

        <section className="dashboard-content" {...swipeHandlers}>
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

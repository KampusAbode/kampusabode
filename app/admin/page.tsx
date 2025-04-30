"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../components/loader/Loader";
import UserManagement from "../components/admin/UserManagement";
import PropertyManagement from "../components/admin/PropertyManagement";
import ReviewManagement from "../components/admin/ReviewManagement";
import Analytics from "../components/admin/Analytics";
import Notifications from "../components/admin/Notifications";
import { checkIsAdmin } from "../utils/user";
import "./admin.css";
import { useUserStore } from "../store/userStore";

const pages = ["users", "properties", "reviews", "analytics", "notifications"];

const AdminPage = () => {
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

    if (checkIsAdmin(user.id)) {
      setIsAdmin(true);
    } else {
      router.push("/apartment");
    }

    setLoading(false);
  }, [router]);

  // Whenever currentPage changes, update the URL query parameter
  useEffect(() => {
    router.push(`/admin?page=${currentPage}`);
  }, [currentPage, router]);

  if (loading) return <Loader />;
  if (!isAdmin) return null;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h4>Admin Dashboard</h4>
        <nav className="dashboard-navigation">
          {pages.map((page) => (
            <button
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "active" : ""}>
              {page}
            </button>
          ))}
        </nav>
        <main className="dashboard-content">
          {currentPage === "users" && <UserManagement />}
          {currentPage === "properties" && <PropertyManagement />}
          {currentPage === "reviews" && <ReviewManagement />}
          {currentPage === "analytics" && <Analytics />}
          {currentPage === "notifications" && <Notifications />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

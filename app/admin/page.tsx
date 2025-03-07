"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import Loader from "../components/loader/Loader";
import UserManagement from "../components/admin/UserManagement";
import PropertyManagement from "../components/admin/PropertyManagement";
import ReviewManagement from "../components/admin/ReviewManagement";
import Analytics from "../components/admin/Analytics";
import Notifications from "../components/admin/Notifications";
import "./admin.css";
import { UserType } from "../fetch/types";

const getStoredUserData = () => {
  try {
    const encryptedData = localStorage.getItem(
      process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY!
    );
    if (!encryptedData) return null;

    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.NEXT_PUBLIC__ENCSECRET_KEY!
    ).toString(CryptoJS.enc.Utf8);

    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
};

const pages = ["users", "properties", "reviews", "analytics", "notifications"];

const AdminPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = searchParams.get("page") || "users";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData: UserType = getStoredUserData();
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    if (userData.id === process.env.NEXT_PUBLIC_ADMINS) {
      setIsAdmin(true);
    } else {
      router.push("/properties");
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

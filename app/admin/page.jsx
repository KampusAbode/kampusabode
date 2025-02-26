"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
// import Sidebar from "../components/admin/Sidebar";
import Loader from "../components/loader/Loader";
import UserManagement from "../components/admin/UserManagement";
import PropertyManagement from "../components/admin/PropertyManagement";
import ReviewManagement from "../components/admin/ReviewManagement";
import Analytics from "../components/admin/Analytics";
import Notifications from "../components/admin/Notifications";
import './admin.css';

const AdminPage = () => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('')
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const checkAdmin = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (
        userSnap.exists()
      ) {
        setIsAdmin(true);
      } else {
        router.push("/properties");
      }
    };

    checkAdmin();
  }, [user, router]);

  if (loading) return <Loader />;
  if (!isAdmin) return null;

  return (
    <div className="admin-dashboard">
      <div className="container">
          <h4>Admin Dashboard</h4>
        <nav className="dashboard-navigation">
          {/* <button onClick={() => setCurrentPage("dashboard")}>Dashboard</button> */}
          <button onClick={() => setCurrentPage("users")}>Users</button>
          <button onClick={() => setCurrentPage("properties")}>
            Properties
          </button>
          <button onClick={() => setCurrentPage("reviews")}>
            User Reviews
          </button>
          <button onClick={() => setCurrentPage("analytics")}>Analytics</button>
          <button onClick={() => setCurrentPage("notifications")}>
            Notifications
          </button>
        </nav>
        <main className="dashboard-content">
          {currentPage === "dashboard" && <h3>Welcome to Admin Dashboard</h3>}
          {currentPage === "users" && <UserManagement />}
          {currentPage === "properties" && <PropertyManagement />}
          {currentPage === "reviews" && <ReviewManagement />}
          {currentPage === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

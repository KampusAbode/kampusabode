"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../components/loader/Loader";
import { useUserStore } from "../store/userStore";
import { useUsersStore } from "../store/usersStore";
import { checkIsAdmin } from "../utils";
import "./admin.css";
import Link from "next/link";

const pages = [
  "users",
  "properties",
  "reviews",
  "analytics",
  "notifications",
  "agents",
  "trends",
  "referrals",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useUserStore((state) => state);
  const { setUsers } = useUsersStore((state) => state);

  // Extract page from pathname: /admin/users → users
  const currentPage = pathname.split("/")[2] || "users";
  const currentIndex = pages.indexOf(currentPage);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function validateUser(userId: string) {
      try {
        const admin = await checkIsAdmin(userId);
        if (!admin) {
          router.push("/apartment");
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    }

    validateUser(user?.id);
    const unsubscribe = setUsers();
    setLoading(false);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Swipe to navigate between admin subpages
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < pages.length - 1) {
        router.push(`/admin/${pages[currentIndex + 1]}`);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        router.push(`/admin/${pages[currentIndex - 1]}`);
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
      </div>

      <nav className="dashboard-navigation filter">
        <div className="container">
          {pages.map((page) => (
            <Link
              key={page}
            prefetch
              href={`/admin/${page}`}
              className={`filter-btn ${currentPage === page ? "active" : ""}`}>
              {page}
            </Link>
          ))}
        </div>
      </nav>

      <div className="container">
        <section className="dashboard-content" {...swipeHandlers}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </section>
  );
}

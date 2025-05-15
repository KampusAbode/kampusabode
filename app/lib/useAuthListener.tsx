"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "../components/loader/Loader";
import { getAuthState } from "../utils";
import { useUserStore } from "../store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PUBLIC_ROUTES = [
  "/",
  "/apartment",
  "/apartment/",
  "/trends",
  "/marketplace",
  "/auth/login",
  "/auth/signup",
  "/auth/forget-password",
  "/about",
  "/contact",
];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const logoutUser = useUserStore((state) => state.logoutUser);

  useEffect(() => {
    const isPublicPage = PUBLIC_ROUTES.includes(pathname);
    const verifyAuth = async () => {
      if (isPublicPage) {
        setLoading(false);
        return;
      }

      const { isAuthenticated } = await getAuthState();
      if (!isAuthenticated) {
        logoutUser();
        router.push(redirectTo);
      }

      setLoading(false);
    };

    verifyAuth();
  }, [pathname, redirectTo, logoutUser, router]);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default ProtectedRoute;

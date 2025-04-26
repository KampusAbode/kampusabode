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
  "/auth/login",
  "/auth/signup",
  "/auth/forget-password",
];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const logoutUser = useUserStore((state) => state.logoutUser);

  const isPublicPage = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isPublicPage) {
        setLoading(false);
        return; // ✅ No authentication needed for public pages
      }

      const { isAuthenticated } = await getAuthState();
      if (!isAuthenticated) {
        logoutUser();
        setLoading(false);
        router.push(redirectTo);
      } else {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default ProtectedRoute;

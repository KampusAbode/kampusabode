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

  const isPublicPage = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isPublicPage) {
        setLoading(false);
        return;
      }

      const { isAuthenticated } = await getAuthState();
      if (!isAuthenticated) {
        logoutUser();
        setLoading(false);

        // Save the page the user was trying to access
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
          pathname
        )}`;
        router.push(redirectUrl);
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

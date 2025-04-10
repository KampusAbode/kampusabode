"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader/Loader";
import { getAuthState } from "../utils";
import { useUserStore } from "../store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** The page to redirect to if the session is not active. */
  redirectTo?: string;
}

/**
 * ProtectedRoute checks if the user session is active using getAuthState.
 * If not, it clears the Zustand user state and redirects the user.
 * If the session is still active, the child components are rendered.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login", // You may choose "/properties" if needed.
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const logoutUser = useUserStore((state) => state.logoutUser);

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated } = await getAuthState();
      if (!isAuthenticated) {
        // If session has expired or is invalid, clear the user state
        logoutUser();
        // Redirect the user
        router.push(redirectTo);
      }
      // End the loading phase
      setLoading(false);
    };

    verifyAuth();
  }, [logoutUser, router, redirectTo]);

  if (loading) return null

  return children;
};

export default ProtectedRoute;

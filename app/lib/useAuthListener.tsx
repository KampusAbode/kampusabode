"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader/Loader";
import { getAuthState } from "../utils";
import { useUserStore } from "../store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const logoutUser = useUserStore((state) => state.logoutUser);

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated } = await getAuthState();
      console.log("Authenticated:", isAuthenticated);
      if (!isAuthenticated) {
        logoutUser();
        
        setLoading(false);
        console.log("Authenticated:", isAuthenticated);
        console.log(loading);
        router.push(redirectTo);
        
      } else {
        setLoading(false);
        console.log(loading);
      }
    };

    verifyAuth();
  }, [logoutUser, router, redirectTo]);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default ProtectedRoute;

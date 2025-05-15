
"use client";

import { useEffect, useState } from "react";
import { getAuthState } from "../utils";
import { useUserStore } from "../store/userStore";
import { toast } from "react-hot-toast";

export const useRequireUser = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const logoutUser = useUserStore((state) => state.logoutUser);

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated } = await getAuthState();
      if (!isAuthenticated) {
        toast.error("Please log in to access this page.");
        logoutUser(); 
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    };

    checkAuth();
  }, [logoutUser]);

  return { authenticated, checking };
};

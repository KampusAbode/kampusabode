
"use client";

import { useEffect, useState } from "react";
import { getAuthState, logoutUser } from "../utils";

export const useRequireUser = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated } = await getAuthState();
      if (!isAuthenticated) {
        setAuthenticated(false);
        logoutUser();
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    };

    checkAuth();
  }, [authenticated]);

  return { authenticated, checking };
};

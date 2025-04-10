"use client";

import { useEffect } from "react";
import { useUserStore } from "../../../store/userStore"; // Import Zustand store

// Custom Hook to save visited properties
function SaveVisitedProperty({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { user, addView } = useUserStore(); // Access Zustand store

  useEffect(() => {
    if (!id || !user || user.userType !== "student") return;

    // Call addView function to track the viewed property
    addView(id);
  }, [id, user, addView]); // Dependency on user and id

  return children;
}

export default SaveVisitedProperty;

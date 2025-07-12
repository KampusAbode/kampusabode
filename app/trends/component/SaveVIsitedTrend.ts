"use client";

import { useEffect } from "react";
import { useUserStore } from "../../store/userStore";

function SaveVisitedTrend({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { user, addViewedTrends } = useUserStore();

  useEffect(() => {
    if (!id || !user) return;



    // Call addView function to track the viewed property
    addViewedTrends(id);
  }, [id]);

  return children;
}

export default SaveVisitedTrend;

"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

// Custom Hook to save visited properties
function SaveVisitedProperty({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    // Get visited properties from localStorage or set an empty array
    const savedVisitedProperties = JSON.parse(
      localStorage.getItem("visitedProperties") || "[]"
    );

    // Check if the property is already in the list
    if (!savedVisitedProperties.includes(id)) {
      // Add the new property ID
      const updatedVisitedProperties = [...savedVisitedProperties, id];

      // Update localStorage with the new list
      localStorage.setItem(
        "visitedProperties",
        JSON.stringify(updatedVisitedProperties)
      );
    }
  }, [id, isAuthenticated]);

  return children;
}

export default SaveVisitedProperty;

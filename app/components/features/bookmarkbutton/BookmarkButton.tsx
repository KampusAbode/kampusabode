"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";
import {
  removeSavedProperty,
  updateSavedProperties,
} from "../../../redux/stateSlice/userdataSlice";

const BookmarkButton = ({ propertyId }: { propertyId: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const dispatch = useDispatch();

  // Get user data from Redux
  const userData = useSelector((state: RootState) => state.userdata);

  useEffect(() => {
    // Narrow down userInfo to StudentUserInfo
    if (
      userData?.userType === "student" &&
      "savedProperties" in userData.userInfo
    ) {
      const savedProperties = userData.userInfo.savedProperties || [];
      setIsBookmarked(savedProperties.includes(propertyId));
    }
  }, [propertyId, userData]);

  const toggleBookmark = () => {
    if (!userData) {
      toast.error("Please log in to bookmark properties.");
      return;
    }

    if (
      userData.userType !== "student" ||
      !("savedProperties" in userData.userInfo)
    ) {
      toast.error("Only students can bookmark properties.");
      return;
    }

    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    // Update bookmark status in Redux and show corresponding toast message
    if (newBookmarkState) {
      dispatch(updateSavedProperties(propertyId));
      toast.success("Property added to bookmarks.");
    } else {
      dispatch(removeSavedProperty(propertyId));
      toast.success("Property removed from bookmarks.");
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Outline"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="bookmark"
      onClick={toggleBookmark}
      fill={isBookmarked ? "#ff2020" : "#fff"}
      role="button"
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
      <path d="M20.137,24a2.8,2.8,0,0,1-1.987-.835L12,17.051,5.85,23.169a2.8,2.8,0,0,1-3.095.609A2.8,2.8,0,0,1,1,21.154V5A5,5,0,0,1,6,0H18a5,5,0,0,1,5,5V21.154a2.8,2.8,0,0,1-1.751,2.624A2.867,2.867,0,0,1,20.137,24ZM6,2A3,3,0,0,0,3,5V21.154a.843.843,0,0,0,1.437.6h0L11.3,14.933a1,1,0,0,1,1.41,0l6.855,6.819a.843.843,0,0,0,1.437-.6V5a3,3,0,0,0-3-3Z" />
    </svg>
  );
};

export default BookmarkButton;

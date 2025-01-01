"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";
import {
  removeSavedProperty,
  updateSavedProperties,
} from "../../../redux/stateSlice/userdataSlice";
import { FaBookmark } from "react-icons/fa";
import "./bookmarkbutton.css";

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

  if (userData.userType === "agent") {
    return;
  }

  return (
    <div
      className={`bookmark-button ${isBookmarked ? "saved" : ""}`}
      onClick={toggleBookmark}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      role="button">
      <FaBookmark color={isBookmarked ? "var(--primary)" : "var(--grey)"} />
    </div>
  );
};

export default BookmarkButton;

'use client'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";
import {
  removeSavedProperty,
  updateSavedProperties,
} from "../../../redux/stateSlice/userdataSlice";
import {updateBookmarkInDB} from '../../../utils'
import { CiBookmark } from "react-icons/ci";
import "./bookmarkbutton.css";

const BookmarkButton = ({ propertyId }: { propertyId: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Get user data from Redux
  const userData = useSelector((state: RootState) => state.userdata);

  useEffect(() => {
    if (
      userData?.userType === "student" &&
      "savedProperties" in userData.userInfo
    ) {
      const savedProperties = userData.userInfo.savedProperties || [];
      setIsBookmarked(savedProperties.includes(propertyId));
    }
  }, [propertyId, userData]);

  

  const toggleBookmark = async () => {
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

    const userId = userData.id;
    const newBookmarkState = !isBookmarked;

    setLoading(true);

    try {
      await updateBookmarkInDB(
        userId,
        propertyId,
        newBookmarkState ? "add" : "remove"
      );

      // Update Redux state
      if (newBookmarkState) {
        dispatch(updateSavedProperties(propertyId));
        toast.success("Property added to bookmarks.");
      } else {
        dispatch(removeSavedProperty(propertyId));
        toast.success("Property removed from bookmarks.");
      }

      setIsBookmarked(newBookmarkState);
    } catch (error) {
      toast.error(
        "An error occurred while updating your bookmarks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (userData.userType === "agent") {
    return null;
  }

  return (
    <div
      className={`bookmark-button ${isBookmarked ? "saved" : ""} ${
        loading ? "loading" : ""
      }`}
      onClick={!loading ? toggleBookmark : undefined}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      role="button"
    >
      <CiBookmark  />
    </div>
  );
};

export default BookmarkButton;

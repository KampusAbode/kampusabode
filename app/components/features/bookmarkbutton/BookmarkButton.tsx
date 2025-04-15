"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { updateBookmarkInDB } from "../../../utils";
import { FaBookmark } from "react-icons/fa";
import "./bookmarkbutton.css";
import { useUserStore } from "../../../store/userStore";

const BookmarkButton = ({ propertyId }: { propertyId: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, addBookmark, removeBookmark } = useUserStore((state) => state);

  useEffect(() => {
    if (user?.userType === "student" && "savedProperties" in user.userInfo) {
      const savedProperties = user.userInfo.savedProperties || [];
      setIsBookmarked(savedProperties.includes(propertyId));
    }
  }, [propertyId, user]);

  const toggleBookmark = async () => {
    if (!user) {
      toast.error("Please log in to bookmark properties.");
      return;
    }

    if (user.userType !== "student" || !("savedProperties" in user.userInfo)) {
      toast.error("Only students can bookmark properties.");
      return;
    }

    const userId = user.id;
    const newBookmarkState = !isBookmarked;

    setLoading(true);

    try {
      await updateBookmarkInDB(
        userId,
        propertyId,
        newBookmarkState ? "add" : "remove"
      );

      // Update state
      if (newBookmarkState) {
        addBookmark(propertyId);
        toast.success("Property added to bookmarks.");
      } else {
        removeBookmark(propertyId);
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

  if (user.userType === "agent") {
    return null;
  }

  return (
    <div
      className={`bookmark-button ${isBookmarked ? "saved" : ""} ${
        loading ? "loading" : ""
      }`}
      onClick={!loading ? toggleBookmark : undefined}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      role="button">
      <FaBookmark />
    </div>
  );
};

export default BookmarkButton;

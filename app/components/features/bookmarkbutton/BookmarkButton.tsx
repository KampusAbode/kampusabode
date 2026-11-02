"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { updateBookmarkInDB } from "../../../utils";
import { Heart } from "lucide-react";
import { Button } from "../../button/Button";
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
      toast.error("Please log in to bookmark apartment.");
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
        toast.success("Apartment added to bookmarks.", { id: "bookmarked" });
      } else {
        removeBookmark(propertyId);
        toast.success("Apartment removed from bookmarks.", {
          id: "bookmarked",
        });
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

  if (user && user?.userType === "agent") {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={`bookmark-button ${isBookmarked ? "saved" : ""}`}
      onClick={toggleBookmark}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      aria-pressed={isBookmarked}
      aria-busy={loading}
      disabled={loading}
      loading={loading}
      leftIcon={
        <Heart fill={isBookmarked ? "currentColor" : "none"} />
      }
    />
  );
};

export default BookmarkButton;

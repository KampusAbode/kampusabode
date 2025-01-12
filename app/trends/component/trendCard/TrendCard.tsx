"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa6";
import { TrendType } from "../../../fetch/types";
import "./trendCard.css";
import { formatNumber } from "../../../utils";
import Link from "next/link";
import { updateLikes } from "../../../utils";
import CryptoJS from "crypto-js";

interface TrendCardProp {
  trendData: TrendType;
}

const TrendCard: React.FC<TrendCardProp> = ({ trendData }) => {
  const [likes, setLikes] = useState<number>(trendData.likes || 0);
  const [userAction, setUserAction] = useState<"like" | "unlike">("unlike");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const encryptedActions = localStorage.getItem("trendActions");
    if (encryptedActions) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedActions,
          process.env.NEXT_PUBLIC__ENCSECRET_KEY || ""
        );
        const decryptedActions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const action = decryptedActions.find(
          (item: { id: string; status: string }) => item.id === trendData.id
        );
        if (action) {
          setUserAction(action.status as "like");
        }
      } catch (error) {
        console.error("Failed to decrypt actions:", error);
      }
    }
  }, [trendData.id]);

  const updateLocalStorage = (id: string, status: "like" | "unlike") => {
    try {
      const encryptedActions = localStorage.getItem("trendActions");
      let storedActions: { id: string; status: "like" | "unlike" }[] = [];
      if (encryptedActions) {
        const bytes = CryptoJS.AES.decrypt(
          encryptedActions,
          process.env.NEXT_PUBLIC__ENCSECRET_KEY || ""
        );
        storedActions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      const updatedActions = storedActions.filter(
        (item: { id: string }) => item.id !== id
      );
      if (status) {
        updatedActions.push({ id, status });
      }
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(updatedActions),
        process.env.NEXT_PUBLIC__ENCSECRET_KEY || ""
      ).toString();
      localStorage.setItem("trendActions", encryptedData);
    } catch (error) {
      console.error("Failed to update local storage:", error);
    }
  };

  const handleLikeToggle = async () => {
    setLoading(true);
    try {
      const action = userAction === "like" ? "unlike" : "like";
      await updateLikes({ id: trendData.id, action });

      if (userAction === "like") {
        setLikes((prevLikes) => prevLikes - 1);
        setUserAction("unlike");
        updateLocalStorage(trendData.id, "unlike");
      } else {
        setLikes((prevLikes) => prevLikes + 1);
        setUserAction("like");
        updateLocalStorage(trendData.id, "like");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedLikes = formatNumber(likes);

  return (
    <div className="trend">
      <div className="trend-image">
        <Link href={`/trends/${trendData?.id}`}>
          <Image
            src={trendData?.image || "/placeholder-image.jpg"}
            width={1000}
            height={1000}
            alt="trend image"
          />
        </Link>
        <span className="category">{trendData?.category || "Unknown"}</span>
      </div>
      <div className="trend-content">
        <div className="author-thumbs">
          <span className="author">
            <i>by {trendData?.author || "Anonymous"}</i>
          </span>
          <span className="thumbs">
            <span>{formattedLikes}</span>
            <FaThumbsUp
              className={`thumbsup ${userAction === "like" ? "active" : ""}`}
              onClick={handleLikeToggle}
              style={{
                pointerEvents: loading ? "none" : "auto",
                opacity: loading ? 0.6 : 1,
              }}
            />
          </span>
        </div>
        <h5 className="trend-title">{trendData?.title || "Untitled"}</h5>
        <p>{trendData?.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default TrendCard;

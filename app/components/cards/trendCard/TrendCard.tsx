"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [likes, setLikes] = useState<number>(trendData.likes);
  const [userAction, setUserAction] = useState<"like" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const encryptedActions = localStorage.getItem("trendActions");
    if (encryptedActions) {
      const bytes = CryptoJS.AES.decrypt(encryptedActions, process.env.NEXT_PUBLIC_SECRET_KEY!);
      const decryptedActions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const action = decryptedActions.find((item: { id: string; status: string }) => item.id === trendData.id);
      if (action) {
        setUserAction(action.status as "like");
      }
    }
  }, [trendData.id]);

  const updateLocalStorage = useCallback((id: string, status: "like" | null) => {
    const encryptedActions = localStorage.getItem("trendActions");
    let storedActions = [];
    if (encryptedActions) {
      const bytes = CryptoJS.AES.decrypt(encryptedActions, process.env.NEXT_PUBLIC_SECRET_KEY!);
      storedActions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    const updatedActions = storedActions.filter((item: { id: string }) => item.id !== id);
    if (status) {
      updatedActions.push({ id, status });
    }
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(updatedActions), process.env.NEXT_PUBLIC_SECRET_KEY!).toString();
    localStorage.setItem("trendActions", encryptedData);
  }, []);

  const handleLikeToggle = useCallback(async () => {
    setLoading(true);
    try {
      const action = userAction === 'like' ? 'unlike' : 'like';
      await updateLikes({ id: trendData.id, action });

      if (userAction === 'like') {
        setLikes((prevLikes) => prevLikes - 1);
        setUserAction(null);
        updateLocalStorage(trendData.id, null);
      } else {
        setLikes((prevLikes) => prevLikes + 1);
        setUserAction('like');
        updateLocalStorage(trendData.id, 'like');
      }
    } catch (error) {
      console.error('Error updating likes: ', error);
    } finally {
      setLoading(false);
    }
  }, [userAction, trendData.id, updateLocalStorage]);

  const formattedLikes = useMemo(() => formatNumber(likes), [likes]);

  return (
    <div className="trend">
      <div className="trend-image">
        <Link href={`/trends/${trendData?.id}`}>
          <Image
            src={trendData?.image}
            width={1000}
            height={1000}
            alt="trend image"
          />
        </Link>
        <span className="category">{trendData?.category}</span>
      </div>
      <div className="trend-content">
        <div className="author-thumbs">
          <span className="author">
            <i>by {trendData?.author}</i>
          </span>
          <span className="thumbs">
            <span>{formattedLikes}</span> {/* Use the utility function */}
            <FaThumbsUp
              className={`thumbsup ${userAction === "like" ? "active" : ""}`}
              onClick={handleLikeToggle}
              style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }} // Disable button while loading
            />
          </span>
        </div>
        <h5 className="trend-title">{trendData?.title}</h5>
        <p>{trendData?.description}</p>
      </div>
    </div>
  );
};

export default TrendCard;
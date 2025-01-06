import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { TrendType } from "../../../fetch/types";
import "./trendCard.css";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getApp } from "firebase/app";
import { formatNumber } from "../../../utils"; 

interface TrendCardProp {
  trendData: TrendType;
}

function TrendCard({ trendData }: TrendCardProp) {
  const [likes, setLikes] = useState(trendData.likes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);

  useEffect(() => {
    const storedActions = JSON.parse(
      localStorage.getItem("trendActions") || "[]"
    );
    const action = storedActions.find(
      (item: { id: string; status: string }) => item.id === trendData.id
    );
    if (action) {
      setUserAction(action.status as "like" | "dislike");
    }
  }, [trendData.id]);

  const updateLocalStorage = (id: string, status: "like" | "dislike") => {
    const storedActions = JSON.parse(
      localStorage.getItem("trendActions") || "[]"
    );
    const updatedActions = storedActions.filter(
      (item: { id: string }) => item.id !== id
    );
    updatedActions.push({ id, status });
    localStorage.setItem("trendActions", JSON.stringify(updatedActions));
  };

  const handleLike = async () => {
    if (userAction === "like") return;

    const db = getFirestore(getApp());
    const trendRef = doc(db, "trends", trendData.id);

    try {
      await updateDoc(trendRef, {
        likes: increment(1),
      });
      setLikes(likes + 1);
      setUserAction("like");
      updateLocalStorage(trendData.id, "like");
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleDislike = async () => {
    if (userAction !== "like") return;

    const db = getFirestore(getApp());
    const trendRef = doc(db, "trends", trendData.id);

    try {
      await updateDoc(trendRef, {
        likes: increment(-1),
      });
      setLikes(likes - 1);
      setUserAction("dislike");
      updateLocalStorage(trendData.id, "dislike");
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  return (
    <div className="trend">
      <div className="trend-image">
        <Image
          src={trendData?.image}
          width={1000}
          height={1000}
          alt="trend image"
        />
        <span className="category">{trendData?.category}</span>
      </div>
      <div className="trend-content">
        <div className="author-thumbs">
          <span className="author">
            <i>by {trendData?.author}</i>
          </span>
          <span className="thumbs">
            <span>{formatNumber(likes)}</span> {/* Use the utility function */}
            <FaThumbsUp
              className={`thumbsup ${userAction === "like" ? "active" : ""}`}
              onClick={handleLike}
            />
            <FaThumbsDown
              className={`thumbsdown ${
                userAction === "dislike" ? "active" : ""
              }`}
              onClick={handleDislike}
            />
          </span>
        </div>
        <h5 className="trend-title">{trendData?.title}</h5>
        <p>{trendData?.description}</p>
      </div>
    </div>
  );
}

export default TrendCard;

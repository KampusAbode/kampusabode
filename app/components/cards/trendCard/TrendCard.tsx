import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa6";
import { TrendType } from "../../../fetch/types";
import "./trendCard.css";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getApp } from "firebase/app";
import { formatNumber } from "../../../utils"; // Import the utility function
import Link from "next/link";

interface TrendCardProp {
  trendData: TrendType;
}

function TrendCard({ trendData }: TrendCardProp) {
  const [likes, setLikes] = useState(trendData.likes);
  const [userAction, setUserAction] = useState<"like" | null>(null);

  useEffect(() => {
    const storedActions = JSON.parse(
      localStorage.getItem("trendActions") || "[]"
    );
    const action = storedActions.find(
      (item: { id: string; status: string }) => item.id === trendData.id
    );
    if (action) {
      setUserAction(action.status as "like");
    }
  }, [trendData.id]);

  const updateLocalStorage = (id: string, status: "like" | null) => {
    const storedActions = JSON.parse(
      localStorage.getItem("trendActions") || "[]"
    );
    const updatedActions = storedActions.filter(
      (item: { id: string }) => item.id !== id
    );
    if (status) {
      updatedActions.push({ id, status });
    }
    localStorage.setItem("trendActions", JSON.stringify(updatedActions));
  };

  const handleLikeToggle = async () => {
    const db = getFirestore(getApp());
    const trendRef = doc(db, "trends", trendData.id);

    try {
      if (userAction === "like") {
        await updateDoc(trendRef, {
          likes: increment(-1),
        });
        setLikes(likes - 1);
        setUserAction(null);
        updateLocalStorage(trendData.id, null);
      } else {
        await updateDoc(trendRef, {
          likes: increment(1),
        });
        setLikes(likes + 1);
        setUserAction("like");
        updateLocalStorage(trendData.id, "like");
      }
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

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
            <span>{formatNumber(likes)}</span> {/* Use the utility function */}
            <FaThumbsUp
              className={`thumbsup ${userAction === "like" ? "active" : ""}`}
              onClick={handleLikeToggle}
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

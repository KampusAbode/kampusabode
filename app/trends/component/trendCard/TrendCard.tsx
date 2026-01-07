"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { TrendType } from "../../../fetch/types";
import "./trendCard.css";
import Link from "next/link";

interface TrendCardProp {
  trendData: TrendType;
}

// const TrendCard: React.FC<TrendCardProp> = ({ trendData }) => {
const TrendCard = ({ trendData }) => {
  const [snippet, setSnippet] = useState<string>("");

  useEffect(() => {
    // Prevent SSR usage of `document`
    if (typeof window !== "undefined" && trendData?.content) {
      // Ensure `document` access happens here only
      const div = document.createElement("div");
      div.innerHTML = trendData.content;
      const firstP = div.querySelector("p");
      setSnippet(firstP ? firstP.outerHTML : "");
    }
  }, [trendData.content]);

  return (
    <Link prefetch href={`/trends/${trendData?.slug}`}>
      <div className="trend-card">
        <div className="trend-image">
          <Image
            priority
            src={trendData?.image}
            width={1000}
            height={1000}
            alt="trend image"
          />
          <span className="category">{trendData?.category || "Unknown"}</span>
        </div>
        <div className="trend-content">
          <div className="author-thumbs">
            <span className="author">
              by {trendData?.author || "Anonymous"}
            </span>
            <span className="thumbs">
              2 mins read
            </span>
          </div>
          <h6 className="trend-title">{trendData?.title || "Untitled"}</h6>
          {/* <p dangerouslySetInnerHTML={{ __html: snippet }} /> */}
        </div>
      </div>
    </Link>
  );
};

export default TrendCard;

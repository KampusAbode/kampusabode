import Image from "next/image";
import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { TrendType } from "../../../fetch/types";
import "./trendCard.css";


interface TrendCardProp {
  trendData: TrendType;
}
function TrendCard({ trendData }: TrendCardProp) {
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
            <FaThumbsUp className="thunbsup" />
            <FaThumbsDown className="thumbsdown" />
          </span>
        </div>
        <h5 className="trend-title">{trendData?.title}</h5>
        <p>{trendData?.description}</p>
      </div>
    </div>
  );
}

export default TrendCard;

import Image from "next/image";
import React from "react";
import "./articleCard.css";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { ArticleType } from "../../../fetch/types";


interface ArticleCardProp {
  articleData: ArticleType;
}
function ArticleCard({ articleData }: ArticleCardProp) {
  return (
    <div className="article">
      <div className="article-image">
        <Image
          src={articleData?.image}
          width={1000}
          height={1000}
          alt="article image"
        />
        <span className="category">{articleData?.category}</span>
      </div>
      <div className="article-content">
        <div className="author-thumbs">
          <span className="author">
            <i>by {articleData?.author}</i>
          </span>
          <span className="thumbs">
            <FaThumbsUp className="thunbsup" />
            <FaThumbsDown className="thumbsdown" />
          </span>
        </div>
        <h5 className="article-title">{articleData?.title}</h5>
        <p>{articleData?.description}</p>
      </div>
    </div>
  );
}

export default ArticleCard;

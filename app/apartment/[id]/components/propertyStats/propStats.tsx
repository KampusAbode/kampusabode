import React from "react";
import { LiaStar, LiaStarHalfAltSolid, LiaStarSolid } from "react-icons/lia";


const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const halfStar = rating % 1 >= 0.5; // Whether to show a half star
  const emptyStars = 5 - Math.ceil(rating); // Remaining empty stars

  return (
    <span style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
      {/* Full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, idx) => (
          <LiaStarSolid key={idx} />
        ))}
      {/* Half star */}
      {halfStar && <LiaStarHalfAltSolid />}
      {/* Empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, idx) => (
          <LiaStar key={fullStars + idx} />
        ))}
    </span>
  );
};

const PropStats = ({rating, reviews}: {rating: number, reviews: number}) => {

  return (
      <>
        <div className="ratings">
          <StarRating rating={rating} />
          <span>{rating.toFixed(1)} / 5.0</span>
        </div>
        <div className="reviews">
          <p>{reviews}</p>
          <span>reviews</span>
        </div>
      </>
  );
};

export default PropStats;

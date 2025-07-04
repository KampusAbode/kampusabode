import React from "react";


const StarIcon = ({ filled }: { filled: boolean }) => {
  return filled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#ff5e5e"
      viewBox="0 0 30 30"
      stroke="none"
      className="w-6 h-6">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 30 30"
      stroke="#ff5e5e"
      className="w-6 h-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
};


const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const halfStar = rating % 1 >= 0.5; // Whether to show a half star
  const emptyStars = 5 - Math.ceil(rating); // Remaining empty stars

  return (
    <span style={{ display: "flex", justifyContent:"center", gap: "4px", }}>
      {/* Full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, idx) => (
          <StarIcon key={idx} filled={true} />
        ))}
      {/* Half star */}
      {halfStar && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="url(#halfStarGradient)"
          viewBox="0 0 30 30"
          stroke="none"
          className="w-6 h-6">
          <defs>
            <linearGradient
              id="halfStarGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%">
              <stop offset="50%" stopColor="#ff5e5e" />
              <stop offset="50%" stopColor="none" />
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )}
      {/* Empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, idx) => (
          <StarIcon key={fullStars + idx} filled={false} />
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
          <span>reviews on this property</span>
        </div>
      </>
  );
};

export default PropStats;

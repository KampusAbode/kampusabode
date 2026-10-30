import React, { FC } from "react";
import "./Loader.css";

const Loader: FC = () => {
  return (
    <div className="spinner">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};

export const CardSkeletonGrid: FC<{ className: string; count?: number }> = ({
  className,
  count = 6,
}) => (
  <div
    className={`card-skeleton-grid ${className}`}
    role="status"
    aria-label="Loading results"
    aria-busy="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <article className="card-skeleton" aria-hidden="true" key={index}>
        <div className="card-skeleton-image" />
        <div className="card-skeleton-content">
          <div className="card-skeleton-line card-skeleton-line-wide" />
          <div className="card-skeleton-line card-skeleton-line-medium" />
          <div className="card-skeleton-line card-skeleton-line-short" />
        </div>
      </article>
    ))}
  </div>
);

export default Loader;

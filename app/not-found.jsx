// app/not-found.tsx
import React from "react";
import Link from "next/link";
import "./not-found.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>Oops!</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link href="/apartment">
          <span className="btn">check out apartments</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

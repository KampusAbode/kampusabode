// app/not-found.tsx
import React from "react";
import Link from "next/link";
import "./not-found.css";
import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-image">
        <Image src={"/icons/404.png"} alt="404" width={800} height={800} />
      </div>
      <div className="not-found-content">
        <h1>Oops!</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link prefetch href="/apartment">
          <span className="btn">check out apartments</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

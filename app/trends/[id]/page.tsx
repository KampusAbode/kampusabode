"use client";
import React, { useState, useEffect } from "react";

import { TrendType } from "../../fetch/types";
import { fetchTrendsByIDs } from "../../utils";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

type Params = {
  params: { id: string };
};

const TrendPage = ({ params }: Params) => {
  const { id } = params;
  const [trendData, setTrendData] = useState<TrendType>();

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const trend: TrendType = await fetchTrendsByIDs([id])[0];
        console.log(trend);
        setTrendData(trend);
      } catch (error) {
        toast.error("Failed to fetch agent properties.");
      }
    };
    fetchTrendData();
  }, []);

  return (
    <div className="trend-details">
      {trendData ? (
        <>
          <h1>{trendData?.title}</h1>
          <div className="trend-image">
            <Image
              src={trendData?.image}
              width={1000}
              height={1000}
              alt="trend image"
            />
          </div>
          <div className="trend-meta">
            <p>
              <strong>Author:</strong> {trendData?.author}
            </p>
            <p>
              <strong>Category:</strong> {trendData?.category}
            </p>
            <p>
              <strong>Likes:</strong> {trendData?.likes}
            </p>
          </div>
          <div className="trend-description">
            <h2>Description</h2>
            <p>{trendData?.description}</p>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TrendPage;

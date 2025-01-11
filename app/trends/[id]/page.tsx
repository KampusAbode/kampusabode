"use client";
import React, { useState, useEffect } from "react";

import { TrendType } from "../../fetch/types";
import { fetchTrendByID } from "../../utils";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import './trend.css';

type Params = {
  params: { id: string };
};

const TrendPage = ({ params }: Params) => {
  const { id } = params;
  const [trendData, setTrendData] = useState<TrendType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const trend: TrendType = await fetchTrendByID(id);
        console.log(trend);
        setTrendData(trend);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch agent properties.");
      }
    };
    fetchTrendData();
  }, []);

  return (
    <div className="trend-details-page">
      {!loading ? (
        <>
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
            <div className="title">{trendData?.title}</div>
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

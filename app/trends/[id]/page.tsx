"use client";
import React, { useState, useEffect } from "react";

import { TrendType } from "../../fetch/types";
import { fetchTrendByID } from "../../utils";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import "./trend.css";

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
        <div className="container">
          <div className="trend-details">
            <span className="category">{trendData?.category}</span>
            <h3 className="title">{trendData?.title}</h3>
            <span>By {trendData?.author}</span>
            <span>{trendData?.published_date}</span>
          </div>
          <div className="trend-image">
            <Image
              src={trendData?.image}
              width={800}
              height={800}
              alt="trend image"
            />
          </div>
          <div className="trend-description">
            {trendData?.content
              .split("\n")
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TrendPage;

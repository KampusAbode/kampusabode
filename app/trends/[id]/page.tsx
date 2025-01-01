"use client";
import React, { useEffect, useState } from "react";
import { TrendType } from "../../fetch/types";

function TrendPage({ id }) {
  const [trendData, setTrendData] = useState<TrendType>();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="trend-page">
      <span>{`Trend > ${trendData.category}`}</span>
    </div>
  );
}

export default TrendPage;

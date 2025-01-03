"use client";
import React, { useEffect, useState } from "react";
import { TrendType } from "../../fetch/types";


type Params = {
  params: { id: string };
};
function TrendPage({ params }: Params) {
  const id = params.id;
  const [trendData, setTrendData] = useState<TrendType>();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="trend-page">
      <span>{`Trend > ${trendData.category}`}</span>
      <h2>{ trendData.title }</h2>
    </div>
  );
}

export default TrendPage;

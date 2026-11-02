"use client";

import React, { useEffect, useState } from "react";
import { allTrends } from "../utils";
import TrendCard from "./component/trendCard/TrendCard";
import { CardSkeletonGrid } from "../components/loader/Loader";
import { TrendType } from "../fetch/types";
import "./trends.css";
import { useTrendStore } from "../store/trendStore";
import data from "../fetch/contents";
import Chip from "../components/button/Chip";

export default function trendsPage() {
  // const [trends, setTrends] = useState<TrendType[]>([]);
  const { trends, setTrends } = useTrendStore((state) => state);
  const [filteredTrends, setFilteredTrends] = useState<TrendType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { trendcategories } = data;


  useEffect(() => {
    // Fetch trends using allTrends function
    const unsubscribe: () => void = allTrends((trendData: TrendType[]) => {
      setTrends(trendData);
      setFilteredTrends(trendData);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    setLoading(true);
    if (category == "all") {
      setFilteredTrends(trends);
    } else {
      const filtered = trends.filter((item) => {
        return item.category.toLowerCase() === category.toLowerCase();
      });
      setFilteredTrends(filtered);
    }
    setLoading(false);
  };

  return (
    <section className="trends-page">
      <div className="container">
        <h2 className="page-heading">Trends</h2>
      </div>

      <div className="filter">
        <div className="container">
          <Chip
            type="button"
            aria-pressed={activeCategory === "all"}
            onClick={() => filterByCategory("all")}>
            All
          </Chip>
          {trendcategories.map((category, index) => (
            <Chip
              type="button"
              key={index}
              aria-pressed={activeCategory === category}
              onClick={() => filterByCategory(category)}>
              {category}
            </Chip>
          ))}
        </div>
      </div>

      <div className="container">
        {!loading ? (
          filteredTrends.length > 0 ? (
            <div className="trends">
              {filteredTrends.map((read) => (
                <TrendCard key={read?.id} trendData={read} />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              {`${activeCategory === "all" ? "No" : `No ${activeCategory}`}`}{" "}
              trend available.
            </p>
          )
        ) : (
          <CardSkeletonGrid className="trends" />
        )}
      </div>
    </section>
  );
}

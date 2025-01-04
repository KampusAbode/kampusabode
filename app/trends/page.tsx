"use client";

import React, { useEffect, useState } from "react";
import { allTrends } from "../utils"; // Adjust path as needed
import TrendCard from "../components/cards/trendCard/TrendCard";
import "./trends.css";
import { FaSearch } from "react-icons/fa";
import Loader from "../components/loader/Loader";
import { TrendType } from "../fetch/types";

export default function trendsPage() {
  const [trends, setTrends] = useState<TrendType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const trendCategories = [
    "Real estate market",
    "Rental market",
    "Interior design",
    "OAU updates",
    "Football",
    "Student investment",
    "Study methods",
    "Skills",
    "Business",
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchTrends(searchQuery);
    }
  };

  const searchTrends = (query: string) => {
    // Implement search logic here
  };

  useEffect(() => {
    // Fetch trends using allTrends function
    const unsubscribe: () => void = allTrends((trendData: TrendType[]) => {
      setTrends(trendData); // Update state when trends data changes
    });
    setLoading(false);

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <section className="trends-page">
      <div className="container">
        <h2 className="page-heading">Trends</h2>
      </div>

      <div className="filter">
        <div className="container">
          {/* <div className="search-trends">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Run search on Enter press
              placeholder="search trend ..."
            />
            <div
              className="search-icon"
              onClick={() => searchTrends(searchQuery)}>
              <FaSearch />
            </div>
          </div> */}

          <div className="filter-trends">
            <p>Categories</p>
            <div className="categories">
              <span className="category-trend active">All</span>
              {trendCategories.map((category, index) => (
                <span key={index} className="category-trend">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {!loading ? (
          trends.length === 0 ? (
            <p style={{ marginBlock: "2rem", textAlign: "center" }}>
              No trends available.
            </p>
          ) : (
            <div className="trends">
              {trends.map((read) => (
                <TrendCard key={read?.id} trendData={read} />
              ))}
            </div>
          )
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}

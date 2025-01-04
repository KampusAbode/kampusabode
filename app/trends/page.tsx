"use client";

import React, { useEffect, useState } from "react";
import { allTrends } from "../utils"; // Adjust path as needed
import TrendCard from "../components/cards/trendCard/TrendCard";
import "./trends.css";
import { FaSearch } from "react-icons/fa";

export default function trendsPage() {
  const [trends, setTrends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCategories = [
    "Real estate market",
    "Rental market",
    "Interior design",
    "Student investment",
    "Study methods",
    "Skills",
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchProperties(searchQuery);
    }
  };

  const searchProperties = (query: string) => {
    // Implement search logic here
  };

  useEffect(() => {
    // Fetch trends using allTrends function
    const unsubscribe = allTrends((items) => {
      setTrends(items); // Update state when trends data changes
    });

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
          {/* <div className="search-items">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Run search on Enter press
              placeholder="search item ..."
            />
            <div
              className="search-icon"
              onClick={() => searchProperties(searchQuery)}>
              <FaSearch />
            </div>
          </div> */}

          <div className="filter-items">
            <p>Categories</p>
            <div className="categories">
              {itemCategories.map((category, index) => (
                <span key={index} className="category-item">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {trends.length === 0 ? (
          <p style={{ marginBlock: "2rem", textAlign: "center" }}>
            No trends available.
          </p>
        ) : (
          <div className="trends">
            {trends.map((read) => (
              <TrendCard key={read?.id} trendData={read} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

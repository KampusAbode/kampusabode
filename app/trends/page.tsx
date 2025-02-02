"use client";

import React, { useEffect, useState } from "react";
import { allTrends } from "../utils";
import TrendCard from "./component/trendCard/TrendCard";
import "./trends.css";
// import { FaSearch } from "react-icons/fa";
import Loader from "../components/loader/Loader";
import { TrendType } from "../fetch/types";

export default function trendsPage() {
  const [trends, setTrends] = useState<TrendType[]>([]);
  const [filteredTrends, setFilteredTrends] = useState<TrendType[]>([]);
  // const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const trendCategories = [
    "Real estate market",
    "Rental market",
    "Interior design",
    "OAU updates",
    "Home Buying",
    "Football",
    "Student investment",
    "Study methods",
    "Real Estate Investment",
    "Skills",
    "Business",
  ];

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

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(event.target.value);
  // };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     searchTrends(searchQuery);
  //   }
  // };

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

  // const searchTrends = (query: string) => {
  //   // Implement search logic here
  // };

  return (
    <section className="trends-page">
      <div className="container">
        <h2 className="page-heading">Trends</h2>
      </div>

      <div className="trends-page-filter">
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
              <span
                className={`category-trend ${
                  activeCategory === "all" ? "active" : ""
                }`}
                onClick={() => filterByCategory("all")}>
                All
              </span>
              {trendCategories.map((category, index) => (
                <span
                  key={index}
                  className={`category-trend ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => filterByCategory(category)}>
                  {category}
                </span>
              ))}
            </div>
          </div>
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
            <p style={{ marginBlock: "2rem", textAlign: "center" }}>
              No trend available.
            </p>
          )
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}

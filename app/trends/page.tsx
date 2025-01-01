'use client'

import React, { useEffect, useState } from "react";
import { allTrends } from "../utils"; // Adjust path as needed
import TrendCard from "../components/cards/trendCard/TrendCard";
import "./trends.css";



export default function trendsPage() {
  const [trends, setTrends] = useState([]);

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
        <h2>Trends</h2>

{trends.length === 0 ? (
        <p style={{marginBlock: "2rem", textAlign: 'center'}}>No trends available.</p>
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

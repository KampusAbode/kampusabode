"use client";

import React, { useState, useEffect } from "react";
// import { trends } from "../fetch/data/trends";
import { fetchProperties, fetchPropertiesByIds } from "../utils";
import "./saved.css";
import TrendCard from "../trends/component/trendCard/TrendCard";
import { TrendType, PropertyType } from "../fetch/types";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SavedPage = () => {
  // const [properties, setProperties] = useState([]);
  const [currentTab, setCurrentTab] = useState("properties");
  const [savedProperties, setsavedProperties] = useState([]);
  const [savedTrends, setsavedTrends] = useState([]);
  const userData = useSelector((state: RootState) => state.userdata);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user?.isAuthenticated
  );

  async () => {
    if (
      isAuthenticated &&
      userData.userType === "student" &&
      "savedProperties" in userData.userInfo
    ) {
      const savedsavedProperties = userData.userInfo.savedProperties;
      const updatedsavedProperties = [...savedsavedProperties];
      const fetchedProperties: PropertyType[] = await fetchPropertiesByIds(
        updatedsavedProperties
      );
      setsavedProperties(fetchedProperties);
    }
  };

  function savedTab(tab: string) {
    if (tab === "trends") {
      return savedTrends.map((read) => {
        return <TrendCard key={read.title} trendData={read as TrendType} />;
      });
    } else {
      if (tab === "properties" && savedProperties) {
        return (
          <div className="saved-props">
            {savedProperties.map((property) => {
              return (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <img src={property.images[0]} alt={property.title} />
                </Link>
              );
            })}
          </div>
        );
      } else {
        return (
          <div className="saved-props">
            <p>
              Oops! Your saved list is empty! Why not start discovering your
              dream property now? 💡
            </p>
          </div>
        );
      }
    }
  }

  return (
    <section className="saved-page">
      <div className="tabs">
        <div className="container">
          <span
            onClick={() => setCurrentTab("properties")}
            className={currentTab === "properties" ? "active" : ""}>
            properties
          </span>
          <span
            onClick={() => setCurrentTab("trends")}
            className={currentTab === "trends" ? "active" : ""}>
            trends
          </span>
        </div>
      </div>

      <div className="saved-items">
        <div className="container">{savedTab(currentTab)}</div>
      </div>
    </section>
  );
};

export default SavedPage;

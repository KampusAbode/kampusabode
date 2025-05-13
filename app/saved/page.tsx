"use client";

import React, { useState, useEffect } from "react";
import { useProperties } from "../utils";
import TrendCard from "../trends/component/trendCard/TrendCard";
import { TrendType, ApartmentType } from "../fetch/types";
import Link from "next/link";
import { useUserStore } from "../store/userStore"; // assuming you have a Zustand store for user data

const SavedPage = () => {
  const [currentTab, setCurrentTab] = useState("properties");
  const [savedProperties, setSavedProperties] = useState<ApartmentType[]>([]);
  const { getApartmentsByIds } = useProperties();

  // Zustand store for user data
  const userData = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (
        userData &&
        userData.userType === "student" &&
        "savedProperties" in userData.userInfo
      ) {
        const savedPropertiesIds = userData.userInfo.savedProperties;
        const fetchedProperties: ApartmentType[] = await getApartmentsByIds(
          savedPropertiesIds
        );
        setSavedProperties(fetchedProperties);
      }
    };

    fetchSavedProperties();
  }, [userData, getApartmentsByIds]);

  const savedTab = (tab: string) => {
    // if (tab === "trends") {
    //   return savedTrends.map((trend) => {
    //     return <TrendCard key={trend.title} trendData={trend as TrendType} />;
    //   });
    // } else {
    if (tab === "properties" && savedProperties.length > 0) {
      return (
        <div className="saved-props">
          {savedProperties.map((property) => {
            return (
              <Link key={property.id} href={`/apartment/${property.id}`}>
                <img src={property.images[0]} alt={property.title} />
              </Link>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="saved-props">
          <p style={{ textAlign: "center", marginTop: "8rem" }}>
            No saved properties yet! 🏠
          </p>
        </div>
      );
    }
    // }
  };

  return (
    <section className="saved-page">
      <div className="tabs">
        <div className="container">
          <span
            onClick={() => setCurrentTab("properties")}
            className={currentTab === "properties" ? "active" : ""}>
            properties
          </span>

          {/* <span
            onClick={() => setCurrentTab("trends")}
            className={currentTab === "trends" ? "active" : ""}>
            trends
          </span> */}
        </div>
      </div>

      <div className="saved-items">
        <div className="container">{savedTab(currentTab)}</div>
      </div>
    </section>
  );
};

export default SavedPage;

"use client";

import React, { useState, useEffect } from "react";
import { useProperties } from "../utils";
// import TrendCard from "../trends/component/trendCard/TrendCard";
import { TrendType, ApartmentType } from "../fetch/types";
import Link from "next/link";
import { useUserStore } from "../store/userStore";
import "./saved.css";
import Image from "next/image";

const SavedPage = () => {
  const [currentTab, setCurrentTab] = useState("properties");
  const [savedProperties, setSavedProperties] = useState<ApartmentType[]>([]);
  const { getApartmentsByIds } = useProperties();
  const [loading, setLoading] = useState(false);

  // Zustand store for user data
  const userData = useUserStore((state) => state.user);


  if (!userData) {
    return (
      <section className="saved-page">
        <div className="container">
          <h4 className="page-heading">Saved</h4>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p>Please log in to access your saved apartments.</p>
            <Link href="/auth/login" style={{textDecoration:"underline"}}>Log in</Link>
          </div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (
        userData &&
        userData.userType === "student" &&
        "savedProperties" in userData.userInfo
      ) {
        setLoading(true);
        try {
          const savedPropertiesIds = userData.userInfo.savedProperties;
          const fetchedProperties: ApartmentType[] = await getApartmentsByIds(
            savedPropertiesIds
          );
          setSavedProperties(fetchedProperties);
        } catch (error) {
          console.error("Failed to fetch saved properties", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSavedProperties();
  }, [userData]);
  

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
                <Image src={property.images[0]} width={4000} height={4000} alt={property.title} />
              </Link>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="no-saved" style={{textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh"}}>
          
          <Image src="/icons/save_apartment.png" alt="no saved" width={3000} height={3000} style={{width: "210px", height: 'auto'}} />

          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No saved apartments yet! 🏠
          </p>
        </div>
      );
    }
    // }
  };

  return (
    <section className="saved-page">
      <div className="container">
        <h4 className="page-heading">Saved</h4>
      </div>
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
        <div className="container">
          {loading ? (
            <div
              className="loading"
              style={{ textAlign: "center", marginTop: "2rem" }}>
              <p>Loading saved apartments...</p>
            </div>
          ) : (
            savedTab(currentTab)
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedPage;

"use client";

import React, { useState, useEffect } from "react";
import { getApartmentsByIds } from "../utils";
// import TrendCard from "../trends/component/trendCard/TrendCard";
import { TrendType, ApartmentType } from "../fetch/types";
import Link from "next/link";
import { useUserStore } from "../store/userStore";
import "./saved.css";
import Image from "next/image";
import Chip from "../components/button/Chip";

const SavedPage = () => {
  const [currentTab, setCurrentTab] = useState("properties");
  const [savedProperties, setSavedProperties] = useState<ApartmentType[]>([]);
  // const { getApartmentsByIds } = useProperties();
  const [loading, setLoading] = useState(false);

  // Zustand store for user data
  const userData = useUserStore((state) => state.user);

  if (!userData) {
    return (
      <section className="saved-page">
        <div className="container">
          <h2 className="page-heading">Saved</h2>

          <div className="saved-page__login-prompt">
            <p>Please log in to access your saved apartments.</p>
            <Link
              prefetch
              href="/auth/login"
              className="saved-page__login-link">
              Log in
            </Link>
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
              <Link
                prefetch
                key={property.id}
                href={`/apartment/${property.id}`}>
                <Image
                  priority
                  src={property.images[0]}
                  width={4000}
                  height={4000}
                  alt={property.title}
                />
              </Link>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="no-saved">
          <Image
            priority
            src="/icons/save_apartment.png"
            alt="no saved"
            width={1200}
            height={1200}
            className="no-saved__illustration"
          />

          <p className="no-saved__message">No saved apartments yet! 🏠</p>
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
          <Chip
            type="button"
            aria-pressed={currentTab === "properties"}
            onClick={() => setCurrentTab("properties")}>
            properties
          </Chip>

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
            <div className="loading">
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

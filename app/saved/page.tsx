"use client";

import React, { useState, useEffect } from "react";
import { articles } from "../fetch/data/articles";
import { getProperties } from "../utils/api";
import "./saved.css";
import ArticleCard from "../components/cards/articleCard/ArticleCard";
import { ArticleType, PropertyType } from "../fetch/types";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SavedPage = () => {
  const [properties, setProperties] = useState([]);
  const [currentTab, setCurrentTab] = useState("properties");
  const [savedProperties, setsavedProperties] = useState([]);
  const userData = useSelector((state: RootState) => state.userdata);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  async () => {
    if (isAuthenticated && userData.userType === "student") {
      const savedsavedProperties = userData?.userInfo.savedProperties;
      const updatedsavedProperties = [...savedsavedProperties];
      const fetchedProperties: PropertyType[] = await getProperties();
      setProperties(fetchedProperties);

      setsavedProperties(updatedsavedProperties);
    }
  };

  function savedTab(tab: string) {
    if (tab === "articles") {
      return articles
        .filter((filter) => filter.saved === true)
        .map((article) => {
          return (
            <ArticleCard
              key={article.title}
              articleData={article as ArticleType}
            />
          );
        });
    } else {
      if (tab === "properties" && savedProperties) {
        return (
          <div className="saved-props">
            {properties
              .filter((filter) => savedProperties.includes(filter.id))
              .map((property) => {
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
            onClick={() => setCurrentTab("articles")}
            className={currentTab === "articles" ? "active" : ""}>
            articles
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

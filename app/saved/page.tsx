"use client";

import React, { useState, useEffect } from "react";
import { articles } from "../fetch/data/articles";
import { properties } from "../fetch/data/properties";
import "./saved.css";
import ArticleCard from "../components/cards/articleCard/ArticleCard";
import { ArticleType } from "../fetch/types";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SavedPage = () => {
  const [currentTab, setCurrentTab] = useState("properties");
  const [savedProperties, setsavedProperties] = useState([]);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    const savedsavedProperties =
      JSON.parse(localStorage.getItem("savedProperties")) || [];

    if (isAuthenticated) {
      const updatedsavedProperties = [...savedsavedProperties];

      // Update localStorage with the new list
      localStorage.setItem(
        "savedProperties",
        JSON.stringify(updatedsavedProperties)
      );
      setsavedProperties(updatedsavedProperties);
    }
  }, []);

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
      if (savedProperties) {
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
    <div className="saved-page">
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
    </div>
  );
};

export default SavedPage;

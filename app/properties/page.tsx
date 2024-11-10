"use client";

import React, { useEffect, useState } from "react";
import data from "../fetch/contents";
import { getProperties } from "../utils/api";
import PropCard from "../components/cards/propcard/PropCard";
import Loader from "../components/loader/Loader";
import "./properties.css";
import { FaSearch } from "react-icons/fa";
import { PropertyType } from "../fetch/types";

const { locations } = data;

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties: PropertyType[] = await getProperties();
      setProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const searchProperties = (query: string, properties: PropertyType[]) => {
    const words = query.toLowerCase().trim().split(" ");
    return properties.filter((property) => {
      const propertyString =
        `${property.title} ${property.location} ${property.type}`.toLowerCase();
      return words.every((word) => propertyString.includes(word));
    });
  };

  const applyFilters = () => {
    const filtered = searchProperties(searchQuery, properties).filter(
      (property) =>
        activeLocation === "all" || property.location === activeLocation
    );
    setFilteredProperties(filtered);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      applyFilters();
      setLoading(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLocationClick = (location: string) => {
    setActiveLocation(location);
    setLoading(true);
    setTimeout(() => {
      applyFilters();
      setLoading(false);
    }, 500);
  };

  return (
    <section className="listings-page">
      <div className="user-search">
        <div className="container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for properties..."
          />
          <div className="search-icon" onClick={handleSearch}>
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="filter">
        <div className="container">
          <span
            className={`${activeLocation === "all" ? "active" : ""}`}
            onClick={() => handleLocationClick("all")}>
            all
          </span>
          {locations.map((location, index) => (
            <span
              key={index}
              className={`${activeLocation === location ? "active" : ""}`}
              onClick={() => handleLocationClick(location)}>
              {location}
            </span>
          ))}
        </div>
      </div>

      <div className="property-listings">
        <div className="container">
          <div className="properties">
            {loading ? (
              <Loader />
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropCard key={property.id} propertyData={property} />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>
                No listed properties found for "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesPage;

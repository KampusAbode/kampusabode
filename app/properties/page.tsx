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
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const fetchedProperties: PropertyType[] = await getProperties();
      setProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  // Function to filter properties by search query
  const searchProperties = (query: string) => {
    const words = query.toLowerCase().trim().split(" ");
    const filtered = properties.filter((property) => {
      const propertyString = `${property.title} ${property.location} ${property.type}`.toLowerCase();
      return words.every((word) => propertyString.includes(word));
    });
    setFilteredProperties(filtered);
  };

  // Function to filter properties by location
  const filterByLocation = (location: string) => {
    setActiveLocation(location);
    if (location === "all") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter((property) => property.location === location);
      setFilteredProperties(filtered);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProperties(query); // Run search function whenever the query changes
  };

  // Handle search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchProperties(searchQuery);
    }
  };

  // Handle location click
  const handleLocationClick = (location: string) => {
    filterByLocation(location); // Run location filter whenever location changes
  };

  return (
    <section className="listings-page">
      <div className="user-search">
        <div className="container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // Run search on Enter press
            placeholder="Search by title, type, location ..."
          />
          <div className="search-icon" onClick={() => searchProperties(searchQuery)}>
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
          {locations.map((location) => (
            <span
              key={location}  // Use location name as key
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

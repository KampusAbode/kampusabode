"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import data from "../fetch/contents";
import { fetchProperties } from "../utils";
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

  // Fetch properties on mount
  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      setLoading(true);
      const fetchedProperties: PropertyType[] = await fetchProperties();
      setProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);
      setLoading(false);
    };
    fetchPropertiesFromDB();
  }, []);

  // Function to filter properties by search query
  const searchProperties = (query: string) => {
    setLoading(true);
    const words = query.toLowerCase().trim().split(" ");
    const filtered = properties.filter((property) => {
      const propertyString =
        `${property.title} ${property.location} ${property.type}`.toLowerCase();
      return words.every((word) => propertyString.includes(word));
    });
    setFilteredProperties(filtered);
     setLoading(false);
  };

  // Function to filter properties by location
  const filterByLocation = (location: string) => {
    setActiveLocation(location);
    if (location === "all") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (property) => property.location === location
      );
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
      <div className="banner">
        <div className="container">
          <span>your comfort</span>
          <h2>
            our priority
            <svg
              width="50"
              height="49"
              viewBox="0 0 50 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24.6571 9.0258C18.75 12.9418 13.3443 17.4625 7.63462 21.628"
                stroke="#CCD7FF"
                strokeWidth="2.65"
                strokeMiterlimit="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M43.1283 16.1354C31.9263 19.0499 20.869 23.231 10.2516 27.7933"
                stroke="#CCD7FF"
                strokeWidth="2.65"
                strokeMiterlimit="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M38.189 35.6927C30.4675 33.8314 18.8695 34.5847 10.6475 34.622"
                stroke="#CCD7FF"
                strokeWidth="2.65"
                strokeMiterlimit="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h2>
        </div>

        <Image
          className="dot1"
          width={109}
          height={251.8}
          src="/assets/Dots.png"
          alt="dots"
        />
        <Image
          className="dot2"
          width={109}
          height={251.8}
          src="/assets/Dots.png"
          alt="dots"
        />

        <Image
          className="building"
          width={387}
          height={253}
          src="/assets/Building.svg"
          alt="buildings"
        />
      </div>

      <div className="user-search">
        <div className="container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // Run search on Enter press
            placeholder="Search by title, type, location ..."
          />
          <div
            className="search-icon"
            onClick={() => searchProperties(searchQuery)}>
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
              key={location} // Use location name as key
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

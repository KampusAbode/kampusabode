"use client";

import React, { useState } from "react";
import data from "../fetch/contents";
import { properties } from "../fetch/data/properties";
import PropCard from "../components/cards/propcard/PropCard";
import Loader from "../components/loader/Loader";
import "./properties.css";
import { FaSearch } from "react-icons/fa";
import { PropertyType } from "../fetch/types";
// import { FaSearch } from "react-icons/fa";



// , locations, priceRanges, bedroomOptions
const { locations } = data;

const PropertiesPage = () => {
  // const [filters, setFilters] = useState({
  //   type: "",
  //   location: "",
  //   priceRange: "",
  //   bedrooms: "",
  // });
  const [filteredProperties, setFilteredProperties] =
    useState<PropertyType[]>(properties);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState('all');
  const [loading, setLoading] = useState(false);

  // function handleInputChange (e: any)  {
  //   const { name, value } = e.target;
  //   setFilters({
  //     ...filters,
  //     [name]: value,
  //   });
  // };

  // const filterProperties = () => {
  //   let result = properties;

  //   if (filters.searchQuery) {
  //     const queryWords = filters.searchQuery
  //       .toLowerCase()
  //       .split(" ")
  //       .filter(Boolean);

  //     result = result.filter((property) => {
  //       const titleWords = property.title
  //         .toLowerCase()
  //         .split(" ")
  //         .filter(Boolean);
  //       const commonWords = queryWords.filter((word) =>
  //         titleWords.includes(word)
  //       );
  //       return commonWords.length >= 3; // Matches if 3 or more words match
  //     });
  //   }
  //   if (filters.type) {
  //     result = result.filter((property) => property.type === filters.type);
  //   }
  //   if (filters.location) {
  //     result = result.filter(
  //       (property) => property.location === filters.location
  //     );
  //   }
  //   if (filters.priceRange) {
  //     const [minPrice, maxPrice] = filters.priceRange.split(",").map(Number);
  //     result = result.filter(
  //       (property) => property.price >= minPrice && property.price <= maxPrice
  //     );
  //   }
  //   if (filters.bedrooms) {
  //     result = result.filter(
  //       (property) => `${property.bedrooms}` === filters.bedrooms
  //     );
  //   }

  //   setFilteredProperties(result);
  // };

  function searchProperties(
    query: string,
    properties: PropertyType[]
  ): PropertyType[] {
    const words: string[] = query.toLowerCase().trim().split(" ");
    return properties.filter((property: PropertyType) => {
      const propertyString =
        `${property.title} ${property.location} ${property.type}`.toLowerCase();
      return words.every((word: string) => propertyString.includes(word));
    });
  }

  const handleSearch = () => {
    setFilteredProperties([]);
    setLoading(true);

    const filtered: PropertyType[] = searchProperties(searchQuery, properties);

    setTimeout(() => {
      setFilteredProperties(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="listings-page">
      {/* <div className="search-filters">
        <select name="type" value={filters.type} onChange={handleInputChange}>
          <option value="">Select Type</option>
          {propertyTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          name="location"
          value={filters.location}
          onChange={handleInputChange}>
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
              </option>
          ))}
          </select>
        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleInputChange}>
          <option value="">Select Price Range</option>
          {priceRanges.map((range, index) => (
            <option key={index} value={`${range.value}`}>
              {range.label}
            </option>
          ))}
        </select>
        <select
        name="bedrooms"
        value={filters.bedrooms}
        onChange={handleInputChange}>
          <option value="">Select Bedrooms</option>
          {bedroomOptions.map((bedrooms, index) => {
            return (
              <option key={index} value={`${bedrooms}`}>
              {bedrooms} Bedrooms
              </option>
              );
              })}
              </select>
              </div> */}

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
            className={`${activeLocation === 'all' ? "active" : ''}`}
            onClick={() => {
              setActiveLocation("all");
              setLoading(true);
              setTimeout(() => {
                setFilteredProperties(properties);
                setLoading(false);
              }, 500);
            }}>
            all
          </span>
          {locations.map((location, index) => {
            return (
              <span
                key={`${index + location}`}
                className={`${activeLocation === location ? "active" : ''}`}
                onClick={() => {
                  setActiveLocation(location);
                  const filterByType = properties.filter(
                    (property) => property.location === location
                  );
                  setLoading(true);
                  setTimeout(() => {
                    setFilteredProperties(filterByType);
                    setLoading(false);
                  }, 500);
                }}>
                {location}
              </span>
            );
          })}
        </div>
      </div>

      <div className="property-listings">
        <div className="container">
          <div className="properties">
            {loading ? (
              <Loader />
            ) : filteredProperties && filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropCard key={property.title} propertyData={property} />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>
                No listed properties found - {searchQuery}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesPage;

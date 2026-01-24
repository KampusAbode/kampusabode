"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { fetchPropertiesRealtime } from "../utils";
import PropCard from "./propcard/PropCard";
import Loader from "../components/loader/Loader";
import "./apartment.css";
import { FaSearch, FaFilter, FaTimes, FaCheck } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropertiesStore } from "../store/propertiesStore";
import data from "../fetch/contents";

const PropertiesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    searchQuery,
    activeLocation,
    isLoading,
    filteredProperties,
    setSearchQuery,
    setActiveLocation,
    setLoading,
    properties,
    setProperties,
    filterProperties,
  } = usePropertiesStore();

  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  const sortOptions = [
    { value: 'recommended', label: 'Recommended', icon: '⭐' },
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
    { value: 'popular', label: 'Most Popular', icon: '🔥' }
  ];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
      setProperties(fetchedProperties);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, [setProperties, setLoading]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const loc = searchParams.get("loc") || "all";
    const sort = searchParams.get("sort") || "recommended";

    if (searchQuery !== q) setSearchQuery(q);
    if (activeLocation !== loc) setActiveLocation(loc);
    if (sortBy !== sort) setSortBy(sort);

    filterProperties();
  }, [searchParams]);

  useEffect(() => {
    if (properties.length > 0) {
      filterProperties();
    }
  }, [properties, searchQuery, activeLocation]);

  // Smart sorting algorithm
  const calculateScore = (property) => {
    let score = 0;
    
    // Recency bonus (max 30 points)
    const daysOld = (Date.now() - (property.listedDate || property.createdAt || Date.now())) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 30 - daysOld);
    
    // Quality indicators
    if (property.images && property.images.length > 0) score += 10;
    if (property.isVerified) score += 15;
    
    // Engagement
    score += (property.views || 0) * 0.5;
    score += (property.inquiries || 0) * 2;
    
    // Small stable random component for variety
    score += (property.id.charCodeAt(0) % 10) / 10;
    
    return score;
  };

  // Apply sorting to filtered properties
  const sortedProperties = useMemo(() => {
    let sorted = [...filteredProperties];

    switch (sortBy) {
      case 'recommended':
        sorted.sort((a, b) => calculateScore(b) - calculateScore(a));
        break;
      
      case 'newest':
        sorted.sort((a, b) => (new Date(b.createdAt).getTime()) - (new Date(a.createdAt).getTime())
        );
        break;
      
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      
      case 'popular':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      
      default:
        break;
    }

    return sorted;
  }, [filteredProperties, sortBy]);

  const updateSearchParams = (query: string, location: string, sort: string = sortBy) => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (location && location !== "all") params.set("loc", location);
    if (sort !== "recommended") params.set("sort", sort);

    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateSearchParams(searchQuery, activeLocation);
      filterProperties();
    }
  };

  const filterByLocation = (location: string) => {
    setActiveLocation(location);
    updateSearchParams(searchQuery, location);
    filterProperties();
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateSearchParams(searchQuery, activeLocation, newSort);
    setTimeout(() => setShowFilter(false), 300);
  };

  return (
    <section className="listings-page">
      <div className="banner">
        <div className="container">
          <span>Rent Smart</span>
          <h2>
            Rent Better
            <svg width="30" height="30" viewBox="0 0 50 49" fill="none">
              <path
                d="M24.6571 9.0258C18.75 12.9418 13.3443 17.4625 7.63462 21.628"
                stroke="#CCD7FF"
                strokeWidth="2.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M43.1283 16.1354C31.9263 19.0499 20.869 23.231 10.2516 27.7933"
                stroke="#CCD7FF"
                strokeWidth="2.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M38.189 35.6927C30.4675 33.8314 18.8695 34.5847 10.6475 34.622"
                stroke="#CCD7FF"
                strokeWidth="2.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h2>
        </div>
        <Image
          priority
          className="dot1"
          width={109}
          height={251.8}
          src="/assets/Dots.png"
          alt="dots"
        />
      </div>

      <div className="user-search">
        <div className="container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by title, type, location ..."
          />
          <div
            className="search-icon"
            onClick={() => {
              updateSearchParams(searchQuery, activeLocation);
              filterProperties();
            }}>
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="filter">
        <div className="container">
           <button 
            className="sort-trigger-btn"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter />
            <span>Sort</span>
          </button>

          <div className="filter-locations">
            <span
              className={`filter-btn ${activeLocation === "all" ? "active" : ""}`}
              onClick={() => filterByLocation("all")}>
              all
            </span>
            {data.locations.map((location) => (
              <span
                key={location}
                className={`filter-btn ${
                  activeLocation.toLowerCase() === location.toLowerCase()
                    ? "active"
                    : ""
                }`}
                onClick={() => filterByLocation(location.toLowerCase())}>
                {location}
              </span>
            ))}
          </div>
          
         
        </div>
      </div>

      {/* Sliding Filter Component */}
      <div className={`filter-slide ${showFilter ? 'show' : ''}`}>
        <div className="filter-overlay" onClick={() => setShowFilter(false)} />
        
        <div className="filter-content">
          <div className="filter-header">
            <h3>Sort Properties</h3>
            <button 
              className="close-btn"
              onClick={() => setShowFilter(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="sort-options">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                onClick={() => handleSortChange(option.value)}
              >
                <div className="option-info">
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </div>
                {sortBy === option.value && (
                  <FaCheck className="check-icon" />
                )}
              </div>
            ))}
          </div>

          <div className="filter-footer">
            <button 
              className="apply-btn"
              onClick={() => setShowFilter(false)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="property-listings">
        <div className="container">
          {isLoading ? (
            <Loader />
          ) : sortedProperties.length > 0 ? (
            <>
              <div className="results-info">
                <p>{sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'} found</p>
                <p className="current-sort">
                  Sorted by: <strong>{sortOptions.find(o => o.value === sortBy)?.label}</strong>
                </p>
              </div>
              <div className="properties">
                {sortedProperties.map((property) => (
                  <PropCard key={property.id} propertyData={property} />
                ))}
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", marginBlock: "2rem" }}>
              No listed property found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertiesPage;
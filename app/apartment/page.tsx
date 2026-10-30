"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { fetchPropertiesRealtime } from "../utils";
import PropCard from "./propcard/PropCard";
// import Filter from "../components/features/filter/Filter";
import { CardSkeletonGrid } from "../components/loader/Loader";
import { Button } from "../components/button/Button";
import Chip from "../components/button/Chip";
import IconButton from "../components/button/IconButton";
import "./apartment.css";
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
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
  const [sortBy, setSortBy] = useState("recommended");

  const sortOptions = [
    { value: "recommended", label: "Recommended", icon: Sparkles },
    { value: "newest", label: "Newest First", icon: Clock3 },
    { value: "price-low", label: "Price: Low to High", icon: ArrowUp },
    { value: "price-high", label: "Price: High to Low", icon: ArrowDown },
    { value: "popular", label: "Most Popular", icon: TrendingUp },
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
    const daysOld =
      (Date.now() - (property.listedDate || property.createdAt || Date.now())) /
      (1000 * 60 * 60 * 24);
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
      case "recommended":
        sorted.sort((a, b) => calculateScore(b) - calculateScore(a));
        break;

      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;

      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;

      case "popular":
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;

      default:
        break;
    }

    return sorted;
  }, [filteredProperties, sortBy]);

  const updateSearchParams = (
    query: string,
    location: string,
    sort: string = sortBy,
  ) => {
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
          <div className="search-controls">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              aria-label="Search apartments"
              placeholder="Search by title, type, location ..."
            />
            <Button
              variant="primary"
              size="md"
              type="button"
              className="search-icon"
              aria-label="Search apartments"
              leftIcon={
                <Search aria-hidden="true" size={20} strokeWidth={1.75} />
              }
              onClick={() => {
                updateSearchParams(searchQuery, activeLocation);
                filterProperties();
              }}
            />
          </div>
        </div>
      </div>

      <div className="filter">
        <div className="container">
          <IconButton
            type="button"
            className="filter-trigger"
            aria-label="Open sort options"
            aria-expanded={showFilter}
            onClick={() => setShowFilter(!showFilter)}
          >
            <SlidersHorizontal aria-hidden="true" size={20} strokeWidth={1.75} />
          </IconButton>
          <div className="filter-locations" aria-label="Filter by location">
            <Chip
              type="button"
              className="filter-chip"
              aria-pressed={activeLocation === "all"}
              onClick={() => filterByLocation("all")}
            >
              all
            </Chip>
            {data.locations.map((location) => (
              <Chip
                type="button"
                key={location}
                className="filter-chip"
                aria-pressed={
                  activeLocation.toLowerCase() === location.toLowerCase()
                }
                onClick={() => filterByLocation(location.toLowerCase())}
              >
                {location}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`filter-slide ${showFilter ? "show" : ""}`}
        aria-hidden={!showFilter}
      >
        <div
          className="filter-overlay"
          onClick={() => setShowFilter(false)}
        />

        <div
          className="filter-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sort-properties-title"
        >
          <div className="filter-header">
            <h3 id="sort-properties-title">Sort Properties</h3>
            <IconButton
              type="button"
              className="close-btn"
              aria-label="Close sort options"
              onClick={() => setShowFilter(false)}
            >
              <X aria-hidden="true" size={20} strokeWidth={1.75} />
            </IconButton>
          </div>

          <div className="sort-options">
            {sortOptions.map((option) => {
              const OptionIcon = option.icon;

              return (
                <Chip
                  key={option.value}
                  type="button"
                  className="sort-option"
                  aria-pressed={sortBy === option.value}
                  leadingIcon={
                    <OptionIcon
                      className="option-icon"
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.75}
                    />
                  }
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </Chip>
              );
            })}
          </div>

          <div className="filter-footer">
            <Button
              variant="primary"
              size="md"
              type="button"
              className="apply-btn"
              onClick={() => setShowFilter(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      <div className="property-listings">
        <div className="container">
          {isLoading ? (
            <CardSkeletonGrid className="properties" />
          ) : sortedProperties.length > 0 ? (
            <>
              <div className="results-info">
                <p>
                  {sortedProperties.length}{" "}
                  {sortedProperties.length === 1 ? "property" : "properties"}{" "}
                  found
                </p>
                <p className="current-sort">
                  Sorted by:{" "}
                  <strong>
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </strong>
                </p>
              </div>
              <div className="properties">
                {sortedProperties.map((property) => (
                  <PropCard key={property.id} propertyData={property} />
                ))}
              </div>
            </>
          ) : (
            <p className="empty-state">
              No listed property found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertiesPage;

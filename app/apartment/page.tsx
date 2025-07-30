"use client";

import { useEffect } from "react";
import Image from "next/image";
import { fetchPropertiesRealtime } from "../utils";
import PropCard from "./propcard/PropCard";
import Loader from "../components/loader/Loader";
import "./apartment.css";
import { FaSearch } from "react-icons/fa";
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

  // 🔁 Real-time Firestore properties listener
  useEffect(() => {
    setLoading(true);
    const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
      setProperties(fetchedProperties);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, [setProperties, setLoading]);

  // 🧠 Read initial query from URL (only if different from state)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const loc = searchParams.get("loc") || "all";

    if (searchQuery !== q) setSearchQuery(q);
    if (activeLocation !== loc) setActiveLocation(loc);

    filterProperties();
  }, [searchParams]);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    const currentLoc = searchParams.get("loc") || "all";

    if (searchQuery !== currentQ || activeLocation !== currentLoc) {
      router.replace(
        `/apartment?q=${encodeURIComponent(
          searchQuery
        )}&loc=${encodeURIComponent(activeLocation)}`
      );
    }
  }, [searchQuery, activeLocation]);


  useEffect(() => {
    if (properties.length > 0) {
      filterProperties();
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      filterProperties();
    }
  };

  const filterByLocation = (location: string) => {
    setActiveLocation(location);
  };

  return (
    <section className="listings-page">
      {/* ✅ Banner */}
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
        {/* Optional Building Illustration */}
        {/* <Image
          priority
          className="building"
          width={387}
          height={253}
          src="/assets/Building.svg"
          alt="buildings"
        /> */}
      </div>

      {/* 🔎 Search */}
      <div className="user-search">
        <div className="container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by title, type, location ..."
          />
          <div className="search-icon" onClick={() => filterProperties()}>
            <FaSearch />
          </div>
        </div>
      </div>

      {/* 🗺️ Location Filter */}
      <div className="filter">
        <div className="container">
          <span
            className={`filter-btn ${activeLocation === "all" ? "active" : ""}`}
            onClick={() => filterByLocation("all")}>
            all
          </span>
          {data.locations.map((location) => (
            <span
              key={location}
              className={`filter-btn ${
                activeLocation === location ? "active" : ""
              }`}
              onClick={() => filterByLocation(location)}>
              {location}
            </span>
          ))}
        </div>
      </div>

      {/* 🏠 Properties */}
      <div className="property-listings">
        <div className="container">
          {isLoading ? (
            <Loader />
          ) : filteredProperties.length > 0 ? (
            <div className="properties">
              {filteredProperties.map((property) => (
                <PropCard key={property.id} propertyData={property} />
              ))}
            </div>
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

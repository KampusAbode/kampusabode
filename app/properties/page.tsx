"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertiesRealtime } from "../utils"; // Ensure this function returns real-time properties
import PropCard from "./propcard/PropCard";
import Loader from "../components/loader/Loader";
import "./properties.css";
import { FaSearch } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import {
  setProperties,
  setLoading,
  setSearchQuery,
  setActiveLocation,
  filterProperties,
} from "../redux/stateSlice/propertySlice";
import { RootState } from "../redux/store";
import data from "../fetch/contents";
import { useLoadPropertiesFromStorage } from "../hooks/useLoadPropertiesFromStorage";

const PropertiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial search values from URL parameters
  const initialSearchQuery = searchParams.get("q") || "";
  const initialActiveLocation = searchParams.get("loc") || "all";

  // Select values from the Redux store
  const { filteredProperties, isLoading, searchQuery, activeLocation } =
    useSelector((state: RootState) => state.properties);

  // Load persisted data from localStorage on the client
  useLoadPropertiesFromStorage();

  // Listen for real-time updates from Firestore
  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
      dispatch(setProperties(fetchedProperties));
      dispatch(setLoading(false)); // Stop loading once properties are set
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [dispatch]);

  // Apply filters on component mount based on URL params
  useEffect(() => {
    dispatch(setSearchQuery(initialSearchQuery));
    dispatch(setActiveLocation(initialActiveLocation));

    // Delay filtering slightly so properties are set
    const timeout = setTimeout(() => {
      dispatch(filterProperties());
    }, 100);

    return () => clearTimeout(timeout);
  }, [dispatch, initialSearchQuery, initialActiveLocation]);

  // Update URL when search query or active location changes, then apply filtering
  useEffect(() => {
    router.replace(
      `/properties?q=${encodeURIComponent(
        searchQuery
      )}&loc=${encodeURIComponent(activeLocation)}`
    );
    dispatch(filterProperties());
  }, [searchQuery, activeLocation, dispatch, router]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Handle search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(filterProperties());
    }
  };

  // Handle location filter change
  const filterByLocation = (location: string) => {
    dispatch(setActiveLocation(location));
  };

  return (
    <section className="listings-page">
      <div className="banner">
        <div className="container">
          <span>your comfort</span>
          <h2>
            our priority
            <svg width="50" height="49" viewBox="0 0 50 49" fill="none">
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
        <Image
          priority
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
            onKeyDown={handleKeyDown}
            placeholder="Search by title, type, location ..."
          />
          <div
            className="search-icon"
            onClick={() => dispatch(filterProperties())}>
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="filter">
        <div className="container">
          <span
            className={`${activeLocation === "all" ? "active" : ""}`}
            onClick={() => filterByLocation("all")}>
            all
          </span>
          {data.locations.map((location) => (
            <span
              key={location}
              className={`${activeLocation === location ? "active" : ""}`}
              onClick={() => filterByLocation(location)}>
              {location}
            </span>
          ))}
        </div>
      </div>

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

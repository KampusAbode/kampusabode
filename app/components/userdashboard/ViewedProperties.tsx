"use client";

import React, { useState, useEffect } from "react";
import { fetchProperties } from "../../utils";
import { PropertyType } from "../../fetch/types";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewedProperties() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      try {
        const fetchedProperties = await fetchProperties();
        setProperties(fetchedProperties);
        toast.success("Properties loaded successfully!");
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
        toast.error("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesFromDB();
  }, []);

  const visitedProperties = JSON.parse(
    localStorage.getItem("visitedProperties") || "[]"
  );

  const checkProperties = visitedProperties.length
    ? properties.filter((property) =>
        visitedProperties.includes(property.id.toString())
      )
    : [];

  return (
    <div className="viewed-properties">
      <ToastContainer />
      <h4>Viewed Properties</h4>
      <div className="display-viewed-properties">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : checkProperties.length > 0 ? (
          checkProperties.map((property) => (
            <Link key={property.id} href={property.url}>
              <Image
                src={property.images[0]}
                width={800}
                height={800}
                alt="property image"
              />
              <span>{property.location}</span>
            </Link>
          ))
        ) : (
          <p>Got some catching up to do!</p>
        )}
      </div>
    </div>
  );
}

export default ViewedProperties;

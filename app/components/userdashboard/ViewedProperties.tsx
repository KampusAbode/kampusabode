"use client";

import React, { useState, useEffect } from "react";
import { fetchPropertiesRealtime } from "../../utils";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setProperties } from "../../redux/stateSlice/propertySlice";
import { RootState } from "../../redux/store";
import Loader from "../loader/Loader";

function ViewedProperties() {
  const dispatch = useDispatch();

  // Select values from Redux store
  const {
    properties,
    isLoading,
  } = useSelector((state: RootState) => state.properties);

  useEffect(() => {

    // Listen for real-time updates from Firestore
    const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
      dispatch(setProperties(fetchedProperties));
    });

    return () => unsubscribe();
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
      <h5>Viewed Properties</h5>
      <div className="display-viewed-properties">
        {isLoading ? (
          <Loader/>
        ) : checkProperties.length > 0 ? (
          checkProperties.map((property) => (
            <Link key={property.id} href={property.url}>
              <Image
                priority
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

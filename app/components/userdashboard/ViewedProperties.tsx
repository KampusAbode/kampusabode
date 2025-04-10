"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "../loader/Loader";
import { useProperties } from "../../utils";
import { useUserStore } from "../../store/userStore";

const ViewedProperties: React.FC = () => {
  // Get the properties state from your Firebase properties store using Zustand
  // (if you're combining properties under the userStore, we get it from there too)
  const properties = useUserStore((state) => state.properties);
  const setProperties = useUserStore((state) => state.setProperties);
  const { fetchPropertiesRealtime } = useProperties();

  // Retrieve the logged-in user data from the store.
  const user = useUserStore((state) => state.user);

  // Local loading state for properties retrieval
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for realtime updates from Firestore for properties
    const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
      setProperties(fetchedProperties);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setProperties, fetchPropertiesRealtime]);

  // Instead of reading localStorage, check the user's visited properties from the store.
  // We assume the student has the 'viewedProperties' array in `user.userInfo`
  const visitedProperties: string[] =
    user && user.userType === "student" && "viewedProperties" in user.userInfo
      ? (user.userInfo as any).viewedProperties
      : [];

  // Filter the properties list based on visited property IDs
  const checkProperties =
    visitedProperties.length > 0
      ? properties.filter((property) =>
          visitedProperties.includes(property.id.toString())
        )
      : [];

  return (
    <div className="viewed-properties">
      <h5>Viewed Properties</h5>
      <div className="display-viewed-properties">
        {isLoading ? (
          <Loader />
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
};

export default ViewedProperties;

"use client";

import { useEffect, useState } from "react";
import { fetchPropertiesRealtime } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { PropertyType } from "../../fetch/types";
import Link from "next/link";
import Image from "next/image";
import { setLoading, setProperties } from "../../redux/stateSlice/propertySlice";
import Loader from "../loader/Loader";
import { error } from "console";
import { RootState } from "../../redux/store";
// import toast from "react-hot-toast";

const BookmarkedProperties = ({ user }) => {
  const bookmarkedIds = user?.userInfo?.savedProperties || [];
  const dispatch = useDispatch();

  // Select values from Redux store
  const {
    properties,
    filteredProperties,
    isLoading,
    searchQuery,
    activeLocation,
  } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
      dispatch(setLoading(true));
  
      // Listen for real-time updates from Firestore
      const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
        dispatch(setProperties(fetchedProperties));
        dispatch(setLoading(false)); // Stop loading after setting properties
      });
  
      return () => unsubscribe(); // Cleanup listener on component unmount
    }, []); // No need for dispatch in dependencies

  // Filter properties based on bookmarkedIds
  const bookmarkedProperties = properties.filter((property) =>
    bookmarkedIds.includes(property.id)
  );

  return (
    <div className="bookmarked-properties">
      <h5>Your Bookmarked Properties</h5>
      <div className="property-list">
        {isLoading ? (
          <Loader/>
        ) : bookmarkedProperties.length > 0 ? (
          <ul>
            {bookmarkedProperties.map((property) => (
              <li key={property.id}>
                <Link href={property.url}>
                  <Image
                    priority
                    src={property.images[0]}
                    width={800}
                    height={800}
                    alt="property image"
                  />
                  <div>
                    <p>{property.title}</p>
                    <span>
                      {property.price} - {property.location}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No properties bookmarked yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarkedProperties;

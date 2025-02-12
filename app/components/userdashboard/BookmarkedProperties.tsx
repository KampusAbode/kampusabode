"use client";

import { useEffect, useState } from "react";
import { fetchProperties } from "../../utils";
import { PropertyType } from "../../fetch/types";
import Link from "next/link";
import Image from "next/image";
// import toast from "react-hot-toast";

const BookmarkedProperties = ({ user }) => {
  const bookmarkedIds = user?.userInfo?.savedProperties || [];
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      try {
        const fetchedProperties = await fetchProperties();
        setProperties(fetchedProperties);
        // toast.success("Properties loaded successfully!");
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties. Please try again.");
        // toast.error("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesFromDB();
  }, []);

  // Filter properties based on bookmarkedIds
  const bookmarkedProperties = properties.filter((property) =>
    bookmarkedIds.includes(property.id)
  );

  return (
    <div className="bookmarked-properties">
      <h4>Your Bookmarked Properties</h4>
      <div className="property-list">
        {loading ? (
          <p>Loading your bookmarked properties...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
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

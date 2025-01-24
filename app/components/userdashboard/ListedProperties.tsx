"use client";

import { useState, useEffect } from "react";
import { fetchPropertiesByIds } from "../../utils";
import { UserType, PropertyType } from "../../fetch/types";
import Link from "next/link";

const ListedProperties = ({ user }: { user: UserType }) => {
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Reset any previous error

        if ("propertiesListed" in user.userInfo) {
          const propertiesListed = user.userInfo.propertiesListed || [];
          if (propertiesListed.length === 0) {
            setFilteredProperties([]);
            return;
          }

          const fetchedProperties: PropertyType[] = await fetchPropertiesByIds(
            propertiesListed.map((property) => property.id)
          );

          setFilteredProperties(fetchedProperties);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching properties:", errorMessage);
        setError(errorMessage); // Set error message
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPropertiesFromDB();
  }, [user]);

  return (
    <div className="listed-properties">
      <h4>
        Your Listed Properties{" "}
        <Link href={"/upload"} className="btn">
          Upload apartment
        </Link>
      </h4>
      <div className="property-list">
        {loading ? (
          <p>Loading properties...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredProperties.length > 0 ? (
          <ul>
            {filteredProperties.map((property) => (
              <li key={property.id}>
                <span>{property.title}</span> <span>₦{property.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no listed properties.</p>
        )}
      </div>
    </div>
  );
};

export default ListedProperties;
 
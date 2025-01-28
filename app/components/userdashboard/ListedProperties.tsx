"use client";

import { useState, useEffect } from "react";
import { fetchPropertiesByIds } from "../../utils";
import { UserType, PropertyType } from "../../fetch/types";
import Link from "next/link";
import Image from "next/image";

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
        Your Listings{" "}
        <Link href={"/upload"} className="btn">
          Upload
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
                <Link href={property.url}>
                  <Image src={property.images[0]} alt={property.title} width={500} height={300} />
                  <div className="detail">
                    <span>{property.title}</span>
                    <span>₦{property.price}</span>
                  </div>
                  
                  {/* <div>

                  </div> */}
                
                </Link>
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
 
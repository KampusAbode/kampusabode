"use client";

import { useState, useEffect } from "react";
import { fetchProperties, fetchPropertiesByIds } from "../../utils";
import { UserType, PropertyType } from "../../fetch/types";
import Link from "next/link";

const ListedProperties = ({ user }: { user: UserType }) => {
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(
    []
  );

  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      if ("propertiesListed" in user.userInfo) {
        const propertiesListed = user.userInfo.propertiesListed || [];

        const fetchedProperties: PropertyType[] = await fetchPropertiesByIds(
          "propertiesListed" in user.userInfo
            ? propertiesListed.map((property) => property.id)
            : []
        );
       

        setFilteredProperties(fetchedProperties);
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
        <ul>
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <li key={property.id}>
                <span>{property.title}</span> <span>₦{property.price}</span>
              </li>
            ))
          ) : (
            <p>You have no listed properties.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ListedProperties;

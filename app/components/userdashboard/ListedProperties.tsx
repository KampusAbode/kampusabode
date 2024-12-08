"use client";

import { useState, useEffect } from "react";
import { getProperties } from "../../utils/api";
import { AgentType, PropertyType } from "../../fetch/types";
import Link from "next/link";

const ListedProperties = ({ user }: { user: AgentType }) => {
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(
    []
  );

  useEffect(() => {
    const fetchProperties = async () => {
      const { propertiesListed } = user.userInfo;

      const fetchedProperties: PropertyType[] = await getProperties();
      const filtered = fetchedProperties.filter((property) =>
        propertiesListed.some(
          (listedProperty) => listedProperty.id === property.id.toString()
        )
      );

      setFilteredProperties(filtered);
    };

    fetchProperties();
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

"use client";

import React, { useState, useEffect } from "react";
import { getProperties } from "../../utils";
import { PropertyType } from "../../fetch/types";
import Image from "next/image";
import Link from "next/link";

function ViewedProperties() {
  const [properties, setProperties] = useState<PropertyType[]>([]);

  const visitedProperties = JSON.parse(
    localStorage.getItem("visitedProperties")
  );

  let checkProperties = [];

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await getProperties();
      setProperties(fetchedProperties);
    };
    fetchProperties();
  }, []);

  if (visitedProperties) {
    checkProperties = properties.filter((property) =>
      visitedProperties.includes(property.id.toString())
    );
  } else {
    checkProperties = [];
  }

  return (
    <div className="viewed-properties">
      <h4>viewed properties</h4>
      <div className="display-viewed-properties">
        {checkProperties.length > 0 ? (
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

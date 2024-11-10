"use client";

import { useState, useEffect } from "react";
import { getProperties } from "../../utils/api";

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchPropertiesData = async () => {
      try {
        const propertyData = await getProperties();
        setProperties(propertyData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchPropertiesData();
  }, []);

  return (
    <div className="property-management">
      <h3>Property Management</h3>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            {property.title} - {property.price} - {property.location}
          </li>
        ))}
      </ul>
      {/* Add functionality to add/edit properties */}
    </div>
  );
};

export default PropertyManagement;

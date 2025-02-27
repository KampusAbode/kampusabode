"use client";

import { useState, useEffect } from "react";
import {
  fetchProperties,
  deleteProperty,
  togglePropertyApproval,
} from "../../utils";
import { PropertyType } from "../../fetch/types";

const PropertyManagement = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPropertiesData = async () => {
      setLoading(true);
      setError("");

      try {
        const propertyData = await fetchProperties();
        setProperties(propertyData);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesData();
  }, []);

  const handleDelete = async (id: string, images: string[]) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await deleteProperty(id, images);
      setProperties((prev) => prev.filter((property) => property.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property.");
    }
  };

  const handleToggleAvailability = async (
    id: string,
    currentStatus: boolean
  ) => {
    try {
      await togglePropertyApproval(id, !currentStatus);
      setProperties((prev) =>
        prev.map((property) =>
          property.id === id
            ? { ...property, available: !currentStatus }
            : property
        )
      );
    } catch (error) {
      console.error("Error updating property availability:", error);
      alert("Failed to update availability.");
    }
  };

  return (
    <div className="property-management">
      <h3>Property Management</h3>

      {loading && <p>Loading properties...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <strong>{property.title}</strong> - ${property.price} -{" "}
            {property.location}{" "}
            <span style={{ color: property.available ? "green" : "red" }}>
              ({property.available ? "Available" : "Unavailable"})
            </span>
            <button
              onClick={() =>
                handleToggleAvailability(property.id, property.available)
              }>
              {property.available ? "Mark as Unavailable" : "Mark as Available"}
            </button>
            <button onClick={() => handleDelete(property.id, property.images)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Future feature: Add/Edit properties */}
    </div>
  );
};

export default PropertyManagement;

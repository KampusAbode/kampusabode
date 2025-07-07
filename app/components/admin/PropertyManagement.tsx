"use client";

import { useState, useEffect } from "react";
import { deleteApartment, toggleApartmentApproval } from "../../utils";
import { ApartmentType } from "../../fetch/types";
import Link from "next/link";
import { usePropertiesStore } from "../../store/propertiesStore";

const PropertyManagement = () => {
  const { properties, setProperties } = usePropertiesStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleDelete = async (id: string, images: string[]) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await deleteApartment(id);
      setProperties(properties.filter((property) => property.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property.");
    }
  };

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      await toggleApartmentApproval(id, currentStatus);
      setProperties(
        properties.map((property) =>
          property.id === id
            ? { ...property, approved: !currentStatus }
            : property
        )
      );
    } catch (error) {
      console.error("Error updating property approve:", error);
      alert("Failed to update approve.");
    }
  };

  return (
    <div className="property-management">
      {loading && <p>Loading properties...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <div className="flex">
              <div className="info">
                <p>
                  <Link href={property.url}>{property.title}</Link>
                </p>
                <span>price: {property.price}</span>
                <span>location: {property.location}</span>
                <span>views: {property.views} </span>
              </div>
              <span style={{ color: property.approved ? "green" : "red" }}>
                {property.approved ? "Approved" : "Unapproved"}
              </span>
            </div>
            <div className="action">
              <button
                className="btn btn-secondary"
                title="Button"
                onClick={() =>
                  handleToggleApprove(property.id, property.approved)
                }
                style={{ marginRight: "1rem" }}>
                {property.approved ? "Unapprove" : "approve"}
              </button>
              <button
                className="btn"
                onClick={() => handleDelete(property.id, property.images)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Future feature: Add/Edit properties */}
    </div>
  );
};

export default PropertyManagement;

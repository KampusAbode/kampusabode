"use client";

import { useState } from "react";
import { deleteApartment, toggleApartmentApproval } from "../../utils";
import { usePropertiesStore } from "../../store/propertiesStore";
import Link from "next/link";
import { MdErrorOutline, MdVerified } from "react-icons/md";
import Prompt from "../modals/prompt/Prompt";

const PropertyManagement = () => {
  const { properties, setProperties } = usePropertiesStore();

  const [promptOpen, setPromptOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );

  const handleDeleteRequest = (id: string) => {
    setSelectedPropertyId(id);
    setPromptOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPropertyId) return;

    try {
      await deleteApartment(selectedPropertyId);
      setProperties(properties.filter((p) => p.id !== selectedPropertyId));
      setPromptOpen(false);
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
      {properties.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "5rem" }}>
          No properties found.
        </p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <div className="flex">
                <div className="flex">
                  <div className="image">
                    <img src={property.images[0]} alt={property.title} />
                  </div>
                  <div className="info">
                    <p>
                      <Link href={property.url}>{property.title}</Link>
                    </p>
                    <span>price: {property.price}</span>
                    <span>location: {property.location}</span>
                    <span>views: {property.views} </span>
                  </div>
                </div>
                <span style={{ color: property.approved ? "green" : "red" }}>
                  {property.approved ? (
                    <MdVerified size={20} color="#2ecc71" title="Verified" />
                  ) : (
                    <MdErrorOutline
                      size={20}
                      color="#e74c3c"
                      title="Not Verified"
                    />
                  )}
                </span>
              </div>
              <div className="actions">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    handleToggleApprove(property.id, property.approved)
                  }
                  style={{ marginRight: "1rem" }}>
                  {property.approved ? "Unapprove" : "Approve"}
                </button>
                <button
                  className="btn"
                  onClick={() => handleDeleteRequest(property.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Prompt
        isOpen={promptOpen}
        message="Are you sure you want to delete this property?"
        onCancel={() => setPromptOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default PropertyManagement;

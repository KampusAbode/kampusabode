"use client";

import { useEffect, useState } from "react";
import {
  deleteApartment,
  fetchAllPropertiesRealtime,
  toggleApartmentApproval,
} from "../../utils";
import { usePropertiesStore } from "../../store/propertiesStore";
import Link from "next/link";
import Image from "next/image";
import Prompt from "../modals/prompt/Prompt";
import { RiCloseCircleLine, RiVerifiedBadgeLine } from "react-icons/ri";

const PropertyManagement = () => {
  const { allProperties, setAllProperties } = usePropertiesStore();

  const [promptOpen, setPromptOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = fetchAllPropertiesRealtime((fetchedProperties) => {
    
      setAllProperties(fetchedProperties);
    });

    return () => unsubscribe();
  }, [setAllProperties]);

  const handleDeleteRequest = (id: string) => {
    setSelectedPropertyId(id);
    setPromptOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPropertyId) return;

    try {
      await deleteApartment(selectedPropertyId);
      setAllProperties(
        allProperties.filter((p) => p.id !== selectedPropertyId)
      );
      setPromptOpen(false);
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property.");
    }
  };

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      await toggleApartmentApproval(id, currentStatus);
      setAllProperties(
        allProperties.map((property) =>
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
      {allProperties.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "5rem" }}>
          No properties found.
        </p>
      ) : (
        <ul>
          {allProperties.map((property) => (
            <li key={property.id}>
              <div className="flex">
                <div className="flex">
                  <div className="image">
                    <Link prefetch href={property.url}>
                      <Image src={property.images[0]} width={500} height={500} alt={property.title} />
                    </Link>
                  </div>
                  <div className="info">
                    <p>
                      <Link prefetch href={property.url}>
                        {property.title}
                      </Link>
                    </p>
                    <span>price: {property.price}</span>
                    <span>location: {property.location}</span>
                    <span>views: {property.views} </span>
                  </div>
                </div>
                {property.approved ? (
                  <span
                    className="verified"
                    style={{ color: property.approved ? "green" : "red" }}>
                    <RiVerifiedBadgeLine title="Verified" />
                  </span>
                ) : (
                  <span className="not-verified">
                    <RiCloseCircleLine title="Not Verified" />
                  </span>
                )}
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

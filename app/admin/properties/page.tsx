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
import Prompt from "../../components/modals/prompt/Prompt";
import { BadgeCheck, CircleX } from "lucide-react";
import { notify } from "@/app/lib/notifications/notify";
import { Button } from "../../components/button/Button";

const PropertyManagement = () => {
  const { allProperties, setAllProperties } = usePropertiesStore();

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
      const res = await deleteApartment(selectedPropertyId);
      if (res.success) {
        setAllProperties(
          allProperties.filter((p) => p.id !== selectedPropertyId)
        );
        setPromptOpen(false);
        notify.success(res.message || "Apartment deleted successfully");
      } else {
        throw new Error("Failed to delete property.");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      notify.error("Failed to delete property.");
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
      notify.error("Failed to update approval.");
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
                    <Link prefetch href={property.url}>
                      {property.title}
                    </Link>
                    <span>price: {property.price}</span>
                    <span>location: {property.location}</span>
                    <span>views: {property.views || 0} </span>
                  </div>
                </div>
                {property.approved ? (
                  <span
                    className="verified"
                    style={{ color: property.approved ? "green" : "red" }}>
                    <BadgeCheck aria-label="Verified" size={20} />
                  </span>
                ) : (
                  <span className="not-verified">
                    <CircleX aria-label="Not verified" size={20} />
                  </span>
                )}
              </div>
              <div className="actions">
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleToggleApprove(property.id, property.approved)
                  }
                  style={{ marginRight: "1rem" }}>
                  {property.approved ? "Unapprove" : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteRequest(property.id)}>
                  Delete
                </Button>
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

"use client";

import { useState } from "react";
import { deleteApartment } from "../../../utils";
import { SlOptionsVertical } from "react-icons/sl";
import Link from "next/link";
import Image from "next/image";
import Loader from "../../../components/loader/Loader";
import Prompt from "../../../components/modals/prompt/Prompt";
import toast from "react-hot-toast";
import { useUserStore } from "../../../store/userStore";
import { useRouter } from "next/navigation";
import "./listings.css";

const ListedProperties = () => {
  const user = useUserStore((state) => state.user);
  // Get properties from store instead of fetching
  const properties = useUserStore((state) => state.properties);
  const loading = useUserStore((state) => state.propertiesLoading);
  const error = useUserStore((state) => state.propertiesError);
  const removeProperty = useUserStore((state) => state.removeProperty);

  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const route = useRouter();

  const handleDeleteClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowPrompt(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedPropertyId) return;

      const propertyToDelete = properties.find(
        (p) => p.id === selectedPropertyId
      );
      if (!propertyToDelete) {
        toast.error("Property not found!");
        return;
      }

      const response = await deleteApartment(propertyToDelete.id);
      if (response.success) {
        toast.success(response.message);
        removeProperty(selectedPropertyId); // Update store
        route.refresh();
      } else {
        toast.error(response.message || "Failed to delete property.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "An unexpected error occurred while deleting the property."
        );
      }
    } finally {
      setShowPrompt(false);
      setSelectedPropertyId(null);
    }
  };

  return (
    <section className="listed-properties">
      <div className="container">
        <h4>Your Listings ({properties.length})</h4>
        <div className="property-list">
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="error">{error}</p>
          ) : properties.length > 0 ? (
            <ul>
              {properties.map((property) => (
                <li key={property.id}>
                  {property.url ? (
                    <Link prefetch href={property.url}>
                      <Image
                        priority
                        src={property.images[0]}
                        alt={property.title || "Apartment image"}
                        width={500}
                        height={500}
                      />
                      <div className="detail">
                        <span>{property.title}</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="disabled-link">No link</div>
                  )}

                  {/* <div
                    className="option-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProperty(
                        activeProperty === property.id ? null : property.id
                      );
                    }}>
                    <SlOptionsVertical />
                  </div> */}

                  {/* {activeProperty === property.id && (
                    <div className="options">
                      <Link
                        className="option-btn"
                        href={`/apartment/edit/${property.id}`}>
                        Edit
                      </Link>
                      <button
                        className="option-btn"
                        onClick={() => handleDeleteClick(property.id)}>
                        Delete
                      </button>
                    </div>
                  )} */}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no listings.</p>
          )}
        </div>
      </div>

      <Prompt
        message="Are you sure you want to delete this property? This action cannot be undone."
        isOpen={showPrompt}
        onConfirm={confirmDelete}
        onCancel={() => setShowPrompt(false)}
      />
    </section>
  );
};

export default ListedProperties;

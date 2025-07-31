"use client";

import { useState, useEffect } from "react";
import { deleteApartment, getApartmentsByIds } from "../../utils";
import { ApartmentType } from "../../fetch/types";
import { SlOptionsVertical } from "react-icons/sl";
import Link from "next/link";
import Image from "next/image";
import Loader from "../loader/Loader";
import Prompt from "../modals/prompt/Prompt";
import toast from "react-hot-toast";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";

const ListedProperties = () => {
  const user = useUserStore((state) => state.user);
  const [filteredProperties, setFilteredProperties] = useState<ApartmentType[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const route = useRouter();

  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      try {
        setLoading(true);
        setError(null);

        if (user && "propertiesListed" in user.userInfo) {
          const propertiesListed = user.userInfo.propertiesListed || [];
          console.log("Properties Listed:", propertiesListed);

          const fetchedProperties: ApartmentType[] =
            await getApartmentsByIds(propertiesListed);
          setFilteredProperties(fetchedProperties);
          console.log("Fetched Properties:", fetchedProperties);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching properties:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPropertiesFromDB();
    }
  }, [user]);

  const handleDeleteClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowPrompt(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedPropertyId) return;

      const propertyToDelete = filteredProperties.find(
        (p) => p.id === selectedPropertyId
      );
      if (!propertyToDelete) {
        toast.error("Property not found!");
        return;
      }

      const response = await deleteApartment(propertyToDelete?.id);
      if (response.success) {
        toast.success(response.message);
        setFilteredProperties((prev) =>
          prev.filter((p) => p.id !== selectedPropertyId)
        );
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
    <div className="listed-properties">
      <h5>
        Your Listings{" "}
        {user?.id && (
          <Link prefetch href={`/apartment/c/${user.id}`}>
            Upload
          </Link>
        )}
      </h5>
      <div className="property-list">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredProperties.length > 0 ? (
          <ul>
            {filteredProperties.map((property) => (
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
                      <span>₦{property.price}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="disabled-link">No link</div>
                )}

                <div
                  className="option-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProperty(
                      activeProperty === property.id ? null : property.id
                    );
                  }}>
                  <SlOptionsVertical />
                </div>

                {activeProperty === property.id && (
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
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no listings.</p>
        )}
      </div>

      <Prompt
        message="Are you sure you want to delete this property? This action cannot be undone."
        isOpen={showPrompt}
        onConfirm={confirmDelete}
        onCancel={() => setShowPrompt(false)}
      />
    </div>
  );
};

export default ListedProperties;

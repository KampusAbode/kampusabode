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

const ListedProperties = () => {
  const user = useUserStore((state) => state.user);
  // const { deleteApartment, getApartmentsByIds } = useProperties();
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

  useEffect(() => {
    const fetchPropertiesFromDB = async () => {
      try {
        setLoading(true);
        setError(null);

        if (user && "propertiesListed" in user.userInfo) {
          const propertiesListed = user.userInfo.propertiesListed || [];
          if (propertiesListed.length === 0) {
            setFilteredProperties([]);
            return;
          }

          const fetchedProperties: ApartmentType[] = await getApartmentsByIds(
            propertiesListed
          );
          setFilteredProperties(fetchedProperties);
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

      const response = await deleteApartment(selectedPropertyId);
      if (response.success) {
        toast.success(response.message);
        setFilteredProperties((prev) =>
          prev.filter((p) => p.id !== selectedPropertyId)
        );
      } else {
        toast.error(response.message || "Failed to delete property.");
      }
    } catch (error) {
      // console.log("Error deleting property:", error);
      toast.error(
        error || "An unexpected error occurred while deleting the property."
      );
    } finally {
      setShowPrompt(false);
      setSelectedPropertyId(null);
    }
  };

  return (
    <div className="listed-properties">
      <h5>
        Your Listings{" "}
        <Link href={`/apartment/c/${user?.id}`} className="btn">
          Upload
        </Link>
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
                <Link href={property.url}>
                  <Image
                    priority
                    src={property.images[0]}
                    alt={property.title}
                    width={500}
                    height={500}
                  />
                  <div className="detail">
                    <span>{property.title}</span>
                    <span>₦{property.price}</span>
                  </div>
                </Link>

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
                    {/* <button>Edit</button> */}
                    <button onClick={() => handleDeleteClick(property.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no listed properties.</p>
        )}
      </div>

      <Prompt
        message="This property can't be restored if deleted"
        isOpen={showPrompt}
        onConfirm={confirmDelete}
        onCancel={() => setShowPrompt(false)}
      />
    </div>
  );
};

export default ListedProperties;

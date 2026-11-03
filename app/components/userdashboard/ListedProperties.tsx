"use client";

import { useState } from "react";
import { deleteApartment } from "../../utils";
import { MoreVertical } from "lucide-react";
import { Button, ButtonLink } from "../button/Button";
import IconButton from "../button/IconButton";
import Link from "next/link";
import Image from "next/image";
import Loader from "../loader/Loader";
import Prompt from "../modals/prompt/Prompt";
import InlineBanner from "../notifications/InlineBanner";
import { notify } from "@/app/lib/notifications/notify";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";

const ListedProperties = () => {
  const user = useUserStore((state) => state.user);
  // Get properties from Zustand store instead of fetching
  const properties = useUserStore((state) => state.properties);
  const loading = useUserStore((state) => state.propertiesLoading);
  const error = useUserStore((state) => state.propertiesError);
  const removeProperty = useUserStore((state) => state.removeProperty);

  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const router = useRouter();

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
        notify.error("Property not found!");
        return;
      }

      const response = await deleteApartment(propertyToDelete.id);
      if (response.success) {
        notify.success(response.message);
        // Update Zustand store - this will automatically update both dashboard and listings page
        removeProperty(selectedPropertyId);
        router.refresh();
      } else {
        notify.error(response.message || "Failed to delete property.");
      }
    } catch (error) {
      if (error instanceof Error) {
        notify.error(error.message);
      } else {
        notify.error(
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
          <ButtonLink
            prefetch
            href={`/apartment/c/${user.id}`}
            variant="link"
            size="sm">
            Upload
          </ButtonLink>
        )}
      </h5>
      <div className="property-list">
        {loading ? (
          <Loader />
        ) : error ? (
          <InlineBanner variant="error">{error}</InlineBanner>
        ) : properties.length > 0 ? (
          <ul>
            {properties.slice(0, 3).map((property) => (
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

                <IconButton
                  type="button"
                  aria-label={`More options for ${property.title}`}
                  className="listed-properties__options-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProperty(
                      activeProperty === property.id ? null : property.id
                    );
                  }}>
                  <MoreVertical size={20} strokeWidth={1.75} />
                </IconButton>

                {activeProperty === property.id && (
                  <div className="options">
                    <ButtonLink
                      className="listed-properties__menu-action"
                      href={`/apartment/edit/${property.id}`}
                      variant="ghost"
                      size="sm">
                      Edit
                    </ButtonLink>
                    <Button
                      type="button"
                      className="listed-properties__menu-action"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(property.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no listings.</p>
        )}
      </div>

    
      {properties.length > 5 && user?.id && (
        <div className="view-all-container">
          <ButtonLink
            prefetch
            href={`/dashboard/${user.id}/listings`}
            className="view-all-link"
            variant="outline">
            View All Listings ({properties.length})
          </ButtonLink>
        </div>
      )}

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

"use client";

import { useEffect, useState } from "react";
import { ApartmentType } from "../../fetch/types";
import { useUserStore } from "../../store/userStore";
import { getApartmentsByIds } from "../../utils";
import Loader from "../loader/Loader";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { AgentUserInfo, StudentUserInfo } from "../../fetch/types";
import { usePropertiesStore } from "../../store/propertiesStore";

// Type guard to check if user is a tenant (student)
const isUserType = (
  userType: string,
  userInfo: AgentUserInfo | StudentUserInfo
): userInfo is StudentUserInfo => {
  return userType === "student";
};

const BookmarkedProperties = () => {
  // const { getApartmentsByIds } = useProperties();
  const user = useUserStore((state) => state.user);
  const [bookmarkedProperties, setBookmarkedProperties] = useState<
    ApartmentType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getPropertiesByIds } = usePropertiesStore();

  const bookmarkedIds: string[] =
    user && isUserType(user.userType, user.userInfo)
      ? user.userInfo.savedProperties || []
      : [];

  useEffect(() => {
    const fetchBookmarkedProperties = async () => {
      if (!user || !isUserType(user.userType, user.userInfo)) {
        setBookmarkedProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (bookmarkedIds.length === 0) {
          setBookmarkedProperties([]);
          return;
        }

        const fetched = getPropertiesByIds(bookmarkedIds);
        setBookmarkedProperties(fetched);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching bookmarked properties:", errorMessage);
        setError(errorMessage);
        toast.error("Failed to load bookmarked properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedProperties();
  }, [user, bookmarkedIds]);

  if (!user || !isUserType(user.userType, user.userInfo)) {
    return <p>This section is only available to student users.</p>;
  }

  return (
    <div className="bookmarked-properties">
      <h5>Your Bookmarked Properties</h5>
      <div className="property-list">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="error">{error}</p>
        ) : bookmarkedProperties.length > 0 ? (
          <ul>
            {bookmarkedProperties.map((property) => (
              <li key={property.id}>
                <Link href={property.url}>
                  <Image
                    priority
                    src={property.images[0]}
                    width={800}
                    height={800}
                    alt={property.title}
                  />
                  <div>
                    <p>{property.title}</p>
                    <span>
                      ₦{property.price} - {property.location}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No properties bookmarked yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarkedProperties;

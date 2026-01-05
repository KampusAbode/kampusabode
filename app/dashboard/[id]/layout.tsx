"use client";

import { useEffect } from "react";
import { useUserStore } from "../../store/userStore";
import { getApartmentsByIds } from "../../utils";
import { ApartmentType } from "../../fetch/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = useUserStore((state) => state.user);
  const setProperties = useUserStore((state) => state.setProperties);
  const setPropertiesLoading = useUserStore(
    (state) => state.setPropertiesLoading
  );
  const setPropertiesError = useUserStore((state) => state.setPropertiesError);

  useEffect(() => {
    const fetchProperties = async () => {
      // Only fetch for agents with listed properties
      if (!user || user.userType !== "agent") return;
      if (!("propertiesListed" in user.userInfo)) return;

      try {
        setPropertiesLoading(true);
        setPropertiesError(null);

        const propertiesListed = user.userInfo.propertiesListed || [];

        if (propertiesListed.length > 0) {
          const fetchedProperties: ApartmentType[] =
            await getApartmentsByIds(propertiesListed);
          setProperties(fetchedProperties);
          console.log("Properties fetched in layout:", fetchedProperties);
        } else {
          setProperties([]);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching properties:", errorMessage);
        setPropertiesError(errorMessage);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, [user, setProperties, setPropertiesLoading, setPropertiesError]);

  return <>{children}</>;
};

export default DashboardLayout;

// store/propertiesStore.ts
'use client'

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { ApartmentType } from "../fetch/types";
import { fetchPropertiesRealtime } from "../utils";

interface PropertiesState {
  properties: ApartmentType[];
  filteredProperties: ApartmentType[];
  isLoading: boolean;
  searchQuery: string;
  activeLocation: string;
  setProperties: (properties: ApartmentType[]) => void;
  setFilteredProperties: (filtered: ApartmentType[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveLocation: (location: string) => void;
  filterProperties: () => void;
}

export const usePropertiesStore = create<PropertiesState>()(
  persist(
    (set, get) => ({
      properties: () => {

         useEffect(() => {
            // Listen for realtime updates from Firestore and update Zustand store
            const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
              set({ properties: fetchedProperties });
            });
        
            return () => unsubscribe();
          }, []);
        
      },
      filteredProperties: [],
      isLoading: false,
      searchQuery: "",
      activeLocation: "all",

      setProperties: (properties) => set({ properties }),
      setFilteredProperties: (filtered) =>
        set({ filteredProperties: filtered }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveLocation: (location) => set({ activeLocation: location }),

      filterProperties: () => {
        const { properties, searchQuery, activeLocation } = get();
        const query = searchQuery.trim().toLowerCase();
        const queryWords = query.split(/\s+/);
        const filtered = properties.filter((property) => {
          const titleWords = property.title.toLowerCase().split(/\s+/);
          const matches =
            queryWords.filter((word) => titleWords.includes(word)).length >=
              2 ||
            property.location.toLowerCase().includes(query) ||
            property.type.toLowerCase().includes(query);
          const locationMatch =
            activeLocation === "all" || property.location === activeLocation;
          return matches && locationMatch;
        });
        set({ filteredProperties: filtered });
      },
    }),
    {
      name: "propertiesstore",
    }
  )
);

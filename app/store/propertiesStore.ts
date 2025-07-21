// store/propertiesStore.ts

import { ApartmentType } from "../fetch/types";
import { create } from "zustand";

interface PropertiesState {
  properties: ApartmentType[];
  allProperties: ApartmentType[];
  filteredProperties: ApartmentType[];
  isLoading: boolean;
  searchQuery: string;
  activeLocation: string;
  setProperties: (properties: ApartmentType[]) => void;
  setAllProperties: (properties: ApartmentType[]) => void;
  setFilteredProperties: (filtered: ApartmentType[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveLocation: (location: string) => void;
  filterProperties: () => void;
  getPropertyById: (id: string) => ApartmentType;
  getPropertiesByIds: (ids: string[]) => ApartmentType[];
}

export const usePropertiesStore = create<PropertiesState>()((set, get) => ({
  properties: [],
  allProperties: [],
  filteredProperties: [],
  isLoading: false,
  searchQuery: "",
  activeLocation: "all",

  setProperties: (properties) => set({ properties }),
  setAllProperties: (properties) => set({ allProperties: properties }),
  setFilteredProperties: (filtered) => set({ filteredProperties: filtered }),
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
        queryWords.filter((word) => titleWords.includes(word)).length >= 2 ||
        property.location.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query);
      const locationMatch =
        activeLocation === "all" || property.location === activeLocation;
      return matches && locationMatch;
    });
    set({ properties: filtered });
    set({ filteredProperties: filtered });
  },

  getPropertyById: (id: string) => {
    const { properties } = get();
    return properties.find((property) => property.id === id);
  },

  getPropertiesByIds: (ids: string[]) => {
    const { properties } = get();
    return properties.filter((property) => ids.includes(property.id));
  },
}));

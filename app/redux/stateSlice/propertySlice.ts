// src/slices/propertySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyType } from "../../fetch/types";

interface PropertyState {
  properties: PropertyType[];
  filteredProperties: PropertyType[];
  isLoading: boolean;
  searchQuery: string;
  activeLocation: string;
}

const initialState: PropertyState = {
  properties: [],
  filteredProperties: [],
  isLoading: false,
  searchQuery: "",
  activeLocation: "all",
};

const propertySlice = createSlice({
  name: "Properties",
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<PropertyType[]>) => {
      state.properties = action.payload;
      state.filteredProperties = action.payload; // Initial filtered properties
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveLocation: (state, action: PayloadAction<string>) => {
      state.activeLocation = action.payload;
    },
    filterProperties: (state) => {
      const words = state.searchQuery.toLowerCase().trim().split(" ");
      state.filteredProperties = state.properties.filter((property) => {
        const propertyString =
          `${property.title} ${property.location} ${property.type}`.toLowerCase();
        const matchesQuery = words.every((word) =>
          propertyString.includes(word)
        );
        const matchesLocation =
          state.activeLocation === "all" ||
          property.location === state.activeLocation;
        return matchesQuery && matchesLocation;
      });
    },
  },
});

export const {
  setProperties,
  setLoading,
  setSearchQuery,
  setActiveLocation,
  filterProperties,
} = propertySlice.actions;

export default propertySlice.reducer;

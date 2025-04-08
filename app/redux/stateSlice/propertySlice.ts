
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyType } from "../../fetch/types";
import CryptoJS from "crypto-js";

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

const secretKey = process.env.NEXT_PUBLIC__ENCSECRET_KEY!;

const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const propertySlice = createSlice({
  name: "Properties",
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<PropertyType[]>) => {
      state.properties = action.payload;
      state.filteredProperties = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("properties", encryptData(action.payload));
        localStorage.setItem("filteredProperties", encryptData(action.payload));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("isLoading", encryptData(action.payload));
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("searchQuery", encryptData(action.payload));
      }
    },
    setActiveLocation: (state, action: PayloadAction<string>) => {
      state.activeLocation = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("activeLocation", encryptData(action.payload));
      }
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

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "filteredProperties",
          encryptData(state.filteredProperties)
        );
      }
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

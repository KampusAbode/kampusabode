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

// Encryption and decryption function
const secretKey = process.env.NEXT_PUBLIC__ENCSECRET_KEY;

const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Function to load properties and settings from localStorage
const loadFromLocalStorage = () => {
  try {
    const properties = localStorage.getItem("properties");
    const searchQuery = localStorage.getItem("searchQuery");
    const activeLocation = localStorage.getItem("activeLocation");
    const filteredProperties = localStorage.getItem("filteredProperties");
    const isLoading = localStorage.getItem("isLoading");

    return {
      properties: properties ? decryptData(properties) : [],
      filteredProperties: filteredProperties ? decryptData(filteredProperties) : [],
      searchQuery: searchQuery || "",
      activeLocation: activeLocation || "all",
      isLoading: isLoading === "true" || false, // handle boolean values
    };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return {
      properties: [],
      filteredProperties: [],
      searchQuery: "",
      activeLocation: "all",
      isLoading: false,
    };
  }
};

const propertySlice = createSlice({
  name: "Properties",
  initialState: loadFromLocalStorage(), // Load from localStorage on initialization
  reducers: {
    setProperties: (state, action: PayloadAction<PropertyType[]>) => {
      state.properties = action.payload;
      state.filteredProperties = action.payload; // Initial filtered properties
      // Save encrypted data to localStorage
      localStorage.setItem("properties", encryptData(action.payload)); 
      localStorage.setItem("filteredProperties", encryptData(action.payload)); 
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      localStorage.setItem("isLoading", encryptData(action.payload)); // Save loading state to localStorage
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      localStorage.setItem("searchQuery", encryptData(action.payload)); // Save search query to localStorage
    },
    setActiveLocation: (state, action: PayloadAction<string>) => {
      state.activeLocation = action.payload;
      localStorage.setItem("activeLocation", encryptData(action.payload)); // Save location filter to localStorage
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
      localStorage.setItem("filteredProperties", encryptData(state.filteredProperties)); // Save filtered properties to localStorage
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

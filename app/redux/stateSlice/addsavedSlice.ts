import { createSlice } from "@reduxjs/toolkit";
import { fetchPropertiesRealtime } from "../../utils"; // Assuming this fetches real-time data
import { PropertyType } from "../../fetch/types";
import { TrendType } from "../../fetch/types";
import { AddSavedState } from "../../fetch/types";
import storage from "redux-persist/lib/storage"; // Use localStorage
import { persistReducer } from "redux-persist";

// Initial State
const initialState: AddSavedState = {
  savedProperties: [],
  savedTrends: [],
};

// Redux Persist Configuration
const persistConfig = {
  key: "addsaved",
  storage,
  whitelist: ["savedProperties", "savedTrends"],
};

// Slice Definition
const addsavedSlice = createSlice({
  name: "addsaved",
  initialState,
  reducers: {
    // Action to add saved property or trend
    addSaved: (state, action) => {
      const { propType, data } = action.payload;
      if (propType === "property") {
        const isSaved = state.savedProperties.some(
          (prop) => prop.id === data.id
        );
        if (!isSaved) {
          state.savedProperties.push(data as PropertyType);
        }
      } else if (propType === "article") {
        const isSaved = state.savedTrends.some(
          (article) => article.title === data.title
        );
        if (!isSaved) {
          state.savedTrends.push(data as TrendType);
        }
      }
    },

    // Action to remove saved property or trend
    removeSaved: (state, action) => {
      const { propType, data } = action.payload;

      if (propType === "property") {
        state.savedProperties = state.savedProperties.filter(
          (prop) => prop.id !== data.id
        );
      } else if (propType === "article") {
        state.savedTrends = state.savedTrends.filter(
          (article) => article.title !== data.title
        );
      }
    },
  },
});

// Persist the reducer
const persistedReducer = persistReducer(persistConfig, addsavedSlice.reducer);

// Redux Actions
export const { addSaved, removeSaved } = addsavedSlice.actions;

// Reducer with Persistence
export default persistedReducer;

import { createSlice } from "@reduxjs/toolkit";
import { PropertyType, TrendType, AddSavedState } from "../../fetch/types";

// Initial State
const initialState: AddSavedState = {
  savedProperties: [],
  savedTrends: [],
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



// Redux Actions
export const { addSaved, removeSaved } = addsavedSlice.actions;

// Reducer with Persistence
export default addsavedSlice.reducer;

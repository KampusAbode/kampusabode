import { createSlice } from "@reduxjs/toolkit";
import { fetchProperties } from "../../utils";
import { PropertyType } from "../../fetch/types";
import { TrendType } from "../../fetch/types";
import { AddSavedState } from "../../fetch/types";

let properties;

async () => {
  const fetchedProperties: PropertyType[] = await fetchProperties();
  properties = fetchedProperties;
};

const initialState: AddSavedState = {
  savedProperties: [],
  savedTrends: [],
};

export const addsavedSlice = createSlice({
  name: "addsaved",
  initialState,
  reducers: {
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

export const { addSaved, removeSaved } = addsavedSlice.actions;

export default addsavedSlice.reducer;

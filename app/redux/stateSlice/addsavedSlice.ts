import { createSlice } from "@reduxjs/toolkit";
import {properties} from "../../fetch/data/properties";
import {articles} from "../../fetch/data/articles";
import { PropertyType } from "../../fetch/types";
import { ArticleType } from "../../fetch/types";
import { AddSavedState } from "../../fetch/types";


const initialState: AddSavedState = {
  savedProperties: properties
    ? properties.filter((prop: { saved: boolean }) => prop.saved === true)
    : [],
  savedArticles: articles
    ? articles.filter((prop: { saved: boolean }) => prop.saved === true)
    : [],
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
        const isSaved = state.savedArticles.some(
          (article) => article.title === data.title
        );
        if (!isSaved) {
          state.savedArticles.push(data as ArticleType);
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
        state.savedArticles = state.savedArticles.filter(
          (article) => article.title !== data.title
        );
      }
    },
  },
});

export const { addSaved, removeSaved } = addsavedSlice.actions;

export default addsavedSlice.reducer;

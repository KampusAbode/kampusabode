import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../fetch/types";

const initialState: UserType | null = null;

const userdataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserType>) => {
      const localSavedProperties = localStorage.getItem("SavedProperties");
      const savedPropertiesFromLocalStorage = localSavedProperties
        ? JSON.parse(localSavedProperties)
        : [];
      


      // Merge savedProperties from localStorage with state
      if (action.payload.userType === "student") {
        return {
          ...action.payload,
          userInfo: {
            ...action.payload.userInfo,
            savedProperties: savedPropertiesFromLocalStorage,
          },
        };
      } else {
        return action.payload; // For agents or other user types
      }
    },

    updateSavedProperties: (state, action: PayloadAction<string>) => {
      if (state?.userType === "student") {
        state.userInfo.savedProperties = state.userInfo.savedProperties || [];
        state.userInfo.savedProperties = [
          ...state.userInfo.savedProperties,
          action.payload,
        ];

        localStorage.setItem(
          "SavedProperties",
          JSON.stringify(state.userInfo.savedProperties)
        );

      }
    },

    removeSavedProperty: (state, action: PayloadAction<string>) => {
      if (state?.userType === "student") {
        if (state.userInfo.savedProperties) {
          state.userInfo.savedProperties =
            state.userInfo.savedProperties.filter(
              (id) => id !== action.payload
            );

          localStorage.setItem(
            "SavedProperties",
            JSON.stringify(state.userInfo.savedProperties)
          );

        }
      }
    },

    updatePropertyListing: (
      state,
      action: PayloadAction<{ propertyId: number; available: boolean }>
    ) => {
      if (state?.userType === "agent") {
        const property = state.userInfo.propertiesListed.find(
          (p) => p.id === String(action.payload.propertyId)
        );

        if (property) {
          property.available = action.payload.available; // Update availability
        } else {
          state.userInfo.propertiesListed = [
            ...state.userInfo.propertiesListed,
            {
              id: String(action.payload.propertyId),
              available: action.payload.available,
            },
          ];
        }
        
        localStorage.setItem("SavedProperties", JSON.stringify(state));

      }
    },
  },
});

export const {
  setUserData,
  updateSavedProperties,
  removeSavedProperty,
  updatePropertyListing,
} = userdataSlice.actions;

export default userdataSlice.reducer;

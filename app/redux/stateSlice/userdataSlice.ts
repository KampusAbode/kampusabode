import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";

// Helper function to safely retrieve saved properties from localStorage
const getSavedPropertiesFromLocalStorage = (): string[] => {
  try {
    const localSavedProperties = localStorage.getItem("SavedProperties");
    return localSavedProperties ? JSON.parse(localSavedProperties) : [];
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return [];
  }
};

const initialState: UserType = {
  id: "",
  name: "",
  email: "",
  userType: "",
  bio: "",
  avatar: "",
  phoneNumber: "",
  university: "",
  userInfo: {} as StudentUserInfo | AgentUserInfo,
};

const userdataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserType>) => {
      const savedPropertiesFromLocalStorage =
        action.payload.userType === "student"
          ? getSavedPropertiesFromLocalStorage()
          : [];

      return {
        ...state,
        ...action.payload,
        userInfo:
          action.payload.userType === "student"
            ? {
                ...(action.payload.userInfo as StudentUserInfo),
                savedProperties: savedPropertiesFromLocalStorage,
              }
            : (action.payload.userInfo as AgentUserInfo),
      };
    },

    updateSavedProperties: (state, action: PayloadAction<string>) => {
      if (state.userType === "student") {
        const updatedSavedProperties = [
          ...(state.userInfo as StudentUserInfo).savedProperties,
          action.payload,
        ];

        localStorage.setItem(
          "SavedProperties",
          JSON.stringify(updatedSavedProperties)
        );

        return {
          ...state,
          userInfo: {
            ...(state.userInfo as StudentUserInfo),
            savedProperties: updatedSavedProperties,
          },
        };
      }
    },

    removeSavedProperty: (state, action: PayloadAction<string>) => {
      if (state.userType === "student") {
        const updatedSavedProperties = (
          state.userInfo as StudentUserInfo
        ).savedProperties.filter((id) => id !== action.payload);

        localStorage.setItem(
          "SavedProperties",
          JSON.stringify(updatedSavedProperties)
        );

        return {
          ...state,
          userInfo: {
            ...(state.userInfo as StudentUserInfo),
            savedProperties: updatedSavedProperties,
          },
        };
      }
    },

    updatePropertyListing: (state, action: PayloadAction<string>) => {
      if (state.userType === "agent") {
        const agentInfo = state.userInfo as AgentUserInfo;
        if (!agentInfo.propertiesListed.includes(action.payload)) {
          return {
            ...state,
            userInfo: {
              ...agentInfo,
              propertiesListed: [...agentInfo.propertiesListed, action.payload],
            },
          };
        }
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

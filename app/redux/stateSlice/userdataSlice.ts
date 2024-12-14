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
  userInfo: {
    bio: "",
    avatar: "",
    phoneNumber: "",
    ...(true
      ? {
          university: "", // Student-specific
          department: "", // Student-specific
          yearOfStudy: 0, // Student-specific
          savedProperties: [], // Student-specific
          wishlist: [], // Student-specific
        }
      : {
          agencyName: "", // Agent-specific
          propertiesListed: [], // Agent-specific
        }),
  } as StudentUserInfo | AgentUserInfo,
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

      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userType = action.payload.userType;

      if (action.payload.userType === "student") {
        state.userInfo = {
          ...action.payload.userInfo,
          savedProperties: savedPropertiesFromLocalStorage,
        } as StudentUserInfo;
      } else if (action.payload.userType === "agent") {
        state.userInfo = action.payload.userInfo as AgentUserInfo;
      }
    },

    updateSavedProperties: (state, action: PayloadAction<string>) => {
      if (state.userType === "student") {
        const studentInfo = state.userInfo as StudentUserInfo;
        studentInfo.savedProperties.push(action.payload);

        localStorage.setItem(
          "SavedProperties",
          JSON.stringify(studentInfo.savedProperties)
        );
      }
    },

    removeSavedProperty: (state, action: PayloadAction<string>) => {
      if (state.userType === "student") {
        const studentInfo = state.userInfo as StudentUserInfo;
        studentInfo.savedProperties = studentInfo.savedProperties.filter(
          (id) => id !== action.payload
        );

        localStorage.setItem(
          "SavedProperties",
          JSON.stringify(studentInfo.savedProperties)
        );
      }
    },

    updatePropertyListing: (
      state,
      action: PayloadAction<{ propertyId: number; available: boolean }>
    ) => {
      if (state.userType === "agent") {
        const agentInfo = state.userInfo as AgentUserInfo;
        const property = agentInfo.propertiesListed.find(
          (p) => p.id === String(action.payload.propertyId)
        );

        if (property) {
          property.available = action.payload.available;
        } else {
          agentInfo.propertiesListed.push({
            id: String(action.payload.propertyId),
            available: action.payload.available,
          });
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

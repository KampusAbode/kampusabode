// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";




// Define a type for the slice state
interface UserState {
  id: string,
  username: string;
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

// Initial state for the user
const initialState: UserState = {
  id: "",
  username: "",
  email: "",
  userType: "",
  isAuthenticated: false,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userType = action.payload.userType;
      state.isAuthenticated = true; // Update state to log in
    },
    clearUser: (state) => {
      state.username = "";
      state.email = "";
      state.userType = "";
      state.isAuthenticated = false; // User logged out
    },
  },
});

// Export the actions and the reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

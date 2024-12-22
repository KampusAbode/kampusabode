// redux/slices/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";



// Initial state for the user
const initialState = false;

// Create the user slice
const userSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    openMenu: () => true,
    closeMenu: () => false,
  },
});

// Export the actions and the reducer
export const { openMenu, closeMenu } = userSlice.actions;
export default userSlice.reducer;

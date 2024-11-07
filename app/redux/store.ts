import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./stateSlice/userSlice";
import userdataSlice from "./stateSlice/userdataSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    userdata: userdataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

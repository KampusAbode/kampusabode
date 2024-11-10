import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./stateSlice/userSlice";
import userdataSlice from "./stateSlice/userdataSlice";
import propertyReducer from "./stateSlice/propertySlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    userdata: userdataSlice,
    properties: propertyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

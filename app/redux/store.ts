import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./stateSlice/userSlice";
import userdataSlice from "./stateSlice/userdataSlice";
import propertyReducer from "./stateSlice/propertySlice";
import menuSlice from "./stateSlice/menuSlice";
import addsavedSlice from "./stateSlice/addsavedSlice";
import { persistStore } from "redux-persist";


export const store = configureStore({
  reducer: {
    user: userSlice,
    userdata: userdataSlice,
    properties: propertyReducer,
    menu: menuSlice,
    addsaved: addsavedSlice
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

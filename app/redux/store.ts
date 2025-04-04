import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import userSlice from "./stateSlice/userSlice";
import userdataSlice from "./stateSlice/userdataSlice";
import propertyReducer from "./stateSlice/propertySlice";
import menuSlice from "./stateSlice/menuSlice";
import addsavedSlice from "./stateSlice/addsavedSlice";

// Root reducer
const rootReducer = combineReducers({
  user: userSlice,
  userdata: userdataSlice,
  properties: propertyReducer,
  menu: menuSlice,
  addsaved: addsavedSlice,
});

// Persist config (optional here because addsaved is already persisted,
// but you can add other reducers in whitelist later if needed)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["addsaved"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

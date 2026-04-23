import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

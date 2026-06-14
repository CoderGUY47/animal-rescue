import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "./slices/reportsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
 reducer: {
 reports: reportsReducer,
 user: userReducer,
 },
});

// Inferred types — use these throughout the app instead of plain RootState/AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

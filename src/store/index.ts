import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "./slices/reportsSlice";
import userReducer from "./slices/userSlice";
import volunteersReducer from "./slices/volunteersSlice";

export const store = configureStore({
 reducer: {
 reports: reportsReducer,
 user: userReducer,
 volunteers: volunteersReducer,
 },
});

// inferred types — use these throughout the app instead of plain rootstate/appdispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

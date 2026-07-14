import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "./slices/reportsSlice";
import userReducer from "./slices/userSlice";
import volunteersReducer from "./slices/volunteersSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
    user: userReducer,
    volunteers: volunteersReducer,
    notifications: notificationsReducer,
  },
});

// inferred types — use these throughout the app instead of plain rootstate/appdispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

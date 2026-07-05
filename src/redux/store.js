import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import canvasReducer from "./slices/canvasSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Useful for React Flow objects
    }),
});

export default store;

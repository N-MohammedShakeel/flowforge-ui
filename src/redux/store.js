// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import canvasReducer from "./slices/canvasSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // React Flow node/edge objects are not serializable (contain functions)
      serializableCheck: false,
    }),
});

export default store;

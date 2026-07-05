// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, registerThunk, logoutThunk } from "../thunks/authThunks";

// ===== Hydrate from localStorage on app start =====
const storedAuth = (() => {
  try {
    return {
      accessToken: localStorage.getItem("ff_access_token"),
      refreshToken: localStorage.getItem("ff_refresh_token"),
      user: JSON.parse(localStorage.getItem("ff_user") || "null"),
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
})();

const initialState = {
  user: storedAuth.user,
  accessToken: storedAuth.accessToken,
  refreshToken: storedAuth.refreshToken,
  isAuthenticated: !!storedAuth.accessToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by the api.js interceptor after a successful token refresh
    tokenRefreshed: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("ff_access_token", action.payload.accessToken);
      localStorage.setItem("ff_refresh_token", action.payload.refreshToken);
    },

    // Hard logout — clear all state and storage
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("ff_access_token");
      localStorage.removeItem("ff_refresh_token");
      localStorage.removeItem("ff_user");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ===== Login =====
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        // Persist to localStorage
        localStorage.setItem("ff_access_token", action.payload.accessToken);
        localStorage.setItem("ff_refresh_token", action.payload.refreshToken);
        localStorage.setItem("ff_user", JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed. Please try again.";
      });

    // ===== Register =====
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("ff_access_token", action.payload.accessToken);
        localStorage.setItem("ff_refresh_token", action.payload.refreshToken);
        localStorage.setItem("ff_user", JSON.stringify(action.payload.user));
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Registration failed. Please try again.";
      });

    // ===== Logout =====
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("ff_access_token");
      localStorage.removeItem("ff_refresh_token");
      localStorage.removeItem("ff_user");
    });
  },
});

export const { tokenRefreshed, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

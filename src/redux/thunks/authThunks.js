// src/redux/thunks/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../services/api";

/**
 * Normalizes the backend AuthResponse into the shape the Redux store expects.
 */
const normalizeAuthResponse = (data) => ({
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
  user: {
    id: data.userId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    fullName: `${data.firstName} ${data.lastName}`,
  },
});

// ===== Login =====
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.login({ email, password });
      return normalizeAuthResponse(response.data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";
      return rejectWithValue(message);
    }
  },
);

// ===== Register =====
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.register({
        firstName,
        lastName,
        email,
        password,
      });
      return normalizeAuthResponse(response.data);
    } catch (error) {
      // Handle validation errors from Spring Boot (field-level errors)
      const fieldErrors = error.response?.data?.details;
      if (fieldErrors && typeof fieldErrors === "object") {
        const messages = Object.values(fieldErrors).join(", ");
        return rejectWithValue(messages);
      }
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  },
);

// ===== Logout =====
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Best-effort — tell the server to revoke refresh tokens
      await authApi.logout();
    } catch {
      // Even if the server call fails, we still clear local state
    }
    return null;
  },
);

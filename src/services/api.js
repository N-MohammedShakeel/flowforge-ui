// src/services/api.js
import axios from "axios";
import { logout, tokenRefreshed } from "../redux/slices/authSlice";

let injectedStore;
export const injectStore = (store) => {
  injectedStore = store;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * Primary axios instance — routes all calls through Spring Boot.
 * The Spring Boot backend proxies AI calls to Python, so the frontend
 * never calls Python directly. This keeps auth enforcement centralized.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes — AI calls can be slow
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

// ===== Request Interceptor — Attach JWT =====
api.interceptors.request.use(
  (config) => {
    const token = injectedStore.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== Response Interceptor — Token Refresh on 401 =====
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt token refresh on 401 (but not for auth endpoints themselves)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/")
    ) {
      if (isRefreshing) {
        // Queue requests while refresh is in-flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = injectedStore.getState().auth.refreshToken;

      if (!refreshToken) {
        injectedStore.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        injectedStore.dispatch(
          tokenRefreshed({ accessToken, refreshToken: newRefreshToken }),
        );
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        injectedStore.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ===== Auth Endpoints =====
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  refresh: (data) => api.post("/auth/refresh", data),
  logout: () => api.post("/auth/logout"),
};

// ===== Project Endpoints =====
export const projectApi = {
  getAll: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  saveCanvas: (id, canvasData) =>
    api.post(`/projects/${id}/canvas`, canvasData),
  loadCanvas: (id) => api.get(`/projects/${id}/canvas`),
  saveReview: (id, reviewData) => api.post(`/projects/${id}/review`, reviewData),
  getVersions: (id) => api.get(`/projects/${id}/canvas/versions`),
  createVersion: (id, canvasData) => api.post(`/projects/${id}/canvas/versions`, canvasData),
  loadVersion: (id, version) => api.get(`/projects/${id}/canvas/versions/${version}`),
};

// ===== AI Endpoints (via Spring Boot gateway) =====
export const aiApi = {
  generate: (data) => api.post("/ai/generate", data),
  review: (data) => api.post("/ai/review", data),
  enhance: (data) => api.post("/ai/enhance", data),
};

// ===== File Upload Endpoints =====
export const uploadApi = {
  uploadSrs: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/srs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadProject: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/project", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;

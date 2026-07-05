import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Spring Boot Backend
const PYTHON_AI_URL = "http://localhost:8000/api"; // Python AI Service

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for AI calls
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// AI Endpoints (Python Service)
export const aiApi = {
  generateArchitecture: (data) =>
    axios.post(`${PYTHON_AI_URL}/v1/workflow/generate`, data),

  reviewArchitecture: (data) =>
    axios.post(`${PYTHON_AI_URL}/v1/workflow/review`, data),

  enhanceArchitecture: (data) =>
    axios.post(`${PYTHON_AI_URL}/v1/workflow/enhance`, data),
};

// Backend Endpoints (Spring Boot)
export const backendApi = {
  // Projects
  createProject: (data) => api.post("/projects", data),
  getProjects: () => api.get("/projects"),
  getProjectById: (id) => api.get(`/projects/${id}`),

  // Canvas / Architecture
  saveCanvas: (projectId, canvasData) =>
    api.post(`/projects/${projectId}/canvas`, canvasData),

  getCanvas: (projectId) => api.get(`/projects/${projectId}/canvas`),
};

export default api;

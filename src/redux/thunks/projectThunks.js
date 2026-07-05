// src/redux/thunks/projectThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { projectApi } from "../../services/api";

// ===== Fetch all projects for the authenticated user =====
export const fetchProjectsThunk = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load projects",
      );
    }
  },
);

// ===== Create a new project =====
export const createProjectThunk = createAsyncThunk(
  "projects/create",
  async ({ name, description, tags = [] }, { rejectWithValue }) => {
    try {
      const response = await projectApi.create({ name, description, tags });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project",
      );
    }
  },
);

// ===== Update project metadata =====
export const updateProjectThunk = createAsyncThunk(
  "projects/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await projectApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project",
      );
    }
  },
);

// ===== Delete a project =====
export const deleteProjectThunk = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await projectApi.delete(id);
      return id; // Return ID so the slice can remove it from the list
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project",
      );
    }
  },
);

// ===== Save canvas state =====
export const saveCanvasThunk = createAsyncThunk(
  "projects/saveCanvas",
  async ({ projectId, nodes, edges }, { rejectWithValue }) => {
    try {
      const response = await projectApi.saveCanvas(projectId, { nodes, edges });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save canvas",
      );
    }
  },
);

// ===== Load canvas state =====
export const loadCanvasThunk = createAsyncThunk(
  "projects/loadCanvas",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await projectApi.loadCanvas(projectId);
      return response.data; // { nodes: [], edges: [] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load canvas",
      );
    }
  },
);

// src/redux/slices/canvasSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  review: null,
  version: 0,
  versions: [],
  isLoading: false,
  error: null,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = { ...state.nodes[index], ...action.payload };
      }
    },
    setReview: (state, action) => {
      state.review = action.payload;
    },
    setVersion: (state, action) => {
      state.version = action.payload;
    },
    setVersions: (state, action) => {
      state.versions = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetCanvas: (state) => {
      state.nodes = [];
      state.edges = [];
      state.review = null;
    },
  },
});

export const {
  setNodes,
  setEdges,
  updateNode,
  setReview,
  setVersion,
  setVersions,
  setLoading,
  setError,
  resetCanvas,
} = canvasSlice.actions;

export default canvasSlice.reducer;

import { createAsyncThunk } from "@reduxjs/toolkit";
import { aiApi } from "../../services/api";
import { setNodes, setEdges, setReview } from "../slices/canvasSlice";

// Generate Architecture from Idea
export const generateArchitecture = createAsyncThunk(
  "canvas/generateArchitecture",
  async (description, { dispatch }) => {
    const response = await aiApi.generateArchitecture({
      project_id: `proj_${Date.now()}`,
      source: "IDEA",
      payload: { description },
    });

    const state = response.data.state;

    dispatch(setNodes(state.nodes || []));
    dispatch(setEdges(state.edges || []));

    return state;
  },
);

// Review Current Architecture
export const reviewArchitecture = createAsyncThunk(
  "canvas/reviewArchitecture",
  async ({ nodes, edges }, { dispatch }) => {
    const response = await aiApi.reviewArchitecture({
      project_id: "current",
      nodes,
      edges,
    });

    const review = response.data.state.review;
    dispatch(setReview(review));

    return review;
  },
);

// Enhance Current Architecture
export const enhanceArchitecture = createAsyncThunk(
  "canvas/enhanceArchitecture",
  async ({ nodes, edges }, { dispatch }) => {
    const response = await aiApi.enhanceArchitecture({
      project_id: "current",
      nodes,
      edges,
    });

    const state = response.data.state;

    dispatch(setNodes(state.nodes || []));
    dispatch(setEdges(state.edges || []));

    return state;
  },
);

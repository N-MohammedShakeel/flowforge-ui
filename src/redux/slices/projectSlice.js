// src/redux/slices/projectSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProjectsThunk,
  createProjectThunk,
  updateProjectThunk,
  deleteProjectThunk,
  saveCanvasThunk,
  loadCanvasThunk,
} from "../thunks/projectThunks";

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  saving: false, // Separate flag for canvas save (doesn't block the full UI)
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ===== Fetch All =====
    builder
      .addCase(fetchProjectsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Create =====
    builder
      .addCase(createProjectThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload); // Newest first
        state.currentProject = action.payload;
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Update =====
    builder
      .addCase(updateProjectThunk.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ===== Delete =====
    builder
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProjectThunk.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ===== Save Canvas =====
    builder
      .addCase(saveCanvasThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveCanvasThunk.fulfilled, (state, action) => {
        state.saving = false;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(saveCanvasThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });

    // ===== Load Canvas =====
    builder
      .addCase(loadCanvasThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCanvasThunk.fulfilled, (state) => {
        state.loading = false;
        // Canvas data goes to canvasSlice — handled in CanvasEditor via dispatch
      })
      .addCase(loadCanvasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;

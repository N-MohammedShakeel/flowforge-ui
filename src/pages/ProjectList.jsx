// src/pages/ProjectList.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentProject } from "../redux/slices/projectSlice";
import {
  fetchProjectsThunk,
  deleteProjectThunk,
} from "../redux/thunks/projectThunks";
import Sidebar from "../components/layout/Sidebar";

// ===== Skeleton Card =====
const ProjectCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-4 bg-gray-200 rounded w-36 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="h-5 bg-gray-100 rounded-full w-16" />
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
    <div className="flex justify-between">
      <div className="h-3 bg-gray-100 rounded w-20" />
      <div className="h-3 bg-gray-100 rounded w-24" />
    </div>
  </div>
);

// ===== Status Badge =====
const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-green-100 text-green-700 ring-1 ring-green-600/10",
    DRAFT: "bg-amber-100 text-amber-700 ring-1 ring-amber-600/10",
    PUBLISHED: "bg-blue-100 text-blue-700 ring-1 ring-blue-600/10",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] || styles.DRAFT}`}
    >
      {status}
    </span>
  );
};

// ===== Empty State =====
const EmptyState = ({ onNew }) => (
  <div className="col-span-3 flex flex-col items-center justify-center py-24">
    <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6">
      <svg
        className="w-10 h-10 text-indigo-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No projects yet
    </h3>
    <p className="text-gray-500 text-sm text-center max-w-xs mb-6">
      Create your first architecture from the dashboard to get started.
    </p>
    <button
      onClick={onNew}
      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98]"
    >
      Create first project
    </button>
  </div>
);

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchProjectsThunk());
  }, [dispatch]);

  const openCanvas = (project) => {
    dispatch(setCurrentProject(project));
    navigate(`/canvas/${project.id}`);
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project? This action cannot be undone."))
      return;
    setDeletingId(projectId);
    await dispatch(deleteProjectThunk(projectId));
    setDeletingId(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                My Projects
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {projects.length} project{projects.length !== 1 ? "s" : ""}{" "}
                total
              </p>
            </div>
            <button
              id="new-project-btn"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Architecture
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))
            ) : projects.length === 0 ? (
              <EmptyState onNew={() => navigate("/dashboard")} />
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => openCanvas(project)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-200/60 hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
                    {project.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Updated {formatDate(project.updatedAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Delete */}
                      <button
                        onClick={(e) => handleDelete(e, project.id)}
                        disabled={deletingId === project.id}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        {deletingId === project.id ? (
                          <svg
                            className="animate-spin w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Open */}
                      <span className="text-indigo-600 font-medium group-hover:text-indigo-700 flex items-center gap-1">
                        Open
                        <svg
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

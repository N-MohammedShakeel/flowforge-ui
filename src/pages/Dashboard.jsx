// src/pages/Dashboard.jsx
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { aiToReactFlow } from "../components/canvas/utils/aiTransformer";
import { createProjectThunk } from "../redux/thunks/projectThunks";
import { projectApi, aiApi, uploadApi } from "../services/api";

/**
 * Dashboard — the main entry point for creating new architectures.
 *
 * Flow:
 * 1. User picks a source (Idea / SRS / Project)
 * 2. We create a project in the backend to get a real project ID
 * 3. We call the AI generation endpoint (via Spring Boot)
 * 4. The canvas state is saved back to the project
 * 5. We navigate to /canvas/:projectId
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("idea"); // "idea" | "srs" | "project"
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState("");
  const [srsFileName, setSrsFileName] = useState("");
  const [zipFileName, setZipFileName] = useState("");
  const srsFileRef = useRef(null);
  const zipFileRef = useRef(null);

  const handleGenerate = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }
    if (activeTab === "idea" && !description.trim()) {
      setError("Please describe your project");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      // Step 1: Create project to get a real ID
      const projectResult = await dispatch(
        createProjectThunk({
          name: projectName.trim(),
          description: description.trim(),
        }),
      ).unwrap();

      const newProjectId = projectResult.id;

      let srsFilePath = null;
      let projectZipPath = null;

      // Step 2: Handle file uploads if applicable
      if (activeTab === "srs" && srsFileRef.current?.files[0]) {
        setUploadProgress("Uploading SRS document...");
        const uploadRes = await uploadApi.uploadSrs(
          srsFileRef.current.files[0],
        );
        srsFilePath = uploadRes.data.filePath;
        setUploadProgress(null);
      }

      if (activeTab === "project" && zipFileRef.current?.files[0]) {
        setUploadProgress("Uploading project files...");
        const uploadRes = await uploadApi.uploadProject(
          zipFileRef.current.files[0],
        );
        projectZipPath = uploadRes.data.filePath;
        setUploadProgress(null);
      }

      // Step 3: Generate architecture via Spring Boot → Python AI
      setUploadProgress("Generating architecture with AI...");
      const aiResponse = await aiApi.generate({
        projectId: newProjectId,
        source: activeTab.toUpperCase(),
        description: description.trim(),
        srsFilePath,
        projectZipPath,
      });

      const generatedState = aiResponse.data?.state;

      // Step 4: Save the generated canvas to the project
      if (generatedState?.nodes?.length) {
        const transformedState = aiToReactFlow(generatedState);
        await projectApi.saveCanvas(newProjectId, {
          nodes: transformedState.nodes,
          edges: transformedState.edges,
        });
      }

      setUploadProgress(null);

      // Step 5: Navigate to the canvas
      navigate(`/canvas/${newProjectId}`);
    } catch (err) {
      setUploadProgress(null);
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Generation failed. Please try again.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    {
      id: "idea",
      label: "From Idea",
      icon: "💡",
      description: "Describe your project in plain text",
    },
    {
      id: "srs",
      label: "From SRS",
      icon: "📄",
      description: "Upload a Software Requirements Spec",
    },
    {
      id: "project",
      label: "Analyze Project",
      icon: "📁",
      description: "Upload an existing codebase as ZIP",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 overflow-auto">
        <div className="max-w-3xl mx-auto p-8 pt-12">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              New Architecture
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5 tracking-tight">
              Create New Architecture
            </h1>
            <p className="text-gray-500 text-sm">
              Describe your system and let FlowForge's AI generate a
              production-ready architecture.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
            {/* Project Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Bus Ticket Booking System"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition text-sm"
              />
            </div>

            {/* Source Tabs */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Architecture source
              </label>
              <div className="flex gap-2 bg-gray-50 border border-gray-100 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError("");
                    }}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      activeTab === tab.id
                        ? "bg-white shadow-sm text-indigo-700 border border-indigo-100 scale-[1.02]"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">
                {tabs.find((t) => t.id === activeTab)?.description}
              </p>
            </div>

            {/* Dynamic Input Area */}
            {activeTab === "idea" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Build a bus ticket booking system like RedBus — users can search routes, select seats, and book tickets with online payment..."
                  className="w-full h-36 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white resize-y text-sm leading-relaxed transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {description.length} characters
                </p>
              </div>
            )}

            {activeTab === "srs" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SRS Document (PDF)
                </label>
                <div
                  onClick={() => srsFileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📄
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {srsFileName || "Click to upload PDF"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF up to 50MB
                  </p>
                  <input
                    ref={srsFileRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      setSrsFileName(e.target.files[0]?.name || "")
                    }
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Additional context (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Any specific requirements or constraints..."
                    className="w-full h-20 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none text-sm transition"
                  />
                </div>
              </div>
            )}

            {activeTab === "project" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project ZIP file
                </label>
                <div
                  onClick={() => zipFileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📁
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {zipFileName || "Click to upload ZIP"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload your project as a ZIP (max 50MB)
                  </p>
                  <input
                    ref={zipFileRef}
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) =>
                      setZipFileName(e.target.files[0]?.name || "")
                    }
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Progress */}
            {uploadProgress && (
              <div className="mb-4 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-sm flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4 flex-shrink-0"
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
                {uploadProgress}
              </div>
            )}

            {/* Generate Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                id="generate-architecture-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !projectName.trim()}
                className="flex-1 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/20 text-sm flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                    Generating...
                  </>
                ) : (
                  <>
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>

              <button
                onClick={async () => {
                  if (!projectName.trim()) {
                    setError("Please enter a project name");
                    return;
                  }
                  setIsGenerating(true);
                  try {
                    const projectResult = await dispatch(
                      createProjectThunk({
                        name: projectName.trim(),
                        description: description.trim(),
                      }),
                    ).unwrap();
                    navigate(`/canvas/${projectResult.id}`);
                  } catch (err) {
                    setError(err?.message || "Failed to create project");
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={isGenerating || !projectName.trim()}
                className="flex-1 w-full py-3.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                Create Blank Canvas
              </button>
            </div>
          </div>

          {/* Recent Projects Quick Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-gray-400 hover:text-indigo-600 transition-colors"
            >
              View all my projects →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

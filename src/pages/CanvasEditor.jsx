// src/pages/CanvasEditor.jsx
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import CanvasFlow from "../components/canvas/CanvasFlow";
import ComponentSidebar from "../components/canvas/sidebar/ComponentSidebar";
import NodeProperties from "../components/canvas/sidebar/NodeProperties";
import EdgeProperties from "../components/canvas/sidebar/EdgeProperties";
import EmptyProperties from "../components/canvas/sidebar/EmptyProperties";
import TopToolbar from "../components/canvas/toolbar/TopToolbar";
import ReviewModal from "../components/canvas/toolbar/ReviewModal";
import EnhancementModal from "../components/canvas/toolbar/EnhancementModal";
import { createNode } from "../components/canvas/utils/nodeFactory";
import {
  aiToReactFlow,
  reactFlowToAi,
} from "../components/canvas/utils/aiTransformer";
import { aiApi, projectApi } from "../services/api";
import { setCurrentProject } from "../redux/slices/projectSlice";
import {
  setNodes,
  setEdges,
  setReview,
  setVersion,
  setVersions,
} from "../redux/slices/canvasSlice";

// ===== Inline Toast Notification =====
const TOAST_DURATION = 4000;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  return { toasts, toast: addToast };
}

const ToastContainer = ({ toasts }) => {
  const typeStyles = {
    success: {
      bar: "bg-emerald-500",
      icon: "text-emerald-500",
      symbol: "✓",
    },
    error: {
      bar: "bg-red-500",
      icon: "text-red-500",
      symbol: "!",
    },
    info: {
      bar: "bg-indigo-500",
      icon: "text-indigo-500",
      symbol: "i",
    },
    warning: {
      bar: "bg-amber-500",
      icon: "text-amber-500",
      symbol: "⚠",
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => {
        const s = typeStyles[t.type] || typeStyles.info;
        return (
          <div
            key={t.id}
            className="relative flex items-center gap-3 bg-white text-gray-800 text-sm pl-4 pr-5 py-3.5 rounded-xl shadow-lg shadow-gray-300/40 border border-gray-100 max-w-xs pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-200 overflow-hidden"
          >
            <span className={`absolute left-0 top-0 h-full w-1 ${s.bar}`} />
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${s.icon} bg-current/10`}
            >
              <span className="text-current">{s.symbol}</span>
            </span>
            <span className="font-medium">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};

// ===== Main Canvas Editor =====
function CanvasEditorContent() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.projects.currentProject);
  const { toasts, toast } = useToast();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElement, setSelectedElement] = useState({
    id: null,
    type: null,
  });
  const { screenToFlowPosition } = useReactFlow();

  const review = useSelector((state) => state.canvas.review);
  const version = useSelector((state) => state.canvas.version);
  const versions = useSelector((state) => state.canvas.versions);

  // Action States
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCanvas, setIsLoadingCanvas] = useState(true);

  // Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState(false);

  // Undo/Redo History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-save debounce
  const autoSaveTimer = useRef(null);

  // Loading overlay state
  const [loadingMessage, setLoadingMessage] = useState("");

  // ===== Load canvas on mount =====
  useEffect(() => {
    if (!projectId) {
      navigate("/projects");
      return;
    }

    const loadCanvas = async () => {
      setIsLoadingCanvas(true);
      try {
        // Load project metadata
        const projectRes = await projectApi.getById(projectId);
        dispatch(setCurrentProject(projectRes.data));

        // Load canvas data
        const canvasRes = await projectApi.loadCanvas(projectId);
        const {
          nodes: savedNodes = [],
          edges: savedEdges = [],
        } = canvasRes.data;

        if (savedNodes.length > 0) {
          // If nodes are still in raw AI format (like from previous buggy saves), convert them
          const state = savedNodes[0].data
            ? { nodes: savedNodes, edges: savedEdges }
            : aiToReactFlow({ nodes: savedNodes, edges: savedEdges });

          setNodes(state.nodes);
          setEdges(state.edges);
          pushToHistory(state.nodes, state.edges);
        } else {
          setNodes([]);
          setEdges([]);
          pushToHistory([], []);
        }

        if (projectRes.data.latestReview) {
          dispatch(setReview(projectRes.data.latestReview));
        } else {
          dispatch(setReview(null));
        }

        try {
          const versionRes = await projectApi.getVersions(projectId);
          const fetchedVersions = versionRes.data || [];
          dispatch(setVersions(fetchedVersions));
          // Set current version to the latest (max) version, or 0 if no versions yet
          const latestVersion = fetchedVersions.length > 0 ? Math.max(...fetchedVersions) : 0;
          dispatch(setVersion(latestVersion));
        } catch (e) {
          console.error("Failed to load versions", e);
          dispatch(setVersion(0));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          toast("Project not found", "error");
          navigate("/projects");
        } else {
          toast("Failed to load canvas", "error");
        }
      } finally {
        setIsLoadingCanvas(false);
      }
    };

    loadCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // ===== History Management =====
  const pushToHistory = useCallback(
    (newNodes, newEdges) => {
      const nextHistory = history.slice(0, historyIndex + 1);
      setHistory([...nextHistory, { nodes: newNodes, edges: newEdges }]);
      setHistoryIndex(nextHistory.length);
    },
    [history, historyIndex],
  );

  // ===== Auto-save =====
  const triggerAutoSave = useCallback(
    (currentNodes, currentEdges) => {
      if (!projectId) return;
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(async () => {
        try {
          await projectApi.saveCanvas(projectId, {
            nodes: currentNodes,
            edges: currentEdges,
            review,
          });
        } catch {
          // Silent auto-save failure
        }
      }, 3000);
    },
    [projectId, review],
  );

  // ===== Drag and Drop =====
  const addNodeFromSidebar = (component) => {
    const newNode = createNode(component);
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    pushToHistory(updatedNodes, edges);
    triggerAutoSave(updatedNodes, edges);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      const component = JSON.parse(rawData);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = createNode(component, position);
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      pushToHistory(updatedNodes, edges);
      triggerAutoSave(updatedNodes, edges);
    },
    [
      nodes,
      edges,
      screenToFlowPosition,
      pushToHistory,
      setNodes,
      triggerAutoSave,
    ],
  );

  // ===== Selection Tracking =====
  const onNodesChangeWithTracking = (changes) => {
    onNodesChange(changes);
    const selectedChange = changes.find(
      (c) => c.type === "select" && c.selected,
    );
    const unselectedChange = changes.find(
      (c) => c.type === "select" && !c.selected,
    );

    if (selectedChange) {
      setSelectedElement({ id: selectedChange.id, type: "node" });
    } else if (unselectedChange) {
      setSelectedElement({ id: null, type: null });
    }
  };

  const onEdgesChangeWithTracking = (changes) => {
    onEdgesChange(changes);
    const selectedChange = changes.find(
      (c) => c.type === "select" && c.selected,
    );
    const unselectedChange = changes.find(
      (c) => c.type === "select" && !c.selected,
    );

    if (selectedChange) {
      setSelectedElement({ id: selectedChange.id, type: "edge" });
    } else if (unselectedChange) {
      setSelectedElement({ id: null, type: null });
    }
  };

  const currentSelectedNode = useMemo(
    () =>
      selectedElement.type === "node"
        ? nodes.find((n) => n.id === selectedElement.id)
        : null,
    [selectedElement, nodes],
  );

  const currentSelectedEdge = useMemo(
    () =>
      selectedElement.type === "edge"
        ? edges.find((e) => e.id === selectedElement.id)
        : null,
    [selectedElement, edges],
  );

  // ===== Toolbar Actions =====
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setNodes(history[prevIndex].nodes);
      setEdges(history[prevIndex].edges);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setNodes(history[nextIndex].nodes);
      setEdges(history[nextIndex].edges);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      await projectApi.saveCanvas(projectId, { nodes, edges, review });
      toast("Canvas saved successfully", "success");
    } catch {
      toast("Failed to save canvas", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute(
      "download",
      `${currentProject?.name || "architecture"}.json`,
    );
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    toast("Exported as JSON", "info");
  };

  const handleReview = async () => {
    if (!projectId) {
      toast("Project ID is missing. Please refresh the page.", "error");
      return;
    }

    if (nodes.length === 0) {
      toast("Add some components before reviewing", "warning");
      return;
    }

    setIsReviewing(true);
    try {
      const aiData = reactFlowToAi(nodes, edges);

      const response = await aiApi.review({
        projectId: projectId,
        nodes: aiData.nodes,
        edges: aiData.edges,
      });

      const reviewData = response.data?.state?.review || response.data?.review;

      if (reviewData) {
        dispatch(setReview(reviewData));
        toast("Review complete!", "success");

        await projectApi.saveReview(projectId, reviewData);
      } else {
        toast("Review returned no data", "warning");
      }
    } catch (err) {
      console.error("Review error:", err);
      const msg =
        err.response?.data?.detail?.[0]?.msg || err.message || "Review failed";
      toast(msg, "error");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleEnhance = async () => {
    if (nodes.length === 0) {
      toast("Add some components before enhancing", "warning");
      return;
    }
    setIsEnhancing(true);
    setLoadingMessage("AI is analyzing and enhancing architecture...");
    try {
      const aiData = reactFlowToAi(nodes, edges);
      const response = await aiApi.enhance({
        projectId: projectId,
        nodes: aiData.nodes,
        edges: aiData.edges,
        review,
      });
      const newState = response.data?.state;
      if (newState?.nodes) {
        const transformedState = aiToReactFlow(newState);
        setNodes(transformedState.nodes);
        setEdges(transformedState.edges);
        pushToHistory(transformedState.nodes, transformedState.edges);
        
        // Create an explicit version snapshot in the DB (CanvasState table)
        await projectApi.createVersion(projectId, {
          nodes: transformedState.nodes,
          edges: transformedState.edges,
        });
        
        toast("Architecture enhanced!", "success");
        
        // Refresh versions after enhancement
        const versionRes = await projectApi.getVersions(projectId);
        const updatedVersions = versionRes.data || [];
        dispatch(setVersions(updatedVersions));
        
        if (updatedVersions.length > 0) {
          dispatch(setVersion(Math.max(...updatedVersions)));
        }
      } else {
        toast("Enhancement returned no changes", "warning");
      }
    } catch {
      toast("Enhancement failed — AI service may be unavailable", "error");
    } finally {
      setIsEnhancing(false);
      setLoadingMessage("");
      setIsEnhanceModalOpen(false);
    }
  };

  const handleLoadVersion = async (targetVersion) => {
    try {
      setIsLoadingCanvas(true);
      const res = await projectApi.loadVersion(projectId, targetVersion);
      const canvasData = res.data;
      if (canvasData) {
        const transformedState = aiToReactFlow({
          nodes: canvasData.nodes || [],
          edges: canvasData.edges || [],
        });
        setNodes(transformedState.nodes);
        setEdges(transformedState.edges);
        pushToHistory(transformedState.nodes, transformedState.edges);
        
        if (canvasData.version) {
          dispatch(setVersion(canvasData.version));
        }
      }
      
      // Fetch project metadata to get latest review and versions
      const projectRes = await projectApi.getById(projectId);
      if (projectRes.data.latestReview) {
        dispatch(setReview(projectRes.data.latestReview));
      }
      
      try {
        const versionRes = await projectApi.getVersions(projectId);
        dispatch(setVersions(versionRes.data || []));
      } catch (e) {
        console.error("Failed to load versions", e);
      }
      toast(`Loaded version ${targetVersion}`, "success");
    } catch (e) {
      toast("Failed to load version", "error");
    } finally {
      setIsLoadingCanvas(false);
    }
  };

  // Loading state
  if (isLoadingCanvas) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/40">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 font-sans antialiased flex-col relative">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Magical Loading Overlay */}
      {isEnhancing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center p-8 rounded-2xl bg-white shadow-2xl shadow-indigo-900/10 border border-indigo-100 max-w-sm w-full transform scale-100 animate-in zoom-in-95">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                ✨
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Enhancing Architecture
            </h3>
            <p className="text-sm text-gray-500">
              {loadingMessage || "Please wait..."}
            </p>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <TopToolbar
        projectName={currentProject?.name || "Architecture"}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onSave={handleSave}
        isSaving={isSaving}
        onExport={handleExportJSON}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        isReviewing={isReviewing}
        onOpenEnhanceModal={() => setIsEnhanceModalOpen(true)}
        isEnhancing={isEnhancing}
      />

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        latestReview={review}
        onGenerateReview={handleReview}
        isGenerating={isReviewing}
      />

      <EnhancementModal
        isOpen={isEnhanceModalOpen}
        onClose={() => setIsEnhanceModalOpen(false)}
        currentVersion={version}
        totalVersions={versions.length > 0 ? Math.max(...versions) : 0}
        onPreviousVersion={() => handleLoadVersion(version - 1)}
        onNextVersion={() => handleLoadVersion(version + 1)}
        onEnhance={handleEnhance}
        isEnhancing={isEnhancing}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left — Component Sidebar */}
        <ComponentSidebar onAddNode={addNodeFromSidebar} />

        {/* Canvas */}
        <div
          className="flex-1 h-full relative"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <CanvasFlow
            nodes={nodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChangeWithTracking}
            onEdgesChange={onEdgesChangeWithTracking}
          />
        </div>

        {/* Right — Properties Panel */}
        <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col shadow-sm">
          {selectedElement.type === "node" && currentSelectedNode && (
            <NodeProperties
              selectedNode={currentSelectedNode}
              setNodes={setNodes}
              setEdges={setEdges}
              pushToHistory={() => pushToHistory(nodes, edges)}
              triggerAutoSave={() => triggerAutoSave(nodes, edges)}
            />
          )}
          {selectedElement.type === "edge" && currentSelectedEdge && (
            <EdgeProperties
              selectedEdge={currentSelectedEdge}
              setEdges={setEdges}
            />
          )}
          {!selectedElement.type && <EmptyProperties />}
        </div>
      </div>
    </div>
  );
}

export default function CanvasEditor() {
  return (
    <ReactFlowProvider>
      <CanvasEditorContent />
    </ReactFlowProvider>
  );
}

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
import { createNode } from "../components/canvas/utils/nodeFactory";
import {
  aiToReactFlow,
  reactFlowToAi,
} from "../components/canvas/utils/aiTransformer";
import { aiApi, projectApi } from "../services/api";
import { setCurrentProject } from "../redux/slices/projectSlice";

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
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-indigo-600",
    warning: "bg-amber-500",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${typeStyles[t.type] || typeStyles.info} text-white text-sm px-4 py-3 rounded-xl shadow-lg max-w-xs animate-fade-in pointer-events-auto`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

// ===== Review Panel (shown when review results exist) =====
const ReviewPanel = ({ review, onClose }) => {
  if (!review) return null;

  const ScoreBar = ({ label, value }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span
          className={`font-bold ${value >= 70 ? "text-green-600" : value >= 50 ? "text-amber-500" : "text-red-600"}`}
        >
          {value}/100
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${value >= 70 ? "bg-green-500" : value >= 50 ? "bg-amber-400" : "bg-red-500"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-30 flex flex-col shadow-xl overflow-y-auto">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Architecture Review</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 flex-1">
        {/* Overall Score */}
        <div className="text-center mb-5 p-4 bg-gray-50 rounded-xl">
          <div
            className={`text-4xl font-bold mb-1 ${review.overall_score >= 70 ? "text-green-600" : review.overall_score >= 50 ? "text-amber-500" : "text-red-600"}`}
          >
            {review.overall_score}
          </div>
          <div className="text-xs text-gray-500 font-medium">Overall Score</div>
        </div>

        {/* Dimension Scores */}
        <div className="mb-5">
          <ScoreBar label="Architecture" value={review.architecture_score} />
          <ScoreBar label="Scalability" value={review.scalability} />
          <ScoreBar label="Maintainability" value={review.maintainability} />
          <ScoreBar label="Security" value={review.security} />
        </div>

        {/* Issues */}
        {review.issues?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Issues
            </h4>
            <ul className="space-y-1.5">
              {review.issues.map((issue, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-gray-600"
                >
                  <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {review.suggestions?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Suggestions
            </h4>
            <ul className="space-y-1.5">
              {review.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-gray-600"
                >
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">
                    →
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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

  // Action States
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCanvas, setIsLoadingCanvas] = useState(true);
  const [review, setReview] = useState(null);
  const [showReview, setShowReview] = useState(false);

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
          review: savedReview = null,
        } = canvasRes.data;

        if (savedNodes.length > 0) {
          // If nodes are still in raw AI format (like from previous buggy saves), convert them
          const state = savedNodes[0].data
            ? { nodes: savedNodes, edges: savedEdges }
            : aiToReactFlow({ nodes: savedNodes, edges: savedEdges });

          setNodes(state.nodes);
          setEdges(state.edges);
          pushToHistory(state.nodes, state.edges);
        }

        if (savedReview) {
          setReview(savedReview);
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
          // Review is obtained from the outer scope, which could be slightly stale in useCallback
          // but since we only care about saving the latest review it's acceptable.
          await projectApi.saveCanvas(projectId, {
            nodes: currentNodes,
            edges: currentEdges,
            review,
          });
        } catch {
          // Silent auto-save failure — don't toast the user on every keystroke failure
        }
      }, 3000); // 3-second debounce
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
    const selectedChange = changes.find((c) => c.type === "select" && c.selected);
    const unselectedChange = changes.find((c) => c.type === "select" && !c.selected);
    
    if (selectedChange) {
      setSelectedElement({ id: selectedChange.id, type: "node" });
    } else if (unselectedChange) {
      setSelectedElement({ id: null, type: null });
    }
  };

  const onEdgesChangeWithTracking = (changes) => {
    onEdgesChange(changes);
    const selectedChange = changes.find((c) => c.type === "select" && c.selected);
    const unselectedChange = changes.find((c) => c.type === "select" && !c.selected);
    
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

      console.log("Sending review request with projectId:", projectId); // ← Debug

      const response = await aiApi.review({
        projectId: projectId, // Make sure this is a string
        nodes: aiData.nodes,
        edges: aiData.edges,
      });

      const reviewData = response.data?.state?.review || response.data?.review;

      if (reviewData) {
        setReview(reviewData);
        setShowReview(true);
        toast("Review complete!", "success");

        await projectApi.saveCanvas(projectId, {
          nodes,
          edges,
          review: reviewData,
        });
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
        triggerAutoSave(transformedState.nodes, transformedState.edges);
        toast("Architecture enhanced!", "success");
      } else {
        toast("Enhancement returned no changes", "warning");
      }
    } catch {
      toast("Enhancement failed — AI service may be unavailable", "error");
    } finally {
      setIsEnhancing(false);
      setLoadingMessage("");
    }
  };

  // Loading state
  if (isLoadingCanvas) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans antialiased flex-col relative">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Magical Loading Overlay */}
      {isEnhancing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center p-8 rounded-2xl bg-white shadow-2xl border border-indigo-100 max-w-sm w-full transform scale-100 animate-in zoom-in-95">
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
        onReview={handleReview}
        isReviewing={isReviewing}
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

          {/* Review Panel (overlays canvas from right) */}
          {showReview && (
            <ReviewPanel review={review} onClose={() => setShowReview(false)} />
          )}
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

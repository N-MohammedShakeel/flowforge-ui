import React, { useState, useMemo, useCallback } from "react";
import { ReactFlowProvider, useNodesState, useEdgesState } from "reactflow";
import CanvasFlow from "../components/canvas/CanvasFlow";
import ComponentSidebar from "../components/canvas/sidebar/ComponentSidebar";
import NodeProperties from "../components/canvas/sidebar/NodeProperties";
import EdgeProperties from "../components/canvas/sidebar/EdgeProperties";
import EmptyProperties from "../components/canvas/sidebar/EmptyProperties";
import TopToolbar from "../components/canvas/toolbar/TopToolbar";
import { createNode } from "../components/canvas/utils/nodeFactory";
import { aiApi, backendApi } from "../services/api";

function CanvasEditorContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElement, setSelectedElement] = useState({
    id: null,
    type: null,
  });

  // Action States
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simple Undo/Redo History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushToHistory = useCallback(
    (newNodes, newEdges) => {
      const nextHistory = history.slice(0, historyIndex + 1);
      setHistory([...nextHistory, { nodes: newNodes, edges: newEdges }]);
      setHistoryIndex(nextHistory.length);
    },
    [history, historyIndex],
  );

  const addNodeFromSidebar = (component) => {
    const newNode = createNode(component);
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    pushToHistory(updatedNodes, edges);
  };

  const onNodesChangeWithTracking = (changes) => {
    onNodesChange(changes);
    const selectChange = changes.find((c) => c.type === "select");
    if (selectChange) {
      setSelectedElement(
        selectChange.selected
          ? { id: selectChange.id, type: "node" }
          : { id: null, type: null },
      );
    }
  };

  const onEdgesChangeWithTracking = (changes) => {
    onEdgesChange(changes);
    const selectChange = changes.find((c) => c.type === "select");
    if (selectChange) {
      setSelectedElement(
        selectChange.selected
          ? { id: selectChange.id, type: "edge" }
          : { id: null, type: null },
      );
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

  // Toolbar Actions
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
    setIsSaving(true);
    try {
      await backendApi.saveCanvas("current", { nodes, edges });
      alert("💾 Project saved successfully!");
    } catch (error) {
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "flowforge-architecture.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReview = async () => {
    setIsReviewing(true);
    try {
      const response = await aiApi.reviewArchitecture({
        project_id: "current",
        nodes,
        edges,
      });
      console.log("Review Result:", response.data);
      alert("✅ Review completed! Check console for details.");
    } catch (error) {
      alert("Review failed.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const response = await aiApi.enhanceArchitecture({
        project_id: "current",
        nodes,
        edges,
      });
      const newState = response.data.state;

      setNodes(newState.nodes || []);
      setEdges(newState.edges || []);
      pushToHistory(newState.nodes || [], newState.edges || []);

      alert("✨ Architecture enhanced successfully!");
    } catch (error) {
      alert("Enhancement failed.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans antialiased flex-col">
      {/* Top Toolbar */}
      <TopToolbar
        projectName="Bus Ticket Booking System"
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
        {/* Left Sidebar */}
        <ComponentSidebar onAddNode={addNodeFromSidebar} />

        {/* Canvas Area */}
        <div className="flex-1 h-full relative">
          <CanvasFlow
            nodes={nodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChangeWithTracking}
            onEdgesChange={onEdgesChangeWithTracking}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col shadow-sm">
          {selectedElement.type === "node" && currentSelectedNode && (
            <NodeProperties
              selectedNode={currentSelectedNode}
              setNodes={setNodes}
              setEdges={setEdges}
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

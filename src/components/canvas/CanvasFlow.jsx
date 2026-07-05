// src/components/canvas/CanvasFlow.jsx
import React, { useCallback } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./node/CustomNode";
import CustomEdge from "./edge/CustomEdge";
import { createEdge } from "./utils/edgeFactory";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const defaultEdgeOptions = {
  animated: true,
  type: "custom",
};

const minimapColor = (node) => {
  if (!node?.data) return "#6b7280";
  switch (node.data.category) {
    case "frontend":
      return "#2563eb";
    case "backend":
      return "#16a34a";
    case "database":
      return "#9333ea";
    case "gateway":
      return "#4f46e5";
    case "cache":
      return "#eab308";
    case "queue":
      return "#ea580c";
    case "security":
      return "#dc2626";
    case "ai":
      return "#0891b2";
    default:
      return "#6b7280";
  }
};

const CanvasFlow = ({
  nodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
}) => {
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => [...eds, createEdge(params)]);
    },
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      snapToGrid
      snapGrid={[20, 20]}
      deleteKeyCode={["Delete", "Backspace"]}
      multiSelectionKeyCode="Shift"
      selectionKeyCode="Shift"
      elevateNodesOnSelect
      proOptions={{ hideAttribution: true }}
    >
      <Controls position="bottom-left" showInteractive={false} />
      <MiniMap pannable zoomable nodeColor={minimapColor} nodeStrokeWidth={3} />
      <Background gap={20} size={1.2} color="#d1d5db" />
    </ReactFlow>
  );
};

export default CanvasFlow;

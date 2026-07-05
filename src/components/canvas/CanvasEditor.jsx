// src/components/canvas/CanvasEditor.jsx
import React from "react";
import { useNodesState, useEdgesState } from "reactflow";
import CanvasFlow from "./CanvasFlow";
import ComponentSidebar from "./sidebar/ComponentSidebar";
import { createNode } from "./utils/nodeFactory";

export default function CanvasEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addNodeFromSidebar = (component) => {
    setNodes((nds) => [...nds, createNode(component)]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Searchable Component Inventory Panel */}
      <ComponentSidebar onAddNode={addNodeFromSidebar} />

      {/* Enhanced Core Canvas Layout Workspace Grid */}
      <div className="flex-1 h-full relative">
        <CanvasFlow
          nodes={nodes}
          edges={edges}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </div>
    </div>
  );
}

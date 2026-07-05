// src/components/canvas/sidebar/NodeProperties.jsx
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function NodeProperties({
  selectedNode,
  setNodes,
  setEdges,
  pushToHistory,
  triggerAutoSave,
}) {
  if (!selectedNode) return null;

  const updateNodeData = (key, value) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, [key]: value } }
          : node,
      );
      if (triggerAutoSave) triggerAutoSave(updatedNodes);
      return updatedNodes;
    });
  };

  const handleBlur = () => {
    if (pushToHistory) pushToHistory();
  };

  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id,
      ),
    );
  };

  return (
    <div className="h-full overflow-auto p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={selectedNode.data.icon || "📦"}
            title="Click to edit emoji/icon"
            onChange={(e) => updateNodeData("icon", e.target.value)}
            onBlur={handleBlur}
            className="text-3xl w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl text-center outline-none focus:border-indigo-500"
          />
          <div className="overflow-hidden">
            <h2 className="text-lg font-bold text-gray-800 truncate">
              {selectedNode.data.label}
            </h2>
            <p className="text-[10px] text-gray-400 font-mono truncate">
              ID: {selectedNode.id}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Component Title
            </label>
            <input
              value={selectedNode.data.label || ""}
              onChange={(e) => updateNodeData("label", e.target.value)}
              onBlur={handleBlur}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Technology Framework
            </label>
            <input
              value={selectedNode.data.technology || ""}
              onChange={(e) => updateNodeData("technology", e.target.value)}
              onBlur={handleBlur}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Classification Type
            </label>
            <select
              value={selectedNode.data.category || "custom"}
              onChange={(e) => {
                updateNodeData("category", e.target.value);
                handleBlur();
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="frontend">⚛️ Frontend Layer</option>
              <option value="backend">🍃 Backend Service</option>
              <option value="database">🐘 Relational Database</option>
              <option value="cache">⚡ Memory Cache</option>
              <option value="queue">📨 Event Streaming / Broker</option>
              <option value="security">🔐 Security Gateway</option>
              <option value="ai">🤖 Artificial Intelligence/Agent</option>
              <option value="custom">📦 Generic Component</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Operational Status
            </label>
            <select
              value={selectedNode.data.status || "healthy"}
              onChange={(e) => {
                updateNodeData("status", e.target.value);
                handleBlur();
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="healthy">🟢 Active / Healthy</option>
              <option value="warning">⚠️ Warning / Technical Debt</option>
              <option value="error">🔴 Degraded / Failure Point</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Functional Overview
            </label>
            <textarea
              rows={3}
              value={selectedNode.data.description || ""}
              onChange={(e) => updateNodeData("description", e.target.value)}
              onBlur={handleBlur}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 resize-none text-gray-600 leading-relaxed"
            />
          </div>
        </div>
      </div>

      <button
        onClick={deleteNode}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer"
      >
        <TrashIcon className="h-4 w-4" />
        Remove Component
      </button>
    </div>
  );
}

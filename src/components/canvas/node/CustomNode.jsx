// src/components/canvas/node/CustomNode.jsx
import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import {
  PencilSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const categoryStyles = {
  frontend: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  backend: {
    border: "border-green-500",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  database: {
    border: "border-purple-500",
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
  cache: {
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  gateway: {
    border: "border-indigo-500",
    bg: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  queue: {
    border: "border-orange-500",
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  security: {
    border: "border-red-500",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  ai: {
    border: "border-cyan-500",
    bg: "bg-cyan-50",
    badge: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500",
  },
  custom: {
    border: "border-gray-400",
    bg: "bg-white",
    badge: "bg-gray-100 text-gray-700",
    dot: "bg-gray-500",
  },
};

const statusColor = {
  healthy: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

function ActionButton({ children, title, onClick }) {
  return (
    <button
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      className="rounded-lg bg-white p-1.5 shadow hover:bg-gray-100 transition"
    >
      {children}
    </button>
  );
}

function CustomNode({ id, data, selected }) {
  const [hover, setHover] = useState(false);
  const style =
    categoryStyles[data.category?.toLowerCase()] || categoryStyles.custom;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-gray-700"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-gray-700"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-600"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-600"
      />

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative w-72 rounded-2xl border-2 ${style.border} ${style.bg} shadow-md transition-all duration-300 hover:shadow-xl ${selected ? "ring-4 ring-indigo-200" : ""}`}
      >
        {hover && (
          <div className="absolute -top-4 right-2 flex gap-1">
            <ActionButton title="Edit">
              <PencilSquareIcon className="h-4 w-4 text-gray-700" />
            </ActionButton>
            <ActionButton title="Duplicate">
              <DocumentDuplicateIcon className="h-4 w-4 text-gray-700" />
            </ActionButton>
            <ActionButton title="Delete">
              <TrashIcon className="h-4 w-4 text-red-600" />
            </ActionButton>
          </div>
        )}

        <div className="flex items-start justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{data.icon}</div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {data.label}
              </h3>
              <p className="text-xs text-gray-500">
                {data.technology || "Unknown"}
              </p>
            </div>
          </div>
          <div
            className={`h-3 w-3 rounded-full ${statusColor[data.status || "healthy"]}`}
            title={data.status || "healthy"}
          />
        </div>

        <div className="px-4 py-3">
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
            {data.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 px-4 pb-4">
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${style.badge}`}
          >
            {data.category || "Custom"}
          </span>
          {data.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-b-2xl border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {data.version || "v1.0"}
          </div>
          {data.aiGenerated && (
            <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700">
              AI Generated
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(CustomNode);

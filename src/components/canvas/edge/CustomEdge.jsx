// src/components/canvas/edge/CustomEdge.jsx
import React, { memo, useMemo } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow";

const protocolStyles = {
  REST: { bg: "bg-blue-100", text: "text-blue-700", stroke: "#2563eb" },
  GraphQL: { bg: "bg-pink-100", text: "text-pink-700", stroke: "#db2777" },
  gRPC: { bg: "bg-green-100", text: "text-green-700", stroke: "#16a34a" },
  Kafka: { bg: "bg-orange-100", text: "text-orange-700", stroke: "#ea580c" },
  RabbitMQ: { bg: "bg-amber-100", text: "text-amber-700", stroke: "#d97706" },
  WebSocket: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    stroke: "#7c3aed",
  },
  Database: { bg: "bg-slate-200", text: "text-slate-700", stroke: "#475569" },
};

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  selected,
}) {
  const protocol = data?.protocol || "REST";
  const style = protocolStyles[protocol] || protocolStyles.REST;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeStyle = useMemo(
    () => ({
      strokeWidth: selected ? 3.5 : 2.5,
      stroke: style.stroke,
    }),
    [selected, style],
  );

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto rounded-full px-3 py-1 text-[11px] font-semibold shadow-md border border-white ${style.bg} ${style.text}`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {protocol}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge);

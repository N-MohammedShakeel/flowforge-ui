// src/components/canvas/utils/edgeFactory.js
export const createEdge = (params) => ({
  ...params,
  id: `edge-${Date.now()}`,
  type: "custom",
  animated: true,
  markerEnd: {
    type: "arrowclosed",
  },
  data: {
    protocol: "REST",
    communication: "Synchronous",
    authentication: "None",
    payload: "JSON",
    description: "",
    latency: "",
    notes: "",
  },
  style: {
    strokeWidth: 2.5,
  },
});

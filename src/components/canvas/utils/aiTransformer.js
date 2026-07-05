// src/components/canvas/utils/aiTransformer.js
export const aiToReactFlow = (aiState) => {
  if (!aiState) return { nodes: [], edges: [] };

  const nodes = (aiState.nodes || []).map((node, index) => {
    // Check if it's already a React Flow node (e.g. contains 'data')
    if (node.data) return node;

    return {
      id: node.id,
      type: "custom",
      position: node.position || {
        x: 100 + (index % 3) * 250,
        y: 100 + Math.floor(index / 3) * 200,
      },
      data: {
        category: node.type,
        label: node.label,
        technology: node.technology,
        description: node.description,
        aiGenerated: true,
      },
    };
  });

  const edges = (aiState.edges || []).map((edge) => {
    // Check if it's already a React Flow edge
    if (edge.data) return edge;

    return {
      id: edge.id || `e-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: "custom",
      animated: true,
      data: {
        label: edge.label || edge.type || "REST",
        protocol: edge.type || "REST",
        type: edge.type || "REST",
      },
    };
  });

  return { nodes, edges };
};

export const reactFlowToAi = (nodes, edges) => {
  const aiNodes = nodes.map((node) => {
    // If it's already an AI node format
    if (!node.data) return node;

    return {
      id: node.id,
      type: node.data.category,
      label: node.data.label,
      technology: node.data.technology,
      description: node.data.description,
      metadata: {},
    };
  });

  const aiEdges = edges.map((edge) => {
    if (!edge.data) return edge;

    return {
      source: edge.source,
      target: edge.target,
      type: edge.data.protocol || edge.data.type,
      label: edge.data.label,
    };
  });

  return { nodes: aiNodes, edges: aiEdges };
};

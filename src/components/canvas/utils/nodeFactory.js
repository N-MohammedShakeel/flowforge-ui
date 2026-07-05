const randomOffset = () => Math.floor(Math.random() * 150);

export const createNode = (
  component,
  position = { x: 250 + randomOffset(), y: 150 + randomOffset() },
) => {
  return {
    id: `${component.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: "custom",
    position,
    data: {
      label: component.label,
      technology: component.technology,
      description: component.description,
      icon: component.icon,
      category: component.category,
      tags: component.tags || [],
      version: "v1.0",
      status: "healthy",
      aiGenerated: false,
      notes: "",
      confidence: 100,
    },
  };
};

export const duplicateNode = (node) => ({
  ...node,
  id: `${node.id}-copy-${Date.now()}`,
  position: {
    x: node.position.x + 50,
    y: node.position.y + 50,
  },
});

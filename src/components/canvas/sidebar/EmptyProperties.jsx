import React from "react";

export default function EmptyProperties() {
  return (
    <div className="h-full p-6 flex flex-col items-center justify-center text-center">
      <div className="text-6xl mb-4">🧠</div>
      <h2 className="text-xl font-bold text-gray-800">No Selection</h2>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        Select a node or a relationship to view and edit its properties...
      </p>
    </div>
  );
}

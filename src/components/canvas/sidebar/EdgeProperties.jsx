import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function EdgeProperties({ selectedEdge, setEdges }) {
  if (!selectedEdge) return null;

  const updateEdgeData = (key, value) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge.id
          ? { ...edge, data: { ...edge.data, [key]: value } }
          : edge,
      ),
    );
  };

  const deleteEdge = () => {
    setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
  };

  return (
    <div className="h-full overflow-auto p-6 flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Connection Properties
          </h2>
          <p className="text-xs text-gray-400 mt-1">ID: {selectedEdge.id}</p>
        </div>

        <div className="space-y-5">
          {/* Connection Protocol Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Protocol / Method
            </label>
            <select
              value={selectedEdge.data?.protocol || "REST"}
              onChange={(e) => updateEdgeData("protocol", e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="REST">🌐 REST API</option>
              <option value="GraphQL">💖 GraphQL</option>
              <option value="gRPC">⚡ gRPC</option>
              <option value="Kafka">📨 Kafka Topic</option>
              <option value="RabbitMQ">🐇 RabbitMQ</option>
              <option value="WebSocket">🔌 WebSocket</option>
              <option value="Database">🗄️ Database Driver (JPA/JDBC)</option>
            </select>
          </div>

          {/* Communication Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Communication Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="communication"
                  value="Synchronous"
                  checked={
                    (selectedEdge.data?.communication || "Synchronous") ===
                    "Synchronous"
                  }
                  onChange={(e) =>
                    updateEdgeData("communication", e.target.value)
                  }
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Synchronous
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="communication"
                  value="Asynchronous"
                  checked={selectedEdge.data?.communication === "Asynchronous"}
                  onChange={(e) =>
                    updateEdgeData("communication", e.target.value)
                  }
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Asynchronous
              </label>
            </div>
          </div>

          {/* Data Payload Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payload Format
            </label>
            <input
              type="text"
              placeholder="e.g., JSON, Protocol Buffers, Avro"
              value={selectedEdge.data?.payload || "JSON"}
              onChange={(e) => updateEdgeData("payload", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Connection Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Purpose / Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe what data flows through this connection..."
              value={selectedEdge.data?.description || ""}
              onChange={(e) => updateEdgeData("description", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Disconnect Relationship Button */}
      <button
        onClick={deleteEdge}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        <TrashIcon className="h-4 w-4" />
        Disconnect Relationship
      </button>
    </div>
  );
}

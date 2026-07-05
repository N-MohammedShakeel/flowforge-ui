import React, { useMemo, useState } from "react";
import { COMPONENT_CATEGORIES } from "../utils/componentLibrary";
import { PlusIcon } from "@heroicons/react/24/outline";

const ComponentSidebar = ({ onAddNode }) => {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return COMPONENT_CATEGORIES;
    return COMPONENT_CATEGORIES.map((category) => ({
      ...category,
      components: category.components.filter(
        (item) =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          item.technology.toLowerCase().includes(search.toLowerCase()),
      ),
    })).filter((category) => category.components.length > 0);
  }, [search]);

  // Inject a completely blank template node structure directly into the canvas
  const handleAddCustomBlankNode = () => {
    const rawCustomComponent = {
      id: "custom-node-item",
      label: "Custom Component",
      category: "custom",
      technology: "Custom Tech Stack",
      icon: "📦",
      description:
        "Define this component's responsibilities in the right panel...",
      tags: ["Custom"],
    };
    onAddNode(rawCustomComponent);
  };

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Components</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add items to map your microservices.
        </p>

        {/* Dynamic Custom Instantiation Handle */}
        <button
          onClick={handleAddCustomBlankNode}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          Add Custom Element
        </button>

        <input
          placeholder="Search pre-defined tech..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.id}>
            <h3 className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">
              {category.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => onAddNode(component)}
                  className="rounded-2xl border border-gray-100 bg-white p-3 transition hover:border-indigo-500 hover:shadow-md text-left cursor-pointer"
                >
                  <div className="text-3xl mb-2">{component.icon}</div>
                  <div className="font-semibold text-sm text-gray-800 truncate">
                    {component.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">
                    {component.technology}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentSidebar;

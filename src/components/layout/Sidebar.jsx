import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: "🏠",
    },
    {
      label: "My Projects",
      path: "/projects",
      icon: "📁",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold text-indigo-600">FlowForge</h1>
        <p className="text-sm text-gray-500 mt-1">AI Architecture Designer</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
              location.pathname === item.path
                ? "bg-indigo-50 text-indigo-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t mt-auto">
        <div className="px-4 py-3 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            👤
          </div>
          <div>
            <p className="font-medium">Demo User</p>
            <p className="text-xs text-gray-500">user@demo.com</p>
          </div>
        </div>

        <button
          onClick={() => alert("Logged out")}
          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

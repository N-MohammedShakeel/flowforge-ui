import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { aiApi } from "../services/api";

const Dashboard = () => {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFromIdea = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);

    try {
      const response = await aiApi.generateArchitecture({
        project_id: `proj_${Date.now()}`,
        source: "IDEA",
        payload: { description },
      });

      console.log("✅ Generated:", response.data);
      alert("Architecture generated! Check console.");
    } catch (error) {
      console.error(error);
      alert("Failed to generate.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold mb-10">Welcome to FlowForge</h2>

          <div className="bg-white rounded-3xl shadow p-10 mb-12">
            <h3 className="text-2xl font-semibold mb-8">
              Create New Architecture
            </h3>

            <div className="grid grid-cols-3 gap-8">
              {/* From Idea */}
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-400 transition-all">
                <div className="text-5xl mb-6">💡</div>
                <h4 className="text-xl font-semibold mb-3">From Idea</h4>
                <p className="text-gray-600 mb-8">Describe your project</p>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Build a bus ticket booking system like RedBus..."
                  className="w-full h-40 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500 resize-y mb-6"
                />

                <button
                  onClick={handleGenerateFromIdea}
                  disabled={isGenerating || !description.trim()}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium rounded-2xl"
                >
                  {isGenerating ? "Generating..." : "Generate Architecture"}
                </button>
              </div>

              {/* Other two options (same as before) */}
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-400 transition-all flex flex-col">
                <div className="text-5xl mb-6">📄</div>
                <h4 className="text-xl font-semibold mb-3">
                  From SRS Document
                </h4>
                <p className="text-gray-600 flex-1">
                  Upload Software Requirements
                </p>
                <button className="w-full py-4 border border-gray-300 hover:bg-gray-50 rounded-2xl mt-8">
                  Upload PDF
                </button>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-400 transition-all flex flex-col">
                <div className="text-5xl mb-6">📁</div>
                <h4 className="text-xl font-semibold mb-3">
                  Analyze Existing Project
                </h4>
                <p className="text-gray-600 flex-1">Upload your project</p>
                <button className="w-full py-4 border border-gray-300 hover:bg-gray-50 rounded-2xl mt-8">
                  Upload ZIP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

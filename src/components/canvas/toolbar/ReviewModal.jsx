import React from "react";
import { XMarkIcon, SparklesIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

export default function ReviewModal({
  isOpen,
  onClose,
  latestReview,
  onGenerateReview,
  isGenerating,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <DocumentCheckIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Architecture Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {latestReview ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Overall Score</div>
                  <div className="text-3xl font-black text-indigo-600">
                    {latestReview.overall_score}/100
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Architecture Score</div>
                  <div className="text-3xl font-black text-blue-600">
                    {latestReview.architecture_score}/100
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Scalability</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {latestReview.scalability}/100
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Security</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {latestReview.security}/100
                  </div>
                </div>
              </div>

              {latestReview.issues && latestReview.issues.length > 0 && (
                <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                  <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Issues Found
                  </h3>
                  <ul className="space-y-2">
                    {latestReview.issues.map((issue, idx) => (
                      <li key={idx} className="text-red-700 text-sm pl-4 relative">
                        <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {latestReview.suggestions && latestReview.suggestions.length > 0 && (
                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <h3 className="text-green-800 font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {latestReview.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-green-700 text-sm pl-4 relative">
                        <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <DocumentCheckIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Review Found</h3>
              <p className="text-gray-500 mt-2">
                Generate an AI review to see architecture feedback here.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onGenerateReview}
            disabled={isGenerating}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
            {latestReview ? "Generate New Review" : "Generate Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

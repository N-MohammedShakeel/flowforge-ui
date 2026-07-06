import React from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export default function EnhancementModal({
  isOpen,
  onClose,
  currentVersion,
  totalVersions,
  onPreviousVersion,
  onNextVersion,
  onEnhance,
  isEnhancing,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DocumentDuplicateIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Version Control</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-gray-50/30 flex flex-col items-center">
          <div className="text-sm text-gray-500 font-medium mb-4 uppercase tracking-wider">
            Architecture History
          </div>
          
          <div className="flex items-center justify-center gap-6 mb-8 w-full">
            <button
              onClick={onPreviousVersion}
              disabled={currentVersion <= 1}
              className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-gray-800">
                v{currentVersion || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                of {totalVersions || 0} versions
              </div>
            </div>

            <button
              onClick={onNextVersion}
              disabled={currentVersion >= totalVersions}
              className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full h-px bg-gray-200 mb-6"></div>

          <p className="text-center text-sm text-gray-600 mb-6">
            Generate an enhanced version of the current architecture. This will save your current progress and create a new version automatically.
          </p>

          <button
            onClick={onEnhance}
            disabled={isEnhancing}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isEnhancing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SparklesIcon className="w-6 h-6" />
            )}
            {isEnhancing ? "Enhancing..." : "Generate Enhancement"}
          </button>
        </div>
      </div>
    </div>
  );
}

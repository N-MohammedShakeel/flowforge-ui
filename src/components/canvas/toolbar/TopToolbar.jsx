import React from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function TopToolbar({
  projectName = "Untitled Architecture",
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onSave,
  isSaving = false,
  onExport,
  onReview,
  isReviewing = false,
  onEnhance,
  isEnhancing = false,
}) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-50 shadow-sm select-none">
      {/* Left Section: Branding & Metadata */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          FlowForge
        </h1>
        <span className="text-gray-300 text-lg">|</span>
        <span className="text-gray-700 font-semibold text-base">
          {projectName}
        </span>
      </div>

      {/* Center Section: Core Canvas Control Actions */}
      <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50 gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo Action"
          className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo Action"
          className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
        >
          <ArrowUturnRightIcon className="h-5 w-5" />
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg disabled:opacity-50 font-medium transition cursor-pointer"
        >
          <CloudArrowUpIcon className="h-5 w-5 text-gray-500" />
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg font-medium transition cursor-pointer"
        >
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
          Export JSON
        </button>
      </div>

      {/* Right Section: Core AI Workspace Agent Tools */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReview}
          disabled={isReviewing}
          className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <MagnifyingGlassIcon
            className={`h-4 w-4 ${isReviewing ? "animate-spin" : ""}`}
          />
          {isReviewing ? "Reviewing..." : "Review Architecture"}
        </button>

        <button
          onClick={onEnhance}
          disabled={isEnhancing}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <SparklesIcon
            className={`h-4 w-4 ${isEnhancing ? "animate-spin" : ""}`}
          />
          {isEnhancing ? "Enhancing Layout..." : "Enhance Architecture"}
        </button>
      </div>
    </div>
  );
}

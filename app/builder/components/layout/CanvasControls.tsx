"use client";

import React from "react";
import { ZoomIn, ZoomOut, Grid, Maximize2, Minus, Plus } from "lucide-react";
import { useCanvas } from "@/app/builder/contexts/CanvasContext";

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

export const CanvasControls: React.FC = () => {
  const { zoom, setZoom, showGrid, setShowGrid, snapToGrid, setSnapToGrid, showGuides, setShowGuides } = useCanvas();

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleFitToView = () => {
    setZoom(100);
  };

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
      {/* Zoom Controls */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={handleZoomOut}
          disabled={zoom === ZOOM_LEVELS[0]}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <select
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {ZOOM_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}%
            </option>
          ))}
        </select>
        <button
          onClick={handleZoomIn}
          disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Fit to View */}
      <button
        onClick={handleFitToView}
        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors border-r border-gray-200 pr-2"
        title="Fit to View"
      >
        <Maximize2 size={16} />
      </button>

      {/* Grid Toggle */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`p-1.5 rounded transition-colors border-r border-gray-200 pr-2 ${
          showGrid ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        title="Toggle Grid"
      >
        <Grid size={16} />
      </button>

      {/* Snap to Grid Toggle */}
      {showGrid && (
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            snapToGrid ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title="Snap to Grid"
        >
          Snap
        </button>
      )}
    </div>
  );
};


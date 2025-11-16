"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, Undo, Redo, Save, Upload, Eye, Edit, Download, ZoomIn, ZoomOut, Grid, Maximize2 } from "lucide-react";
import { useResponsive, BREAKPOINTS, BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useCanvas } from "@/app/builder/contexts/CanvasContext";

interface CombinedToolbarProps {
  isPreviewMode: boolean;
  onPreviewToggle: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  saveStatus?: string;
}

export const CombinedToolbar: React.FC<CombinedToolbarProps> = ({
  isPreviewMode,
  onPreviewToggle,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onExport,
  canUndo = false,
  canRedo = false,
  saveStatus = "",
}) => {
  const { currentBreakpoint, setCurrentBreakpoint } = useResponsive();
  const { actualCanvasWidth } = useCanvasWidth();
  const { zoom, setZoom, showGrid, setShowGrid, snapToGrid, setSnapToGrid } = useCanvas();
  
  // Zoom levels
  const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];
  
  // Get canvas width for display
  const getCanvasWidth = (breakpoint: keyof typeof BREAKPOINTS): number | null => {
    switch (breakpoint) {
      case "mobile":
        return 375;
      case "tablet":
        return 768;
      case "desktop":
        return null;
      default:
        return null;
    }
  };
  
  const displayWidth = actualCanvasWidth || getCanvasWidth(currentBreakpoint);

  // Zoom handlers
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
    <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left: Logo + Mode */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">WB</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">Website Builder</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${isPreviewMode ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
          {isPreviewMode ? "Preview" : "Edit"}
        </span>
      </div>

      {/* Center: Breakpoint indicator (only in edit mode when canvas is constrained) */}
      {!isPreviewMode && displayWidth && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-1.5">
            {currentBreakpoint === 'desktop' && <Monitor size={14} className="text-blue-600" />}
            {currentBreakpoint === 'tablet' && <Tablet size={14} className="text-blue-600" />}
            {currentBreakpoint === 'mobile' && <Smartphone size={14} className="text-blue-600" />}
            <span className="text-xs font-semibold text-blue-700">
              {BREAKPOINTS[currentBreakpoint].label}
            </span>
            <span className="text-xs text-blue-600">
              {displayWidth}px
            </span>
          </div>
        </div>
      )}

      {/* Right: Responsive icons + Undo/Redo/Save/Load/Preview */}
      <div className="flex items-center gap-2">
        {/* Responsive icons - no labels */}
        {!isPreviewMode && (
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md p-0.5">
            {Object.entries(BREAKPOINTS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCurrentBreakpoint(key as BreakpointKey)}
                className={`p-1.5 rounded transition-colors ${
                  currentBreakpoint === key
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                title={`${config.label} (${config.min}px${config.max === Infinity ? '+' : `-${config.max}px`})`}
              >
                {key === 'desktop' && <Monitor size={16} />}
                {key === 'tablet' && <Tablet size={16} />}
                {key === 'mobile' && <Smartphone size={16} />}
              </button>
            ))}
          </div>
        )}

        {/* Canvas Controls: Zoom and Grid (only in edit mode) */}
        {!isPreviewMode && (
          <>
            {/* Separator */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
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
                title="Zoom Level"
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
              <button
                onClick={handleFitToView}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Fit to View (100%)"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Grid Toggle */}
            <div className="flex items-center gap-1">
              <div className="h-6 w-px bg-gray-300" />
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded transition-colors ${
                  showGrid ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                title="Toggle Grid"
              >
                <Grid size={16} />
              </button>
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
          </>
        )}

        {/* Undo */}
        {!isPreviewMode && onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
            }`}
            title="Undo"
          >
            <Undo size={16} />
          </button>
        )}

        {/* Redo */}
        {!isPreviewMode && onRedo && (
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
            }`}
            title="Redo"
          >
            <Redo size={16} />
          </button>
        )}

        {/* Save */}
        {!isPreviewMode && onSave && (
          <button
            onClick={onSave}
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Save"
          >
            <Save size={16} />
          </button>
        )}

        {/* Load */}
        {!isPreviewMode && onLoad && (
          <button
            onClick={onLoad}
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Load"
          >
            <Upload size={16} />
          </button>
        )}

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Export HTML/CSS for eBay"
          >
            <Download size={16} />
          </button>
        )}

        {/* Save/Load Status */}
        {!isPreviewMode && saveStatus && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{saveStatus}</span>
        )}

        {/* Preview Button */}
        <button
          onClick={onPreviewToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isPreviewMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isPreviewMode ? (
            <>
              <Edit size={14} />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Eye size={14} />
              <span>Preview</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


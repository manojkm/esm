"use client";

import { useState } from "react";

// Craft.js core components for drag-and-drop editor
import { Editor } from "@craftjs/core";
// Page builder components and UI
import { Text, Button, Container, Toolbox, SettingsPanel } from "./components";
import { ToolbarActions } from "./components/layout/ToolbarActions";
import { KeyboardShortcuts } from "./components/layout/KeyboardShortcuts";
import { CanvasControls } from "./components/layout/CanvasControls";
import { CanvasGrid } from "./components/layout/CanvasGrid";
import { CanvasArea } from "./components/layout/CanvasArea";
import { ResponsiveProvider } from "@/app/builder/contexts/ResponsiveContext";
import { CanvasProvider } from "@/app/builder/contexts/CanvasContext";
import { RenderNode } from "./components/ui/RenderNode";

/**
 * Main Page Builder Interface
 * Features: Drag/drop editor, responsive design, component toolbox, settings panel, preview mode
 */
export default function Builder() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    // Responsive context for breakpoint management
    <ResponsiveProvider>
      {/* Canvas context for zoom, grid, guides */}
      <CanvasProvider>
        {/* Full-height layout container */}
        <div className="h-screen flex flex-col bg-white">
          {/* Craft.js Editor - Main drag/drop functionality */}
          <Editor
            resolver={{ Text, Button, Container }} // Available components
            indicator={{
              success: "#10b981", // Drop success color
              error: "#ef4444", // Drop error color
            }}
            onRender={isPreviewMode ? undefined : RenderNode} // Disable custom rendering in preview mode
            enabled={!isPreviewMode} // Disable editing in preview mode
          >
            {/* Keyboard Shortcuts Handler */}
            {!isPreviewMode && <KeyboardShortcuts />}

            {/* Combined Toolbar - Inside Editor context for undo/redo/save/load */}
            <ToolbarActions isPreviewMode={isPreviewMode} onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)} />
            {/* Main editor layout */}
            <div className="flex-1 flex">
              {/* Left sidebar - Component toolbox - Hidden in preview mode */}
              {!isPreviewMode && <Toolbox />}

              {/* Center - Canvas area */}
              <div className={`flex-1 flex flex-col relative ${isPreviewMode ? "bg-white" : ""}`}>
                {/* Canvas Grid Overlay */}
                {!isPreviewMode && <CanvasGrid />}

                {/* Canvas Controls */}
                {!isPreviewMode && <CanvasControls />}

                {/* Main canvas with default content */}
                <CanvasArea isPreviewMode={isPreviewMode} />
              </div>

              {/* Right sidebar - Settings and layers - Hidden in preview mode */}
              {!isPreviewMode && <SettingsPanel />}
            </div>
          </Editor>
        </div>
      </CanvasProvider>
    </ResponsiveProvider>
  );
}

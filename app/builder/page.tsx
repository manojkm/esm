"use client";

import { useState } from "react";

// Craft.js core components for drag-and-drop editor
import { Editor, Frame, Element } from "@craftjs/core";
// Page builder components and UI
import { Text, Button, Container, Image, Heading, Video, Icon, Toolbar, Toolbox, SettingsPanel } from "./components";
import { ResponsiveToolbar } from "./components/layout/ResponsiveToolbar";
import { ResponsiveProvider } from "@/app/builder/contexts/ResponsiveContext";
import { RenderNode } from "./components/ui/RenderNode";
import { Eye, Edit } from "lucide-react";

/**
 * Main Page Builder Interface
 * Features: Drag/drop editor, responsive design, component toolbox, settings panel, preview mode
 */
export default function Builder() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    // Responsive context for breakpoint management
    <ResponsiveProvider>
      {/* Full-height layout container */}
      <div className="h-screen flex flex-col bg-white">
        {/* Preview Mode Toggle */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">Website Builder</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPreviewMode ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{isPreviewMode ? "Preview Mode" : "Edit Mode"}</span>
          </div>

          <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isPreviewMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-green-600 text-white hover:bg-green-700"}`}>
            {isPreviewMode ? (
              <>
                <Edit size={16} />
                Back to Edit
              </>
            ) : (
              <>
                <Eye size={16} />
                Preview
              </>
            )}
          </button>
        </div>

        {/* Craft.js Editor - Main drag/drop functionality */}
        <Editor
          resolver={{ Text, Button, Container, Image, Heading, Video, Icon }} // Available components
          indicator={{
            success: "#10b981", // Drop success color
            error: "#ef4444", // Drop error color
          }}
          onRender={isPreviewMode ? undefined : RenderNode} // Disable custom rendering in preview mode
          enabled={!isPreviewMode} // Disable editing in preview mode
        >
          {/* Top toolbar - Hidden in preview mode */}
          {!isPreviewMode && <Toolbar />}

          {/* Main editor layout */}
          <div className="flex-1 flex">
            {/* Left sidebar - Component toolbox - Hidden in preview mode */}
            {!isPreviewMode && <Toolbox />}

            {/* Center - Canvas area */}
            <div className={`flex-1 flex flex-col ${isPreviewMode ? "bg-white" : ""}`}>
              {/* Device breakpoint selector - Hidden in preview mode */}
              {!isPreviewMode && (
                <div className="bg-white border-b border-gray-200 p-4 flex justify-center">
                  <ResponsiveToolbar />
                </div>
              )}

              {/* Main canvas with default content */}
              <div className={`flex-1 overflow-auto ${isPreviewMode ? "bg-white" : "p-4"}`}>
                <Frame>
                  {/* Root container - canvas allows dropping */}
                  <Element is={Container} canvas>
                    {/* Sample content */}
                    <Text text="Welcome to your website!" fontSize="24" />

                    {/* Flex container with buttons */}
                    <Element is={Container} layout="flex" flexDirection="row" justifyContent="center" padding={6} className="bg-blue-50 gap-4" canvas>
                      <Button text="Get Started" />
                      <Button text="Learn More" color="bg-green-500" />
                    </Element>

                    {/* Grid container with text elements */}
                    <Element is={Container} layout="grid" padding={4} className="gap-4" canvas>
                      <Text text="Feature 1" />
                      <Text text="Feature 2" />
                      <Text text="Feature 3" />
                    </Element>
                  </Element>
                </Frame>
              </div>
            </div>

            {/* Right sidebar - Settings and layers - Hidden in preview mode */}
            {!isPreviewMode && <SettingsPanel />}
          </div>
        </Editor>
      </div>
    </ResponsiveProvider>
  );
}

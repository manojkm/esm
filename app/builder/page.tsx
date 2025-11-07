"use client";

// Craft.js core components for drag-and-drop editor
import { Editor, Frame, Element } from "@craftjs/core";
// Page builder components and UI
import { Text, Button, Container, Image, Heading, Video, Icon, Toolbar, Toolbox, SettingsPanel } from "./components";
import { ResponsiveToolbar } from "./components/layout/ResponsiveToolbar";
import { ResponsiveProvider } from "@/app/builder/contexts/ResponsiveContext";
import { RenderNode } from "./components/ui/RenderNode";

/**
 * Main Page Builder Interface
 * Features: Drag/drop editor, responsive design, component toolbox, settings panel
 */
export default function Builder() {
  return (
    // Responsive context for breakpoint management
    <ResponsiveProvider>
      {/* Full-height layout container */}
      <div className="h-screen flex flex-col bg-white">
        {/* Craft.js Editor - Main drag/drop functionality */}
        <Editor
          resolver={{ Text, Button, Container, Image, Heading, Video, Icon }} // Available components
          indicator={{
            success: "#10b981", // Drop success color
            error: "#ef4444", // Drop error color
          }}
          onRender={RenderNode}
        >
          {/* Top toolbar with save/load/undo/redo */}
          <Toolbar />

          {/* Main editor layout */}
          <div className="flex-1 flex">
            {/* Left sidebar - Component toolbox */}
            <Toolbox />

            {/* Center - Canvas area */}
            <div className="flex-1 flex flex-col">
              {/* Device breakpoint selector */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-center">
                <ResponsiveToolbar />
              </div>

              {/* Main canvas with default content */}
              <div className="flex-1 p-4 overflow-auto">
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

            {/* Right sidebar - Settings and layers */}
            <SettingsPanel />

            {/* <Layers expandRootOnLoad={true} /> */}
          </div>
        </Editor>
      </div>
    </ResponsiveProvider>
  );
}

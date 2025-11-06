"use client";

import { Editor, Frame, Element } from "@craftjs/core";
import { 
  Text, 
  Button, 
  Container, 
  Image, 
  Heading, 
  Video, 
  Icon,
  Toolbar,
  Toolbox,
  SettingsPanel
} from "./components";
import { ResponsiveToolbar } from "./components/layout/ResponsiveToolbar";
import { ResponsiveProvider } from "@/app/builder/contexts/ResponsiveContext";

export default function Builder() {
  return (
    <ResponsiveProvider>
      <div className="h-screen flex flex-col bg-white">
        <Editor 
          resolver={{ Text, Button, Container, Image, Heading, Video, Icon }}
          indicator={{
            success: '#10b981', // green-500
            error: '#ef4444',   // red-500
            style: {
              borderRadius: '4px',
              borderWidth: '2px',
              borderStyle: 'dashed',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          <Toolbar />
          <div className="flex-1 flex">
            <Toolbox />
            <div className="flex-1 flex flex-col">
              {/* Responsive Toolbar */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-center">
                <ResponsiveToolbar />
              </div>
              
              <div className="flex-1 p-4 overflow-auto">
                <Frame>
                  <Element is={Container} canvas>
                    <Text text="Welcome to your website!" fontSize="24" />
                    <Element is={Container} layout="flex" flexDirection="row" justifyContent="center" gap={4} padding={6} background="bg-blue-50" canvas>
                      <Button text="Get Started" />
                      <Button text="Learn More" color="bg-green-500" />
                    </Element>
                    <Element is={Container} layout="grid" gridCols={3} gap={4} padding={4} canvas>
                      <Text text="Feature 1" />
                      <Text text="Feature 2" />
                      <Text text="Feature 3" />
                    </Element>
                  </Element>
                </Frame>
              </div>
            </div>
            <SettingsPanel />
          </div>
        </Editor>
      </div>
    </ResponsiveProvider>
  );
}
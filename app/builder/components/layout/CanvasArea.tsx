"use client";

import React from "react";
import { Frame, Element } from "@craftjs/core";
import { useCanvas } from "@/app/builder/contexts/CanvasContext";
import { Container } from "../ui";

interface CanvasAreaProps {
  isPreviewMode: boolean;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({ isPreviewMode }) => {
  const { zoom } = useCanvas();

  return (
    <div className={`flex-1 overflow-auto ${isPreviewMode ? "bg-white" : "p-4"}`} style={!isPreviewMode ? { transform: `scale(${zoom / 100})`, transformOrigin: "top left" } : {}}>
      <Frame>
        {/* Root container - canvas allows dropping */}
        <Element is={Container} canvas>
          {/* Empty canvas - users can start dropping components here */}
        </Element>
      </Frame>
    </div>
  );
};

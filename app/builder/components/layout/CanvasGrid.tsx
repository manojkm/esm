"use client";

import React from "react";
import { useCanvas } from "@/app/builder/contexts/CanvasContext";

export const CanvasGrid: React.FC = () => {
  const { showGrid, zoom } = useCanvas();

  if (!showGrid) return null;

  const gridSize = 20; // Base grid size in pixels
  const scaledGridSize = (gridSize * zoom) / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
      }}
    />
  );
};


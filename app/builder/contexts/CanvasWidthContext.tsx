"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { BreakpointKey } from "./ResponsiveContext";
import { BREAKPOINTS } from "./ResponsiveContext";

interface CanvasWidthContextType {
  actualCanvasWidth: number | null;
  actualBreakpoint: BreakpointKey | null;
  setCanvasWidth: (width: number) => void;
}

const CanvasWidthContext = createContext<CanvasWidthContextType | undefined>(undefined);

/**
 * Determine the breakpoint based on actual width
 */
const getBreakpointFromWidth = (width: number): BreakpointKey => {
  if (width >= BREAKPOINTS.desktop.min) return "desktop";
  if (width >= BREAKPOINTS.tablet.min) return "tablet";
  return "mobile";
};

export const CanvasWidthProvider = ({ children }: { children: ReactNode }) => {
  const [actualCanvasWidth, setActualCanvasWidth] = useState<number | null>(null);
  const [actualBreakpoint, setActualBreakpoint] = useState<BreakpointKey | null>(null);

  const setCanvasWidth = useCallback((width: number) => {
    setActualCanvasWidth(width);
    setActualBreakpoint(getBreakpointFromWidth(width));
  }, []);

  return (
    <CanvasWidthContext.Provider
      value={{
        actualCanvasWidth,
        actualBreakpoint,
        setCanvasWidth,
      }}
    >
      {children}
    </CanvasWidthContext.Provider>
  );
};

export const useCanvasWidth = () => {
  const context = useContext(CanvasWidthContext);
  if (!context) {
    // Return default values if not in provider (for preview mode or outside editor)
    return {
      actualCanvasWidth: null,
      actualBreakpoint: null,
      setCanvasWidth: () => {},
    };
  }
  return context;
};


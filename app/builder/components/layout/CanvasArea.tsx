"use client";

import React, { useRef, useEffect } from "react";
import { Frame, Element } from "@craftjs/core";
import { useCanvas } from "@/app/builder/contexts/CanvasContext";
import { useResponsive, BREAKPOINTS } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { Container } from "../ui";

interface CanvasAreaProps {
  isPreviewMode: boolean;
}

/**
 * Get the canvas width based on the current breakpoint
 * This simulates the actual device width in the editor
 */
const getCanvasWidth = (breakpoint: keyof typeof BREAKPOINTS): number | null => {
  switch (breakpoint) {
    case "mobile":
      // Common mobile widths: 375px (iPhone), 390px, 414px, 428px
      return 375; // iPhone standard width
    case "tablet":
      // Common tablet widths: 768px (iPad), 820px, 1024px
      return 768; // iPad standard width
    case "desktop":
      // Desktop: no constraint, use full width
      return null;
    default:
      return null;
  }
};

/**
 * Determine the current breakpoint based on actual width
 * This matches the BREAKPOINTS definition
 */
const getBreakpointFromWidth = (width: number): keyof typeof BREAKPOINTS => {
  if (width >= 1024) return "desktop";
  if (width >= 768) return "tablet";
  return "mobile";
};

export const CanvasArea: React.FC<CanvasAreaProps> = ({ isPreviewMode }) => {
  const { zoom } = useCanvas();
  const { currentBreakpoint } = useResponsive();
  const { setCanvasWidth } = useCanvasWidth();
  const frameWrapperRef = useRef<HTMLDivElement>(null);

  // Get canvas width constraint based on current breakpoint
  const canvasWidth = !isPreviewMode ? getCanvasWidth(currentBreakpoint) : null;

  // Track actual canvas width and update context for responsive simulation
  useEffect(() => {
    if (!frameWrapperRef.current || isPreviewMode) return;

    const element = frameWrapperRef.current;

    // Use ResizeObserver to track actual canvas width
    // Debounce updates to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const actualWidth = entry.contentRect.width;

        // Debounce updates to reduce re-renders (wait 50ms after last resize)
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          // Update context so all containers can react to canvas width changes
          setCanvasWidth(actualWidth);

          // Set CSS custom property with actual width (for potential CSS usage)
          element.style.setProperty("--canvas-width", `${actualWidth}px`);

          // Set breakpoint based on actual width (for DOM queries)
          const detectedBreakpoint = getBreakpointFromWidth(actualWidth);
          element.setAttribute("data-canvas-breakpoint", detectedBreakpoint);
        }, 50);
      }
    });

    resizeObserver.observe(element);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resizeObserver.disconnect();
    };
  }, [isPreviewMode, setCanvasWidth]);

  // Calculate container styles
  // Always center the canvas to prevent shifting when switching breakpoints
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    minHeight: "100%",
    ...(canvasWidth && {
      padding: "20px",
    }),
  };

  // Calculate frame wrapper styles
  // Use flex-shrink: 0 to prevent the wrapper from shrinking and causing layout shifts
  // Ensure proper centering and containment to prevent shifting when switching breakpoints
  const frameWrapperStyle: React.CSSProperties = {
    width: canvasWidth ? `${canvasWidth}px` : "100%",
    maxWidth: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    flexShrink: 0, // Prevent shrinking when parent flexbox changes
    backgroundColor: "transparent",
    boxShadow: canvasWidth ? "0 0 0 1px rgba(0, 0, 0, 0.1)" : "none",
    transition: "width 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    // Ensure content inside doesn't shift - contain everything properly
    overflow: "visible", // Allow overflow for zoom scaling
  };

  // Frame wrapper inner style with zoom transform
  // Zoom should be applied to the content, not the canvas width itself
  // Use left top origin since the wrapper is already centered with margin: auto
  const frameInnerStyle: React.CSSProperties = {
    width: "100%", // Always fill parent width to prevent shifting
    ...(!isPreviewMode && zoom !== 100
      ? {
          transform: `scale(${zoom / 100})`,
          transformOrigin: "left top", // Use left top since wrapper is already centered
          // Adjust width to compensate for scale to maintain layout
          width: `${100 / (zoom / 100)}%`,
        }
      : {}),
  };

  return (
    <div className={`flex-1 overflow-auto ${isPreviewMode ? "bg-white" : ""}`} style={containerStyle}>
      <div ref={frameWrapperRef} style={frameWrapperStyle}>
        <div style={frameInnerStyle}>
          <Frame>
            {/* Root container - canvas allows dropping */}
            <Element is={Container} canvas>
              {/* Empty canvas - users can start dropping components here */}
            </Element>
          </Frame>
        </div>
      </div>
    </div>
  );
};

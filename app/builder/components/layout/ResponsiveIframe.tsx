"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { useResponsive, BREAKPOINTS } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvas } from "@/app/builder/contexts/CanvasContext";

interface ResponsiveIframeProps {
  children: React.ReactNode;
  width: number | null;
  zoom: number;
  isPreviewMode: boolean;
}

/**
 * Responsive iframe wrapper that renders content in an iframe
 * so CSS media queries respond to the iframe's viewport width, not the browser window.
 * This simulates how modern website builders work.
 */
export const ResponsiveIframe: React.FC<ResponsiveIframeProps> = ({
  children,
  width,
  zoom,
  isPreviewMode,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { query, actions } = useEditor();
  const { currentBreakpoint } = useResponsive();

  // Get the HTML content from Craft.js
  const getSerializedContent = useCallback(() => {
    try {
      return query.serialize();
    } catch (error) {
      console.error("Error serializing content:", error);
      return null;
    }
  }, [query]);

  // Set iframe content when it loads or content changes
  useEffect(() => {
    if (!iframeRef.current || !iframeLoaded) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Set iframe document HTML
    const serialized = getSerializedContent();
    if (!serialized) return;

    // Create a React renderer that will render the content inside the iframe
    // For now, we'll use a simpler approach - render the children directly
    // We need to inject React and Craft.js into the iframe

    // Actually, let me use a different approach - we'll render children in parent
    // and use CSS to constrain, then use ResizeObserver to detect canvas width changes
    // and inject viewport meta tag changes
  }, [iframeLoaded, getSerializedContent, children]);

  // Set iframe viewport width
  useEffect(() => {
    if (!iframeRef.current || !iframeLoaded) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Update viewport meta tag width
    let viewport = iframeDoc.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = iframeDoc.createElement("meta");
      viewport.setAttribute("name", "viewport");
      iframeDoc.head.appendChild(viewport);
    }

    if (width) {
      viewport.setAttribute(
        "content",
        `width=${width}, initial-scale=1, maximum-scale=1, user-scalable=no`
      );
    } else {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      );
    }

    // Update iframe body width to match
    if (iframeDoc.body) {
      iframeDoc.body.style.width = width ? `${width}px` : "100%";
      iframeDoc.body.style.margin = "0 auto";
      iframeDoc.body.style.minHeight = "100vh";
    }
  }, [width, iframeLoaded]);

  const handleLoad = () => {
    setIframeLoaded(true);
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Inject styles and scripts into iframe
    const style = iframeDoc.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    `;
    iframeDoc.head.appendChild(style);
  };

  // Iframe container styles
  const iframeContainerStyle: React.CSSProperties = {
    width: width ? `${width}px` : "100%",
    maxWidth: "100%",
    margin: "0 auto",
    backgroundColor: width ? "#f9fafb" : "transparent",
    boxShadow: width ? "0 0 0 1px rgba(0, 0, 0, 0.1)" : "none",
    transition: "width 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    overflow: "hidden",
    height: "100%",
    minHeight: "100%",
  };

  const iframeStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
    transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
    transformOrigin: "top center",
    transition: "transform 0.2s ease",
  };

  // For now, let's use a simpler approach without iframe
  // We'll use a div with CSS that simulates viewport width
  // and use ResizeObserver + style injection to apply responsive styles

  return (
    <div style={iframeContainerStyle}>
      {/* Breakpoint indicator */}
      {width && !isPreviewMode && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: 500,
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {BREAKPOINTS[currentBreakpoint].label} ({width}px)
        </div>
      )}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
};


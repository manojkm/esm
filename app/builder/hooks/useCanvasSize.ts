"use client";

import { useEffect, useState, RefObject } from "react";

/**
 * Hook to track the width of an element (canvas) for responsive simulation
 */
export const useCanvasSize = (ref: RefObject<HTMLElement>): number | null => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Set initial width
    setWidth(element.offsetWidth);

    // Use ResizeObserver to track width changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return width;
};


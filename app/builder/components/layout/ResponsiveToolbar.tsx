"use client";

import React from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useResponsive, BREAKPOINTS, BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";

export const ResponsiveToolbar = () => {
  const { currentBreakpoint, setCurrentBreakpoint } = useResponsive();

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
      {Object.entries(BREAKPOINTS).map(([key, config]) => (
        <button
          key={key}
          onClick={() => setCurrentBreakpoint(key as BreakpointKey)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentBreakpoint === key
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title={`${config.label} (${config.min}px${config.max === Infinity ? '+' : `-${config.max}px`})`}
        >
          {key === 'desktop' && <Monitor size={16} />}
          {key === 'tablet' && <Tablet size={16} />}
          {key === 'mobile' && <Smartphone size={16} />}
          <span className="hidden sm:inline">{config.label}</span>
        </button>
      ))}
    </div>
  );
};
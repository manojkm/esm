"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Breakpoint definitions
export const BREAKPOINTS = {
  desktop: { min: 1024, max: Infinity, label: "Desktop", icon: "🖥️" },
  tablet: { min: 768, max: 1023, label: "Tablet", icon: "📱" },
  mobile: { min: 0, max: 767, label: "Mobile", icon: "📱" }
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

interface ResponsiveContextType {
  currentBreakpoint: BreakpointKey;
  setCurrentBreakpoint: (breakpoint: BreakpointKey) => void;
  getResponsiveValue: (values: Partial<Record<BreakpointKey, any>>, fallback?: any) => any;
  setResponsiveValue: (values: Partial<Record<BreakpointKey, any>>, breakpoint: BreakpointKey, value: any) => Partial<Record<BreakpointKey, any>>;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider = ({ children }: { children: ReactNode }) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>("desktop");

  // Get value for current breakpoint with fallback logic
  const getResponsiveValue = (values: Partial<Record<BreakpointKey, any>>, fallback?: any) => {
    // Try current breakpoint first
    if (values[currentBreakpoint] !== undefined) {
      return values[currentBreakpoint];
    }
    
    // Fallback hierarchy: desktop -> tablet -> mobile
    const fallbackOrder: BreakpointKey[] = ["desktop", "tablet", "mobile"];
    for (const bp of fallbackOrder) {
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }
    
    return fallback;
  };

  // Set value for specific breakpoint
  const setResponsiveValue = (values: Partial<Record<BreakpointKey, any>>, breakpoint: BreakpointKey, value: any) => {
    return {
      ...values,
      [breakpoint]: value
    };
  };

  return (
    <ResponsiveContext.Provider value={{
      currentBreakpoint,
      setCurrentBreakpoint,
      getResponsiveValue,
      setResponsiveValue
    }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error("useResponsive must be used within ResponsiveProvider");
  }
  return context;
};
"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveRecord } from "../types/responsive";
import { ColorPicker } from "./ColorPicker";

/**
 * Shared color input that optionally supports per-breakpoint overrides.
 * Consumed by feature modules such as background, border, and typography.
 */
export interface ColorInputProps {
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
  placeholder?: string;
  responsive?: boolean;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange, placeholder = "#000000", responsive = false }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  if (responsive) {
    const responsiveValue = getResponsiveValue((value as ResponsiveRecord) || {}, null);
    const hasCustomValue = responsiveValue !== null;

    const handleResponsiveChange = (newValue: string | null) => {
      const updatedValues = setResponsiveValue((value as ResponsiveRecord) || {}, currentBreakpoint, newValue);
      onChange(updatedValues);
    };

    const handleReset = () => {
      const updatedValues = setResponsiveValue((value as ResponsiveRecord) || {}, currentBreakpoint, null);
      onChange(updatedValues);
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            {label}
            <span className="ml-2 text-blue-600">
              {currentBreakpoint === "desktop" && <Monitor size={12} />}
              {currentBreakpoint === "tablet" && <Tablet size={12} />}
              {currentBreakpoint === "mobile" && <Smartphone size={12} />}
            </span>
          </label>
          {hasCustomValue && (
            <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <ColorPicker
            color={responsiveValue}
            onChange={handleResponsiveChange}
            allowTransparent={true}
          />
          <input
            type="text"
            value={responsiveValue || ""}
            onChange={(event) => handleResponsiveChange(event.target.value || null)}
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  const stringValue = (value as string | null) ?? "";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        <ColorPicker
          color={stringValue}
          onChange={(color) => onChange(color)}
          allowTransparent={true}
        />
        <input
          type="text"
          value={stringValue}
          onChange={(event) => onChange(event.target.value || null)}
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};


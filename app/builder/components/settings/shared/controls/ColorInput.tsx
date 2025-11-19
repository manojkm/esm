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
      <div className="flex items-center justify-between">
        {/* Left side: Label + Responsive icon */}
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {label}
          <span className="text-blue-600">
            {currentBreakpoint === "desktop" && <Monitor size={14} />}
            {currentBreakpoint === "tablet" && <Tablet size={14} />}
            {currentBreakpoint === "mobile" && <Smartphone size={14} />}
          </span>
        </label>

        {/* Right side: Reset icon + Color picker */}
        <div className="flex items-center gap-2">
          {hasCustomValue && (
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset to default"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <ColorPicker
            color={responsiveValue}
            onChange={handleResponsiveChange}
            allowTransparent={true}
            size="small"
          />
        </div>
      </div>
    );
  }

  const stringValue = (value as string | null) ?? "";

  return (
    <div className="flex items-center justify-between">
      {/* Left side: Label */}
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Right side: Color picker */}
      <ColorPicker
        color={stringValue}
        onChange={(color) => onChange(color)}
        allowTransparent={true}
        size="small"
      />
    </div>
  );
};


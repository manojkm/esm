"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveRecord } from "../types/responsive";

export interface ResponsiveSelectOption {
  value: string;
  label: string;
}

export interface ResponsiveSelectControlProps {
  controlId?: string;
  label: string;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord) => void;
  options: ResponsiveSelectOption[];
  defaultValue?: string;
  layout?: "grid" | "select";
  gridCols?: number;
}

export const ResponsiveSelectControl: React.FC<ResponsiveSelectControlProps> = ({
  controlId = "responsive-select",
  label,
  value,
  onChange,
  options,
  defaultValue = "",
  layout = "grid",
  gridCols = 2,
}) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const responsiveValue = getResponsiveValue(value || {}, defaultValue);

  const handleValueChange = (newValue: string) => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
    onChange(updatedValues);
  };

  const hasCustomValue = responsiveValue !== defaultValue;
  const baseId = `responsive-select-${controlId}`;

  const handleReset = () => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, defaultValue);
    onChange(updatedValues);
  };

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700" htmlFor={`${baseId}-control`}>
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
      
      {layout === "grid" ? (
        <div id={`${baseId}-buttons`} className={`grid grid-cols-${gridCols} gap-1`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              data-component-id={`${baseId}-${option.value}`}
              onClick={() => handleValueChange(option.value)}
              className={`px-2 py-2 text-xs border rounded ${responsiveValue === option.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
              aria-pressed={responsiveValue === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <select
          id={`${baseId}-select`}
          value={responsiveValue}
          onChange={(event) => handleValueChange(event.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-gray-900 bg-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
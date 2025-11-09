"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveRecord } from "../types/responsive";

/**
 * Slider + numeric input pair that stores values in the responsive map format.
 * Used by spacing and other numeric feature controls.
 */
export interface ResponsiveNumberInputProps {
  controlId?: string;
  label: string;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord, isThrottled?: boolean) => void;
  min?: number;
  max?: number;
  unit?: string;
  unitOptions?: string[];
  defaultValue?: number;
  minMaxByUnit?: Record<string, { min: number; max: number }>;
}

export const ResponsiveNumberInput: React.FC<ResponsiveNumberInputProps> = ({
  controlId = "responsive-number",
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  unit = "px",
  unitOptions = ["px", "%"],
  defaultValue = 0,
  minMaxByUnit,
}) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const responsiveValue = getResponsiveValue(value || {}, defaultValue);
  const responsiveUnit = getResponsiveValue((value as ResponsiveRecord)?.unit || {}, unit);

  const getBounds = (unitOverride?: string) => {
    if (minMaxByUnit) {
      const byUnit = minMaxByUnit[unitOverride ?? responsiveUnit];
      if (byUnit) {
        return byUnit;
      }
    }
    return { min, max };
  };

  const clampValue = (input: number, unitOverride?: string) => {
    const bounds = getBounds(unitOverride);
    return Math.min(bounds.max, Math.max(bounds.min, input));
  };

  const bounds = getBounds();
  const clampedResponsiveValue = clampValue(responsiveValue);

  const handleValueChange = (newValue: number) => {
    const clamped = clampValue(newValue);
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, clamped);
    onChange(updatedValues);
  };

  const handleThrottledChange = (newValue: number) => {
    const clamped = clampValue(newValue);
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, clamped);
    onChange(updatedValues, true);
  };

  const handleUnitChange = (newUnit: string) => {
    const updatedUnits = setResponsiveValue(value?.unit || {}, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnits });
  };

  const hasCustomValue = responsiveValue !== defaultValue;
  const showUnitSelector = unitOptions.length > 1;
  const baseId = `responsive-number-${controlId}`;

  const handleReset = () => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, defaultValue);
    onChange(updatedValues);
  };

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700" htmlFor={`${baseId}-number`}>
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
      <div className="flex items-center gap-2">
        <input
          id={`${baseId}-range`}
          type="range"
          min={bounds.min}
          max={bounds.max}
          value={clampedResponsiveValue}
          onChange={(event) => handleThrottledChange(parseInt(event.target.value, 10))}
          className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          id={`${baseId}-number`}
          type="number"
          value={clampedResponsiveValue}
          min={bounds.min}
          max={bounds.max}
          onChange={(event) => handleValueChange(parseInt(event.target.value, 10))}
          className={`w-16 px-2 py-1 text-xs border border-gray-300 text-gray-900 bg-white ${showUnitSelector ? "rounded-l" : "rounded"}`}
        />
        {showUnitSelector ? (
          <select
            id={`${baseId}-unit`}
            value={responsiveUnit}
            onChange={(event) => handleUnitChange(event.target.value)}
            className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white"
          >
            {unitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <span className="px-2 py-1 text-xs text-gray-500">{unit}</span>
        )}
      </div>
    </div>
  );
};


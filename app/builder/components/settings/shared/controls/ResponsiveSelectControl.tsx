"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import type { BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveRecord } from "../types/responsive";

export interface ResponsiveSelectOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface ResponsiveSelectControlProps<TValue extends string> {
  controlId?: string;
  label: string;
  options: Array<ResponsiveSelectOption<TValue>>;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord) => void;
  defaultValue: TValue;
  defaultValues?: Partial<Record<BreakpointKey, TValue>>;
}

export const ResponsiveSelectControl = <TValue extends string>({
  controlId = "responsive-select",
  label,
  options,
  value,
  onChange,
  defaultValue,
  defaultValues,
}: ResponsiveSelectControlProps<TValue>) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const fallbackValue = defaultValues?.[currentBreakpoint] ?? defaultValue;

  const resolveValue = () => getResponsiveValue((value as ResponsiveRecord) || {}, fallbackValue);
  const responsiveValue = resolveValue();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as TValue;
    if (selectedValue === fallbackValue) {
      const currentValues = (value as ResponsiveRecord) || {};
      if (currentValues[currentBreakpoint] === undefined) {
        return;
      }
      const next = { ...currentValues };
      delete next[currentBreakpoint];
      onChange(next);
      return;
    }
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, selectedValue);
    onChange(updatedValues);
  };

  const handleReset = () => {
    const currentValues = (value as ResponsiveRecord) || {};
    if (currentValues[currentBreakpoint] === undefined) return;
    const next = { ...currentValues };
    delete next[currentBreakpoint];
    if (Object.keys(next).length === 0) {
      onChange({});
    } else {
      onChange(next);
    }
  };

  const hasCustomValue =
    (value && value[currentBreakpoint] !== undefined && value[currentBreakpoint] !== fallbackValue) ||
    responsiveValue !== fallbackValue;

  const baseId = `responsive-select-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700" htmlFor={`${baseId}-select`}>
          {label}
          <span className="ml-2 text-blue-600">
            {currentBreakpoint === "desktop" && <Monitor size={12} />}
            {currentBreakpoint === "tablet" && <Tablet size={12} />}
            {currentBreakpoint === "mobile" && <Smartphone size={12} />}
          </span>
        </label>
        {hasCustomValue && (
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset breakpoint value">
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <select
        id={`${baseId}-select`}
        value={responsiveValue}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};


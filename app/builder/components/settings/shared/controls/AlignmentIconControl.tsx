"use client";

import React from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveRecord } from "../types/responsive";

export interface AlignmentIconControlProps {
  controlId?: string;
  label: string;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord) => void;
  defaultValue?: string;
}

const ALIGNMENT_OPTIONS = [
  { value: "left", icon: AlignLeft, label: "Left" },
  { value: "center", icon: AlignCenter, label: "Center" },
  { value: "right", icon: AlignRight, label: "Right" },
  { value: "justify", icon: AlignJustify, label: "Justify" },
];

export const AlignmentIconControl: React.FC<AlignmentIconControlProps> = ({ controlId = "alignment-icon", label, value, onChange, defaultValue = "left" }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const responsiveValue = getResponsiveValue(value || {}, defaultValue);

  const handleValueChange = (newValue: string) => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
    onChange(updatedValues);
  };

  const hasCustomValue = responsiveValue !== defaultValue;
  const baseId = `alignment-icon-${controlId}`;

  const handleReset = () => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, defaultValue);
    onChange(updatedValues);
  };

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-between flex-1 min-w-0">
          <label className="flex items-center text-sm font-medium text-gray-700 truncate justify-between w-full" htmlFor={`${baseId}-control`}>
            {label}
            <span className="ml-2 text-blue-600 shrink-0">
              {currentBreakpoint === "desktop" && <Monitor size={12} />}
              {currentBreakpoint === "tablet" && <Tablet size={12} />}
              {currentBreakpoint === "mobile" && <Smartphone size={12} />}
            </span>
          </label>
          {hasCustomValue && (
            <button onClick={handleReset} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0" title="Reset to default">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-md shrink-0 w-32 p-1 justify-between">
          {ALIGNMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = responsiveValue === option.value;
            return (
              <button key={option.value} type="button" data-component-id={`${baseId}-${option.value}`} onClick={() => handleValueChange(option.value)} className={`p-1 rounded transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-200"}`} aria-pressed={isActive} title={option.label}>
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

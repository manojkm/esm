"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveRecord } from "../types/responsive";

/**
 * Four-side spacing editor that persists responsive values + unit selection.
 * Handles padding, margin, border radius, etc.
 */
export interface ResponsiveSpacingControlProps {
  controlId?: string;
  label: string;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord) => void;
  unitOptions?: string[];
  defaultValue?: number;
}

const SIDES = ["top", "right", "bottom", "left"] as const;

export const ResponsiveSpacingControl: React.FC<ResponsiveSpacingControlProps> = ({ controlId = "responsive-spacing", label, value, onChange, unitOptions = ["px", "%"], defaultValue }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const getValue = (side: (typeof SIDES)[number]) => {
    const sideValues = value?.[side] || {};
    const fallback = defaultValue !== undefined ? defaultValue : null;
    return getResponsiveValue(sideValues, fallback);
  };

  const getUnit = () => {
    const unitValues = value?.unit || {};
    return getResponsiveValue(unitValues, "px");
  };

  const setValue = (side: (typeof SIDES)[number], inputValue: string) => {
    const trimmed = inputValue.trim();
    const currentSideValues = (value?.[side] as Record<string, number | null>) || {};

    if (trimmed === "") {
      const nextSideValues = { ...currentSideValues };
      delete nextSideValues[currentBreakpoint];
      const nextState: ResponsiveRecord = { ...(value || {}) };
      if (Object.keys(nextSideValues).length === 0) {
        delete nextState[side];
      } else {
        nextState[side] = nextSideValues;
      }

      if (defaultValue === undefined) {
        const hasAnySide = SIDES.some((key) => {
          const sideRecord = nextState[key] as Record<string, unknown> | undefined;
          return sideRecord && Object.keys(sideRecord).length > 0;
        });
        if (!hasAnySide) {
          delete nextState.unit;
        }
      }

      onChange(nextState);
      return;
    }

    if (!/^-?\d+$/.test(trimmed)) {
      return;
    }

    const parsed = parseInt(trimmed, 10);
    const updatedSideValues = setResponsiveValue(currentSideValues, currentBreakpoint, parsed);
    onChange({ ...value, [side]: updatedSideValues });
  };

  const setUnit = (newUnit: string) => {
    const currentUnitValues = value?.unit || {};
    const updatedUnitValues = setResponsiveValue(currentUnitValues, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnitValues });
  };

  const hasCustomValues = SIDES.some((side) => {
    const resolved = getValue(side);
    if (defaultValue !== undefined) {
      return resolved !== defaultValue;
    }
    return resolved !== null && resolved !== undefined;
  });

  const handleReset = () => {
    const resetValues: Record<string, unknown> = { ...(value || {}) };
    SIDES.forEach((side) => {
      const currentSideValues = (value?.[side] as Record<string, number | null>) || {};
      if (defaultValue === undefined) {
        const nextSideValues = { ...currentSideValues };
        delete nextSideValues[currentBreakpoint];
        if (Object.keys(nextSideValues).length === 0) {
          delete resetValues[side];
        } else {
          resetValues[side] = nextSideValues;
        }
      } else {
        resetValues[side] = setResponsiveValue(currentSideValues, currentBreakpoint, defaultValue);
      }
    });

    if (defaultValue === undefined && resetValues.unit) {
      const nextUnits = { ...(resetValues.unit as Record<string, string>) };
      delete nextUnits[currentBreakpoint];
      if (Object.keys(nextUnits).length === 0) {
        delete resetValues.unit;
      } else {
        resetValues.unit = nextUnits;
      }
    }

    onChange(resetValues);
  };

  const baseId = `responsive-spacing-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700" htmlFor={`${baseId}-unit`}>
          {label}
          <span className="ml-2 text-blue-600">
            {currentBreakpoint === "desktop" && <Monitor size={12} />}
            {currentBreakpoint === "tablet" && <Tablet size={12} />}
            {currentBreakpoint === "mobile" && <Smartphone size={12} />}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {hasCustomValues && (
            <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default">
              <RotateCcw size={14} />
            </button>
          )}
          <select id={`${baseId}-unit`} value={getUnit()} onChange={(event) => setUnit(event.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white">
            {unitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {SIDES.map((side) => (
          <div key={side}>
            <label className="block text-xs text-gray-500 mb-1 capitalize" htmlFor={`${baseId}-${side}`}>
              {side}
            </label>
            <input id={`${baseId}-${side}`} type="text" inputMode="numeric" pattern="-?\\d*" value={getValue(side) !== null && getValue(side) !== undefined ? String(getValue(side)) : ""} onChange={(event) => setValue(side, event.target.value)} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
};

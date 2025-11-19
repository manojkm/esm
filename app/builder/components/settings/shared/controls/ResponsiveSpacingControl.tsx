"use client";

import React, { useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
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
  // Individual side defaults (for when non-responsive props are set)
  defaultTop?: number | null;
  defaultRight?: number | null;
  defaultBottom?: number | null;
  defaultLeft?: number | null;
}

const SIDES = ["top", "right", "bottom", "left"] as const;

export const ResponsiveSpacingControl: React.FC<ResponsiveSpacingControlProps> = ({ controlId = "responsive-spacing", label, value, onChange, unitOptions = ["px", "%"], defaultValue, defaultTop, defaultRight, defaultBottom, defaultLeft }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();
  const { getSpacingScale } = useGlobalSettings();
  const spacingScale = getSpacingScale();
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  const getValue = (side: (typeof SIDES)[number]) => {
    const sideValues = value?.[side] || {};
    // Get the value from responsive record (may be null if explicitly cleared)
    const responsiveValue = getResponsiveValue(sideValues, undefined);

    // If value is explicitly null (user cleared it), return null
    if (responsiveValue === null) {
      return null;
    }

    // If value exists (not undefined), return it
    if (responsiveValue !== undefined) {
      return responsiveValue;
    }

    // Otherwise, use default fallback
    let fallback: number | null = null;
    if (side === "top" && defaultTop !== undefined) {
      fallback = defaultTop;
    } else if (side === "right" && defaultRight !== undefined) {
      fallback = defaultRight;
    } else if (side === "bottom" && defaultBottom !== undefined) {
      fallback = defaultBottom;
    } else if (side === "left" && defaultLeft !== undefined) {
      fallback = defaultLeft;
    } else if (defaultValue !== undefined) {
      fallback = defaultValue;
    }
    return fallback;
  };

  const getUnit = () => {
    const unitValues = value?.unit || {};
    return getResponsiveValue(unitValues, "px");
  };

  const setValue = (side: (typeof SIDES)[number], inputValue: string) => {
    const trimmed = inputValue.trim();
    const currentSideValues = (value?.[side] as Record<string, number | null>) || {};

    if (trimmed === "") {
      // User cleared the value - set it to null explicitly (not delete) so we know it was cleared
      const updatedSideValues = setResponsiveValue(currentSideValues, currentBreakpoint, null);
      const nextState: ResponsiveRecord = { ...(value || {}), [side]: updatedSideValues };

      // Check if we should clean up unit if all sides are null/empty
      const hasAnyNonDefaultSide = SIDES.some((key) => {
        const sideRecord = nextState[key] as Record<string, unknown> | undefined;
        if (!sideRecord) return false;
        // Check if any breakpoint has a non-null value
        return Object.values(sideRecord).some((val) => val !== null);
      });

      if (!hasAnyNonDefaultSide && nextState.unit) {
        delete nextState.unit;
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
    const sideValues = value?.[side] || {};
    const responsiveValue = getResponsiveValue(sideValues, undefined);

    // Get the expected default for this side
    let sideDefault: number | null | undefined = undefined;
    if (side === "top" && defaultTop !== undefined) {
      sideDefault = defaultTop;
    } else if (side === "right" && defaultRight !== undefined) {
      sideDefault = defaultRight;
    } else if (side === "bottom" && defaultBottom !== undefined) {
      sideDefault = defaultBottom;
    } else if (side === "left" && defaultLeft !== undefined) {
      sideDefault = defaultLeft;
    } else if (defaultValue !== undefined) {
      sideDefault = defaultValue;
    }

    // If there's an explicit value in the responsive record for current breakpoint
    if (responsiveValue !== undefined) {
      // If value is explicitly null (user cleared it), it's custom only if default was not null
      if (responsiveValue === null) {
        return sideDefault !== null && sideDefault !== undefined;
      }
      // If value differs from default, it's custom
      return responsiveValue !== sideDefault;
    }

    // No explicit value in responsive record for current breakpoint
    // Check if there are values for OTHER breakpoints (responsive overrides)
    const hasOtherBreakpoints = sideValues && Object.keys(sideValues).some((bp) => bp !== currentBreakpoint && (sideValues as Record<string, unknown>)[bp] !== undefined);

    // If there are responsive overrides for other breakpoints, it's custom
    // Otherwise, if we're just showing the default value, it's NOT custom
    return hasOtherBreakpoints;
  });

  const handleReset = () => {
    const resetValues: Record<string, unknown> = { ...(value || {}) };
    SIDES.forEach((side) => {
      const currentSideValues = (value?.[side] as Record<string, number | null>) || {};
      // Get the default value for this side
      let sideDefault: number | null | undefined = undefined;
      if (side === "top" && defaultTop !== undefined) {
        sideDefault = defaultTop;
      } else if (side === "right" && defaultRight !== undefined) {
        sideDefault = defaultRight;
      } else if (side === "bottom" && defaultBottom !== undefined) {
        sideDefault = defaultBottom;
      } else if (side === "left" && defaultLeft !== undefined) {
        sideDefault = defaultLeft;
      } else if (defaultValue !== undefined) {
        sideDefault = defaultValue;
      }

      if (sideDefault === undefined) {
        // No default - clear the value
        const nextSideValues = { ...currentSideValues };
        delete nextSideValues[currentBreakpoint];
        if (Object.keys(nextSideValues).length === 0) {
          delete resetValues[side];
        } else {
          resetValues[side] = nextSideValues;
        }
      } else {
        // Reset to default value
        resetValues[side] = setResponsiveValue(currentSideValues, currentBreakpoint, sideDefault);
      }
    });

    // Check if all sides are cleared (no defaults)
    const hasAnyDefault = defaultValue !== undefined || defaultTop !== undefined || defaultRight !== undefined || defaultBottom !== undefined || defaultLeft !== undefined;
    if (!hasAnyDefault && resetValues.unit) {
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

  const handleQuickSelect = (side: (typeof SIDES)[number], spacingValue: number) => {
    setValue(side, String(spacingValue));
    setShowQuickSelect(false);
  };

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

      {/* Quick Select Spacing Scale */}
      {spacingScale.values.length > 0 && getUnit() === (spacingScale.unit || "px") && (
        <div className="mb-2">
          <button type="button" onClick={() => setShowQuickSelect(!showQuickSelect)} className="text-xs text-blue-600 hover:text-blue-800 underline">
            {showQuickSelect ? "Hide" : "Show"} Quick Select
          </button>
          {showQuickSelect && (
            <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
              <div className="text-xs font-medium text-gray-700 mb-2">Quick Select Values (click to apply to all sides):</div>
              <div className="flex flex-wrap gap-1">
                {spacingScale.values.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      // Apply to all sides
                      const updatedValue: ResponsiveRecord = { ...value };
                      SIDES.forEach((side) => {
                        const currentSideValues = (value?.[side] as Record<string, number | null>) || {};
                        updatedValue[side] = setResponsiveValue(currentSideValues, currentBreakpoint, val);
                      });
                      onChange(updatedValue);
                      setShowQuickSelect(false);
                    }}
                    className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    title={`Apply ${val}${spacingScale.unit || "px"} to all sides`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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

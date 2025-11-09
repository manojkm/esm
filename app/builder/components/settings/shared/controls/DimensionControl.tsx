"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

/**
 * Generic dimension picker with unit switching and reset handling.
 * Shared by custom width/content width controls for containers.
 */
interface DimensionControlProps {
  controlId: string;
  label: string;
  value: number;
  unit: string;
  unitOptions: Array<{ value: string; label: string }>;
  minMaxByUnit: Record<string, { min: number; max: number }>;
  defaultValues: Record<string, number>;
  onValueChange: (value: number, unit: string) => void;
  onUnitChange: (unit: string, defaultValue: number) => void;
  showReset?: boolean;
  onReset?: () => void;
}

export const DimensionControl: React.FC<DimensionControlProps> = ({
  controlId,
  label,
  value,
  unit,
  unitOptions,
  minMaxByUnit,
  defaultValues,
  onValueChange,
  onUnitChange,
  showReset = false,
  onReset,
}) => {
  const resolvedUnit = unitOptions.find((option) => option.value === unit)?.value || unitOptions[0]?.value || "px";
  const unitConfig = minMaxByUnit[resolvedUnit] ?? { min: 0, max: 1000 };
  const defaultValue = defaultValues[resolvedUnit] ?? unitConfig.min;
  const numericValue = Number.isFinite(value) ? Number(value) : defaultValue;
  const clampedValue = Math.min(unitConfig.max, Math.max(unitConfig.min, Math.round(numericValue)));
  const baseId = `dimension-control-${controlId}`;

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    const clamped = Math.min(unitConfig.max, Math.max(unitConfig.min, Math.round(next)));
    onValueChange(clamped, resolvedUnit);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next)) {
      onValueChange(defaultValue, resolvedUnit);
      return;
    }
    const clamped = Math.min(unitConfig.max, Math.max(unitConfig.min, Math.round(next)));
    onValueChange(clamped, resolvedUnit);
  };

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextUnit = event.target.value;
    const fallbackDefault = defaultValues[nextUnit] ?? minMaxByUnit[nextUnit]?.min ?? defaultValue;
    onUnitChange(nextUnit, fallbackDefault);
  };

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label id={`${baseId}-label`} className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-number`}>
          {label}
        </label>
        {showReset && onReset && (
          <button onClick={onReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default" aria-controls={baseId}>
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          id={`${baseId}-range`}
          type="range"
          min={unitConfig.min}
          max={unitConfig.max}
          value={clampedValue}
          onChange={handleRangeChange}
          className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-labelledby={`${baseId}-label`}
        />
        <div className="flex items-center gap-1">
          <input
            id={`${baseId}-number`}
            type="number"
            value={clampedValue}
            min={unitConfig.min}
            max={unitConfig.max}
            onChange={handleNumberChange}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
          />
          <select id={`${baseId}-unit`} value={resolvedUnit} onChange={handleUnitChange} className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white">
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};


"use client";

import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectControlProps {
  controlId?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

/**
 * Simple inline select control matching the style of ResponsiveSelectControl inline variant.
 * Left side: Label
 * Right side: Select dropdown
 */
export const SelectControl: React.FC<SelectControlProps> = ({
  controlId = "select",
  label,
  value,
  onChange,
  options,
  className = "",
}) => {
  const baseId = `select-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className={`flex items-center justify-between ${className}`}>
      <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-select`}>
        {label}
      </label>
      <select
        id={`${baseId}-select`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-32 px-2 py-2 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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


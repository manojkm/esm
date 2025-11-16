"use client";

import React, { useState, useRef, useEffect } from "react";
import { SketchPicker, ColorResult } from "react-color";

/**
 * Converts CSS color value to react-color format
 * Handles: hex (#fff, #ffffff), rgb(a), hsl(a), named colors, transparent
 */
const parseColorForPicker = (color: string | null | undefined): string | { r: number; g: number; b: number; a: number } => {
  // If explicitly "transparent", return fully transparent
  if (color === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  
  // If no color set yet (null/undefined), default to white with full opacity
  if (!color) {
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  // Already hex format
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
    return color.toLowerCase();
  }

  // Try to parse rgba
  if (color.startsWith("rgba")) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1,
      };
    }
  }

  // Try to parse rgb
  if (color.startsWith("rgb")) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: 1,
      };
    }
  }

  // Try to parse using canvas to convert any CSS color
  if (typeof window !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.fillStyle = color;
      const computed = ctx.fillStyle;
      
      // If it's hex, return it
      if (computed.startsWith("#")) {
        return computed;
      }

      // If it's rgba, parse it
      if (computed.startsWith("rgba")) {
        const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: match[4] ? parseFloat(match[4]) : 1,
          };
        }
      }
    }
  }

  // Fallback to default
  return "#000000";
};

/**
 * Converts react-color ColorResult to CSS color value
 */
const colorResultToCss = (color: ColorResult, allowTransparent: boolean = true): string | null => {
  // If fully transparent and allowed, return null (which represents transparent)
  if (allowTransparent && color.rgb.a === 0) {
    return null;
  }

  // If fully opaque, return hex
  if (color.rgb.a === 1) {
    return color.hex;
  }

  // Return rgba format
  const { r, g, b, a } = color.rgb;
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
};

interface ColorPickerProps {
  color: string | null | undefined;
  onChange: (color: string | null) => void;
  allowTransparent?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  allowTransparent = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerColor, setPickerColor] = useState<string | { r: number; g: number; b: number; a: number }>(parseColorForPicker(color));
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update picker color when prop changes
  useEffect(() => {
    setPickerColor(parseColorForPicker(color));
  }, [color]);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleColorChange = (newColor: ColorResult) => {
    setPickerColor(newColor.rgb);
    const cssColor = colorResultToCss(newColor, allowTransparent);
    onChange(cssColor);
  };

  const currentColor = color || null;
  const isTransparent = !currentColor || currentColor === "transparent";
  const displayColor = isTransparent ? "rgba(0, 0, 0, 0)" : currentColor;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 shrink-0 border border-gray-300 rounded cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        style={{
          background: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                       linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                       linear-gradient(45deg, transparent 75%, #ccc 75%), 
                       linear-gradient(-45deg, transparent 75%, #ccc 75%),
                       ${displayColor}`,
          backgroundSize: "8px 8px, 8px 8px, 8px 8px, 8px 8px, 100% 100%",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px, 0 0",
        }}
        title={isTransparent ? "Transparent" : (currentColor || "No color")}
      >
        {isTransparent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
          </div>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Popover */}
          <div
            ref={popoverRef}
            className="fixed z-50"
            style={{
              top: buttonRef.current
                ? `${buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 8}px`
                : "100%",
              left: buttonRef.current
                ? `${buttonRef.current.getBoundingClientRect().left + window.scrollX}px`
                : "0",
            }}
          >
            <SketchPicker
              color={pickerColor}
              onChange={handleColorChange}
              disableAlpha={false}
              width={220}
            />
            {allowTransparent && (
              <div className="mt-2 p-2 bg-white border border-gray-200 rounded shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors border border-gray-300"
                  title="Clear color (transparent)"
                >
                  Clear (Transparent)
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

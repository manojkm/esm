"use client";

import React, { useState, useRef, useEffect } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";

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

  // If allowTransparent is false and alpha is 0, force alpha to 1 (fully opaque)
  if (!allowTransparent && color.rgb.a === 0) {
    const { r, g, b } = color.rgb;
    // Convert to hex format
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  size?: "default" | "small";
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  allowTransparent = true,
  size = "default",
}) => {
  const { settings } = useGlobalSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [pickerColor, setPickerColor] = useState<string | { r: number; g: number; b: number; a: number }>(parseColorForPicker(color));
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get theme colors from global settings
  const themeColors = [
    { key: "primary", label: "Primary", color: settings.colorPalette.primary },
    { key: "secondary", label: "Secondary", color: settings.colorPalette.secondary },
    { key: "accent", label: "Accent", color: settings.colorPalette.accent },
    { key: "text", label: "Text", color: settings.colorPalette.text },
    { key: "background", label: "Background", color: settings.colorPalette.background },
  ].filter((item) => item.color); // Only show colors that are defined

  // Update picker color when prop changes
  useEffect(() => {
    setPickerColor(parseColorForPicker(color));
  }, [color]);

  // Calculate popover position synchronously before rendering
  const getPopoverPosition = (): { top: string; left: string } => {
    if (!buttonRef.current) {
      return { top: "0", left: "0" };
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 220; // SketchPicker width + padding
    const popoverHeight = 350; // Approximate height of popover
    const spacing = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate initial position (below button, aligned to left)
    let top = buttonRect.bottom + window.scrollY + spacing;
    let left = buttonRect.left + window.scrollX;

    // Check if popover would overflow right edge
    if (left + popoverWidth > viewportWidth + window.scrollX) {
      // Align to right edge of button instead
      left = buttonRect.right + window.scrollX - popoverWidth;
      // If still overflowing, align to viewport right edge
      if (left < window.scrollX) {
        left = window.scrollX + viewportWidth - popoverWidth - 8;
      }
    }

    // Check if popover would overflow bottom edge
    if (buttonRect.bottom + spacing + popoverHeight > viewportHeight + window.scrollY) {
      // Position above button instead
      top = buttonRect.top + window.scrollY - popoverHeight - spacing;
      // If still overflowing, align to viewport top
      if (top < window.scrollY) {
        top = window.scrollY + 8;
      }
    }

    return { top: `${top}px`, left: `${left}px` };
  };

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
  
  // Check if color has alpha transparency (rgba with alpha < 1)
  const hasAlpha = currentColor && currentColor.startsWith("rgba") && currentColor.includes(",");
  const alphaValue = hasAlpha ? parseFloat(currentColor.match(/,\s*([\d.]+)\)/)?.[1] || "1") : 1;
  const isSemiTransparent = hasAlpha && alphaValue < 1;
  
  // Only show checkboard pattern for transparent or semi-transparent colors
  const showCheckboard = isTransparent || isSemiTransparent;
  const displayColor = isTransparent ? "rgba(0, 0, 0, 0)" : currentColor;

  const isSmall = size === "small";
  const buttonSize = isSmall ? "w-6 h-6" : "w-10 h-10";
  const borderRadius = isSmall ? "rounded-full" : "rounded";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonSize} shrink-0 border border-gray-300 ${borderRadius} cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
        style={{
          backgroundColor: displayColor,
          ...(showCheckboard && {
            // Only apply checkboard pattern for transparent/semi-transparent colors
            backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                              linear-gradient(-45deg, #ccc 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #ccc 75%),
                              linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: "8px 8px, 8px 8px, 8px 8px, 8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
          }),
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
            style={getPopoverPosition()}
          >
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              {/* Theme Colors */}
              {themeColors.length > 0 && (
                <div className="p-2 border-b border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">Theme Colors</div>
                  <div className="flex flex-wrap gap-2">
                    {themeColors.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          onChange(item.color || null);
                          setIsOpen(false);
                        }}
                        className="group relative"
                        title={item.label}
                      >
                        <div
                          className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-500 transition-colors shadow-sm"
                          style={{ backgroundColor: item.color || "#ffffff" }}
                        />
                        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Picker */}
              <div className="p-2">
                <SketchPicker
                  color={pickerColor}
                  onChange={handleColorChange}
                  disableAlpha={!allowTransparent}
                  width={220}
                />
              </div>

              {/* Clear Button */}
              {allowTransparent && (
                <div className="p-2 border-t border-gray-200">
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
          </div>
        </>
      )}
    </div>
  );
};

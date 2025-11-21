"use client";

import React from "react";
import { ResponsiveNumberInput, ResponsiveSelectControl } from "./controls";
import { ColorInput } from "./controls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { POPULAR_GOOGLE_FONTS } from "@/app/builder/lib/google-fonts";
import type { ComponentControlActions } from "./types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "./types/responsive";

// Shared constants
export const FONT_WEIGHT_OPTIONS = [
  { value: "100", label: "100 (Thin)" },
  { value: "200", label: "200 (Extra Light)" },
  { value: "300", label: "300 (Light)" },
  { value: "400", label: "400 (Normal)" },
  { value: "500", label: "500 (Medium)" },
  { value: "600", label: "600 (Semi Bold)" },
  { value: "700", label: "700 (Bold)" },
  { value: "800", label: "800 (Extra Bold)" },
  { value: "900", label: "900 (Black)" },
];

export const FONT_STYLE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Italic" },
  { value: "oblique", label: "Oblique" },
];

export const TEXT_TRANSFORM_OPTIONS = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

export const TEXT_DECORATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line Through" },
  { value: "underline overline", label: "Underline Overline" },
];

export const LINE_HEIGHT_UNIT_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "number", label: "Number" },
  { value: "px", label: "px" },
  { value: "em", label: "em" },
  { value: "rem", label: "rem" },
];

export interface TypographyConfig {
  // Prop name prefixes (e.g., "text", "heading", "subHeading")
  prefix: string;
  
  // Base ID for controls
  baseId: string;
  
  // Control ID
  controlId: string;
  
  // Typography element type for global defaults
  typographyElement: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body";
  
  // Default values
  defaults: {
    fontSize: number;
    fontWeight: number | string;
    fontStyle: string;
    lineHeight: number;
    letterSpacing: number;
    textColor: string;
  };
  
  // Features to show
  features: {
    linkColors?: boolean; // Show link color controls (Text component only)
    lineHeightUnitStyle?: "buttons" | "select"; // How to show line height unit selector
  };
}

export interface TypographyControlsProps<TProps extends Record<string, any>> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  config: TypographyConfig;
}

/**
 * Shared reusable Typography Controls component
 * Handles all typography settings (color, font family, size, weight, style, transform, decoration, letter spacing, line height)
 * Supports different prop name prefixes via configuration
 */
export const TypographyControls = <TProps extends Record<string, any>>({
  props,
  actions,
  config,
}: TypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const { prefix, baseId, typographyElement, defaults, features } = config;

  const isHeading = typographyElement !== "body";
  const typographyType = isHeading ? "headings" : "body";

  // Get global defaults
  const globalFontSize = settings.typography.fontSize?.desktop?.[typographyElement];
  const globalFontWeight = settings.typography.fontWeight?.[typographyType];
  const globalFontStyle = settings.typography.fontStyle?.[typographyType];
  const globalTextColor = settings.typography.textColor?.[typographyType];
  const globalLineHeight = settings.typography.lineHeight?.[typographyType];
  const globalLetterSpacing = settings.typography.letterSpacing?.[typographyType];

  // Helper to get prop name with prefix
  // When prefix is empty, convert PascalCase to camelCase (e.g., "FontSize" -> "fontSize")
  // When prefix exists, prepend it (e.g., "heading" + "FontSize" -> "headingFontSize")
  const getPropName = (key: string) => {
    if (prefix) {
      return `${prefix}${key}`;
    }
    // Convert PascalCase to camelCase: lowercase first letter
    return key.charAt(0).toLowerCase() + key.slice(1);
  };
  
  // Helper to get prop value
  const getProp = (key: string) => props[getPropName(key)];
  
  // Helper to set prop value
  const setProp = (key: string, value: any) => {
    actions.setProp((draft: any) => {
      draft[getPropName(key)] = value;
    });
  };

  // Helper to get responsive prop
  const getResponsiveProp = (key: string) => {
    if (prefix) {
      const responsiveKey = `${prefix}${key}Responsive`;
      return props[responsiveKey] as ResponsiveRecord | undefined;
    }
    // Convert PascalCase to camelCase and append "Responsive"
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    const responsiveKey = `${camelKey}Responsive`;
    return props[responsiveKey] as ResponsiveRecord | undefined;
  };
  
  // Helper to set responsive prop
  const setResponsiveProp = (key: string, value: ResponsiveValue) => {
    actions.setProp((draft: any) => {
      if (prefix) {
        draft[`${prefix}${key}Responsive`] = value;
      } else {
        // Convert PascalCase to camelCase and append "Responsive"
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        draft[`${camelKey}Responsive`] = value;
      }
    });
  };

  // Text Color handler
  const handleTextColorChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const colorKey = getPropName("TextColor");
      const colorResponsiveKey = getPropName("TextColorResponsive");
      
      draft[colorResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      
      const desktopValue = record.desktop as string | null | undefined;
      const tabletValue = record.tablet as string | null | undefined;
      const mobileValue = record.mobile as string | null | undefined;
      
      const hasAnyValue = (desktopValue != null && desktopValue !== "") || 
                         (tabletValue != null && tabletValue !== "") || 
                         (mobileValue != null && mobileValue !== "");
      
      if (!hasAnyValue) {
        draft[colorKey] = undefined;
      } else {
        const fallback = desktopValue ?? tabletValue ?? mobileValue ?? draft[colorKey] ?? globalTextColor ?? defaults.textColor;
        draft[colorKey] = fallback;
      }
    });
  };

  // Text Hover Color handler
  const handleTextHoverColorChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const hoverKey = getPropName("TextColorHover");
      const hoverResponsiveKey = getPropName("TextColorHoverResponsive");
      
      draft[hoverResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      
      const desktopValue = record.desktop as string | null | undefined;
      const tabletValue = record.tablet as string | null | undefined;
      const mobileValue = record.mobile as string | null | undefined;
      
      const hasAnyValue = (desktopValue != null && desktopValue !== "") || 
                         (tabletValue != null && tabletValue !== "") || 
                         (mobileValue != null && mobileValue !== "");
      
      if (!hasAnyValue) {
        draft[hoverKey] = undefined;
      } else {
        const fallback = desktopValue ?? tabletValue ?? mobileValue ?? draft[hoverKey];
        draft[hoverKey] = fallback;
      }
    });
  };

  // Link Color handler (Text component only)
  const handleLinkColorChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      draft.linkColorResponsive = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const desktopValue = record.desktop as string | null | undefined;
      const tabletValue = record.tablet as string | null | undefined;
      const mobileValue = record.mobile as string | null | undefined;
      const hasAnyValue = desktopValue != null || tabletValue != null || mobileValue != null;
      
      if (!hasAnyValue) {
        draft.linkColor = null;
      } else {
        const fallback = desktopValue ?? tabletValue ?? mobileValue ?? draft.linkColor;
        draft.linkColor = fallback as string | null;
      }
    });
  };

  // Link Hover Color handler (Text component only)
  const handleLinkHoverColorChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      draft.linkColorHoverResponsive = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const desktopValue = record.desktop as string | null | undefined;
      const tabletValue = record.tablet as string | null | undefined;
      const mobileValue = record.mobile as string | null | undefined;
      const hasAnyValue = desktopValue != null || tabletValue != null || mobileValue != null;
      
      if (!hasAnyValue) {
        draft.linkColorHover = null;
      } else {
        const fallback = desktopValue ?? tabletValue ?? mobileValue ?? draft.linkColorHover;
        draft.linkColorHover = fallback as string | null;
      }
    });
  };

  // Font Size handler
  const handleFontSizeChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const sizeKey = getPropName("FontSize");
      const sizeResponsiveKey = getPropName("FontSizeResponsive");
      const sizeUnitKey = getPropName("FontSizeUnit");
      
      draft[sizeResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft[sizeKey] ?? globalFontSize ?? defaults.fontSize;
      draft[sizeKey] = fallback;
      const unitRecord = (record.unit as Record<string, string>) || {};
      draft[sizeUnitKey] = (unitRecord.desktop ?? draft[sizeUnitKey] ?? "px") as string;
    });
  };

  // Font Weight handler
  const handleFontWeightChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const weightKey = getPropName("FontWeight");
      const weightResponsiveKey = getPropName("FontWeightResponsive");
      
      draft[weightResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? String(draft[weightKey] ?? globalFontWeight ?? defaults.fontWeight);
      draft[weightKey] = typeof fallback === "string" && /^\d+$/.test(fallback) ? parseInt(fallback) : fallback;
    });
  };

  // Font Style handler
  const handleFontStyleChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const styleKey = getPropName("FontStyle");
      const styleResponsiveKey = getPropName("FontStyleResponsive");
      
      draft[styleResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft[styleKey] ?? globalFontStyle ?? defaults.fontStyle;
      draft[styleKey] = fallback;
    });
  };

  // Text Transform handler
  const handleTextTransformChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const transformKey = getPropName("TextTransform");
      const transformResponsiveKey = getPropName("TextTransformResponsive");
      
      draft[transformResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft[transformKey] ?? "none";
      draft[transformKey] = fallback;
    });
  };

  // Text Decoration handler
  const handleTextDecorationChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const decorationKey = getPropName("TextDecoration");
      const decorationResponsiveKey = getPropName("TextDecorationResponsive");
      
      draft[decorationResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft[decorationKey] ?? "none";
      draft[decorationKey] = fallback;
    });
  };

  // Letter Spacing handler
  const handleLetterSpacingChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const spacingKey = getPropName("LetterSpacing");
      const spacingResponsiveKey = getPropName("LetterSpacingResponsive");
      const spacingUnitKey = getPropName("LetterSpacingUnit");
      
      draft[spacingResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft[spacingKey] ?? globalLetterSpacing ?? defaults.letterSpacing;
      draft[spacingKey] = fallback;
      const unitRecord = (record.unit as Record<string, string>) || {};
      draft[spacingUnitKey] = (unitRecord.desktop ?? draft[spacingUnitKey] ?? "px") as string;
    });
  };

  // Line Height handler
  const handleLineHeightChange = (value: ResponsiveRecord) => {
    actions.setProp((draft: any) => {
      const lineHeightKey = getPropName("LineHeight");
      const lineHeightResponsiveKey = getPropName("LineHeightResponsive");
      const lineHeightUnitKey = getPropName("LineHeightUnit");
      
      draft[lineHeightResponsiveKey] = value as ResponsiveValue;
      const record = value as ResponsiveRecord;
      const unitRecord = (record.unit as Record<string, string>) || {};
      const unit = unitRecord.desktop ?? draft[lineHeightUnitKey] ?? "normal";
      draft[lineHeightUnitKey] = unit;
      
      const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? (typeof draft[lineHeightKey] === "number" ? draft[lineHeightKey] : globalLineHeight ?? defaults.lineHeight);
      draft[lineHeightKey] = fallback;
    });
  };

  // Line Height Unit handler
  const handleLineHeightUnitChange = (unit: string) => {
    actions.setProp((draft: any) => {
      draft[getPropName("LineHeightUnit")] = unit;
    });
  };

  // Font Family handler
  const handleFontFamilyChange = (value: string) => {
    actions.setProp((draft: any) => {
      draft[getPropName("FontFamily")] = value || (prefix ? undefined : null);
    });
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Text Color */}
      <ColorInput
        label="Text Color"
        value={getResponsiveProp("TextColor")}
        onChange={handleTextColorChange}
        placeholder={globalTextColor || defaults.textColor}
        responsive
      />

      {/* Text Hover Color */}
      <ColorInput
        label="Text Hover Color"
        value={getResponsiveProp("TextColorHover")}
        onChange={handleTextHoverColorChange}
        placeholder="Hover color"
        responsive
      />

      {/* Links Color (Text component only) */}
      {features.linkColors && (
        <>
          <ColorInput
            label="Links Color"
            value={getProp("linkColorResponsive") as ResponsiveRecord | undefined}
            onChange={handleLinkColorChange}
            placeholder="#0066cc"
            responsive
          />

          <ColorInput
            label="Links Hover Color"
            value={getProp("linkColorHoverResponsive") as ResponsiveRecord | undefined}
            onChange={handleLinkHoverColorChange}
            placeholder="#004499"
            responsive
          />
        </>
      )}

      {/* Font Family */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Font Family</label>
        <select
          value={getProp("FontFamily") || ""}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="w-48 px-2 py-2 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Use Global Default</option>
          {POPULAR_GOOGLE_FONTS.map((font) => (
            <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
              {font.family}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <ResponsiveNumberInput
        controlId={`${baseId}-font-size`}
        label="Font Size"
        value={getResponsiveProp("FontSize")}
        onChange={handleFontSizeChange}
        unit={getProp("FontSizeUnit") || "px"}
        unitOptions={["px", "rem", "em", "%"]}
        defaultValue={globalFontSize ?? defaults.fontSize}
        min={8}
        max={200}
      />

      {/* Font Weight */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-weight`}
        label="Font Weight"
        value={getResponsiveProp("FontWeight")}
        onChange={handleFontWeightChange}
        options={FONT_WEIGHT_OPTIONS}
        defaultValue={String(globalFontWeight ?? defaults.fontWeight)}
        layout="select"
        variant="inline"
      />

      {/* Font Style */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-style`}
        label="Font Style"
        value={getResponsiveProp("FontStyle")}
        onChange={handleFontStyleChange}
        options={FONT_STYLE_OPTIONS}
        defaultValue={globalFontStyle || defaults.fontStyle}
        layout="select"
        variant="inline"
      />

      {/* Text Transform */}
      <ResponsiveSelectControl
        controlId={`${baseId}-text-transform`}
        label="Text Transform"
        value={getResponsiveProp("TextTransform")}
        onChange={handleTextTransformChange}
        options={TEXT_TRANSFORM_OPTIONS}
        defaultValue="none"
        layout="select"
        variant="inline"
      />

      {/* Text Decoration */}
      <ResponsiveSelectControl
        controlId={`${baseId}-text-decoration`}
        label="Text Decoration"
        value={getResponsiveProp("TextDecoration")}
        onChange={handleTextDecorationChange}
        options={TEXT_DECORATION_OPTIONS}
        defaultValue="none"
        layout="select"
        variant="inline"
      />

      {/* Letter Spacing */}
      <ResponsiveNumberInput
        controlId={`${baseId}-letter-spacing`}
        label="Letter Spacing"
        value={getResponsiveProp("LetterSpacing")}
        onChange={handleLetterSpacingChange}
        unit={getProp("LetterSpacingUnit") || "px"}
        unitOptions={["px", "em"]}
        defaultValue={globalLetterSpacing ?? defaults.letterSpacing}
        min={-5}
        max={20}
      />

      {/* Line Height */}
      <div className={features.lineHeightUnitStyle === "select" ? "space-y-2" : ""}>
        <ResponsiveNumberInput
          controlId={`${baseId}-line-height`}
          label="Line Height"
          value={getResponsiveProp("LineHeight")}
          onChange={handleLineHeightChange}
          unit={(() => {
            const unit = getProp("LineHeightUnit") || "normal";
            return unit === "normal" || unit === "number" ? "" : unit;
          })()}
          unitOptions={(() => {
            const unit = getProp("LineHeightUnit") || "normal";
            return unit === "normal" || unit === "number" ? [] : ["px", "em", "rem"];
          })()}
          defaultValue={(() => {
            const currentValue = getProp("LineHeight");
            return typeof currentValue === "number" ? currentValue : (globalLineHeight ?? defaults.lineHeight);
          })()}
          min={features.lineHeightUnitStyle === "select" ? 0 : 0.5}
          max={features.lineHeightUnitStyle === "select" ? 10 : 5}
        />
        
        {features.lineHeightUnitStyle === "buttons" ? (
          <div className="mt-2 flex gap-2">
            {LINE_HEIGHT_UNIT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLineHeightUnitChange(option.value)}
                className={`px-2 py-1 text-xs rounded ${
                  (getProp("LineHeightUnit") || "normal") === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-500">Unit</label>
            <select
              value={getProp("LineHeightUnit") || "normal"}
              onChange={(e) => handleLineHeightUnitChange(e.target.value)}
              className="w-32 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LINE_HEIGHT_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};


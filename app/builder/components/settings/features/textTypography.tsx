"use client";

import React from "react";
import { ResponsiveNumberInput, ResponsiveSelectControl } from "../shared/controls";
import { ColorInput } from "../shared/controls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { POPULAR_GOOGLE_FONTS } from "@/app/builder/lib/google-fonts";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface TextTypographyFeatureProps {
  textColor?: string | null;
  textColorResponsive?: ResponsiveValue;
  textColorHover?: string | null;
  textColorHoverResponsive?: ResponsiveValue;
  linkColor?: string | null;
  linkColorResponsive?: ResponsiveValue;
  linkColorHover?: string | null;
  linkColorHoverResponsive?: ResponsiveValue;
  fontFamily?: string | null;
  fontFamilyResponsive?: ResponsiveValue;
  fontSize?: number;
  fontSizeResponsive?: ResponsiveValue;
  fontSizeUnit?: "px" | "rem" | "em" | "%";
  fontWeight?: number | string;
  fontWeightResponsive?: ResponsiveValue;
  fontStyle?: "normal" | "italic" | "oblique";
  fontStyleResponsive?: ResponsiveValue;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textTransformResponsive?: ResponsiveValue;
  textDecoration?: "none" | "underline" | "overline" | "line-through" | "underline overline";
  textDecorationResponsive?: ResponsiveValue;
  letterSpacing?: number;
  letterSpacingResponsive?: ResponsiveValue;
  letterSpacingUnit?: "px" | "em";
  lineHeight?: number;
  lineHeightResponsive?: ResponsiveValue;
  lineHeightUnit?: "px" | "em" | "rem" | "normal" | "number";
  htmlTag?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface TextTypographyControlsProps<TProps extends TextTypographyFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const FONT_WEIGHT_OPTIONS = [
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

const FONT_STYLE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Italic" },
  { value: "oblique", label: "Oblique" },
];

const TEXT_TRANSFORM_OPTIONS = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

const TEXT_DECORATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line Through" },
  { value: "underline overline", label: "Underline Overline" },
];

const LINE_HEIGHT_UNIT_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "number", label: "Number" },
  { value: "px", label: "px" },
  { value: "em", label: "em" },
  { value: "rem", label: "rem" },
];

export const TextTypographyControls = <TProps extends TextTypographyFeatureProps>({
  props,
  actions,
  controlId = "text-typography",
}: TextTypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const baseId = `text-typography-${controlId}`;

  // Get typography defaults based on htmlTag
  const getTypographyElement = (): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" => {
    if (props.htmlTag?.startsWith("h")) {
      return props.htmlTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    }
    return "body";
  };

  const typographyElement = getTypographyElement();
  const isHeading = typographyElement !== "body";
  const typographyType = isHeading ? "headings" : "body";

  // Get global defaults
  const globalFontSize = settings.typography.fontSize?.desktop?.[typographyElement];
  const globalFontWeight = settings.typography.fontWeight?.[typographyType];
  const globalFontStyle = settings.typography.fontStyle?.[typographyType];
  const globalTextColor = settings.typography.textColor?.[typographyType];
  const globalLineHeight = settings.typography.lineHeight?.[typographyType];
  const globalLetterSpacing = settings.typography.letterSpacing?.[typographyType];

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Text Color */}
      <ColorInput
        label="Text Color"
        value={props.textColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textColorResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.textColor ?? globalTextColor ?? "#1f2937";
            draft.textColor = fallback as string | null;
          })
        }
        placeholder={globalTextColor || "#1f2937"}
        responsive
      />

      {/* Text Hover Color */}
      <ColorInput
        label="Text Hover Color"
        value={props.textColorHoverResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textColorHoverResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.textColorHover;
            draft.textColorHover = fallback as string | null;
          })
        }
        placeholder="Hover color"
        responsive
      />

      {/* Links Color */}
      <ColorInput
        label="Links Color"
        value={props.linkColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.linkColorResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.linkColor;
            draft.linkColor = fallback as string | null;
          })
        }
        placeholder="#0066cc"
        responsive
      />

      {/* Links Hover Color */}
      <ColorInput
        label="Links Hover Color"
        value={props.linkColorHoverResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.linkColorHoverResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.linkColorHover;
            draft.linkColorHover = fallback as string | null;
          })
        }
        placeholder="#004499"
        responsive
      />

      {/* Font Family */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Font Family</label>
        <select
          value={props.fontFamily || ""}
          onChange={(e) =>
            actions.setProp((draft) => {
              draft.fontFamily = e.target.value || null;
            })
          }
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
        value={props.fontSizeResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.fontSizeResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.fontSize ?? globalFontSize ?? 16;
            draft.fontSize = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.fontSizeUnit = (unitRecord.desktop ?? draft.fontSizeUnit ?? "px") as "px" | "rem" | "em" | "%";
          })
        }
        unit={props.fontSizeUnit || "px"}
        unitOptions={["px", "rem", "em", "%"]}
        defaultValue={globalFontSize ?? 16}
        min={8}
        max={200}
      />

      {/* Font Weight */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-weight`}
        label="Font Weight"
        value={props.fontWeightResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.fontWeightResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? String(draft.fontWeight ?? globalFontWeight ?? 400);
            draft.fontWeight = parseInt(fallback) || fallback;
          })
        }
        options={FONT_WEIGHT_OPTIONS}
        defaultValue={String(globalFontWeight ?? 400)}
        layout="select"
        variant="inline"
      />

      {/* Font Style */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-style`}
        label="Font Style"
        value={props.fontStyleResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.fontStyleResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.fontStyle ?? globalFontStyle ?? "normal";
            draft.fontStyle = fallback as "normal" | "italic" | "oblique";
          })
        }
        options={FONT_STYLE_OPTIONS}
        defaultValue={globalFontStyle || "normal"}
        layout="select"
        variant="inline"
      />

      {/* Text Transform */}
      <ResponsiveSelectControl
        controlId={`${baseId}-text-transform`}
        label="Text Transform"
        value={props.textTransformResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textTransformResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.textTransform ?? "none";
            draft.textTransform = fallback as "none" | "uppercase" | "lowercase" | "capitalize";
          })
        }
        options={TEXT_TRANSFORM_OPTIONS}
        defaultValue="none"
        layout="select"
        variant="inline"
      />

      {/* Text Decoration */}
      <ResponsiveSelectControl
        controlId={`${baseId}-text-decoration`}
        label="Text Decoration"
        value={props.textDecorationResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textDecorationResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.textDecoration ?? "none";
            draft.textDecoration = fallback as "none" | "underline" | "overline" | "line-through" | "underline overline";
          })
        }
        options={TEXT_DECORATION_OPTIONS}
        defaultValue="none"
        layout="select"
        variant="inline"
      />

      {/* Letter Spacing */}
      <ResponsiveNumberInput
        controlId={`${baseId}-letter-spacing`}
        label="Letter Spacing"
        value={props.letterSpacingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.letterSpacingResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.letterSpacing ?? globalLetterSpacing ?? 0;
            draft.letterSpacing = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.letterSpacingUnit = (unitRecord.desktop ?? draft.letterSpacingUnit ?? "px") as "px" | "em";
          })
        }
        unit={props.letterSpacingUnit || "px"}
        unitOptions={["px", "em"]}
        defaultValue={globalLetterSpacing ?? 0}
        min={-5}
        max={20}
      />

      {/* Line Height */}
      <div>
        <ResponsiveNumberInput
          controlId={`${baseId}-line-height`}
          label="Line Height"
          value={props.lineHeightResponsive as ResponsiveRecord | undefined}
          onChange={(value) =>
            actions.setProp((draft) => {
              draft.lineHeightResponsive = value as ResponsiveValue;
              const record = value as ResponsiveRecord;
              const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.lineHeight ?? globalLineHeight ?? 1.6;
              draft.lineHeight = fallback;
              const unitRecord = (record.unit as Record<string, string>) || {};
              draft.lineHeightUnit = (unitRecord.desktop ?? draft.lineHeightUnit ?? "normal") as "px" | "em" | "rem" | "normal" | "number";
            })
          }
          unit={props.lineHeightUnit === "normal" || props.lineHeightUnit === "number" ? "" : props.lineHeightUnit || "px"}
          unitOptions={props.lineHeightUnit === "normal" || props.lineHeightUnit === "number" ? [] : ["px", "em", "rem"]}
          defaultValue={globalLineHeight ?? 1.6}
          min={0.5}
          max={5}
        />
        <div className="mt-2 flex gap-2">
          {LINE_HEIGHT_UNIT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                actions.setProp((draft) => {
                  draft.lineHeightUnit = option.value as "px" | "em" | "rem" | "normal" | "number";
                })
              }
              className={`px-2 py-1 text-xs rounded ${
                (props.lineHeightUnit || "normal") === option.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


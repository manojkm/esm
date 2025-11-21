"use client";

import React from "react";
import { ResponsiveNumberInput, ResponsiveSelectControl } from "../shared/controls";
import { ColorInput } from "../shared/controls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { POPULAR_GOOGLE_FONTS } from "@/app/builder/lib/google-fonts";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface SubHeadingTypographyFeatureProps {
  subHeadingTextColor?: string;
  subHeadingTextColorResponsive?: ResponsiveValue;
  subHeadingTextColorHover?: string;
  subHeadingTextColorHoverResponsive?: ResponsiveValue;
  subHeadingFontFamily?: string;
  subHeadingFontFamilyResponsive?: ResponsiveValue;
  subHeadingFontSize?: number;
  subHeadingFontSizeResponsive?: ResponsiveValue;
  subHeadingFontSizeUnit?: string;
  subHeadingFontWeight?: string;
  subHeadingFontWeightResponsive?: ResponsiveValue;
  subHeadingFontStyle?: string;
  subHeadingFontStyleResponsive?: ResponsiveValue;
  subHeadingTextTransform?: string;
  subHeadingTextTransformResponsive?: ResponsiveValue;
  subHeadingTextDecoration?: string;
  subHeadingTextDecorationResponsive?: ResponsiveValue;
  subHeadingLetterSpacing?: number;
  subHeadingLetterSpacingResponsive?: ResponsiveValue;
  subHeadingLetterSpacingUnit?: string;
  subHeadingLineHeight?: number | string;
  subHeadingLineHeightResponsive?: ResponsiveValue;
  subHeadingLineHeightUnit?: string;
}

export interface SubHeadingTypographyControlsProps<TProps extends SubHeadingTypographyFeatureProps> {
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

export const SubHeadingTypographyControls = <TProps extends SubHeadingTypographyFeatureProps>({
  props,
  actions,
  controlId = "sub-heading-typography",
}: SubHeadingTypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const baseId = `sub-heading-typography-${controlId}`;

  // Get global defaults for body/sub-heading
  const globalFontSize = settings.typography.fontSize?.desktop?.body;
  const globalFontWeight = settings.typography.fontWeight?.body;
  const globalFontStyle = settings.typography.fontStyle?.body;
  const globalTextColor = settings.typography.textColor?.body;
  const globalLineHeight = settings.typography.lineHeight?.body;
  const globalLetterSpacing = settings.typography.letterSpacing?.body;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Text Color */}
      <ColorInput
        label="Text Color"
        value={props.subHeadingTextColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingTextColorResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            // Extract values, treating null as "not set"
            const desktopValue = record.desktop as string | null | undefined;
            const tabletValue = record.tablet as string | null | undefined;
            const mobileValue = record.mobile as string | null | undefined;
            
            // Check if there are any actual color values (not null/undefined)
            const hasAnyValue = (desktopValue != null && desktopValue !== "") || 
                               (tabletValue != null && tabletValue !== "") || 
                               (mobileValue != null && mobileValue !== "");
            
            if (!hasAnyValue) {
              // No values set: clear the non-responsive prop so it falls back to global default
              draft.subHeadingTextColor = undefined;
            } else {
              // Set fallback from responsive values (null values are skipped by ??)
              const fallback = desktopValue ?? tabletValue ?? mobileValue ?? draft.subHeadingTextColor ?? globalTextColor ?? "#6b7280";
              draft.subHeadingTextColor = fallback;
            }
          })
        }
        placeholder={globalTextColor || "#6b7280"}
        responsive
      />

      {/* Text Hover Color */}
      <ColorInput
        label="Text Hover Color"
        value={props.subHeadingTextColorHoverResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingTextColorHoverResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.subHeadingTextColorHover;
            draft.subHeadingTextColorHover = fallback;
          })
        }
        placeholder="Hover color"
        responsive
      />

      {/* Font Family */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Font Family</label>
        <select
          value={props.subHeadingFontFamily || ""}
          onChange={(e) =>
            actions.setProp((draft) => {
              draft.subHeadingFontFamily = e.target.value || undefined;
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
        value={props.subHeadingFontSizeResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingFontSizeResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.subHeadingFontSize ?? globalFontSize ?? 16;
            draft.subHeadingFontSize = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.subHeadingFontSizeUnit = (unitRecord.desktop ?? draft.subHeadingFontSizeUnit ?? "px") as string;
          })
        }
        unit={props.subHeadingFontSizeUnit || "px"}
        unitOptions={["px", "rem", "em", "%"]}
        defaultValue={globalFontSize ?? 16}
        min={8}
        max={200}
      />

      {/* Font Weight */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-weight`}
        label="Font Weight"
        value={props.subHeadingFontWeightResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingFontWeightResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? String(draft.subHeadingFontWeight ?? globalFontWeight ?? 400);
            draft.subHeadingFontWeight = fallback;
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
        value={props.subHeadingFontStyleResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingFontStyleResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.subHeadingFontStyle ?? globalFontStyle ?? "normal";
            draft.subHeadingFontStyle = fallback as string;
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
        value={props.subHeadingTextTransformResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingTextTransformResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.subHeadingTextTransform ?? "none";
            draft.subHeadingTextTransform = fallback as string;
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
        value={props.subHeadingTextDecorationResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingTextDecorationResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.subHeadingTextDecoration ?? "none";
            draft.subHeadingTextDecoration = fallback as string;
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
        value={props.subHeadingLetterSpacingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingLetterSpacingResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.subHeadingLetterSpacing ?? globalLetterSpacing ?? 0;
            draft.subHeadingLetterSpacing = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.subHeadingLetterSpacingUnit = (unitRecord.desktop ?? draft.subHeadingLetterSpacingUnit ?? "px") as string;
          })
        }
        unit={props.subHeadingLetterSpacingUnit || "px"}
        unitOptions={["px", "em"]}
        defaultValue={globalLetterSpacing ?? 0}
        min={-5}
        max={20}
      />

      {/* Line Height */}
      <div className="space-y-2">
        <ResponsiveNumberInput
          controlId={`${baseId}-line-height`}
          label="Line Height"
          value={props.subHeadingLineHeightResponsive as ResponsiveRecord | undefined}
          onChange={(value) =>
            actions.setProp((draft) => {
              draft.subHeadingLineHeightResponsive = value as ResponsiveValue;
              const record = value as ResponsiveRecord;
              const unitRecord = (record.unit as Record<string, string>) || {};
              const unit = unitRecord.desktop ?? draft.subHeadingLineHeightUnit ?? "normal";
              draft.subHeadingLineHeightUnit = unit as string;
              if (unit === "normal" || unit === "number") {
                const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? (typeof draft.subHeadingLineHeight === "number" ? draft.subHeadingLineHeight : globalLineHeight ?? 1.5);
                draft.subHeadingLineHeight = fallback;
              } else {
                const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? (typeof draft.subHeadingLineHeight === "number" ? draft.subHeadingLineHeight : 1.5);
                draft.subHeadingLineHeight = fallback;
              }
            })
          }
          unit={props.subHeadingLineHeightUnit === "normal" || props.subHeadingLineHeightUnit === "number" ? undefined : (props.subHeadingLineHeightUnit || "px")}
          unitOptions={props.subHeadingLineHeightUnit === "normal" || props.subHeadingLineHeightUnit === "number" ? [] : ["px", "em", "rem"]}
          defaultValue={typeof props.subHeadingLineHeight === "number" ? props.subHeadingLineHeight : (globalLineHeight ?? 1.5)}
          min={0}
          max={10}
        />
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">Unit</label>
          <select
            value={props.subHeadingLineHeightUnit || "normal"}
            onChange={(e) =>
              actions.setProp((draft) => {
                draft.subHeadingLineHeightUnit = e.target.value as string;
              })
            }
            className="w-32 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LINE_HEIGHT_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};


"use client";

import React from "react";
import { ResponsiveNumberInput, ResponsiveSelectControl } from "../shared/controls";
import { ColorInput } from "../shared/controls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { POPULAR_GOOGLE_FONTS } from "@/app/builder/lib/google-fonts";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface HeadingTypographyFeatureProps {
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  headingTextColor?: string;
  headingTextColorResponsive?: ResponsiveValue;
  headingTextColorHover?: string;
  headingTextColorHoverResponsive?: ResponsiveValue;
  headingFontFamily?: string;
  headingFontFamilyResponsive?: ResponsiveValue;
  headingFontSize?: number;
  headingFontSizeResponsive?: ResponsiveValue;
  headingFontSizeUnit?: string;
  headingFontWeight?: string;
  headingFontWeightResponsive?: ResponsiveValue;
  headingFontStyle?: string;
  headingFontStyleResponsive?: ResponsiveValue;
  headingTextTransform?: string;
  headingTextTransformResponsive?: ResponsiveValue;
  headingTextDecoration?: string;
  headingTextDecorationResponsive?: ResponsiveValue;
  headingLetterSpacing?: number;
  headingLetterSpacingResponsive?: ResponsiveValue;
  headingLetterSpacingUnit?: string;
  headingLineHeight?: number | string;
  headingLineHeightResponsive?: ResponsiveValue;
  headingLineHeightUnit?: string;
}

export interface HeadingTypographyControlsProps<TProps extends HeadingTypographyFeatureProps> {
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

export const HeadingTypographyControls = <TProps extends HeadingTypographyFeatureProps>({
  props,
  actions,
  controlId = "heading-typography",
}: HeadingTypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const baseId = `heading-typography-${controlId}`;

  // Get typography defaults based on headingTag
  const getTypographyElement = (): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" => {
    if (props.headingTag?.startsWith("h")) {
      return props.headingTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
  const globalTextColor = settings.typography.headingTextColor || settings.typography.textColor?.[typographyType];
  const globalLineHeight = settings.typography.lineHeight?.[typographyType];
  const globalLetterSpacing = settings.typography.letterSpacing?.[typographyType];

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Text Color */}
      <ColorInput
        label="Text Color"
        value={props.headingTextColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingTextColorResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.headingTextColor ?? globalTextColor ?? "#1f2937";
            draft.headingTextColor = fallback;
          })
        }
        placeholder={globalTextColor || "#1f2937"}
        responsive
      />

      {/* Text Hover Color */}
      <ColorInput
        label="Text Hover Color"
        value={props.headingTextColorHoverResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingTextColorHoverResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.headingTextColorHover;
            draft.headingTextColorHover = fallback;
          })
        }
        placeholder="Hover color"
        responsive
      />

      {/* Font Family */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Font Family</label>
        <select
          value={props.headingFontFamily || ""}
          onChange={(e) =>
            actions.setProp((draft) => {
              draft.headingFontFamily = e.target.value || undefined;
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
        value={props.headingFontSizeResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingFontSizeResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.headingFontSize ?? globalFontSize ?? 24;
            draft.headingFontSize = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.headingFontSizeUnit = (unitRecord.desktop ?? draft.headingFontSizeUnit ?? "px") as string;
          })
        }
        unit={props.headingFontSizeUnit || "px"}
        unitOptions={["px", "rem", "em", "%"]}
        defaultValue={globalFontSize ?? 24}
        min={8}
        max={200}
      />

      {/* Font Weight */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-weight`}
        label="Font Weight"
        value={props.headingFontWeightResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingFontWeightResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? String(draft.headingFontWeight ?? globalFontWeight ?? 700);
            draft.headingFontWeight = fallback;
          })
        }
        options={FONT_WEIGHT_OPTIONS}
        defaultValue={String(globalFontWeight ?? 700)}
        layout="select"
        variant="inline"
      />

      {/* Font Style */}
      <ResponsiveSelectControl
        controlId={`${baseId}-font-style`}
        label="Font Style"
        value={props.headingFontStyleResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingFontStyleResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.headingFontStyle ?? globalFontStyle ?? "normal";
            draft.headingFontStyle = fallback as string;
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
        value={props.headingTextTransformResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingTextTransformResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.headingTextTransform ?? "none";
            draft.headingTextTransform = fallback as string;
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
        value={props.headingTextDecorationResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingTextDecorationResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.headingTextDecoration ?? "none";
            draft.headingTextDecoration = fallback as string;
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
        value={props.headingLetterSpacingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingLetterSpacingResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.headingLetterSpacing ?? globalLetterSpacing ?? 0;
            draft.headingLetterSpacing = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.headingLetterSpacingUnit = (unitRecord.desktop ?? draft.headingLetterSpacingUnit ?? "px") as string;
          })
        }
        unit={props.headingLetterSpacingUnit || "px"}
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
          value={props.headingLineHeightResponsive as ResponsiveRecord | undefined}
          onChange={(value) =>
            actions.setProp((draft) => {
              draft.headingLineHeightResponsive = value as ResponsiveValue;
              const record = value as ResponsiveRecord;
              const unitRecord = (record.unit as Record<string, string>) || {};
              const unit = unitRecord.desktop ?? draft.headingLineHeightUnit ?? "normal";
              draft.headingLineHeightUnit = unit as string;
              if (unit === "normal" || unit === "number") {
                const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? (typeof draft.headingLineHeight === "number" ? draft.headingLineHeight : globalLineHeight ?? 1.2);
                draft.headingLineHeight = fallback;
              } else {
                const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? (typeof draft.headingLineHeight === "number" ? draft.headingLineHeight : 1.2);
                draft.headingLineHeight = fallback;
              }
            })
          }
          unit={props.headingLineHeightUnit === "normal" || props.headingLineHeightUnit === "number" ? undefined : (props.headingLineHeightUnit || "px")}
          unitOptions={props.headingLineHeightUnit === "normal" || props.headingLineHeightUnit === "number" ? [] : ["px", "em", "rem"]}
          defaultValue={typeof props.headingLineHeight === "number" ? props.headingLineHeight : (globalLineHeight ?? 1.2)}
          min={0}
          max={10}
        />
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">Unit</label>
          <select
            value={props.headingLineHeightUnit || "normal"}
            onChange={(e) =>
              actions.setProp((draft) => {
                draft.headingLineHeightUnit = e.target.value as string;
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


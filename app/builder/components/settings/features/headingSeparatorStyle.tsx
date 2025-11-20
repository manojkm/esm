"use client";

import React from "react";
import { ResponsiveNumberInput } from "../shared/controls";
import { ColorInput } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface HeadingSeparatorStyleFeatureProps {
  separatorStyle?: "none" | "solid" | "double" | "dashed" | "dotted";
  separatorWidth?: number;
  separatorWidthResponsive?: ResponsiveValue;
  separatorWidthUnit?: string;
  separatorThickness?: number;
  separatorColor?: string;
  separatorColorResponsive?: ResponsiveValue;
  separatorBottomSpacing?: number;
  separatorBottomSpacingResponsive?: ResponsiveValue;
  separatorBottomSpacingUnit?: string;
}

export interface HeadingSeparatorStyleControlsProps<TProps extends HeadingSeparatorStyleFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const HeadingSeparatorStyleControls = <TProps extends HeadingSeparatorStyleFeatureProps>({
  props,
  actions,
  controlId = "heading-separator-style",
}: HeadingSeparatorStyleControlsProps<TProps>) => {
  const baseId = `heading-separator-style-${controlId}`;

  // Only show if separator is enabled
  if (!props.separatorStyle || props.separatorStyle === "none") {
    return null;
  }

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Width */}
      <ResponsiveNumberInput
        controlId={`${baseId}-width`}
        label="Width"
        value={props.separatorWidthResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.separatorWidthResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.separatorWidth ?? 12;
            draft.separatorWidth = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.separatorWidthUnit = (unitRecord.desktop ?? draft.separatorWidthUnit ?? "%") as string;
          })
        }
        unit={props.separatorWidthUnit || "%"}
        unitOptions={["%", "px", "em", "rem"]}
        defaultValue={12}
        min={0}
        max={100}
        minMaxByUnit={{
          "%": { min: 0, max: 100 },
          px: { min: 0, max: 1000 },
          em: { min: 0, max: 50 },
          rem: { min: 0, max: 50 },
        }}
      />

      {/* Thickness */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Thickness</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={20}
            value={props.separatorThickness ?? 2}
            onChange={(e) =>
              actions.setProp((draft) => {
                draft.separatorThickness = parseInt(e.target.value, 10);
              })
            }
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min={1}
            max={20}
            value={props.separatorThickness ?? 2}
            onChange={(e) =>
              actions.setProp((draft) => {
                draft.separatorThickness = parseInt(e.target.value, 10) || 2;
              })
            }
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
          />
          <span className="text-xs text-gray-500">px</span>
        </div>
      </div>

      {/* Color */}
      <ColorInput
        label="Color"
        value={props.separatorColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.separatorColorResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.separatorColor ?? "#000000";
            draft.separatorColor = fallback;
          })
        }
        placeholder="#000000"
        responsive
      />

      {/* Bottom Spacing */}
      <ResponsiveNumberInput
        controlId={`${baseId}-bottom-spacing`}
        label="Bottom Spacing"
        value={props.separatorBottomSpacingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.separatorBottomSpacingResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.separatorBottomSpacing ?? 16;
            draft.separatorBottomSpacing = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.separatorBottomSpacingUnit = (unitRecord.desktop ?? draft.separatorBottomSpacingUnit ?? "px") as string;
          })
        }
        unit={props.separatorBottomSpacingUnit || "px"}
        unitOptions={["px", "rem", "em"]}
        defaultValue={16}
        min={0}
        max={200}
      />
    </div>
  );
};


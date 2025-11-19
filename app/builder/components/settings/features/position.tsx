"use client";

import React from "react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import type { BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveSpacingControl, ResponsiveNumberInput } from "../shared/controls";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveRecord } from "../shared/types/responsive";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import { InfoNotice } from "../shared/components";

/**
 * Positioning feature: lets authors switch positioning mode, offsets, and z-index.
 */

export interface PositionFeatureProps {
  position?: string | null;
  positionTop?: number | null;
  positionRight?: number | null;
  positionBottom?: number | null;
  positionLeft?: number | null;
  positionTopUnit?: string;
  positionRightUnit?: string;
  positionBottomUnit?: string;
  positionLeftUnit?: string;
  positionTopResponsive?: ResponsiveValue;
  positionRightResponsive?: ResponsiveValue;
  positionBottomResponsive?: ResponsiveValue;
  positionLeftResponsive?: ResponsiveValue;
  zIndex?: number | null;
  zIndexResponsive?: ResponsiveValue;
}

export interface PositionControlsProps<TProps extends PositionFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const PositionControls = <TProps extends PositionFeatureProps>({ props, actions, controlId = "position" }: PositionControlsProps<TProps>) => {
  const baseId = `position-controls-${controlId}`;
  const { currentBreakpoint } = useResponsive();

  const resolveExistingUnit = () => props.positionTopUnit || props.positionRightUnit || props.positionBottomUnit || props.positionLeftUnit;

  // Build responsive record from existing responsive props or static values
  const buildResponsiveRecord = (side: "top" | "right" | "bottom" | "left"): ResponsiveRecord | undefined => {
    const responsiveProp = side === "top" ? props.positionTopResponsive :
                          side === "right" ? props.positionRightResponsive :
                          side === "bottom" ? props.positionBottomResponsive :
                          props.positionLeftResponsive;
    
    // If responsive prop exists, use it
    if (responsiveProp) {
      const record: ResponsiveRecord = {};
      if (responsiveProp.desktop !== undefined && responsiveProp.desktop !== null) {
        record.desktop = responsiveProp.desktop as number;
      }
      if (responsiveProp.tablet !== undefined && responsiveProp.tablet !== null) {
        record.tablet = responsiveProp.tablet as number;
      }
      if (responsiveProp.mobile !== undefined && responsiveProp.mobile !== null) {
        record.mobile = responsiveProp.mobile as number;
      }
      if (responsiveProp.unit) {
        record.unit = responsiveProp.unit;
      }
      return Object.keys(record).length > 0 ? record : undefined;
    }
    
    // Otherwise, build from static value
    const staticValue = side === "top" ? props.positionTop :
                       side === "right" ? props.positionRight :
                       side === "bottom" ? props.positionBottom :
                       props.positionLeft;
    
    if (staticValue !== null && staticValue !== undefined) {
      return { desktop: staticValue } as ResponsiveRecord;
    }
    
    return undefined;
  };

  const offsetsValue: ResponsiveRecord = {};
  const topRecord = buildResponsiveRecord("top");
  if (topRecord) offsetsValue.top = topRecord;
  const rightRecord = buildResponsiveRecord("right");
  if (rightRecord) offsetsValue.right = rightRecord;
  const bottomRecord = buildResponsiveRecord("bottom");
  if (bottomRecord) offsetsValue.bottom = bottomRecord;
  const leftRecord = buildResponsiveRecord("left");
  if (leftRecord) offsetsValue.left = leftRecord;

  const existingUnit = resolveExistingUnit();
  if (existingUnit && !offsetsValue.unit) {
    offsetsValue.unit = { desktop: existingUnit };
  }

  const handleOffsetResponsiveChange = (nextValue: ResponsiveRecord) => {
    const fallbackOrder: BreakpointKey[] = [currentBreakpoint, "desktop", "tablet", "mobile"];

    const getSideValue = (side: "top" | "right" | "bottom" | "left") => {
      const sideRecord = (nextValue?.[side] as Partial<Record<BreakpointKey, number | null>>) || {};
      for (const bp of fallbackOrder) {
        if (sideRecord[bp] !== undefined) {
          const candidate = sideRecord[bp];
          return candidate === null ? null : candidate;
        }
      }
      return null;
    };

    const unitRecord = (nextValue?.unit as Partial<Record<BreakpointKey, string | null>>) || {};
    let unit: string | undefined;
    for (const bp of fallbackOrder) {
      if (unitRecord[bp] !== undefined) {
        unit = unitRecord[bp] ?? undefined;
        break;
      }
    }
    if (!unit) {
      unit = resolveExistingUnit() || "px";
    }

    // Store the full responsive record
    const buildResponsiveValue = (side: "top" | "right" | "bottom" | "left"): ResponsiveValue => {
      const sideRecord = (nextValue?.[side] as Partial<Record<BreakpointKey, number | null>>) || {};
      const responsive: ResponsiveValue = {};
      
      if (sideRecord.desktop !== undefined) responsive.desktop = sideRecord.desktop;
      if (sideRecord.tablet !== undefined) responsive.tablet = sideRecord.tablet;
      if (sideRecord.mobile !== undefined) responsive.mobile = sideRecord.mobile;
      
      if (unitRecord.desktop !== undefined) {
        if (!responsive.unit) responsive.unit = {};
        responsive.unit.desktop = unitRecord.desktop ?? undefined;
      }
      if (unitRecord.tablet !== undefined) {
        if (!responsive.unit) responsive.unit = {};
        responsive.unit.tablet = unitRecord.tablet ?? undefined;
      }
      if (unitRecord.mobile !== undefined) {
        if (!responsive.unit) responsive.unit = {};
        responsive.unit.mobile = unitRecord.mobile ?? undefined;
      }
      
      return responsive;
    };

    actions.setProp((draft) => {
      // Store static values for current breakpoint (for editor preview)
      draft.positionTop = getSideValue("top");
      draft.positionRight = getSideValue("right");
      draft.positionBottom = getSideValue("bottom");
      draft.positionLeft = getSideValue("left");

      draft.positionTopUnit = unit;
      draft.positionRightUnit = unit;
      draft.positionBottomUnit = unit;
      draft.positionLeftUnit = unit;

      // Store full responsive records
      draft.positionTopResponsive = buildResponsiveValue("top");
      draft.positionRightResponsive = buildResponsiveValue("right");
      draft.positionBottomResponsive = buildResponsiveValue("bottom");
      draft.positionLeftResponsive = buildResponsiveValue("left");
    });
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-select`}>
          Position
        </label>
        <select
          id={`${baseId}-select`}
          value={props.position || "default"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.position = event.target.value;
            })
          }
          className="w-32 px-2 py-2 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default</option>
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>

      {props.position && props.position !== "default" && props.position !== "static" && (
        <>
          <ResponsiveSpacingControl controlId={`${baseId}-offsets`} label="Offsets" value={Object.keys(offsetsValue).length ? offsetsValue : undefined} onChange={handleOffsetResponsiveChange} unitOptions={["px", "%"]} />

          <ResponsiveNumberInput
            controlId={`${baseId}-zindex`}
            label="Z-Index"
            value={props.zIndexResponsive as ResponsiveRecord | undefined}
            onChange={(value) => {
              const record = value as ResponsiveRecord;
              const fallback = (record.desktop as number | undefined) ?? props.zIndex ?? null;
              actions.setProp((draft) => {
                draft.zIndexResponsive = value as ResponsiveValue;
                draft.zIndex = fallback;
              });
            }}
            min={-9999}
            max={9999}
            defaultValue={0}
          />

          <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
        </>
      )}
    </div>
  );
};


"use client";

import React from "react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import type { BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveSpacingControl } from "../shared/controls";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveRecord } from "../shared/types/responsive";
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
  zIndex?: number | null;
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

  const buildSideRecord = (val?: number | null) => {
    if (val === null || val === undefined) return undefined;
    return { desktop: val } as ResponsiveRecord;
  };

  const offsetsValue: ResponsiveRecord = {};
  const topRecord = buildSideRecord(props.positionTop);
  if (topRecord) offsetsValue.top = topRecord;
  const rightRecord = buildSideRecord(props.positionRight);
  if (rightRecord) offsetsValue.right = rightRecord;
  const bottomRecord = buildSideRecord(props.positionBottom);
  if (bottomRecord) offsetsValue.bottom = bottomRecord;
  const leftRecord = buildSideRecord(props.positionLeft);
  if (leftRecord) offsetsValue.left = leftRecord;

  const existingUnit = resolveExistingUnit();
  if (existingUnit) {
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

    actions.setProp((draft) => {
      draft.positionTop = getSideValue("top");
      draft.positionRight = getSideValue("right");
      draft.positionBottom = getSideValue("bottom");
      draft.positionLeft = getSideValue("left");

      draft.positionTopUnit = unit;
      draft.positionRightUnit = unit;
      draft.positionBottomUnit = unit;
      draft.positionLeftUnit = unit;
    });
  };

  const handleZIndexChange = (value: string) => {
    actions.setProp((draft) => {
      const parsed = value === "" ? undefined : Number(value);
      draft.zIndex = parsed === undefined || Number.isNaN(parsed) ? undefined : parsed;
    });
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
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
          className={INLINE_FIELD_CLASS}
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

          <div className={INLINE_ROW_CLASS}>
            <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-zindex`}>
              Z-Index
            </label>
            <input
              id={`${baseId}-zindex`}
              type="number"
              value={props.zIndex ?? ""}
              onChange={(event) => handleZIndexChange(event.target.value)}
              placeholder="auto"
              className={INLINE_FIELD_CLASS}
            />
          </div>

          <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
        </>
      )}
    </div>
  );
};


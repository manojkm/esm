"use client";

import React from "react";
import { ResponsiveNumberInput } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface SubHeadingBottomSpacingFeatureProps {
  subHeadingBottomSpacing?: number;
  subHeadingBottomSpacingResponsive?: ResponsiveValue;
  subHeadingBottomSpacingUnit?: string;
}

export interface SubHeadingBottomSpacingControlsProps<TProps extends SubHeadingBottomSpacingFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const SubHeadingBottomSpacingControls = <TProps extends SubHeadingBottomSpacingFeatureProps>({
  props,
  actions,
  controlId = "sub-heading-bottom-spacing",
}: SubHeadingBottomSpacingControlsProps<TProps>) => {
  const baseId = `sub-heading-bottom-spacing-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <ResponsiveNumberInput
        controlId={`${baseId}-spacing`}
        label="Bottom Spacing"
        value={props.subHeadingBottomSpacingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.subHeadingBottomSpacingResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.subHeadingBottomSpacing ?? 16;
            draft.subHeadingBottomSpacing = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.subHeadingBottomSpacingUnit = (unitRecord.desktop ?? draft.subHeadingBottomSpacingUnit ?? "px") as string;
          })
        }
        unit={props.subHeadingBottomSpacingUnit || "px"}
        unitOptions={["px", "rem", "em"]}
        defaultValue={16}
        min={0}
        max={200}
      />
    </div>
  );
};


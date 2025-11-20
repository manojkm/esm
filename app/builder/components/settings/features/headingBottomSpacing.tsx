"use client";

import React from "react";
import { ResponsiveNumberInput } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface HeadingBottomSpacingFeatureProps {
  headingBottomSpacing?: number;
  headingBottomSpacingResponsive?: ResponsiveValue;
  headingBottomSpacingUnit?: string;
}

export interface HeadingBottomSpacingControlsProps<TProps extends HeadingBottomSpacingFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const HeadingBottomSpacingControls = <TProps extends HeadingBottomSpacingFeatureProps>({
  props,
  actions,
  controlId = "heading-bottom-spacing",
}: HeadingBottomSpacingControlsProps<TProps>) => {
  const baseId = `heading-bottom-spacing-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <ResponsiveNumberInput
        controlId={`${baseId}-spacing`}
        label="Bottom Spacing"
        value={props.headingBottomSpacingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingBottomSpacingResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.headingBottomSpacing ?? 16;
            draft.headingBottomSpacing = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.headingBottomSpacingUnit = (unitRecord.desktop ?? draft.headingBottomSpacingUnit ?? "px") as string;
          })
        }
        unit={props.headingBottomSpacingUnit || "px"}
        unitOptions={["px", "rem", "em"]}
        defaultValue={16}
        min={0}
        max={200}
      />
    </div>
  );
};


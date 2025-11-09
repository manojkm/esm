"use client";

import React from "react";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import { ResponsiveNumberInput, ResponsiveSpacingControl } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveRecord } from "../shared/types/responsive";

/**
 * Feature bundle that exposes flex gaps, padding and margin controls.
 * Applies to any component that supports responsive spacing adjustments.
 */

export interface SpacingFeatureProps {
  layout?: string;
  rowGapResponsive?: ResponsiveValue;
  columnGapResponsive?: ResponsiveValue;
  paddingResponsive?: ResponsiveValue;
  marginResponsive?: ResponsiveValue;
}

export interface SpacingControlsProps<TProps extends SpacingFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const GapControls = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing-gaps" }: SpacingControlsProps<TProps>) => {
  if (props.layout !== "flex") return null;

  const baseId = `gap-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ResponsiveNumberInput
        controlId={`${baseId}-row`}
        label="Row Gap"
        value={props.rowGapResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.rowGapResponsive = value as ResponsiveValue;
          })
        }
        max={100}
        unitOptions={["px", "%"]}
        defaultValue={20}
      />

      <ResponsiveNumberInput
        controlId={`${baseId}-column`}
        label="Column Gap"
        value={props.columnGapResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.columnGapResponsive = value as ResponsiveValue;
          })
        }
        max={100}
        unitOptions={["px", "%"]}
        defaultValue={20}
      />
    </section>
  );
};

const PaddingControl = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing-padding" }: SpacingControlsProps<TProps>) => {
  const baseId = `padding-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ResponsiveSpacingControl
        controlId={`${baseId}-responsive`}
        label="Padding"
        value={props.paddingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.paddingResponsive = value as ResponsiveValue;
          })
        }
        defaultValue={10}
      />
    </section>
  );
};

const MarginControl = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing-margin" }: SpacingControlsProps<TProps>) => {
  const baseId = `margin-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ResponsiveSpacingControl
        controlId={`${baseId}-responsive`}
        label="Margin"
        value={props.marginResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.marginResponsive = value as ResponsiveValue;
          })
        }
        unitOptions={["px", "%", "auto"]}
      />
    </section>
  );
};

export const SpacingControls = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing" }: SpacingControlsProps<TProps>) => {
  const baseId = `spacing-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <GapControls props={props} actions={actions} controlId={`${controlId}-gaps`} />
      <PaddingControl props={props} actions={actions} controlId={`${controlId}-padding`} />
      <MarginControl props={props} actions={actions} controlId={`${controlId}-margin`} />
    </div>
  );
};

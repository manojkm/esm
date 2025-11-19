"use client";

import React from "react";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import { ResponsiveNumberInput, ResponsiveSpacingControl } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveRecord } from "../shared/types/responsive";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";

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
  // Non-responsive props for displaying defaults
  padding?: number | null;
  margin?: number | null;
  paddingTop?: number | null;
  paddingRight?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
  marginTop?: number | null;
  marginRight?: number | null;
  marginBottom?: number | null;
  marginLeft?: number | null;
}

export interface SpacingControlsProps<TProps extends SpacingFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
  showGaps?: boolean;
  // Component-specific defaults (optional)
  defaultPadding?: number | null; // Default padding value for this component type
  defaultMargin?: number | null; // Default margin value for this component type
}

const GapControls = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing-gaps", showGaps = true }: SpacingControlsProps<TProps>) => {
  if (!showGaps || props.layout !== "flex") return null;

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

const PaddingControl = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing-padding", defaultPadding }: SpacingControlsProps<TProps>) => {
  const baseId = `padding-control-${controlId}`;
  const { settings } = useGlobalSettings();

  // Use component-specific default if provided, otherwise fall back to:
  // - Container defaults (10px) or global defaults
  // - If defaultPadding is explicitly null, use undefined (no default)
  const paddingDefault = props.padding !== undefined ? (props.padding !== null ? props.padding : undefined) : defaultPadding !== undefined ? (defaultPadding !== null ? defaultPadding : undefined) : settings.containerDefaults.padding?.default ?? 10; // Fallback to Container/global default

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
        // Pass non-responsive props as defaults for display
        defaultValue={paddingDefault}
        defaultTop={props.paddingTop}
        defaultRight={props.paddingRight}
        defaultBottom={props.paddingBottom}
        defaultLeft={props.paddingLeft}
      />
    </section>
  );
};

const MarginControl = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing-margin", defaultMargin }: SpacingControlsProps<TProps>) => {
  const baseId = `margin-control-${controlId}`;
  const { settings } = useGlobalSettings();

  // Use component-specific default if provided, otherwise fall back to:
  // - Container defaults (0) or global defaults
  // - If defaultMargin is explicitly null, use undefined (no default)
  const marginDefault = props.margin !== undefined ? (props.margin !== null ? props.margin : undefined) : defaultMargin !== undefined ? (defaultMargin !== null ? defaultMargin : undefined) : settings.containerDefaults.margin?.default ?? 0; // Fallback to Container/global default

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
        // Pass non-responsive props as defaults for display
        defaultValue={marginDefault}
        defaultTop={props.marginTop}
        defaultRight={props.marginRight}
        defaultBottom={props.marginBottom}
        defaultLeft={props.marginLeft}
      />
    </section>
  );
};

export const SpacingControls = <TProps extends SpacingFeatureProps>({ props, actions, controlId = "spacing", showGaps = true, defaultPadding, defaultMargin }: SpacingControlsProps<TProps>) => {
  const baseId = `spacing-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <GapControls props={props} actions={actions} controlId={`${controlId}-gaps`} showGaps={showGaps} />
      <PaddingControl props={props} actions={actions} controlId={`${controlId}-padding`} defaultPadding={defaultPadding} />
      <MarginControl props={props} actions={actions} controlId={`${controlId}-margin`} defaultMargin={defaultMargin} />
    </div>
  );
};

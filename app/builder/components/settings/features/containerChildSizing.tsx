"use client";

import React from "react";
import type { ComponentControlActions } from "../shared/types";
import { DimensionControl } from "../shared/controls";

/**
 * Feature exposed only when the container is used as a child (column).
 * Wraps width overrides and delegates to shared min-height/equal-height features.
 */

const CHILD_WIDTH_DEFAULTS = {
  "%": 100,
  px: 320,
} as const;

export interface ContainerChildSizingProps extends React.PropsWithChildren {
  flexBasis?: number | null;
  flexBasisUnit?: string;
}

export interface ContainerChildSizingControlsProps<TProps extends ContainerChildSizingProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const ContainerChildSizingControls = <TProps extends ContainerChildSizingProps>({ props, actions, controlId = "child-sizing" }: ContainerChildSizingControlsProps<TProps>) => {
  const isChildContainer = props.flexBasis !== null && props.flexBasis !== undefined;
  if (!isChildContainer) return null;

  const baseId = `child-sizing-${controlId}`;
  const widthUnit = props.flexBasisUnit ?? "%";
  const widthDefaults = CHILD_WIDTH_DEFAULTS[widthUnit as keyof typeof CHILD_WIDTH_DEFAULTS] ?? CHILD_WIDTH_DEFAULTS["%"];

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <DimensionControl
        controlId={`${baseId}-width`}
        label="Custom Width"
        value={props.flexBasis ?? widthDefaults}
        unit={widthUnit}
        unitOptions={[
          { value: "%", label: "%" },
          { value: "px", label: "px" },
        ]}
        minMaxByUnit={{
          "%": { min: 1, max: 100 },
          px: { min: 20, max: 1600 },
        }}
        defaultValues={{
          "%": 100,
          px: 320,
        }}
        onValueChange={(value, unit) =>
          actions.setProp((draft) => {
            const { min, max } = unit === "%" ? { min: 1, max: 100 } : { min: 20, max: 1600 };
            const clamped = Math.min(max, Math.max(min, Math.round(value)));
            draft.flexBasis = clamped;
            draft.flexBasisUnit = unit;
          })
        }
        onUnitChange={(unit, defaultValue) =>
          actions.setProp((draft) => {
            draft.flexBasisUnit = unit;
            draft.flexBasis = defaultValue;
          })
        }
        showReset={Boolean(props.flexBasis && props.flexBasis !== (props.flexBasisUnit === "%" ? 100 : 320))}
        onReset={() =>
          actions.setProp((draft) => {
            draft.flexBasis = draft.flexBasisUnit === "%" ? 100 : 320;
          })
        }
      />
    </div>
  );
};

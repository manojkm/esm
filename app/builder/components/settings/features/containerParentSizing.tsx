"use client";

import React from "react";
import type { ComponentControlActions } from "../shared/types";
import { DimensionControl } from "../shared/controls";

/**
 * Feature exposed for top-level containers, covering width presets and content box sizing.
 */

export interface ContainerParentSizingProps {
  containerWidth?: string;
  customWidth?: number;
  customWidthUnit?: string;
  contentWidth?: string;
  contentBoxWidth?: number;
  contentBoxWidthUnit?: string;
  flexBasis?: number | null;
}

export interface ContainerParentSizingControlsProps<TProps extends ContainerParentSizingProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const CUSTOM_WIDTH_CONFIG = {
  unitOptions: [
    { value: "px", label: "px" },
    { value: "%", label: "%" },
  ],
  minMaxByUnit: {
    px: { min: 100, max: 1600 },
    "%": { min: 10, max: 100 },
  },
  defaultValues: {
    px: 1200,
    "%": 100,
  },
} as const;

export const ContainerParentSizingControls = <TProps extends ContainerParentSizingProps>({ props, actions, controlId = "parent-sizing" }: ContainerParentSizingControlsProps<TProps>) => {
  const isChildContainer = props.flexBasis !== undefined && props.flexBasis !== null;
  if (isChildContainer) return null;

  const baseId = `parent-sizing-${controlId}`;

  const renderContainerWidthButtons = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Container Width</label>
      <div className="grid grid-cols-3 gap-1">
        {["full", "boxed", "custom"].map((width) => (
          <button
            key={width}
            type="button"
            onClick={() =>
              actions.setProp((draft) => {
                draft.containerWidth = width;
              })
            }
            className={`px-3 py-2 text-xs border rounded capitalize ${(props.containerWidth || "full") === width ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
          >
            {width === "full" ? "Full Width" : width}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCustomWidthControl = () => {
    if (props.containerWidth !== "custom") return null;

    return (
      <DimensionControl
        controlId={`${baseId}-custom`}
        label="Custom Width"
        value={props.customWidth ?? (props.customWidthUnit === "%" ? 100 : 1200)}
        unit={props.customWidthUnit || "px"}
        unitOptions={CUSTOM_WIDTH_CONFIG.unitOptions}
        minMaxByUnit={CUSTOM_WIDTH_CONFIG.minMaxByUnit}
        defaultValues={CUSTOM_WIDTH_CONFIG.defaultValues}
        onValueChange={(value, unit) =>
          actions.setProp((draft) => {
            const { min, max } = unit === "%" ? { min: 10, max: 100 } : { min: 100, max: 1600 };
            const clamped = Math.min(max, Math.max(min, Math.round(value)));
            draft.customWidth = clamped;
            draft.customWidthUnit = unit;
          })
        }
        onUnitChange={(unit, defaultValue) =>
          actions.setProp((draft) => {
            draft.customWidthUnit = unit;
            draft.customWidth = defaultValue;
          })
        }
        showReset={Boolean(props.customWidth && props.customWidth !== (props.customWidthUnit === "%" ? 100 : 1200))}
        onReset={() =>
          actions.setProp((draft) => {
            draft.customWidth = draft.customWidthUnit === "%" ? 100 : 1200;
          })
        }
      />
    );
  };

  const renderContentWidthButtons = () => {
    if (props.containerWidth !== "full" && props.containerWidth) return null;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Width</label>
        <div className="grid grid-cols-2 gap-1">
          {["boxed", "full"].map((contentWidth) => (
            <button
              key={contentWidth}
              type="button"
              onClick={() =>
                actions.setProp((draft) => {
                  draft.contentWidth = contentWidth;
                })
              }
              className={`px-3 py-2 text-xs border rounded capitalize ${(props.contentWidth || "boxed") === contentWidth ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              {contentWidth === "full" ? "Full Width" : "Boxed"}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderContentBoxWidth = () => {
    if ((props.containerWidth !== "full" && props.containerWidth) || (props.contentWidth !== "boxed" && props.contentWidth)) return null;

    return (
      <DimensionControl
        controlId={`${baseId}-content-box`}
        label="Content Box Width"
        value={props.contentBoxWidth ?? (props.contentBoxWidthUnit === "%" ? 100 : 1200)}
        unit={props.contentBoxWidthUnit || "px"}
        unitOptions={CUSTOM_WIDTH_CONFIG.unitOptions}
        minMaxByUnit={CUSTOM_WIDTH_CONFIG.minMaxByUnit}
        defaultValues={CUSTOM_WIDTH_CONFIG.defaultValues}
        onValueChange={(value, unit) =>
          actions.setProp((draft) => {
            const { min, max } = unit === "%" ? { min: 10, max: 100 } : { min: 100, max: 1600 };
            const clamped = Math.min(max, Math.max(min, Math.round(value)));
            draft.contentBoxWidth = clamped;
            draft.contentBoxWidthUnit = unit;
          })
        }
        onUnitChange={(unit, defaultValue) =>
          actions.setProp((draft) => {
            draft.contentBoxWidthUnit = unit;
            draft.contentBoxWidth = defaultValue;
          })
        }
        showReset={Boolean(props.contentBoxWidth && props.contentBoxWidth !== (props.contentBoxWidthUnit === "%" ? 100 : 1200))}
        onReset={() =>
          actions.setProp((draft) => {
            draft.contentBoxWidth = draft.contentBoxWidthUnit === "%" ? 100 : 1200;
          })
        }
      />
    );
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {renderContainerWidthButtons()}
      {renderCustomWidthControl()}
      {renderContentWidthButtons()}
      {renderContentBoxWidth()}

    </div>
  );
};


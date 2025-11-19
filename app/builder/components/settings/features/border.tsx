"use client";

import React from "react";
import { ResponsiveSpacingControl, ColorInput } from "../shared/controls";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

/**
 * Collects border style, width, colors, and radius into one reusable feature.
 * Hidden automatically when the border style is set to none.
 */

export interface BorderFeatureProps {
  borderStyle?: string;
  borderWidthResponsive?: ResponsiveValue;
  borderColorResponsive?: ResponsiveValue;
  borderColorHoverResponsive?: ResponsiveValue;
  borderRadiusResponsive?: ResponsiveValue;
}

export interface BorderControlsProps<TProps extends BorderFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const BorderStyleControl = <TProps extends BorderFeatureProps>({ props, actions, controlId = "border-style" }: BorderControlsProps<TProps>) => {
  const baseId = `border-style-${controlId}`;
  const options = ["none", "solid", "dotted", "dashed", "double", "groove", "inset", "outset", "ridge"];

  return (
    <section id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-select`}>
          Border Style
        </label>
        <select
          id={`${baseId}-select`}
          value={props.borderStyle || "none"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.borderStyle = event.target.value;
            })
          }
          className="w-32 px-2 py-2 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

const BorderWidthControl = <TProps extends BorderFeatureProps>({ props, actions, controlId = "border-width" }: BorderControlsProps<TProps>) => {
  if (!props.borderStyle || props.borderStyle === "none") return null;

  return (
    <ResponsiveSpacingControl
      controlId={controlId}
      label="Border Width"
      value={props.borderWidthResponsive as ResponsiveRecord | undefined}
      onChange={(value) =>
        actions.setProp((draft) => {
          draft.borderWidthResponsive = value as ResponsiveValue;
        })
      }
      unitOptions={["px"]}
      defaultValue={1}
    />
  );
};

const BorderColorControls = <TProps extends BorderFeatureProps>({ props, actions, controlId = "border-color" }: BorderControlsProps<TProps>) => {
  if (!props.borderStyle || props.borderStyle === "none") return null;

  const baseId = `border-color-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput
        label="Border Color"
        value={props.borderColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.borderColorResponsive = value as ResponsiveValue;
          })
        }
        placeholder="#000000"
        responsive
      />
      <ColorInput
        label="Hover Border Color"
        value={props.borderColorHoverResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.borderColorHoverResponsive = value as ResponsiveValue;
          })
        }
        placeholder="#333333"
        responsive
      />
    </section>
  );
};

const BorderRadiusControl = <TProps extends BorderFeatureProps>({ props, actions, controlId = "border-radius" }: BorderControlsProps<TProps>) => (
  <ResponsiveSpacingControl
    controlId={controlId}
    label="Border Radius"
    value={props.borderRadiusResponsive as ResponsiveRecord | undefined}
    onChange={(value) =>
      actions.setProp((draft) => {
        draft.borderRadiusResponsive = value as ResponsiveValue;
      })
    }
    unitOptions={["px", "%"]}
    defaultValue={0}
  />
);

export const BorderControls = <TProps extends BorderFeatureProps>({ props, actions, controlId = "border" }: BorderControlsProps<TProps>) => {
  const baseId = `border-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <BorderStyleControl props={props} actions={actions} controlId={`${controlId}-style`} />
      <BorderWidthControl props={props} actions={actions} controlId={`${controlId}-width`} />
      <BorderColorControls props={props} actions={actions} controlId={`${controlId}-color`} />
      <BorderRadiusControl props={props} actions={actions} controlId={`${controlId}-radius`} />
    </div>
  );
};

"use client";

import React from "react";
import { ResponsiveSelectControl } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";

export interface HeadingSeparatorFeatureProps {
  separatorStyle?: "none" | "solid" | "double" | "dashed" | "dotted";
}

export interface HeadingSeparatorControlsProps<TProps extends HeadingSeparatorFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const SEPARATOR_STYLE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "double", label: "Double" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
];

export const HeadingSeparatorControls = <TProps extends HeadingSeparatorFeatureProps>({
  props,
  actions,
  controlId = "heading-separator",
}: HeadingSeparatorControlsProps<TProps>) => {
  const baseId = `heading-separator-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <ResponsiveSelectControl
        controlId={`${baseId}-style`}
        label="Style"
        value={{ desktop: props.separatorStyle || "none" } as any}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.separatorStyle = value as "none" | "solid" | "double" | "dashed" | "dotted";
          })
        }
        options={SEPARATOR_STYLE_OPTIONS}
        variant="inline"
        layout="select"
      />
    </div>
  );
};


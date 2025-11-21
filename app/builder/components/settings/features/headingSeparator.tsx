"use client";

import React from "react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
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
  const { getResponsiveValue } = useResponsive();

  return (
    <div id={baseId} data-component-id={baseId}>
      <ResponsiveSelectControl
        controlId={`${baseId}-style`}
        label="Style"
        value={{ desktop: props.separatorStyle || "none" } as any}
        onChange={(value) => {
          // Extract the actual value from the responsive record
          const styleValue = getResponsiveValue(value as any, "none") as "none" | "solid" | "double" | "dashed" | "dotted";
          actions.setProp((draft) => {
            draft.separatorStyle = styleValue;
          });
        }}
        options={SEPARATOR_STYLE_OPTIONS}
        variant="inline"
        layout="select"
        defaultValue="none"
      />
    </div>
  );
};


"use client";

import React from "react";
import { AlignmentIconControl } from "../shared/controls/AlignmentIconControl";
import { SelectControl } from "../shared/controls/SelectControl";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface HeadingContentFeatureProps {
  textAlign?: string;
  textAlignResponsive?: ResponsiveValue;
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  headingWrapper?: "div" | "header";
}

export interface HeadingContentControlsProps<TProps extends HeadingContentFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const HEADING_TAG_OPTIONS = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
  { value: "p", label: "P" },
  { value: "div", label: "Div" },
];

const WRAPPER_OPTIONS = [
  { value: "div", label: "Div" },
  { value: "header", label: "Header" },
];

export const HeadingContentControls = <TProps extends HeadingContentFeatureProps>({
  props,
  actions,
  controlId = "heading-content",
}: HeadingContentControlsProps<TProps>) => {
  const baseId = `heading-content-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Alignment */}
      <AlignmentIconControl
        controlId={`${baseId}-align`}
        label="Alignment"
        value={props.textAlignResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textAlignResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.textAlign ?? "left";
            draft.textAlign = fallback;
          })
        }
        defaultValue="left"
      />

      {/* Heading Tag */}
      <SelectControl
        controlId={`${baseId}-tag`}
        label="Heading Tag"
        value={props.headingTag || "h2"}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingTag = value as "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
          })
        }
        options={HEADING_TAG_OPTIONS}
      />

      {/* Heading Wrapper */}
      <SelectControl
        controlId={`${baseId}-wrapper`}
        label="Heading Wrapper"
        value={props.headingWrapper || "div"}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.headingWrapper = value as "div" | "header";
          })
        }
        options={WRAPPER_OPTIONS}
      />
    </div>
  );
};


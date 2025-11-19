"use client";

import React from "react";
import { AlignmentIconControl } from "../shared/controls/AlignmentIconControl";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

export interface TextGeneralFeatureProps {
  htmlTag?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  textAlign?: "left" | "center" | "right" | "justify";
  textAlignResponsive?: ResponsiveValue;
}

export interface TextGeneralControlsProps<TProps extends TextGeneralFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const TAG_OPTIONS = [
  { value: "div", label: "div" },
  { value: "p", label: "p" },
  { value: "span", label: "span" },
  { value: "h1", label: "h1" },
  { value: "h2", label: "h2" },
  { value: "h3", label: "h3" },
  { value: "h4", label: "h4" },
  { value: "h5", label: "h5" },
  { value: "h6", label: "h6" },
];


export const TextGeneralControls = <TProps extends TextGeneralFeatureProps>({
  props,
  actions,
  controlId = "text-general",
}: TextGeneralControlsProps<TProps>) => {
  const baseId = `text-general-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* HTML Tag */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Tag</label>
        <select
          id={`${baseId}-tag`}
          value={props.htmlTag || "p"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.htmlTag = event.target.value as "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
            })
          }
          className="w-32 px-2 py-2 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TAG_OPTIONS.map((tag) => (
            <option key={tag.value} value={tag.value}>
              {tag.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Alignment */}
      <AlignmentIconControl
        controlId={`${baseId}-align`}
        label="Alignment"
        value={props.textAlignResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textAlignResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as string | undefined) ?? (record.tablet as string | undefined) ?? (record.mobile as string | undefined) ?? draft.textAlign ?? "left";
            draft.textAlign = fallback as "left" | "center" | "right" | "justify";
          })
        }
        defaultValue="left"
      />
    </div>
  );
};


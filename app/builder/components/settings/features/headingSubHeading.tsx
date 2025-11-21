"use client";

import React from "react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { ResponsiveSelectControl } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";

export interface HeadingSubHeadingFeatureProps {
  enableSubHeading?: boolean;
  subHeadingPosition?: "above" | "below";
  subHeading?: string;
}

export interface HeadingSubHeadingControlsProps<TProps extends HeadingSubHeadingFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const POSITION_OPTIONS = [
  { value: "below", label: "Below Heading" },
  { value: "above", label: "Above Heading" },
];

export const HeadingSubHeadingControls = <TProps extends HeadingSubHeadingFeatureProps>({
  props,
  actions,
  controlId = "heading-sub-heading",
}: HeadingSubHeadingControlsProps<TProps>) => {
  const baseId = `heading-sub-heading-${controlId}`;
  const { getResponsiveValue } = useResponsive();

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {/* Enable Sub Heading Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Enable Sub Heading</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-enable`}
            type="checkbox"
            checked={props.enableSubHeading || false}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.enableSubHeading = event.target.checked;
                if (!event.target.checked) {
                  draft.subHeading = "";
                }
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Position */}
      {props.enableSubHeading && (
        <ResponsiveSelectControl
          controlId={`${baseId}-position`}
          label="Position"
          value={{ desktop: props.subHeadingPosition || "below" } as any}
          onChange={(value) => {
            // Extract the actual value from the responsive record
            const positionValue = getResponsiveValue(value as any, "below") as "above" | "below";
            actions.setProp((draft) => {
              draft.subHeadingPosition = positionValue;
            });
          }}
          options={POSITION_OPTIONS}
          variant="inline"
          layout="select"
        />
      )}
    </div>
  );
};


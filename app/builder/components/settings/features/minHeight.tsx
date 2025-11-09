"use client";

import React, { useEffect } from "react";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import { ResponsiveNumberInput } from "../shared/controls";
import type { ResponsiveRecord } from "../shared/types/responsive";

/**
 * Toggle + slider for enforcing a minimum height on the component.
 */

export interface MinHeightFeatureProps {
  enableMinHeight?: boolean;
  minHeight?: number | null;
  minHeightUnit?: string;
  minHeightResponsive?: ResponsiveValue;
}

export interface MinHeightControlsProps<TProps extends MinHeightFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const MinHeightControls = <TProps extends MinHeightFeatureProps>({ props, actions, controlId = "min-height" }: MinHeightControlsProps<TProps>) => {
  const baseId = `min-height-${controlId}`;

  useEffect(() => {
    if (!props.enableMinHeight) return;

    const responsive = props.minHeightResponsive;
    const needsDesktop = !responsive || responsive.desktop === undefined;
    const unitMap = responsive?.unit || {};
    const needsUnitDesktop = !unitMap.desktop;

    if (!needsDesktop && !needsUnitDesktop) return;

    actions.setProp((draft) => {
      const nextResponsive: ResponsiveValue = { ...(draft.minHeightResponsive as ResponsiveValue | undefined) };
      const fallback = draft.minHeight ?? 450;
      nextResponsive.desktop ??= fallback;
      nextResponsive.unit = {
        ...(nextResponsive.unit || {}),
        desktop: nextResponsive.unit?.desktop ?? draft.minHeightUnit ?? "px",
      };
      draft.minHeightResponsive = nextResponsive;
    });
  }, [actions, props.enableMinHeight, props.minHeightResponsive, props.minHeight, props.minHeightUnit]);

  const responsiveValue = props.minHeightResponsive as ResponsiveRecord | undefined;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Minimum Height</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-toggle`}
            type="checkbox"
            checked={props.enableMinHeight || false}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.enableMinHeight = event.target.checked;
                if (!event.target.checked) {
                  draft.minHeight = null;
                  draft.minHeightResponsive = undefined;
                } else {
                  const fallback = draft.minHeight ?? 450;
                  draft.minHeight = fallback;
                  draft.minHeightUnit = draft.minHeightUnit ?? "px";
                  draft.minHeightResponsive = {
                    desktop: fallback,
                    unit: { desktop: draft.minHeightUnit ?? "px" },
                  };
                }
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {props.enableMinHeight && (
        <ResponsiveNumberInput
          controlId={`${baseId}-value`}
          label="Min Height Value"
          value={responsiveValue}
          onChange={(value) =>
            actions.setProp((draft) => {
              draft.minHeightResponsive = value as ResponsiveValue;
              const record = value as ResponsiveRecord;
              const fallback = (record.desktop as number | undefined) ?? draft.minHeight ?? 450;
              draft.minHeight = fallback;
              const unitRecord = (record.unit as Record<string, string>) || {};
              draft.minHeightUnit = unitRecord.desktop ?? draft.minHeightUnit ?? "px";
            })
          }
          unitOptions={["px", "vh"]}
          defaultValue={450}
          minMaxByUnit={{
            px: { min: 20, max: 1000 },
            vh: { min: 10, max: 100 },
          }}
        />
      )}
    </section>
  );
};

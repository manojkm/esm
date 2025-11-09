"use client";

import React from "react";
import type { ComponentControlActions } from "../shared/types";

/**
 * Toggle + slider for enforcing a minimum height on the component.
 */

export interface MinHeightFeatureProps {
  enableMinHeight?: boolean;
  minHeight?: number | null;
  minHeightUnit?: string;
}

export interface MinHeightControlsProps<TProps extends MinHeightFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const MinHeightControls = <TProps extends MinHeightFeatureProps>({ props, actions, controlId = "min-height" }: MinHeightControlsProps<TProps>) => {
  const baseId = `min-height-${controlId}`;

  const rangeConfig = props.minHeightUnit === "vh" ? { min: 10, max: 100, fallback: 50 } : { min: 20, max: 1000, fallback: 20 };
  const currentValue = props.minHeight ?? rangeConfig.fallback;

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
                } else {
                  draft.minHeight = rangeConfig.fallback;
                }
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {props.enableMinHeight && (
        <div className="flex items-center gap-2">
          <input
            id={`${baseId}-range`}
            type="range"
            min={rangeConfig.min}
            max={rangeConfig.max}
            value={currentValue}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.minHeight = parseInt(event.target.value, 10);
              })
            }
            className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            id={`${baseId}-number`}
            type="number"
            value={currentValue}
            onChange={(event) =>
              actions.setProp((draft) => {
                const numeric = parseInt(event.target.value, 10);
                draft.minHeight = Number.isFinite(numeric) ? numeric : rangeConfig.fallback;
              })
            }
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
          />
        </div>
      )}
    </section>
  );
};


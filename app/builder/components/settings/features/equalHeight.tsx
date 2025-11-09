"use client";

import React from "react";
import type { ComponentControlActions } from "../shared/types";

/**
 * Simple toggle that syncs flex children to equal heights.
 */

export interface EqualHeightFeatureProps {
  equalHeight?: boolean;
}

export interface EqualHeightToggleProps<TProps extends EqualHeightFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const EqualHeightToggle = <TProps extends EqualHeightFeatureProps>({ props, actions, controlId = "equal-height" }: EqualHeightToggleProps<TProps>) => {
  const baseId = `equal-height-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-toggle`}>
          Equal Height
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-toggle`}
            type="checkbox"
            checked={props.equalHeight || false}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.equalHeight = event.target.checked;
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <p className="text-xs text-gray-500">Enabling this will change the Align Items value to Stretch.</p>
    </section>
  );
};


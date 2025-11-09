"use client";

import React from "react";
import type { ComponentControlActions } from "../shared/types";
import { InfoNotice } from "../shared/components";

/**
 * Feature that toggles visibility per breakpoint for the rendered component.
 */

export interface ResponsiveFeatureProps {
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnLandscapeMobile?: boolean;
  hideOnMobile?: boolean;
}

export interface ResponsiveControlsProps<TProps extends ResponsiveFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

type VisibilityAccessor = keyof ResponsiveFeatureProps;

export const ResponsiveControls = <TProps extends ResponsiveFeatureProps>({ props, actions, controlId = "responsive" }: ResponsiveControlsProps<TProps>) => {
  const baseId = `responsive-controls-${controlId}`;

  const visibilityToggles: Array<{ id: string; label: string; helper: string; accessor: VisibilityAccessor }> = [
    { id: "desktop", label: "Hide on Desktop", helper: "Hide on screens 1024px and above", accessor: "hideOnDesktop" },
    { id: "tablet", label: "Hide on Tablet", helper: "Hide on screens 768px to 1023px", accessor: "hideOnTablet" },
    { id: "landscape", label: "Hide on Landscape Mobile", helper: "Hide on screens 480px to 767px", accessor: "hideOnLandscapeMobile" },
    { id: "mobile", label: "Hide on Mobile", helper: "Hide on screens below 480px", accessor: "hideOnMobile" },
  ];

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {visibilityToggles.map(({ id, label, helper, accessor }) => (
        <div key={id} id={`${baseId}-${id}`} data-component-id={`${baseId}-${id}`}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-${id}-toggle`}>
              {label}
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id={`${baseId}-${id}-toggle`}
                type="checkbox"
                checked={Boolean(props[accessor])}
                onChange={(event) =>
                  actions.setProp((draft) => {
                    draft[accessor] = event.target.checked;
                  })
                }
                className="sr-only peer"
              />
              <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'></div>
            </label>
          </div>
          <p className="text-xs text-gray-500">{helper}</p>
        </div>
      ))}

      <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
    </div>
  );
};


"use client";

import React from "react";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";

/**
 * Shared UI for managing data-* attributes and aria-label.
 */

export interface AttributesFeatureProps {
  dataAttributes?: string;
  ariaLabel?: string;
}

export interface AttributesControlsProps<TProps extends AttributesFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const AttributesControls = <TProps extends AttributesFeatureProps>({ props, actions, controlId = "attributes" }: AttributesControlsProps<TProps>) => {
  const baseId = `attribute-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-data`}>
          Data Attributes
        </label>
        <textarea
          id={`${baseId}-data`}
          value={props.dataAttributes || ""}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.dataAttributes = event.target.value;
            })
          }
          placeholder={"data-scroll=&quot;true&quot;\n" + "data-animation=&quot;fade&quot;"}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">One attribute per line (e.g., data-scroll=&quot;true&quot;)</p>
      </div>

      <div className="space-y-1.5">
        <div className={INLINE_ROW_CLASS}>
          <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-aria`}>
            ARIA Label
          </label>
          <input
            id={`${baseId}-aria`}
            type="text"
            value={props.ariaLabel || ""}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.ariaLabel = event.target.value;
              })
            }
            placeholder="Descriptive label for screen readers"
            className={INLINE_FIELD_CLASS}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Accessibility label for screen readers</p>
      </div>
    </div>
  );
};


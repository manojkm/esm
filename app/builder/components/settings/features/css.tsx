"use client";

import React from "react";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";

/**
 * Simple feature for editing custom class and id attributes.
 */

export interface CssFeatureProps {
  className?: string;
  cssId?: string;
}

export interface CssControlsProps<TProps extends CssFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const CssControls = <TProps extends CssFeatureProps>({ props, actions, controlId = "css" }: CssControlsProps<TProps>) => {
  const baseId = `css-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div className="space-y-1.5">
        <div className={INLINE_ROW_CLASS}>
          <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-classes`}>
            CSS Classes
          </label>
          <input
            id={`${baseId}-classes`}
            type="text"
            value={props.className || ""}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.className = event.target.value;
              })
            }
            placeholder="custom-class another-class"
            className={INLINE_FIELD_CLASS}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Add custom CSS classes separated by spaces</p>
      </div>

      <div className="space-y-1.5">
        <div className={INLINE_ROW_CLASS}>
          <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-id`}>
            CSS ID
          </label>
          <input
            id={`${baseId}-id`}
            type="text"
            value={props.cssId || ""}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.cssId = event.target.value;
              })
            }
            placeholder="unique-id"
            className={INLINE_FIELD_CLASS}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Unique identifier for this element</p>
      </div>
    </div>
  );
};


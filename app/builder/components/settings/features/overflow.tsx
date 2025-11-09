"use client";

import React from "react";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";

/**
 * Standard select for configuring CSS overflow behaviour.
 */

export interface OverflowFeatureProps {
  overflow?: string;
}

export interface OverflowSelectProps<TProps extends OverflowFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const OVERFLOW_OPTIONS = [
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
  { value: "auto", label: "Auto" },
  { value: "scroll", label: "Scroll" },
];

export const OverflowSelect = <TProps extends OverflowFeatureProps>({ props, actions, controlId = "overflow" }: OverflowSelectProps<TProps>) => {
  const baseId = `overflow-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
          Overflow
        </label>
        <select
          id={`${baseId}-select`}
          value={props.overflow || "visible"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.overflow = event.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
        >
          {OVERFLOW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";

/**
 * Dropdown to pick the HTML tag used when rendering the component.
 */

export interface HtmlTagFeatureProps {
  htmlTag?: string;
}

export interface HtmlTagSelectProps<TProps extends HtmlTagFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const TAG_OPTIONS = ["div", "section", "article", "header", "footer", "main", "aside", "nav"];

export const HtmlTagSelect = <TProps extends HtmlTagFeatureProps>({ props, actions, controlId = "html-tag" }: HtmlTagSelectProps<TProps>) => {
  const baseId = `html-tag-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
          HTML Tag
        </label>
        <select
          id={`${baseId}-select`}
          value={props.htmlTag || "div"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.htmlTag = event.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
        >
          {TAG_OPTIONS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};


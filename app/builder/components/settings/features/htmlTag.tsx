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
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-select`}>
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
          className="w-32 px-2 py-2 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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


"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNode, useEditor } from "@craftjs/core";

interface RenderNodeProps {
  render: React.ReactElement;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  const {
    id,
    connectors: { connect, drag },
    selected,
    name,
  } = useNode((node) => ({
    selected: node.events.selected,
    name: node.data.displayName || node.data.name,
  }));

  const { enabled, query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const isRoot = query.node(id).isRoot();

  // Don't show handles if editor is disabled or if it's the root node
  if (!enabled || isRoot) {
    return render;
  }

  return (
    <>
      {/* <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`
        relative ok
        ${selected ? "ring-2 ring-blue-500 ring-offset-0" : "hover:ring-1 hover:ring-blue-300"}
        transition-all duration-200
      `}
      style={{ outline: "none", display: "contents" }}
    > */}
      {render}
      {/* Selection Indicator */}
      {/* {selected && <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10 pointer-events-none">{name}</div>} */}
      {/* </div> */}
    </>
  );
};

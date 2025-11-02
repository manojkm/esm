"use client";

import { useNode } from "@craftjs/core";

export const Button = ({ text = "Button", color = "bg-blue-500" }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  return (
    <div ref={(ref) => connect(drag(ref))} className={`inline-block ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <button className={`${color} text-white px-4 py-2 rounded hover:opacity-80`}>
        {text}
      </button>
    </div>
  );
};
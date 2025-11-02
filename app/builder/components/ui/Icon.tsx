"use client";

import { useNode } from "@craftjs/core";

export const Icon = ({ icon = "⭐", size = "text-2xl", color = "text-gray-700" }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  return (
    <div ref={(ref) => connect(drag(ref))} className={`inline-block ${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-gray-300 hover:border-blue-500'} p-2`}>
      <span className={`${size} ${color}`}>{icon}</span>
    </div>
  );
};
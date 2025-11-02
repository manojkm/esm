"use client";

import { useNode } from "@craftjs/core";

export const Text = ({ text = "Click to edit", fontSize = "16" }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  return (
    <div 
      ref={(ref) => connect(drag(ref))} 
      className={`p-2 cursor-pointer ${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-gray-300 hover:border-blue-500'}`}
    >
      <p 
        contentEditable 
        suppressContentEditableWarning 
        className="text-gray-900 outline-none"
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </p>
    </div>
  );
};
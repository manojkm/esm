"use client";

import { useNode } from "@craftjs/core";

export const Heading = ({ text = "Heading", level = "h2", color = "text-gray-900", size = "text-2xl" }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  const HeadingTag = level;

  return (
    <div ref={(ref) => connect(drag(ref))} className={`${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-gray-300 hover:border-blue-500'} p-2`}>
      <HeadingTag 
        contentEditable 
        suppressContentEditableWarning 
        className={`${color} ${size} font-bold outline-none`}
      >
        {text}
      </HeadingTag>
    </div>
  );
};
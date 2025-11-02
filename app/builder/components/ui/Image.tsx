"use client";

import { useNode } from "@craftjs/core";

export const Image = ({ src = "https://via.placeholder.com/300x200", alt = "Image", width = "300", height = "200" }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  return (
    <div ref={(ref) => connect(drag(ref))} className={`${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-gray-300 hover:border-blue-500'} p-1`}>
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className="max-w-full h-auto object-cover"
      />
    </div>
  );
};
"use client";

import { useNode } from "@craftjs/core";

export const Video = ({ src = "https://www.w3schools.com/html/mov_bbb.mp4", width = "400", height = "300" }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  return (
    <div ref={(ref) => connect(drag(ref))} className={`${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-gray-300 hover:border-blue-500'} p-1`}>
      <video 
        src={src} 
        width={width} 
        height={height}
        controls
        className="max-w-full h-auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
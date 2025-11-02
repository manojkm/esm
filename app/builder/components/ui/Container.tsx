"use client";

import { useNode } from "@craftjs/core";

export const Container = ({ 
  children, 
  padding = 4, 
  margin = 0,
  background = "bg-gray-50", 
  layout = "block", // block, flex, grid
  flexDirection = "row", // row, column
  justifyContent = "start", // start, center, end, between, around
  alignItems = "start", // start, center, end, stretch
  gap = 2,
  gridCols = 2,
  width = "full", // full, auto, custom
  height = "auto" // auto, full, custom
}) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected
  }));

  const getLayoutClasses = () => {
    let classes = [];
    
    // Layout type
    if (layout === "flex") {
      classes.push("flex");
      classes.push(`flex-${flexDirection}`);
      classes.push(`justify-${justifyContent}`);
      classes.push(`items-${alignItems}`);
      classes.push(`gap-${gap}`);
    } else if (layout === "grid") {
      classes.push("grid");
      classes.push(`grid-cols-${gridCols}`);
      classes.push(`gap-${gap}`);
    }
    
    // Spacing
    classes.push(`p-${padding}`);
    classes.push(`m-${margin}`);
    
    // Dimensions
    classes.push(`w-${width}`);
    if (height === "full") classes.push("h-full");
    else if (height === "auto") classes.push("min-h-[100px]");
    
    return classes.join(" ");
  };

  return (
    <div 
      ref={(ref) => connect(drag(ref))} 
      className={`${background} ${getLayoutClasses()} ${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-gray-300 hover:border-blue-500'}`}
    >
      {children}
    </div>
  );
};
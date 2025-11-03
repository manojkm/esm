"use client";

import React, { useState, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { ContainerLayoutPicker } from "./ContainerLayoutPicker";

// Container component for page builder

export const Container = ({ children, padding = 20, margin = 0, backgroundColor = "#ffffff", borderRadius = 0, className = "", showLayoutPicker = false, layout = "block", gap = 4, selectedLayout = null, flexBasis = null, containerWidth = "full", contentWidth = "boxed", contentBoxWidth = 1400, contentBoxWidthUnit = "px", customWidth = 1200, customWidthUnit = "px", minHeight = 450, minHeightUnit = "px", enableMinHeight = false, equalHeight = false, htmlTag = "div", overflow = "visible" }) => {
  const {
    connectors: { connect, drag },
    selected,
    actions,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const [showPicker, setShowPicker] = useState(showLayoutPicker);
  
  // Check if this is a child container (has flexBasis prop)
  const isChildContainer = flexBasis !== null && flexBasis !== undefined;

  const handleLayoutSelect = (selectedLayout) => {
    // Update container to flex layout
    actions.setProp((props) => {
      props.layout = "flex";
      props.gap = 4;
      props.className = "flex gap-4";
      props.selectedLayout = selectedLayout;
    });

    setShowPicker(false);
  };

  const containerStyle = {
    padding: `${padding}px`,
    margin: `${margin}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    minHeight: isChildContainer ? "50px" : (enableMinHeight && minHeight ? `${minHeight}${minHeightUnit}` : "50px"),
    gap: layout === "flex" ? `${gap * 4}px` : undefined,
    flex: flexBasis ? `0 0 ${flexBasis}%` : undefined,
    width: "100%",
    maxWidth: isChildContainer ? undefined : (containerWidth === "custom" ? `${customWidth}${customWidthUnit}` : containerWidth === "boxed" ? "1400px" : undefined),
    marginLeft: isChildContainer ? undefined : (containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined),
    marginRight: isChildContainer ? undefined : (containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined),
    alignItems: isChildContainer ? undefined : (equalHeight && layout === "flex" ? "stretch" : undefined),
    overflow: isChildContainer ? undefined : overflow,
  };

  const contentWrapperStyle = {
    maxWidth: isChildContainer ? undefined : (containerWidth === "full" && contentWidth === "boxed" ? `${contentBoxWidth}${contentBoxWidthUnit}` : undefined),
    marginLeft: isChildContainer ? undefined : (containerWidth === "full" && contentWidth === "boxed" ? "auto" : undefined),
    marginRight: isChildContainer ? undefined : (containerWidth === "full" && contentWidth === "boxed" ? "auto" : undefined),
    width: "100%",
    height: isChildContainer ? undefined : (equalHeight && layout === "flex" ? "100%" : undefined),
  };

  const ContainerTag = isChildContainer ? "div" : htmlTag;

  return (
    <ContainerTag
      ref={(ref) => connect(drag(ref))}
      className={`
        relative
        ${selected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"}
        transition-all duration-200
        ${className}
      `}
      style={containerStyle}
    >
      {/* Selection Indicator */}
      {selected && <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10">Container</div>}

      {/* Content Wrapper for boxed content within full-width container */}
      <div className={`${layout === "flex" ? "flex" : ""}`} style={contentWrapperStyle}>
        {/* Auto-generate columns based on selected layout */}
        {!children && selectedLayout && selectedLayout.cols.map((width, index) => <Element key={index} id={`column_${index}_${width}`} is={Container} padding={15} backgroundColor="#f8fafc" borderRadius={6} className="border border-gray-200" flexBasis={width} canvas />)}

        {/* Regular drop zone */}
        {!children && !selectedLayout && <div className="flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-md h-20">Drop components here</div>}

        {children}
      </div>

      {/* Layout Picker Modal */}
      {showPicker && <ContainerLayoutPicker onSelect={handleLayoutSelect} onClose={() => setShowPicker(false)} />}
    </ContainerTag>
  );
};

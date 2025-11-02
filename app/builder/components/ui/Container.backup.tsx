"use client";

import React, { useState, useEffect } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ContainerLayoutPicker } from "./ContainerLayoutPicker";

export const Container = ({ 
  children,
  showLayoutPicker = false,
  style = {},
  // Layout
  layout = "block", // block, flex, grid
  flexDirection = "row",
  justifyContent = "start",
  alignItems = "start",
  gap = 2,
  gridCols = 2,
  // Dimensions
  width = "full", // full, boxed, custom
  maxWidth = "1200",
  height = "auto", // auto, min-height, full, custom
  minHeight = "100",
  customHeight = "400",
  // Spacing
  paddingTop = 20,
  paddingRight = 20,
  paddingBottom = 20,
  paddingLeft = 20,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  // Background
  backgroundType = "color", // color, gradient, image
  backgroundColor = "#ffffff",
  gradientColor1 = "#667eea",
  gradientColor2 = "#764ba2",
  gradientDirection = "135",
  backgroundImage = "",
  backgroundSize = "cover",
  backgroundPosition = "center",
  backgroundRepeat = "no-repeat",
  // Border
  borderWidth = 0,
  borderStyle = "solid",
  borderColor = "#e5e7eb",
  borderRadius = 0,
  // Shadow
  boxShadow = "none",
  shadowColor = "rgba(0,0,0,0.1)",
  shadowX = 0,
  shadowY = 4,
  shadowBlur = 6,
  shadowSpread = 0,
  // Advanced
  customClass = "",
  zIndex = "auto",
  overflow = "visible",
  // Internal
  flex
}) => {
  const { connectors: { connect, drag }, selected, actions, id, layoutToCreate } = useNode((state) => ({
    selected: state.events.selected,
    layoutToCreate: state.data.props.selectedLayout
  }));
  
  const { actions: editorActions } = useEditor();
  const [showPicker, setShowPicker] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Ensure client-side rendering for modal
  useEffect(() => {
    setIsClient(true);
    if (showLayoutPicker) {
      setShowPicker(true);
    }
  }, [showLayoutPicker]);
  
  // Clear the selectedLayout after it's processed
  useEffect(() => {
    if (layoutToCreate && isClient) {
      // Clear the selectedLayout after layout is applied
      setTimeout(() => {
        actions.setProp((props) => {
          delete props.selectedLayout;
        });
      }, 100);
    }
  }, [layoutToCreate, actions, isClient]);
  
  const handleLayoutSelect = (layout) => {
    // Update current container to flex row layout with grid-like behavior
    actions.setProp((props) => {
      props.layout = "flex";
      props.flexDirection = "row";
      props.gap = 4;
      props.paddingTop = 20;
      props.paddingRight = 20;
      props.paddingBottom = 20;
      props.paddingLeft = 20;
      props.backgroundColor = "#f9fafb";
      props.borderWidth = 2;
      props.borderColor = "#e5e7eb";
      props.borderStyle = "dashed";
      props.minHeight = 200;
      props.selectedLayout = layout; // Store selected layout for reference
    });
    
    setShowPicker(false);
  };

  const getContainerStyles = () => {
    let styles = { ...style };
    
    // Dimensions
    if (width === "boxed") {
      styles.maxWidth = `${maxWidth}px`;
      styles.marginLeft = "auto";
      styles.marginRight = "auto";
    } else if (width === "custom") {
      styles.width = `${maxWidth}px`;
    }
    
    if (height === "min-height") {
      styles.minHeight = `${minHeight}px`;
    } else if (height === "full") {
      styles.height = "100vh";
    } else if (height === "custom") {
      styles.height = `${customHeight}px`;
    }
    
    // Spacing
    styles.paddingTop = `${paddingTop}px`;
    styles.paddingRight = `${paddingRight}px`;
    styles.paddingBottom = `${paddingBottom}px`;
    styles.paddingLeft = `${paddingLeft}px`;
    styles.marginTop = `${marginTop}px`;
    styles.marginRight = `${marginRight}px`;
    styles.marginBottom = `${marginBottom}px`;
    styles.marginLeft = `${marginLeft}px`;
    
    // Background
    if (backgroundType === "color") {
      styles.backgroundColor = backgroundColor;
    } else if (backgroundType === "gradient") {
      styles.background = `linear-gradient(${gradientDirection}deg, ${gradientColor1}, ${gradientColor2})`;
    } else if (backgroundType === "image" && backgroundImage) {
      styles.backgroundImage = `url(${backgroundImage})`;
      styles.backgroundSize = backgroundSize;
      styles.backgroundPosition = backgroundPosition;
      styles.backgroundRepeat = backgroundRepeat;
    }
    
    // Border
    if (borderWidth > 0) {
      styles.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
    }
    if (borderRadius > 0) {
      styles.borderRadius = `${borderRadius}px`;
    }
    
    // Shadow
    if (boxShadow === "custom") {
      styles.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`;
    } else if (boxShadow !== "none") {
      const shadows = {
        small: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        large: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      };
      styles.boxShadow = shadows[boxShadow];
    }
    
    // Advanced
    if (zIndex !== "auto") {
      styles.zIndex = zIndex;
    }
    styles.overflow = overflow;
    
    // Flex properties for column layouts
    if (flex) {
      styles.flex = flex;
    }
    
    return styles;
  };

  const getLayoutClasses = () => {
    let classes = [];
    
    // Layout type
    if (layout === "flex") {
      classes.push("flex");
      classes.push(`flex-${flexDirection}`);
      classes.push(`justify-${justifyContent}`);
      classes.push(`items-${alignItems}`);
      if (gap > 0) classes.push(`gap-${gap}`);
    } else if (layout === "grid") {
      classes.push("grid");
      classes.push(`grid-cols-${gridCols}`);
      if (gap > 0) classes.push(`gap-${gap}`);
    }
    
    // Width classes
    if (width === "full") {
      classes.push("w-full");
    }
    
    // Custom class
    if (customClass) {
      classes.push(customClass);
    }
    
    return classes.join(" ");
  };

  const containerClasses = `
    ${getLayoutClasses()}
    ${selected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
    ${!selected ? 'hover:ring-1 hover:ring-blue-300 hover:ring-opacity-50' : ''}
    transition-all duration-200 ease-in-out
    relative
    min-h-[50px]
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      <div 
        ref={(ref) => connect(drag(ref))} 
        className={containerClasses}
        style={getContainerStyles()}
      >
        {/* Selection Indicator */}
        {selected && (
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10">
            Container
          </div>
        )}
        
        {/* Drop Zone Indicator */}
        {!children && !showPicker && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            {layoutToCreate ? (
              <div className="text-center">
                <div className="text-lg mb-2">📐</div>
                <div>Drop containers here to create {layoutToCreate.cols.length} columns</div>
                <div className="text-xs mt-1">Widths: {layoutToCreate.cols.join('% - ')}%</div>
              </div>
            ) : (
              "Drop components here"
            )}
          </div>
        )}
        
        {children}
      </div>
      
      {/* Layout Picker Modal */}
      {isClient && showPicker && (
        <ContainerLayoutPicker
          onSelect={handleLayoutSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
};
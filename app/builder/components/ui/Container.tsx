"use client";

import React, { useState, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { ContainerLayoutPicker } from "./ContainerLayoutPicker";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";

// Container component for page builder with hover functionality

export const Container = ({
  children,
  padding = 10,
  margin = 0,
  paddingTop = null,
  paddingRight = null,
  paddingBottom = null,
  paddingLeft = null,
  paddingUnit = "px",
  marginTop = null,
  marginRight = null,
  marginBottom = null,
  marginLeft = null,
  marginUnit = "px",
  rowGap = 20,
  columnGap = 20,
  rowGapUnit = "px",
  columnGapUnit = "px",
  paddingResponsive,
  marginResponsive,
  rowGapResponsive,
  columnGapResponsive,
  backgroundColor = "#ffffff",
  backgroundColorHover = "#f0f0f0",
  backgroundType = null,
  backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  backgroundGradientHover = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
  backgroundImage = "",
  borderRadius = 0,
  borderTopLeftRadius = null,
  borderTopRightRadius = null,
  borderBottomRightRadius = null,
  borderBottomLeftRadius = null,
  borderRadiusUnit = "px",
  borderStyle = "none",
  borderWidth = 1,
  borderTopWidth = null,
  borderRightWidth = null,
  borderBottomWidth = null,
  borderLeftWidth = null,
  borderColor = "#000000",
  borderColorHover = "#333333",
  boxShadowColor = "rgba(0, 0, 0, 0.1)",
  boxShadowColorHover = "rgba(0, 0, 0, 0.15)",
  boxShadowHorizontal = 0,
  boxShadowVertical = 0,
  boxShadowBlur = 0,
  boxShadowSpread = 0,
  boxShadowPosition = "outset",
  boxShadowHorizontalHover = 0,
  boxShadowVerticalHover = 0,
  boxShadowBlurHover = 0,
  boxShadowSpreadHover = 0,
  boxShadowPositionHover = "outset",
  boxShadowPreset = null,
  textColor = null,
  linkColor = null,
  linkColorHover = null,
  className = "",
  cssId = "",
  dataAttributes = "",
  ariaLabel = "",
  hideOnDesktop = false,
  hideOnTablet = false,
  hideOnLandscapeMobile = false,
  hideOnMobile = false,
  showLayoutPicker = false,
  layout = "block",
  selectedLayout = null,
  flexBasis = null,
  containerWidth = "full",
  contentWidth = "boxed",
  contentBoxWidth = 1200,
  contentBoxWidthUnit = "px",
  customWidth = 1200,
  customWidthUnit = "px",
  minHeight = 450,
  minHeightUnit = "px",
  enableMinHeight = false,
  equalHeight = false,
  htmlTag = "div",
  overflow = "visible",
  flexDirection = "row",
  justifyContent = "flex-start",
  alignItems = "stretch",
  flexWrap = "nowrap",
  alignContent = "stretch",
  position = "default",
  positionTop = null,
  positionRight = null,
  positionBottom = null,
  positionLeft = null,
  positionTopUnit = "px",
  positionRightUnit = "px",
  positionBottomUnit = "px",
  positionLeftUnit = "px",
  zIndex = null,
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));
  
  const { getResponsiveValue } = useResponsive();

  const [showPicker, setShowPicker] = useState(showLayoutPicker);

  // Check if this is a child container (has flexBasis prop)
  const isChildContainer = flexBasis !== null && flexBasis !== undefined;

  const handleLayoutSelect = (selectedLayout) => {
    // Set layout based on column count: block for single, flex for multi-column
    actions.setProp((props) => {
      props.layout = selectedLayout.cols.length === 1 ? "block" : "flex";
      props.selectedLayout = selectedLayout;
    });

    setShowPicker(false);
  };

  // Check if we need content wrapper for boxed content
  const needsContentWrapper = !isChildContainer && containerWidth === "full" && contentWidth === "boxed";

  // Calculate responsive padding values
  const getResponsivePadding = () => {
    if (paddingResponsive) {
      const top = getResponsiveValue(paddingResponsive.top || {}, paddingTop ?? padding);
      const right = getResponsiveValue(paddingResponsive.right || {}, paddingRight ?? padding);
      const bottom = getResponsiveValue(paddingResponsive.bottom || {}, paddingBottom ?? padding);
      const left = getResponsiveValue(paddingResponsive.left || {}, paddingLeft ?? padding);
      const unit = getResponsiveValue(paddingResponsive.unit || {}, paddingUnit);
      return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
    }
    return paddingTop !== null || paddingRight !== null || paddingBottom !== null || paddingLeft !== null ? `${paddingTop ?? padding}${paddingUnit} ${paddingRight ?? padding}${paddingUnit} ${paddingBottom ?? padding}${paddingUnit} ${paddingLeft ?? padding}${paddingUnit}` : `${padding}px`;
  };

  // Calculate responsive margin values
  const getResponsiveMargin = () => {
    if (marginResponsive) {
      const top = getResponsiveValue(marginResponsive.top || {}, marginTop ?? margin);
      const right = getResponsiveValue(marginResponsive.right || {}, marginRight ?? margin);
      const bottom = getResponsiveValue(marginResponsive.bottom || {}, marginBottom ?? margin);
      const left = getResponsiveValue(marginResponsive.left || {}, marginLeft ?? margin);
      const unit = getResponsiveValue(marginResponsive.unit || {}, marginUnit);
      return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
    }
    return marginTop !== null || marginRight !== null || marginBottom !== null || marginLeft !== null ? `${marginTop ?? margin}${marginUnit} ${marginRight ?? margin}${marginUnit} ${marginBottom ?? margin}${marginUnit} ${marginLeft ?? margin}${marginUnit}` : `${margin}px`;
  };
  
  // Calculate responsive gap values
  const getResponsiveRowGap = () => {
    if (rowGapResponsive) {
      const value = getResponsiveValue(rowGapResponsive, rowGap);
      const unit = getResponsiveValue(rowGapResponsive.unit || {}, rowGapUnit);
      return `${value}${unit}`;
    }
    return `${rowGap}${rowGapUnit}`;
  };
  
  const getResponsiveColumnGap = () => {
    if (columnGapResponsive) {
      const value = getResponsiveValue(columnGapResponsive, columnGap);
      const unit = getResponsiveValue(columnGapResponsive.unit || {}, columnGapUnit);
      return `${value}${unit}`;
    }
    return `${columnGap}${columnGapUnit}`;
  };
  
  const paddingValue = getResponsivePadding();
  const marginValue = getResponsiveMargin();

  // Generate unique class name for hover styles
  const hoverClassName = `container-hover-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate background styles only when backgroundType is active
  const getBackgroundStyles = () => {
    if (!backgroundType) return {};

    switch (backgroundType) {
      case "color":
        return {
          backgroundColor: backgroundColor,
        };
      case "gradient":
        return {
          background: backgroundGradient,
        };
      case "image":
        return backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {};
      default:
        return {};
    }
  };

  // Calculate border styles
  const getBorderStyles = () => {
    const styles = {};

    // Always apply border radius
    const borderRadiusValue = borderTopLeftRadius !== null || borderTopRightRadius !== null || borderBottomRightRadius !== null || borderBottomLeftRadius !== null ? `${borderTopLeftRadius ?? borderRadius}${borderRadiusUnit} ${borderTopRightRadius ?? borderRadius}${borderRadiusUnit} ${borderBottomRightRadius ?? borderRadius}${borderRadiusUnit} ${borderBottomLeftRadius ?? borderRadius}${borderRadiusUnit}` : `${borderRadius}${borderRadiusUnit}`;

    styles.borderRadius = borderRadiusValue;

    // Only apply border properties if style is not none
    if (borderStyle && borderStyle !== "none") {
      const borderWidthValue = borderTopWidth !== null || borderRightWidth !== null || borderBottomWidth !== null || borderLeftWidth !== null ? `${borderTopWidth ?? borderWidth}px ${borderRightWidth ?? borderWidth}px ${borderBottomWidth ?? borderWidth}px ${borderLeftWidth ?? borderWidth}px` : `${borderWidth}px`;

      styles.borderStyle = borderStyle;
      styles.borderWidth = borderWidthValue;
      styles.borderColor = borderColor;
    }

    return styles;
  };

  // Calculate box shadow styles
  const getBoxShadowStyles = () => {
    if (!boxShadowPreset && boxShadowHorizontal === 0 && boxShadowVertical === 0 && boxShadowBlur === 0) return {};

    const inset = boxShadowPosition === "inset" ? "inset " : "";
    const boxShadowValue = `${inset}${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${boxShadowColor}`;

    return {
      boxShadow: boxShadowValue,
    };
  };

  // Calculate color styles
  const getColorStyles = () => {
    const styles = {};

    if (textColor) {
      styles.color = textColor;
    }

    return styles;
  };

  // Generate responsive styles (only for live pages, not in editor)
  const getResponsiveStyles = () => {
    // Skip responsive styles in editor mode
    if (typeof window !== "undefined" && window.location.pathname.includes("/builder")) {
      return "";
    }

    let responsiveCSS = "";

    if (hideOnDesktop) {
      responsiveCSS += `@media (min-width: 1024px) { .${hoverClassName} { display: none !important; } } `;
    }
    if (hideOnTablet) {
      responsiveCSS += `@media (min-width: 768px) and (max-width: 1023px) { .${hoverClassName} { display: none !important; } } `;
    }
    if (hideOnLandscapeMobile) {
      responsiveCSS += `@media (min-width: 480px) and (max-width: 767px) { .${hoverClassName} { display: none !important; } } `;
    }
    if (hideOnMobile) {
      responsiveCSS += `@media (max-width: 479px) { .${hoverClassName} { display: none !important; } } `;
    }

    return responsiveCSS;
  };

  // Generate hover styles
  const getHoverStyles = () => {
    let hoverCSS = "";

    // Background hover styles
    if (backgroundType) {
      switch (backgroundType) {
        case "color":
          hoverCSS += `background-color: ${backgroundColorHover} !important; `;
          break;
        case "gradient":
          hoverCSS += `background: ${backgroundGradientHover} !important; `;
          break;
      }
    }

    // Border hover styles
    if (borderStyle && borderStyle !== "none") {
      hoverCSS += `border-color: ${borderColorHover} !important; `;
    }

    // Box shadow hover styles
    if (boxShadowPreset || boxShadowHorizontalHover !== 0 || boxShadowVerticalHover !== 0 || boxShadowBlurHover !== 0) {
      const insetHover = boxShadowPositionHover === "inset" ? "inset " : "";
      const boxShadowHoverValue = `${insetHover}${boxShadowHorizontalHover}px ${boxShadowVerticalHover}px ${boxShadowBlurHover}px ${boxShadowSpreadHover}px ${boxShadowColorHover}`;
      hoverCSS += `box-shadow: ${boxShadowHoverValue} !important; `;
    }

    // Link color styles
    let linkCSS = "";
    if (linkColor) {
      linkCSS += `.${hoverClassName} a { color: ${linkColor} !important; } `;
    }
    if (linkColorHover) {
      linkCSS += `.${hoverClassName} a:hover { color: ${linkColorHover} !important; } `;
    }

    const combinedCSS = (hoverCSS ? `.${hoverClassName}:hover { ${hoverCSS} }` : "") + linkCSS + getResponsiveStyles();
    return combinedCSS;
  };

  // Parse data attributes
  const parseDataAttributes = () => {
    if (!dataAttributes) return {};
    const attrs = {};
    dataAttributes.split("\n").forEach((line) => {
      const match = line.trim().match(/^([^=]+)=["']([^"']*)["']$/);
      if (match) {
        attrs[match[1]] = match[2];
      }
    });
    return attrs;
  };

  const containerStyle = {
    padding: paddingValue,
    margin: marginValue,
    ...getBackgroundStyles(),
    ...getBorderStyles(),
    ...getBoxShadowStyles(),
    ...getColorStyles(),
    minHeight: isChildContainer ? "50px" : enableMinHeight && minHeight ? `${minHeight}${minHeightUnit}` : "50px",
    display: layout === "flex" && !needsContentWrapper ? "flex" : "block",
    flexDirection: layout === "flex" && !needsContentWrapper ? flexDirection : undefined,
    justifyContent: layout === "flex" && !needsContentWrapper ? justifyContent : undefined,
    alignItems: layout === "flex" && !needsContentWrapper ? (equalHeight ? "stretch" : alignItems) : undefined,
    flexWrap: layout === "flex" && !needsContentWrapper ? flexWrap : undefined,
    alignContent: layout === "flex" && !needsContentWrapper && flexWrap === "wrap" ? alignContent : undefined,
    rowGap: layout === "flex" && !needsContentWrapper ? getResponsiveRowGap() : undefined,
    columnGap: layout === "flex" && !needsContentWrapper ? getResponsiveColumnGap() : undefined,
    width: "100%",
    maxWidth: isChildContainer ? (flexBasis ? `${flexBasis}%` : undefined) : containerWidth === "custom" ? `${customWidth}${customWidthUnit}` : containerWidth === "boxed" ? "1200px" : undefined,
    marginLeft: isChildContainer ? undefined : containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined,
    marginRight: isChildContainer ? undefined : containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined,
    overflow: isChildContainer ? undefined : overflow,
    position: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : position && position !== "default" ? position : undefined,
    top: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionTop && position && position !== "default" && position !== "static" ? `${positionTop}${positionTopUnit}` : undefined,
    right: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionRight && position && position !== "default" && position !== "static" ? `${positionRight}${positionRightUnit}` : undefined,
    bottom: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionBottom && position && position !== "default" && position !== "static" ? `${positionBottom}${positionBottomUnit}` : undefined,
    left: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionLeft && position && position !== "default" && position !== "static" ? `${positionLeft}${positionLeftUnit}` : undefined,
    zIndex: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : zIndex ? parseInt(zIndex) : undefined,
  };

  const contentWrapperStyle = {
    // Width settings for boxed content
    maxWidth: needsContentWrapper ? `${contentBoxWidth}${contentBoxWidthUnit}` : undefined,
    marginLeft: needsContentWrapper ? "auto" : undefined,
    marginRight: needsContentWrapper ? "auto" : undefined,
    width: "100%",
    height: isChildContainer ? undefined : equalHeight && layout === "flex" ? "100%" : undefined,
    // Apply flex properties to content wrapper when needed
    display: layout === "flex" && needsContentWrapper ? "flex" : undefined,
    flexDirection: layout === "flex" && needsContentWrapper ? flexDirection : undefined,
    justifyContent: layout === "flex" && needsContentWrapper ? justifyContent : undefined,
    alignItems: layout === "flex" && needsContentWrapper ? (equalHeight ? "stretch" : alignItems) : undefined,
    flexWrap: layout === "flex" && needsContentWrapper ? flexWrap : undefined,
    alignContent: layout === "flex" && needsContentWrapper && flexWrap === "wrap" ? alignContent : undefined,
    rowGap: layout === "flex" && needsContentWrapper ? getResponsiveRowGap() : undefined,
    columnGap: layout === "flex" && needsContentWrapper ? getResponsiveColumnGap() : undefined,
  };

  const ContainerTag = isChildContainer ? "div" : htmlTag;

  return (
    <>
      {/* Inject hover and responsive styles */}
      {((backgroundType && (backgroundType === "color" || backgroundType === "gradient")) || (borderStyle && borderStyle !== "none") || boxShadowPreset || boxShadowHorizontalHover !== 0 || boxShadowVerticalHover !== 0 || boxShadowBlurHover !== 0 || linkColor || linkColorHover || hideOnDesktop || hideOnTablet || hideOnLandscapeMobile || hideOnMobile) && <style>{getHoverStyles()}</style>}

      <ContainerTag
        ref={(ref) => connect(drag(ref))}
        id={cssId || undefined}
        aria-label={ariaLabel || undefined}
        {...parseDataAttributes()}
        className={`
          relative
          ${selected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"}
          transition-all duration-200
          ${(backgroundType && (backgroundType === "color" || backgroundType === "gradient")) || (borderStyle && borderStyle !== "none") || boxShadowPreset || boxShadowHorizontalHover !== 0 || boxShadowVerticalHover !== 0 || boxShadowBlurHover !== 0 || linkColor || linkColorHover || hideOnDesktop || hideOnTablet || hideOnLandscapeMobile || hideOnMobile ? hoverClassName : ""}
          ${className}
        `}
        style={containerStyle}
      >
        {/* Selection Indicator */}
        {selected && <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10">Container</div>}

        {/* Conditionally render content wrapper only when needed for boxed content */}
        {(() => {
          const content = (
            <>
              {/* Auto-generate columns based on selected layout - skip single column */}
              {!children && selectedLayout && selectedLayout.cols.length > 1 && selectedLayout.cols.map((width, index) => <Element key={index} id={`column_${index}_${width}`} is={Container} padding={15} borderRadius={6} className="border border-gray-200" flexBasis={width} canvas />)}

              {/* Regular drop zone */}
              {!children && (!selectedLayout || selectedLayout.cols.length === 1) && <div className="flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-md h-20">Drop components here</div>}

              {children}
            </>
          );

          return needsContentWrapper ? <div style={contentWrapperStyle}>{content}</div> : content;
        })()}

        {/* Layout Picker Modal */}
        {showPicker && <ContainerLayoutPicker onSelect={handleLayoutSelect} onClose={() => setShowPicker(false)} />}
      </ContainerTag>
    </>
  );
};

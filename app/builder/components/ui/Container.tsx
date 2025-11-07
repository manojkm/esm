"use client";

import React, { useState } from "react";
import { useNode, Element, useEditor } from "@craftjs/core";
import { ContainerLayoutPicker } from "./ContainerLayoutPicker";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { Trash2, ArrowUp, MoreVertical } from "lucide-react";
import { Copy } from "lucide-react";

/**
 * Container Component - Main building block for page layouts
 * Features: Responsive design, drag/drop, styling controls, rename functionality
 */

interface ResponsiveValue {
  desktop?: number | string;
  tablet?: number | string;
  mobile?: number | string;
  unit?: Record<string, string>;
  top?: Record<string, number>;
  right?: Record<string, number>;
  bottom?: Record<string, number>;
  left?: Record<string, number>;
}

interface LayoutColumn {
  width: number;
}

interface SelectedLayout {
  cols: LayoutColumn[];
}

interface ContainerProps {
  children?: React.ReactNode;
  padding?: number;
  margin?: number;
  paddingTop?: number | null;
  paddingRight?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
  paddingUnit?: string;
  marginTop?: number | null;
  marginRight?: number | null;
  marginBottom?: number | null;
  marginLeft?: number | null;
  marginUnit?: string;
  rowGap?: number;
  columnGap?: number;
  rowGapUnit?: string;
  columnGapUnit?: string;
  paddingResponsive?: ResponsiveValue;
  marginResponsive?: ResponsiveValue;
  rowGapResponsive?: ResponsiveValue;
  columnGapResponsive?: ResponsiveValue;
  backgroundColor?: string;
  backgroundColorHover?: string;
  backgroundColorResponsive?: ResponsiveValue;
  backgroundColorHoverResponsive?: ResponsiveValue;
  backgroundType?: string | null;
  backgroundGradient?: string;
  backgroundGradientHover?: string;
  backgroundImage?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number | null;
  borderTopRightRadius?: number | null;
  borderBottomRightRadius?: number | null;
  borderBottomLeftRadius?: number | null;
  borderRadiusUnit?: string;
  borderRadiusResponsive?: ResponsiveValue;
  borderWidthResponsive?: ResponsiveValue;
  borderStyle?: string;
  borderWidth?: number;
  borderTopWidth?: number | null;
  borderRightWidth?: number | null;
  borderBottomWidth?: number | null;
  borderLeftWidth?: number | null;
  borderColor?: string;
  borderColorHover?: string;
  borderColorResponsive?: ResponsiveValue;
  borderColorHoverResponsive?: ResponsiveValue;
  boxShadowColor?: string;
  boxShadowColorHover?: string;
  boxShadowHorizontal?: number;
  boxShadowVertical?: number;
  boxShadowBlur?: number;
  boxShadowSpread?: number;
  boxShadowPosition?: string;
  boxShadowHorizontalHover?: number;
  boxShadowVerticalHover?: number;
  boxShadowBlurHover?: number;
  boxShadowSpreadHover?: number;
  boxShadowPositionHover?: string;
  boxShadowPreset?: string | null;
  boxShadowHorizontalResponsive?: ResponsiveValue;
  boxShadowVerticalResponsive?: ResponsiveValue;
  boxShadowBlurResponsive?: ResponsiveValue;
  boxShadowSpreadResponsive?: ResponsiveValue;
  boxShadowHorizontalHoverResponsive?: ResponsiveValue;
  boxShadowVerticalHoverResponsive?: ResponsiveValue;
  boxShadowBlurHoverResponsive?: ResponsiveValue;
  boxShadowSpreadHoverResponsive?: ResponsiveValue;
  textColor?: string | null;
  linkColor?: string | null;
  linkColorHover?: string | null;
  className?: string;
  cssId?: string;
  dataAttributes?: string;
  ariaLabel?: string;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnLandscapeMobile?: boolean;
  hideOnMobile?: boolean;
  showLayoutPicker?: boolean;
  layout?: string;
  selectedLayout?: SelectedLayout | null;
  flexBasis?: number | null;
  containerWidth?: string;
  contentWidth?: string;
  contentBoxWidth?: number;
  contentBoxWidthUnit?: string;
  customWidth?: number;
  customWidthUnit?: string;
  minHeight?: number;
  minHeightUnit?: string;
  enableMinHeight?: boolean;
  equalHeight?: boolean;
  htmlTag?: string;
  overflow?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  alignContent?: string;
  position?: string;
  positionTop?: number | null;
  positionRight?: number | null;
  positionBottom?: number | null;
  positionLeft?: number | null;
  positionTopUnit?: string;
  positionRightUnit?: string;
  positionBottomUnit?: string;
  positionLeftUnit?: string;
  zIndex?: number | null;
}

export const Container: React.FC<ContainerProps> = ({
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
  backgroundColorResponsive,
  backgroundColorHoverResponsive,
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
  borderRadiusResponsive,
  borderWidthResponsive,
  borderStyle = "none",
  borderWidth = 1,
  borderTopWidth = null,
  borderRightWidth = null,
  borderBottomWidth = null,
  borderLeftWidth = null,
  borderColor = "#000000",
  borderColorHover = "#333333",
  borderColorResponsive,
  borderColorHoverResponsive,
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
  boxShadowHorizontalResponsive,
  boxShadowVerticalResponsive,
  boxShadowBlurResponsive,
  boxShadowSpreadResponsive,
  boxShadowHorizontalHoverResponsive,
  boxShadowVerticalHoverResponsive,
  boxShadowBlurHoverResponsive,
  boxShadowSpreadHoverResponsive,
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
  // Craft.js hooks for component interaction
  const {
    connectors: { connect, drag }, // Drag/drop connectors
    selected, // Is component currently selected
    actions, // Component prop actions
    id, // Unique component ID
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  // Editor-level actions and queries
  const { actions: editorActions, query } = useEditor();
  const handleCopy = () => {
    const node = query.node(id).get();
    const parent = node.data.parent;

    if (parent !== null) {
      // Helper function to recursively build React element tree with children
      const buildElementTree = (nodeId: string): React.ReactElement => {
        const currentNode = query.node(nodeId).get();
        const nodeChildren = currentNode.data.nodes || [];

        // Recursively build children elements
        const childElements = nodeChildren.map((childId: string) => buildElementTree(childId));

        // Create React element with type, props, and children
        return React.createElement(currentNode.data.type, currentNode.data.props, ...childElements);
      };

      // Build the complete element tree
      const elementTree = buildElementTree(id);

      // Parse the element tree to create a new node tree with fresh IDs
      const newNodeTree = query.parseReactElement(elementTree).toNodeTree();

      // Add the cloned tree to the parent
      editorActions.addNodeTree(newNodeTree, parent);
    }
  };

  const { getResponsiveValue } = useResponsive();

  // Component state management
  // Only show picker for new containers (no children, no selectedLayout, and showLayoutPicker prop is true)
  const shouldShowPicker = showLayoutPicker && !children && !selectedLayout;
  const [showPicker, setShowPicker] = useState(shouldShowPicker); // Layout picker modal
  const [showContextMenu, setShowContextMenu] = useState(false); // Context menu visibility

  // Context menu handlers
  const handleDelete = () => {
    editorActions.delete(id);
    setShowContextMenu(false);
  };

  const handleSelectParent = () => {
    const parentId = query.node(id).get().data.parent;
    if (parentId) {
      editorActions.selectNode(parentId);
    }
    setShowContextMenu(false);
  };

  // Layout logic
  const isChildContainer = flexBasis !== null && flexBasis !== undefined; // Is this a column in a layout
  const needsContentWrapper = !isChildContainer && containerWidth === "full" && contentWidth === "boxed"; // Needs inner wrapper for boxed content

  const handleLayoutSelect = (layout: { cols: number[] }) => {
    const transformedLayout: SelectedLayout = {
      cols: layout.cols.map((width) => ({ width })),
    };

    actions.setProp((props: ContainerProps) => {
      props.layout = transformedLayout.cols.length === 1 ? "block" : "flex";
      props.selectedLayout = transformedLayout;
    });

    if (transformedLayout.cols.length > 1) {
      transformedLayout.cols.forEach(col => {
        const newNodeTree = query.parseReactElement(
          <Element is={Container} padding={15} borderRadius={6} className="border border-gray-200" flexBasis={col.width} canvas />
        ).toNodeTree();
        editorActions.addNodeTree(newNodeTree, id);
      });
    }

    setShowPicker(false);
  };

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

  // Generate unique class for dynamic hover styles (stable for SSR)
  const hoverClassName = `container-hover-${id}`;

  // Calculate background styles only when backgroundType is active
  const getBackgroundStyles = () => {
    if (!backgroundType) return {};

    switch (backgroundType) {
      case "color":
        const bgColor = getResponsiveValue(backgroundColorResponsive || {}, backgroundColor);
        return bgColor ? { backgroundColor: bgColor } : {};
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

  // Calculate responsive border radius
  const getResponsiveBorderRadius = () => {
    if (borderRadiusResponsive) {
      const topLeft = getResponsiveValue(borderRadiusResponsive.top || {}, borderTopLeftRadius ?? borderRadius);
      const topRight = getResponsiveValue(borderRadiusResponsive.right || {}, borderTopRightRadius ?? borderRadius);
      const bottomRight = getResponsiveValue(borderRadiusResponsive.bottom || {}, borderBottomRightRadius ?? borderRadius);
      const bottomLeft = getResponsiveValue(borderRadiusResponsive.left || {}, borderBottomLeftRadius ?? borderRadius);
      const unit = getResponsiveValue(borderRadiusResponsive.unit || {}, borderRadiusUnit);
      return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
    }
    return borderTopLeftRadius !== null || borderTopRightRadius !== null || borderBottomRightRadius !== null || borderBottomLeftRadius !== null ? `${borderTopLeftRadius ?? borderRadius}${borderRadiusUnit} ${borderTopRightRadius ?? borderRadius}${borderRadiusUnit} ${borderBottomRightRadius ?? borderRadius}${borderRadiusUnit} ${borderBottomLeftRadius ?? borderRadius}${borderRadiusUnit}` : `${borderRadius}${borderRadiusUnit}`;
  };

  // Calculate responsive border width
  const getResponsiveBorderWidth = () => {
    if (borderWidthResponsive) {
      const top = getResponsiveValue(borderWidthResponsive.top || {}, borderTopWidth ?? borderWidth);
      const right = getResponsiveValue(borderWidthResponsive.right || {}, borderRightWidth ?? borderWidth);
      const bottom = getResponsiveValue(borderWidthResponsive.bottom || {}, borderBottomWidth ?? borderWidth);
      const left = getResponsiveValue(borderWidthResponsive.left || {}, borderLeftWidth ?? borderWidth);
      return `${top}px ${right}px ${bottom}px ${left}px`;
    }
    return borderTopWidth !== null || borderRightWidth !== null || borderBottomWidth !== null || borderLeftWidth !== null ? `${borderTopWidth ?? borderWidth}px ${borderRightWidth ?? borderWidth}px ${borderBottomWidth ?? borderWidth}px ${borderLeftWidth ?? borderWidth}px` : `${borderWidth}px`;
  };

  // Calculate border styles
  const getBorderStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Always apply border radius
    styles.borderRadius = getResponsiveBorderRadius();

    // Only apply border properties if style is not none
    if (borderStyle && borderStyle !== "none") {
      styles.borderStyle = borderStyle as React.CSSProperties["borderStyle"];
      styles.borderWidth = getResponsiveBorderWidth();
      const responsiveBorderColor = getResponsiveValue(borderColorResponsive || {}, borderColor);
      styles.borderColor = responsiveBorderColor;
    }

    return styles;
  };

  // Calculate responsive box shadow values
  const getResponsiveBoxShadow = () => {
    let horizontal = boxShadowHorizontal;
    let vertical = boxShadowVertical;
    let blur = boxShadowBlur;
    let spread = boxShadowSpread;

    if (boxShadowHorizontalResponsive) {
      horizontal = getResponsiveValue(boxShadowHorizontalResponsive, boxShadowHorizontal);
    }
    if (boxShadowVerticalResponsive) {
      vertical = getResponsiveValue(boxShadowVerticalResponsive, boxShadowVertical);
    }
    if (boxShadowBlurResponsive) {
      blur = getResponsiveValue(boxShadowBlurResponsive, boxShadowBlur);
    }
    if (boxShadowSpreadResponsive) {
      spread = getResponsiveValue(boxShadowSpreadResponsive, boxShadowSpread);
    }

    return { horizontal, vertical, blur, spread };
  };

  const getResponsiveBoxShadowHover = () => {
    let horizontal = boxShadowHorizontalHover;
    let vertical = boxShadowVerticalHover;
    let blur = boxShadowBlurHover;
    let spread = boxShadowSpreadHover;

    if (boxShadowHorizontalHoverResponsive) {
      horizontal = getResponsiveValue(boxShadowHorizontalHoverResponsive, boxShadowHorizontalHover);
    }
    if (boxShadowVerticalHoverResponsive) {
      vertical = getResponsiveValue(boxShadowVerticalHoverResponsive, boxShadowVerticalHover);
    }
    if (boxShadowBlurHoverResponsive) {
      blur = getResponsiveValue(boxShadowBlurHoverResponsive, boxShadowBlurHover);
    }
    if (boxShadowSpreadHoverResponsive) {
      spread = getResponsiveValue(boxShadowSpreadHoverResponsive, boxShadowSpreadHover);
    }

    return { horizontal, vertical, blur, spread };
  };

  // Calculate box shadow styles
  const getBoxShadowStyles = () => {
    const shadowValues = getResponsiveBoxShadow();

    if (!boxShadowPreset && shadowValues.horizontal === 0 && shadowValues.vertical === 0 && shadowValues.blur === 0) return {};

    const inset = boxShadowPosition === "inset" ? "inset " : "";
    const boxShadowValue = `${inset}${shadowValues.horizontal}px ${shadowValues.vertical}px ${shadowValues.blur}px ${shadowValues.spread}px ${boxShadowColor}`;

    return {
      boxShadow: boxShadowValue,
    };
  };

  // Calculate color styles
  const getColorStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

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
          const bgColorHover = getResponsiveValue(backgroundColorHoverResponsive || {}, backgroundColorHover);
          if (bgColorHover) {
            hoverCSS += `background-color: ${bgColorHover} !important; `;
          }
          break;
        case "gradient":
          hoverCSS += `background: ${backgroundGradientHover} !important; `;
          break;
      }
    }

    // Border hover styles
    if (borderStyle && borderStyle !== "none") {
      const responsiveBorderColorHover = getResponsiveValue(borderColorHoverResponsive || {}, borderColorHover);
      hoverCSS += `border-color: ${responsiveBorderColorHover} !important; `;
    }

    // Box shadow hover styles
    const hoverShadowValues = getResponsiveBoxShadowHover();
    if (boxShadowPreset || hoverShadowValues.horizontal !== 0 || hoverShadowValues.vertical !== 0 || hoverShadowValues.blur !== 0) {
      const insetHover = boxShadowPositionHover === "inset" ? "inset " : "";
      const boxShadowHoverValue = `${insetHover}${hoverShadowValues.horizontal}px ${hoverShadowValues.vertical}px ${hoverShadowValues.blur}px ${hoverShadowValues.spread}px ${boxShadowColorHover}`;
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
  const parseDataAttributes = (): Record<string, string> => {
    if (!dataAttributes) return {};
    const attrs: Record<string, string> = {};
    dataAttributes.split("\n").forEach((line) => {
      const match = line.trim().match(/^([^=]+)=["']([^"']*)["']$/);
      if (match) {
        attrs[match[1]] = match[2];
      }
    });
    return attrs;
  };

  const containerStyle: React.CSSProperties = {
    padding: paddingValue,
    margin: marginValue,
    ...getBackgroundStyles(),
    ...getBorderStyles(),
    ...getBoxShadowStyles(),
    ...getColorStyles(),
    minHeight: isChildContainer ? "50px" : enableMinHeight && minHeight ? `${minHeight}${minHeightUnit}` : "50px",
    display: layout === "flex" && !needsContentWrapper ? "flex" : "block",
    flexDirection: layout === "flex" && !needsContentWrapper ? (flexDirection as React.CSSProperties["flexDirection"]) : undefined,
    justifyContent: layout === "flex" && !needsContentWrapper ? (justifyContent as React.CSSProperties["justifyContent"]) : undefined,
    alignItems: layout === "flex" && !needsContentWrapper ? (equalHeight ? "stretch" : (alignItems as React.CSSProperties["alignItems"])) : undefined,
    flexWrap: layout === "flex" && !needsContentWrapper ? (flexWrap as React.CSSProperties["flexWrap"]) : undefined,
    alignContent: layout === "flex" && !needsContentWrapper && flexWrap === "wrap" ? (alignContent as React.CSSProperties["alignContent"]) : undefined,
    rowGap: layout === "flex" && !needsContentWrapper ? getResponsiveRowGap() : undefined,
    columnGap: layout === "flex" && !needsContentWrapper ? getResponsiveColumnGap() : undefined,
    flexBasis: isChildContainer && flexBasis ? `${flexBasis}%` : "auto",
    width: isChildContainer && flexBasis ? `${flexBasis}%` : "100%",
    maxWidth: isChildContainer ? undefined : containerWidth === "custom" ? `${customWidth}${customWidthUnit}` : containerWidth === "boxed" ? "1200px" : undefined,
    marginLeft: isChildContainer ? undefined : containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined,
    marginRight: isChildContainer ? undefined : containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined,
    overflow: isChildContainer ? undefined : (overflow as React.CSSProperties["overflow"]),
    position: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : position && position !== "default" ? (position as React.CSSProperties["position"]) : undefined,
    top: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionTop && position && position !== "default" && position !== "static" ? `${positionTop}${positionTopUnit}` : undefined,
    right: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionRight && position && position !== "default" && position !== "static" ? `${positionRight}${positionRightUnit}` : undefined,
    bottom: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionBottom && position && position !== "default" && position !== "static" ? `${positionBottom}${positionBottomUnit}` : undefined,
    left: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : positionLeft && position && position !== "default" && position !== "static" ? `${positionLeft}${positionLeftUnit}` : undefined,
    zIndex: typeof window !== "undefined" && window.location.pathname.includes("/builder") ? undefined : zIndex ? zIndex : undefined,
  };

  const contentWrapperStyle: React.CSSProperties = {
    // Width settings for boxed content
    maxWidth: needsContentWrapper ? `${contentBoxWidth}${contentBoxWidthUnit}` : undefined,
    marginLeft: needsContentWrapper ? "auto" : undefined,
    marginRight: needsContentWrapper ? "auto" : undefined,
    width: "100%",
    height: isChildContainer ? undefined : equalHeight && layout === "flex" ? "100%" : undefined,
    // Apply flex properties to content wrapper when needed
    display: layout === "flex" && needsContentWrapper ? "flex" : undefined,
    flexDirection: layout === "flex" && needsContentWrapper ? (flexDirection as React.CSSProperties["flexDirection"]) : undefined,
    justifyContent: layout === "flex" && needsContentWrapper ? (justifyContent as React.CSSProperties["justifyContent"]) : undefined,
    alignItems: layout === "flex" && needsContentWrapper ? (equalHeight ? "stretch" : (alignItems as React.CSSProperties["alignItems"])) : undefined,
    flexWrap: layout === "flex" && needsContentWrapper ? (flexWrap as React.CSSProperties["flexWrap"]) : undefined,
    alignContent: layout === "flex" && needsContentWrapper && flexWrap === "wrap" ? (alignContent as React.CSSProperties["alignContent"]) : undefined,
    rowGap: layout === "flex" && needsContentWrapper ? getResponsiveRowGap() : undefined,
    columnGap: layout === "flex" && needsContentWrapper ? getResponsiveColumnGap() : undefined,
  };

  const ContainerTag = isChildContainer ? "div" : htmlTag;

  const containerProps = {
    ref: (ref: HTMLElement | null) => {
      if (ref) connect(drag(ref));
    },
    id: cssId || undefined,
    "aria-label": ariaLabel || undefined,
    ...parseDataAttributes(),
    className: `
      relative
      ${selected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"}
      transition-all duration-200
      ${(backgroundType && (backgroundType === "color" || backgroundType === "gradient")) || (borderStyle && borderStyle !== "none") || boxShadowPreset || boxShadowHorizontalHover !== 0 || boxShadowVerticalHover !== 0 || boxShadowBlurHover !== 0 || linkColor || linkColorHover || hideOnDesktop || hideOnTablet || hideOnLandscapeMobile || hideOnMobile ? hoverClassName : ""}
      ${className}
    `,
    style: containerStyle,
  };

  return (
    <>
      {/* Inject hover and responsive styles */}
      {((backgroundType && (backgroundType === "color" || backgroundType === "gradient")) || (borderStyle && borderStyle !== "none") || boxShadowPreset || boxShadowHorizontalHover !== 0 || boxShadowVerticalHover !== 0 || boxShadowBlurHover !== 0 || linkColor || linkColorHover || hideOnDesktop || hideOnTablet || hideOnLandscapeMobile || hideOnMobile) && <style>{getHoverStyles()}</style>}

      {React.createElement(
        ContainerTag,
        containerProps,
        <>
          {/* Selection Indicator */}
          {selected && (
            <>
              <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10">Container</div>
              <div className="absolute -top-6 right-0 z-10">
                <button onClick={() => setShowContextMenu(!showContextMenu)} className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-t-md transition-colors" title="Component Actions">
                  <MoreVertical size={12} />
                </button>

                {/* Context Menu */}
                {showContextMenu && (
                  <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[120px]">
                    <button onClick={handleCopy} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <Copy size={12} /> Copy
                    </button>

                    {/* Select Parent */}
                    {!isChildContainer && (
                      <button onClick={handleSelectParent} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <ArrowUp size={14} />
                        Select Parent
                      </button>
                    )}

                    {/* Delete */}
                    <button onClick={handleDelete} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {/* Conditionally render content wrapper only when needed for boxed content */}
          {(() => {
            const content = (
              <>
                {/* Regular drop zone for empty container */}
                {!children && <div className="flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-md h-20">Drop components here</div>}

                {children}
              </>
            );

            return needsContentWrapper ? <div style={contentWrapperStyle}>{content}</div> : content;
          })()}

          {/* Layout Picker Modal */}
          {showPicker && <ContainerLayoutPicker onSelect={handleLayoutSelect} onClose={() => setShowPicker(false)} />}
        </>,
      )}
    </>
  );
};

// Craft.js component configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Container as any).craft = {
  displayName: "Container", // Default name in toolbox
  isCanvas: true, // Can accept child components (droppable + expandable in layers)
  rules: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canMoveIn: (incomingNodes: any, currentNode: any, helpers: any) => {
      const depth = helpers(currentNode.id).ancestors().length;
      return depth < 10; // Prevent excessive nesting
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canMoveOut: (outgoingNodes: any, currentNode: any, helpers: any) => {
      return !helpers(currentNode.id).isRoot(); // Can't move root
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canDrag: (node: any, helpers: any) => {
      return !helpers(node.id).isRoot(); // Can't drag root
    },
  },
};

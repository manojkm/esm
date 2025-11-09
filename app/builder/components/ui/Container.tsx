"use client";

import React, { useState } from "react";
import { useNode, Element, useEditor } from "@craftjs/core";
import { ContainerLayoutPicker } from "./ContainerLayoutPicker";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { buildBackgroundHoverCss, buildBackgroundStyles, buildBorderHoverCss, buildBorderStyles, buildBoxShadowHoverCss, buildBoxShadowStyle, buildHoverRule, buildLinkColorCss, buildResponsiveFourSideValue, buildResponsiveValueWithUnit, buildTextColorStyles, buildVisibilityCss, mergeCssSegments, parseDataAttributes, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import type { ContainerProps, SelectedLayout } from "./container/types";

/**
 * The main Container component. It receives props from the craft.js store
 * and renders the appropriate layout and styles.
 */
export const Container: React.FC<ContainerProps> = ({
  // Props are destructured here. When a user changes a setting in the SettingsPanel,
  // craft.js updates the corresponding prop, and this component re-renders with the new value.
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
  enableBoxShadow = false,
  enableBoxShadowHover = false,
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
  layout,
  selectedLayout = null,
  flexBasis = null,
  flexBasisUnit = "%",
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
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  alignContent,
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
  // The `useNode` hook is the core of craft.js. It connects this component instance
  // to the editor's state, providing its props, selection status, and actions to modify it.
  const {
    connectors: { connect, drag }, // `connect` makes the component a drop target, `drag` makes it draggable.
    selected, // `true` if the component is currently selected in the editor.
    actions, // Contains `setProp`, the function used by settings panels to update this component's props.
    id, // A unique ID for this component instance (node).
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  // `useEditor` provides access to the global editor state and actions.
  const {
    actions: editorActions, // Global actions, like adding a new component (`addNodeTree`).
    query, // Functions to query the editor's state (e.g., `query.parseReactElement`).
    enabled, // `true` if the editor is in "edit" mode.
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const isEditMode = enabled;

  // Custom hook to get the correct style value based on the current viewport (desktop, tablet, mobile).
  const { getResponsiveValue } = useResponsive();
  const responsiveResolver: ResponsiveResolver = (values, fallback) => getResponsiveValue(values ?? {}, fallback);

  // State to control the visibility of the layout picker modal.
  // The picker is shown for new containers that don't have children or a pre-defined layout.
  const shouldShowPicker = showLayoutPicker && !children && !selectedLayout;
  const [showPicker, setShowPicker] = useState(shouldShowPicker);

  // --- Layout Logic ---
  // Determines if this container is a column within a parent flex container.
  const isChildContainer = flexBasis !== null && flexBasis !== undefined;
  // Determines if a nested content wrapper is needed for "full-width container with boxed content".
  const needsContentWrapper = !isChildContainer && containerWidth === "full" && contentWidth === "boxed";

  // Determine effective layout properties, falling back to defaults if not specified.
  const effectiveLayout = layout ?? (isChildContainer ? "flex" : "block");
  const effectiveFlexDirection = flexDirection ?? (isChildContainer ? "column" : "row");
  const effectiveJustifyContent = justifyContent ?? (isChildContainer ? "center" : "flex-start");
  const effectiveAlignItems = alignItems ?? (isChildContainer ? "center" : "stretch");
  const effectiveFlexWrap = flexWrap ?? "nowrap";
  const effectiveAlignContent = alignContent ?? "stretch";

  // Check if the container has any children.
  const childCount = React.Children.count(children);
  const hasChildren = childCount > 0;
  const isEmpty = !hasChildren;

  /**
   * Handles the selection of a layout from the picker.
   * It updates this container's props and adds new child containers for each column.
   * @param layout - The selected layout object with column widths.
   */
  const handleLayoutSelect = (layout: { cols: number[] }) => {
    const transformedLayout: SelectedLayout = {
      cols: layout.cols.map((width) => ({ width })),
    };

    // Use `actions.setProp` to update this container's own props in the craft.js store.
    actions.setProp((props: ContainerProps) => {
      props.layout = transformedLayout.cols.length === 1 ? "block" : "flex";
      props.selectedLayout = transformedLayout;
    });

    // If a multi-column layout is chosen, create new `Container` nodes for each column.
    if (transformedLayout.cols.length > 1) {
      transformedLayout.cols.forEach((col) => {
        // Create a new container element configured as a flex column.
        const newNodeTree = query.parseReactElement(<Element is={Container} flexBasis={col.width} flexBasisUnit="%" layout="flex" flexDirection="column" justifyContent="center" alignItems="center" flexWrap="nowrap" canvas />).toNodeTree();
        // Use the global `editorActions` to add the new column to this container.
        editorActions.addNodeTree(newNodeTree, id);
      });
    }

    setShowPicker(false);
  };

  // --- Style Calculation Helper Functions ---
  // These computations read the component's props (which are controlled by the settings panel)
  // and compute the final CSS styles, including responsive adjustments.
  const paddingValue = buildResponsiveFourSideValue({
    responsive: paddingResponsive,
    fallback: {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
      defaultValue: padding,
    },
    defaultUnit: paddingUnit,
    resolver: responsiveResolver,
  });

  const marginValue = buildResponsiveFourSideValue({
    responsive: marginResponsive,
    fallback: {
      top: marginTop,
      right: marginRight,
      bottom: marginBottom,
      left: marginLeft,
      defaultValue: margin,
    },
    defaultUnit: marginUnit,
    resolver: responsiveResolver,
  });

  const rowGapValue = buildResponsiveValueWithUnit({
    responsive: rowGapResponsive,
    fallbackValue: rowGap,
    fallbackUnit: rowGapUnit,
    resolver: responsiveResolver,
  });

  const columnGapValue = buildResponsiveValueWithUnit({
    responsive: columnGapResponsive,
    fallbackValue: columnGap,
    fallbackUnit: columnGapUnit,
    resolver: responsiveResolver,
  });

  const backgroundStyles = buildBackgroundStyles({
    type: backgroundType,
    color: backgroundColor,
    colorResponsive: backgroundColorResponsive,
    gradient: backgroundGradient,
    image: backgroundImage,
    resolver: responsiveResolver,
  });

  const borderStyles = buildBorderStyles({
    style: borderStyle,
    color: borderColor,
    colorResponsive: borderColorResponsive,
    radiusResponsive: borderRadiusResponsive,
    widthResponsive: borderWidthResponsive,
    radiusFallback: {
      topLeft: borderTopLeftRadius,
      topRight: borderTopRightRadius,
      bottomRight: borderBottomRightRadius,
      bottomLeft: borderBottomLeftRadius,
      defaultValue: borderRadius,
      defaultUnit: borderRadiusUnit,
    },
    widthFallback: {
      top: borderTopWidth,
      right: borderRightWidth,
      bottom: borderBottomWidth,
      left: borderLeftWidth,
      defaultValue: borderWidth,
      defaultUnit: "px",
    },
    resolver: responsiveResolver,
  });

  const boxShadowStyles = buildBoxShadowStyle({
    enable: enableBoxShadow,
    preset: boxShadowPreset,
    position: boxShadowPosition,
    color: boxShadowColor,
    horizontal: boxShadowHorizontal,
    vertical: boxShadowVertical,
    blur: boxShadowBlur,
    spread: boxShadowSpread,
    horizontalResponsive: boxShadowHorizontalResponsive,
    verticalResponsive: boxShadowVerticalResponsive,
    blurResponsive: boxShadowBlurResponsive,
    spreadResponsive: boxShadowSpreadResponsive,
    resolver: responsiveResolver,
  });

  const colorStyles = buildTextColorStyles({ color: textColor });

  // Generate a unique, stable class name for this component instance to apply hover styles.
  const hoverClassName = `container-hover-${id}`;

  const hoverBackgroundCss = buildBackgroundHoverCss({
    type: backgroundType,
    colorHover: backgroundColorHover,
    colorHoverResponsive: backgroundColorHoverResponsive,
    gradientHover: backgroundGradientHover,
    resolver: responsiveResolver,
  });

  const hoverBorderCss = buildBorderHoverCss({
    style: borderStyle,
    colorHover: borderColorHover,
    colorHoverResponsive: borderColorHoverResponsive,
    resolver: responsiveResolver,
  });

  const hoverBoxShadowCss = buildBoxShadowHoverCss({
    enableHover: enableBoxShadowHover,
    preset: boxShadowPreset,
    hoverPosition: boxShadowPositionHover,
    colorHover: boxShadowColorHover,
    color: boxShadowColor,
    horizontal: boxShadowHorizontalHover,
    vertical: boxShadowVerticalHover,
    blur: boxShadowBlurHover,
    spread: boxShadowSpreadHover,
    horizontalResponsive: boxShadowHorizontalHoverResponsive,
    verticalResponsive: boxShadowVerticalHoverResponsive,
    blurResponsive: boxShadowBlurHoverResponsive,
    spreadResponsive: boxShadowSpreadHoverResponsive,
    resolver: responsiveResolver,
  });

  const hoverRules = mergeCssSegments(hoverBackgroundCss, hoverBorderCss, hoverBoxShadowCss);

  const linkCss = buildLinkColorCss({
    baseSelector: `.${hoverClassName}`,
    linkColor,
    linkColorHover,
  });

  const responsiveVisibilityCss = buildVisibilityCss({
    hoverClassName,
    isEditMode,
    hideOnDesktop,
    hideOnTablet,
    hideOnLandscapeMobile,
    hideOnMobile,
  });

  const styleTagContent = mergeCssSegments(buildHoverRule(hoverClassName, hoverRules), linkCss, responsiveVisibilityCss);

  // --- Final Style and Prop Aggregation ---

  // Determine various conditional styles and properties for rendering.
  const hasCustomMinHeight = enableMinHeight && typeof minHeight === "number";
  const hasCustomBorder = borderStyle && borderStyle !== "none";
  // Show a helper border in edit mode for empty containers or columns without a real border.
  const shouldShowHelperBorder = isEditMode && !hasCustomBorder && (!isChildContainer || isEmpty);
  const computedMinHeight = hasCustomMinHeight ? `${minHeight}${minHeightUnit}` : isEditMode ? "20px" : undefined;
  const hasCustomPosition = position && position !== "default" && position !== "static";
  const formatPositionValue = (value: number | null | undefined, unit: string) => (value !== null && value !== undefined ? `${value}${unit}` : undefined);

  // Assemble the final style object for the main container element from all the helper functions.
  const containerStyle: React.CSSProperties = {
    padding: paddingValue,
    margin: marginValue,
    ...backgroundStyles,
    ...borderStyles,
    ...boxShadowStyles,
    ...colorStyles,
    ...(shouldShowHelperBorder
      ? {
          border: "1px dashed rgba(148, 163, 184, 0.9)",
        }
      : {}),
    minHeight: computedMinHeight,
    // Flexbox properties are applied directly if no content wrapper is needed.
    display: effectiveLayout === "flex" && !needsContentWrapper ? "flex" : "block",
    flexDirection: effectiveLayout === "flex" && !needsContentWrapper ? (effectiveFlexDirection as React.CSSProperties["flexDirection"]) : undefined,
    justifyContent: effectiveLayout === "flex" && !needsContentWrapper ? (effectiveJustifyContent as React.CSSProperties["justifyContent"]) : undefined,
    alignItems: effectiveLayout === "flex" && !needsContentWrapper ? (equalHeight ? "stretch" : (effectiveAlignItems as React.CSSProperties["alignItems"])) : undefined,
    flexWrap: effectiveLayout === "flex" && !needsContentWrapper ? (effectiveFlexWrap as React.CSSProperties["flexWrap"]) : undefined,
    alignContent: effectiveLayout === "flex" && !needsContentWrapper && effectiveFlexWrap === "wrap" ? (effectiveAlignContent as React.CSSProperties["alignContent"]) : undefined,
    rowGap: effectiveLayout === "flex" && !needsContentWrapper ? rowGapValue : undefined,
    columnGap: effectiveLayout === "flex" && !needsContentWrapper ? columnGapValue : undefined,
    // Sizing properties
    flexBasis: isChildContainer && flexBasis !== null && flexBasis !== undefined ? `${flexBasis}${flexBasisUnit}` : undefined,
    width: isChildContainer && flexBasis !== null && flexBasis !== undefined ? `${flexBasis}${flexBasisUnit}` : "100%",
    maxWidth: isChildContainer ? undefined : containerWidth === "custom" ? `${customWidth}${customWidthUnit}` : containerWidth === "boxed" ? "1200px" : undefined,
    marginLeft: isChildContainer ? undefined : containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined,
    marginRight: isChildContainer ? undefined : containerWidth === "boxed" || containerWidth === "custom" ? "auto" : undefined,
    overflow: overflow as React.CSSProperties["overflow"],
    // Positioning properties (applied only in live mode, not editor)
    position: isEditMode ? undefined : hasCustomPosition ? (position as React.CSSProperties["position"]) : undefined,
    top: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionTop, positionTopUnit) : undefined,
    right: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionRight, positionRightUnit) : undefined,
    bottom: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionBottom, positionBottomUnit) : undefined,
    left: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionLeft, positionLeftUnit) : undefined,
    zIndex: isEditMode ? undefined : zIndex ? zIndex : undefined,
  };

  // Define the style object for the inner content wrapper (used for boxed layouts).
  const contentWrapperStyle: React.CSSProperties = {
    maxWidth: needsContentWrapper ? `${contentBoxWidth}${contentBoxWidthUnit}` : undefined,
    marginLeft: needsContentWrapper ? "auto" : undefined,
    marginRight: needsContentWrapper ? "auto" : undefined,
    width: "100%",
    minHeight: "inherit",
    height: isChildContainer ? undefined : equalHeight && effectiveLayout === "flex" ? "100%" : undefined,
    // Flexbox properties are applied here if a content wrapper is used.
    display: effectiveLayout === "flex" && needsContentWrapper ? "flex" : undefined,
    flexDirection: effectiveLayout === "flex" && needsContentWrapper ? (effectiveFlexDirection as React.CSSProperties["flexDirection"]) : undefined,
    justifyContent: effectiveLayout === "flex" && needsContentWrapper ? (effectiveJustifyContent as React.CSSProperties["justifyContent"]) : undefined,
    alignItems: effectiveLayout === "flex" && needsContentWrapper ? (equalHeight ? "stretch" : (effectiveAlignItems as React.CSSProperties["alignItems"])) : undefined,
    flexWrap: effectiveLayout === "flex" && needsContentWrapper ? (effectiveFlexWrap as React.CSSProperties["flexWrap"]) : undefined,
    alignContent: effectiveLayout === "flex" && needsContentWrapper && effectiveFlexWrap === "wrap" ? (effectiveAlignContent as React.CSSProperties["alignContent"]) : undefined,
    rowGap: effectiveLayout === "flex" && needsContentWrapper ? rowGapValue : undefined,
    columnGap: effectiveLayout === "flex" && needsContentWrapper ? columnGapValue : undefined,
  };

  // Dynamically set the HTML tag for the container (e.g., 'div', 'section', 'header').
  const ContainerTag = htmlTag;

  // Aggregate all props for the container element.
  const containerProps = {
    // The `ref` is crucial. It connects the rendered DOM element back to craft.js,
    // enabling drag-and-drop and selection highlighting.
    ref: (ref: HTMLElement | null) => {
      if (!ref) return;
      // In edit mode, the element is both a drop target and draggable.
      if (isEditMode) {
        connect(drag(ref));
      } else {
        // In live mode, it's just a drop target (for potential future features).
        connect(ref);
      }
    },
    id: cssId || undefined,
    "aria-label": ariaLabel || undefined,
    ...parseDataAttributes(dataAttributes),
    className: `
      relative
      ${isEditMode && selected ? "ring-2 ring-blue-500 ring-offset-0" : isEditMode ? "hover:ring-1 hover:ring-blue-300" : ""}
      transition-all duration-200
      ${hoverClassName}
      ${className}
    `,
    style: containerStyle,
  };

  return (
    <>
      {/* Inject a <style> tag for hover and responsive styles. This is necessary because
          pseudo-classes (:hover) and media queries cannot be applied via inline styles. */}
      <style>{styleTagContent}</style>

      {/* Render the container using React.createElement to support dynamic HTML tags from props. */}
      {React.createElement(
        ContainerTag,
        containerProps,
        <>
          {/* IIFE to conditionally render the content wrapper only when needed. */}
          {(() => {
            const content = (
              <>
                {/* Show a "Drop components here" message in edit mode for empty containers. */}
                {isEditMode && isEmpty && <div className="flex items-center justify-center text-gray-400 text-sm h-full min-h-[40px]">Drop components here</div>}

                {/* Render child components passed from the editor. */}
                {children}
              </>
            );

            // If a content wrapper is needed, wrap the content in it; otherwise, render directly.
            return needsContentWrapper ? <div style={contentWrapperStyle}>{content}</div> : content;
          })()}

          {/* Render the layout picker modal if it should be visible. */}
          {showPicker && <ContainerLayoutPicker onSelect={handleLayoutSelect} onClose={() => setShowPicker(false)} />}
        </>,
      )}
    </>
  );
};

// --- Craft.js Configuration ---
// This static `craft` object tells craft.js how the Container component should behave in the editor.
// The `related.settings` property, which links to the settings panel, is attached in a separate file
// to keep the component's display logic clean.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Container as any).craft = {
  displayName: "Container", // Name displayed in the editor's toolbox.
  isCanvas: true, // `true` means this component can host other draggable components.
  // Rules define how this component interacts with others in the editor.
  rules: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canMoveIn: (incomingNodes: any, currentNode: any, helpers: any) => {
      // Limit nesting depth to prevent performance issues and overly complex structures.
      const depth = helpers(currentNode.id).ancestors().length;
      return depth < 10;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canMoveOut: (outgoingNodes: any, currentNode: any, helpers: any) => {
      // The root container cannot be moved out of the frame.
      return !helpers(currentNode.id).isRoot();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canDrag: (node: any, helpers: any) => {
      // The root container cannot be dragged.
      return !helpers(node.id).isRoot();
    },
  },
};

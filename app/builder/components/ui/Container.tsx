"use client";

import React, { useState } from "react";
import { useNode, Element, useEditor } from "@craftjs/core";
import { ContainerLayoutPicker } from "./ContainerLayoutPicker";
import { useResponsive, type BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { buildBackgroundHoverCss, buildBackgroundStyles, buildBorderHoverCss, buildBorderStyles, buildBoxShadowHoverCss, buildBoxShadowStyle, buildHoverRule, buildLinkColorCss, buildOverlayStyles, buildResponsiveFourSideValue, buildResponsiveValueWithUnit, buildTextColorStyles, buildVisibilityCss, mergeCssSegments, parseDataAttributes, resolveResponsiveValue, type ResponsiveMap, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import { generatePaddingCss, generateMarginCss, generateResponsiveCss, generateResponsiveFlexCss, generateBackgroundColorCss, generateBorderColorCss, generateResponsiveFourSideCss, generateBoxShadowCss, generateHoverBackgroundColorCss, generateHoverBorderColorCss, generateTextColorCss, generateLinkColorCss, generatePositionCss, generateZIndexCss } from "@/app/builder/lib/style-system/css-responsive";
import type { ContainerProps, SelectedLayout } from "./container/types";

/**
 * The main Container component. It receives props from the craft.js store
 * and renders the appropriate layout and styles.
 */
export const Container: React.FC<ContainerProps> = (props) => {
  // Get global settings for defaults (reactive to changes)
  const { settings } = useGlobalSettings();
  const containerDefaults = settings.containerDefaults;
  
  // Props are destructured here. When a user changes a setting in the SettingsPanel,
  // craft.js updates the corresponding prop, and this component re-renders with the new value.
  const {
    children,
    padding,
    margin,
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
    enableBackgroundColorHover = false,
    backgroundColorHover = null,
    backgroundColorResponsive,
    backgroundColorHoverResponsive,
    backgroundType = null,
    backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundGradientHover = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    backgroundImage = "",
    // Background Overlay
    enableBackgroundOverlay = false,
    overlayType = null,
    overlayColor = null,
    overlayColorResponsive,
    overlayImage,
    overlayPosition = "center",
    overlayPositionResponsive,
    overlayAttachment = "scroll",
    overlayAttachmentResponsive,
    overlayBlendMode = "normal",
    overlayBlendModeResponsive,
    overlayRepeat = "no-repeat",
    overlayRepeatResponsive,
    overlaySize = "cover",
    overlaySizeResponsive,
    overlayOpacity = 50,
    overlayOpacityResponsive,
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
    textColorResponsive,
    linkColor = null,
    linkColorResponsive,
    linkColorHover = null,
    linkColorHoverResponsive,
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
    flexBasisResponsive,
    containerWidth = "full",
    contentWidth = "boxed",
    contentBoxWidth,
    contentBoxWidthUnit = "px",
    contentBoxWidthResponsive,
    customWidth,
    customWidthUnit = "px",
    customWidthResponsive,
    minHeight = 450,
    minHeightUnit = "px",
    enableMinHeight = false,
    minHeightResponsive,
    equalHeight = false,
    htmlTag = "div",
    overflow = "visible",
    flexDirection,
    flexDirectionResponsive,
    justifyContent,
    justifyContentResponsive,
    alignItems,
    alignItemsResponsive,
    flexWrap,
    flexWrapResponsive,
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
    positionTopResponsive,
    positionRightResponsive,
    positionBottomResponsive,
    positionLeftResponsive,
    zIndex = null,
    zIndexResponsive,
  } = props;

  // Apply global defaults if props are undefined
  const finalPadding = padding ?? containerDefaults.padding?.default ?? 10;
  const finalMargin = margin ?? containerDefaults.margin?.default ?? 0;
  // Content box width is for content wrappers (Full Width + Content Width = Boxed), NOT for Container Width = Boxed
  const finalContentBoxWidth = contentBoxWidth ?? 1200;
  const finalCustomWidth = customWidth ?? containerDefaults.maxWidth?.custom ?? 100;

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
  const { currentBreakpoint, getResponsiveValue } = useResponsive();
  const { actualBreakpoint } = useCanvasWidth();
  
  // In editor mode, use actual canvas breakpoint for responsive simulation
  // This makes responsive styles work based on canvas width, not browser window width
  // Memoized to prevent unnecessary recalculations
  const getEditorResponsiveValue = React.useCallback(<T,>(
    values: ResponsiveMap<T> | undefined,
    fallback: T
  ): T => {
    if (!isEditMode || !values) {
      return getResponsiveValue(values ?? {}, fallback);
    }

    // Use actual canvas breakpoint from CanvasWidthContext
    // This is updated by ResizeObserver in CanvasArea, causing re-renders
    if (actualBreakpoint && values[actualBreakpoint] !== undefined) {
      return values[actualBreakpoint];
    }

    // Fallback to current breakpoint from context
    return getResponsiveValue(values ?? {}, fallback);
  }, [isEditMode, getResponsiveValue, actualBreakpoint, currentBreakpoint]);

  const responsiveResolver: ResponsiveResolver = (values, fallback) => 
    getEditorResponsiveValue(values, fallback);

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

  const effectiveFlexDirection = flexDirectionResponsive 
    ? responsiveResolver(flexDirectionResponsive, isChildContainer ? "column" : "row")
    : (flexDirection ?? (isChildContainer ? "column" : "row"));
  const effectiveJustifyContent = justifyContentResponsive
    ? responsiveResolver(justifyContentResponsive, isChildContainer ? "center" : "flex-start")
    : (justifyContent ?? (isChildContainer ? "center" : "flex-start"));
  const effectiveAlignItems = alignItemsResponsive
    ? responsiveResolver(alignItemsResponsive, isChildContainer ? "center" : "stretch")
    : (alignItems ?? (isChildContainer ? "center" : "stretch"));
  const effectiveFlexWrap = flexWrapResponsive
    ? responsiveResolver(flexWrapResponsive, "nowrap")
    : (flexWrap ?? "nowrap");
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
      defaultValue: finalPadding,
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
      defaultValue: finalMargin,
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

  const contentBoxWidthValue = buildResponsiveValueWithUnit({
    responsive: contentBoxWidthResponsive,
    fallbackValue: finalContentBoxWidth,
    fallbackUnit: contentBoxWidthUnit ?? "px",
    resolver: responsiveResolver,
  });

  const customWidthValue = buildResponsiveValueWithUnit({
    responsive: customWidthResponsive,
    fallbackValue: finalCustomWidth,
    fallbackUnit: customWidthUnit ?? "%",
    resolver: responsiveResolver,
  });

  const flexBasisValue = flexBasis !== null && flexBasis !== undefined
    ? buildResponsiveValueWithUnit({
        responsive: flexBasisResponsive,
        fallbackValue: flexBasis,
        fallbackUnit: flexBasisUnit ?? "%",
        resolver: responsiveResolver,
      })
    : undefined;

  const minHeightValue = enableMinHeight
    ? buildResponsiveValueWithUnit({
        responsive: minHeightResponsive,
        fallbackValue: minHeight ?? (minHeightUnit === "vh" ? 50 : 450),
        fallbackUnit: minHeightUnit ?? "px",
        resolver: responsiveResolver,
      })
    : undefined;

  const backgroundStyles = buildBackgroundStyles({
    type: backgroundType,
    color: backgroundColor,
    colorResponsive: backgroundColorResponsive,
    gradient: backgroundGradient,
    image: backgroundImage,
    resolver: responsiveResolver,
  });

  // Generate a unique, stable class name for this component instance to apply hover styles.
  // This must be defined before buildOverlayStyles since it needs className.
  const hoverClassName = `container-hover-${id}`;

  // Build overlay styles for editor preview and export CSS
  const overlayStylesResult = buildOverlayStyles({
    enableOverlay: enableBackgroundOverlay,
    overlayType,
    overlayColor,
    overlayColorResponsive,
    overlayImage,
    overlayPosition,
    overlayPositionResponsive,
    overlayAttachment,
    overlayAttachmentResponsive,
    overlayBlendMode,
    overlayBlendModeResponsive,
    overlayRepeat,
    overlayRepeatResponsive,
    overlaySize,
    overlaySizeResponsive,
    overlayOpacity,
    overlayOpacityResponsive,
    resolver: responsiveResolver,
    className: hoverClassName,
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

  // Generate a unique class name for the content wrapper if needed
  const contentWrapperClassName = needsContentWrapper ? `container-content-${id}` : "";

  // Hover CSS for editor mode (uses resolver for current breakpoint)
  const hoverBackgroundCss = enableBackgroundColorHover && backgroundType === "color" && backgroundColorHover
    ? buildBackgroundHoverCss({
        type: backgroundType,
        colorHover: backgroundColorHover,
        colorHoverResponsive: backgroundColorHoverResponsive,
        gradientHover: backgroundGradientHover,
        resolver: responsiveResolver,
      })
    : "";

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

  // Link color CSS for editor mode (non-responsive, uses static values)
  // In export mode, responsive link color CSS is generated in responsiveCss
  const linkCss = isEditMode ? buildLinkColorCss({
    baseSelector: `.${hoverClassName}`,
    linkColor,
    linkColorHover,
  }) : "";

  const responsiveVisibilityCss = buildVisibilityCss({
    hoverClassName,
    isEditMode,
    hideOnDesktop,
    hideOnTablet,
    hideOnLandscapeMobile,
    hideOnMobile,
  });

  // Generate CSS media queries for responsive values (for exported HTML - no JS required)
  // These will work even without JavaScript in the browser
  // IMPORTANT: In editor mode, we disable CSS media queries and use inline styles instead
  // because CSS media queries respond to browser viewport, not canvas width
  // Only generate CSS media queries for exported HTML (when not in edit mode)
  let responsiveCss = "";
  
  // Skip CSS media queries in editor mode - use inline styles from responsiveResolver instead
  const shouldGenerateMediaQueries = !isEditMode;

  // Generate responsive hover CSS for export mode (base value + media queries for overrides)
  let responsiveHoverCss = "";
  if (shouldGenerateMediaQueries) {
    // Hover background color responsive CSS
    if (enableBackgroundColorHover && backgroundType === "color" && backgroundColorHover && backgroundColorHoverResponsive) {
      responsiveHoverCss += generateHoverBackgroundColorCss(hoverClassName, backgroundColorHoverResponsive, backgroundColorHover);
    }

    // Hover border color responsive CSS
    if (borderStyle && borderStyle !== "none" && borderColorHover && borderColorHoverResponsive) {
      responsiveHoverCss += generateHoverBorderColorCss(hoverClassName, borderColorHoverResponsive, borderColorHover);
    }
  }

  // Only generate CSS media queries for exported HTML, not for editor preview
  if (shouldGenerateMediaQueries) {
    // Padding responsive CSS
    if (paddingResponsive) {
      responsiveCss += generatePaddingCss(hoverClassName, paddingResponsive, {
        top: paddingTop,
        right: paddingRight,
        bottom: paddingBottom,
        left: paddingLeft,
        defaultValue: padding,
      }, paddingUnit);
    }

    // Margin responsive CSS
    if (marginResponsive) {
      responsiveCss += generateMarginCss(hoverClassName, marginResponsive, {
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
        defaultValue: margin,
      }, marginUnit);
    }

    // Gap responsive CSS (only applies to main container when no content wrapper)
    if (!needsContentWrapper && effectiveLayout === "flex") {
      // Generate CSS for row-gap (with or without responsive)
      if (rowGapResponsive) {
        responsiveCss += generateResponsiveCss(hoverClassName, "row-gap", rowGapResponsive, rowGap, rowGapUnit);
      } else if (rowGap !== null && rowGap !== undefined) {
        responsiveCss += `.${hoverClassName} { row-gap: ${rowGap}${rowGapUnit}; }\n`;
      }
      
      // Generate CSS for column-gap (with or without responsive)
      if (columnGapResponsive) {
        responsiveCss += generateResponsiveCss(hoverClassName, "column-gap", columnGapResponsive, columnGap, columnGapUnit);
      } else if (columnGap !== null && columnGap !== undefined) {
        responsiveCss += `.${hoverClassName} { column-gap: ${columnGap}${columnGapUnit}; }\n`;
      }
    }

    // Flex properties responsive CSS (applies to main container when no content wrapper)
    if (!needsContentWrapper && effectiveLayout === "flex") {
      // Generate CSS for flex-direction (with or without responsive)
      const flexDirFallback = flexDirection ?? (isChildContainer ? "column" : "row");
      if (flexDirectionResponsive) {
        responsiveCss += generateResponsiveFlexCss(hoverClassName, "flex-direction", flexDirectionResponsive, flexDirFallback);
      } else if (flexDirFallback) {
        responsiveCss += `.${hoverClassName} { flex-direction: ${flexDirFallback}; }\n`;
      }
      
      // Generate CSS for justify-content (with or without responsive)
      const justifyContentFallback = justifyContent ?? (isChildContainer ? "center" : "flex-start");
      if (justifyContentResponsive) {
        responsiveCss += generateResponsiveFlexCss(hoverClassName, "justify-content", justifyContentResponsive, justifyContentFallback);
      } else if (justifyContentFallback) {
        responsiveCss += `.${hoverClassName} { justify-content: ${justifyContentFallback}; }\n`;
      }
      
      // Generate CSS for align-items (with or without responsive)
      const alignItemsFallback = alignItems ?? (isChildContainer ? "center" : "stretch");
      if (alignItemsResponsive) {
        responsiveCss += generateResponsiveFlexCss(hoverClassName, "align-items", alignItemsResponsive, alignItemsFallback);
      } else if (alignItemsFallback) {
        responsiveCss += `.${hoverClassName} { align-items: ${alignItemsFallback}; }\n`;
      }
      
      // Generate CSS for flex-wrap (with or without responsive)
      const flexWrapFallback = flexWrap ?? "nowrap";
      if (flexWrapResponsive) {
        responsiveCss += generateResponsiveFlexCss(hoverClassName, "flex-wrap", flexWrapResponsive, flexWrapFallback);
      } else if (flexWrapFallback) {
        responsiveCss += `.${hoverClassName} { flex-wrap: ${flexWrapFallback}; }\n`;
      }
    }

    // Flex properties responsive CSS (applies to content wrapper when it exists)
    if (needsContentWrapper && effectiveLayout === "flex") {
      // Generate CSS for flex-direction (with or without responsive)
      const flexDirFallback = flexDirection ?? (isChildContainer ? "column" : "row");
      if (flexDirectionResponsive) {
        responsiveCss += generateResponsiveFlexCss(contentWrapperClassName, "flex-direction", flexDirectionResponsive, flexDirFallback);
      } else if (flexDirFallback) {
        responsiveCss += `.${contentWrapperClassName} { flex-direction: ${flexDirFallback}; }\n`;
      }
      
      // Generate CSS for justify-content (with or without responsive)
      const justifyContentFallback = justifyContent ?? (isChildContainer ? "center" : "flex-start");
      if (justifyContentResponsive) {
        responsiveCss += generateResponsiveFlexCss(contentWrapperClassName, "justify-content", justifyContentResponsive, justifyContentFallback);
      } else if (justifyContentFallback) {
        responsiveCss += `.${contentWrapperClassName} { justify-content: ${justifyContentFallback}; }\n`;
      }
      
      // Generate CSS for align-items (with or without responsive)
      const alignItemsFallback = alignItems ?? (isChildContainer ? "center" : "stretch");
      if (alignItemsResponsive) {
        responsiveCss += generateResponsiveFlexCss(contentWrapperClassName, "align-items", alignItemsResponsive, alignItemsFallback);
      } else if (alignItemsFallback) {
        responsiveCss += `.${contentWrapperClassName} { align-items: ${alignItemsFallback}; }\n`;
      }
      
      // Generate CSS for flex-wrap (with or without responsive)
      const flexWrapFallback = flexWrap ?? "nowrap";
      if (flexWrapResponsive) {
        responsiveCss += generateResponsiveFlexCss(contentWrapperClassName, "flex-wrap", flexWrapResponsive, flexWrapFallback);
      } else if (flexWrapFallback) {
        responsiveCss += `.${contentWrapperClassName} { flex-wrap: ${flexWrapFallback}; }\n`;
      }
      // Gap responsive CSS for content wrapper
      if (rowGapResponsive) {
        responsiveCss += generateResponsiveCss(contentWrapperClassName, "row-gap", rowGapResponsive, rowGap, rowGapUnit);
      } else if (rowGap !== null && rowGap !== undefined) {
        responsiveCss += `.${contentWrapperClassName} { row-gap: ${rowGap}${rowGapUnit}; }\n`;
      }
      
      if (columnGapResponsive) {
        responsiveCss += generateResponsiveCss(contentWrapperClassName, "column-gap", columnGapResponsive, columnGap, columnGapUnit);
      } else if (columnGap !== null && columnGap !== undefined) {
        responsiveCss += `.${contentWrapperClassName} { column-gap: ${columnGap}${columnGapUnit}; }\n`;
      }
    }

    // Background color responsive CSS
    if (backgroundType === "color" && backgroundColorResponsive) {
      responsiveCss += generateBackgroundColorCss(hoverClassName, backgroundColorResponsive, backgroundColor ?? undefined);
    }

    // Border color responsive CSS
    if (borderStyle && borderStyle !== "none" && borderColorResponsive) {
      responsiveCss += generateBorderColorCss(hoverClassName, borderColorResponsive, borderColor ?? undefined);
    }

    // Border radius responsive CSS
    if (borderRadiusResponsive) {
      responsiveCss += generateResponsiveFourSideCss(hoverClassName, "border-radius", borderRadiusResponsive, {
        top: borderTopLeftRadius,
        right: borderTopRightRadius,
        bottom: borderBottomRightRadius,
        left: borderBottomLeftRadius,
        defaultValue: borderRadius,
      }, borderRadiusUnit);
    }

    // Border width responsive CSS
    if (borderWidthResponsive) {
      responsiveCss += generateResponsiveFourSideCss(hoverClassName, "border-width", borderWidthResponsive, {
        top: borderTopWidth,
        right: borderRightWidth,
        bottom: borderBottomWidth,
        left: borderLeftWidth,
        defaultValue: borderWidth,
      }, "px");
    }

    // Flex basis responsive CSS (for child containers)
    // Generate CSS for width/flex-basis even if no responsive prop exists
    if (isChildContainer) {
      if (flexBasisResponsive) {
        responsiveCss += generateResponsiveCss(hoverClassName, "flex-basis", flexBasisResponsive, flexBasis, flexBasisUnit ?? "%");
        // Also set width to ensure it works in preview mode
        responsiveCss += generateResponsiveCss(hoverClassName, "width", flexBasisResponsive, flexBasis, flexBasisUnit ?? "%");
      } else if (flexBasis !== null && flexBasis !== undefined) {
        // Generate base CSS even without responsive prop
        const baseValue = `${flexBasis}${flexBasisUnit ?? "%"}`;
        responsiveCss += `.${hoverClassName} { flex-basis: ${baseValue}; width: ${baseValue}; }\n`;
      }
    }

    // Min height responsive CSS
    if (minHeightResponsive && enableMinHeight) {
      responsiveCss += generateResponsiveCss(hoverClassName, "min-height", minHeightResponsive, minHeight, minHeightUnit ?? "px");
    }

    // Content box width responsive CSS (applies to content wrapper, not main container)
    if (contentBoxWidthResponsive && needsContentWrapper) {
      responsiveCss += generateResponsiveCss(contentWrapperClassName, "max-width", contentBoxWidthResponsive, contentBoxWidth, contentBoxWidthUnit ?? "px");
    }

    // Boxed width CSS (applies to main container when containerWidth is "boxed")
    if (containerWidth === "boxed" && !isChildContainer) {
      const boxedMaxWidth = containerDefaults.maxWidth?.boxed ?? 1200;
      responsiveCss += `.${hoverClassName} { max-width: ${boxedMaxWidth}px; margin-left: auto; margin-right: auto; }\n`;
    }

    // Custom width responsive CSS (applies to main container)
    if (customWidthResponsive && containerWidth === "custom") {
      responsiveCss += generateResponsiveCss(hoverClassName, "max-width", customWidthResponsive, customWidth, customWidthUnit ?? "px");
    }

    // Box shadow responsive CSS
    if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
      responsiveCss += generateBoxShadowCss(
        hoverClassName,
        boxShadowHorizontalResponsive,
        boxShadowVerticalResponsive,
        boxShadowBlurResponsive,
        boxShadowSpreadResponsive,
        boxShadowHorizontal ?? 0,
        boxShadowVertical ?? 0,
        boxShadowBlur ?? 0,
        boxShadowSpread ?? 0,
        boxShadowColor ?? "rgba(0, 0, 0, 0.1)",
        boxShadowPosition ?? "outset"
      );
    }

    // Overlay CSS (for export - pure CSS using pseudo-element)
    if (overlayStylesResult.css) {
      responsiveCss += overlayStylesResult.css;
    }

    // Text color responsive CSS
    if (textColor && textColorResponsive) {
      responsiveCss += generateTextColorCss(hoverClassName, textColorResponsive, textColor);
    }

    // Link color responsive CSS
    if ((linkColor || linkColorHover) && (linkColorResponsive || linkColorHoverResponsive)) {
      responsiveCss += generateLinkColorCss(
        hoverClassName,
        linkColorResponsive,
        linkColor ?? undefined,
        linkColorHoverResponsive,
        linkColorHover ?? undefined
      );
    }

    // Position responsive CSS (only when position is set and not default/static)
    if (position && position !== "default" && position !== "static") {
      if (positionTopResponsive || positionRightResponsive || positionBottomResponsive || positionLeftResponsive) {
        responsiveCss += generatePositionCss(
          hoverClassName,
          positionTopResponsive,
          positionRightResponsive,
          positionBottomResponsive,
          positionLeftResponsive,
          positionTop,
          positionRight,
          positionBottom,
          positionLeft,
          positionTopUnit,
          positionRightUnit,
          positionBottomUnit,
          positionLeftUnit
        );
      }

      // Z-index responsive CSS
      if (zIndex !== null && zIndex !== undefined && zIndexResponsive) {
        responsiveCss += generateZIndexCss(hoverClassName, zIndexResponsive, zIndex);
      }
    }
  }

  const styleTagContent = mergeCssSegments(
    // In editor mode, use buildHoverRule with resolved values
    // In export mode, use responsiveHoverCss which has base + media queries
    isEditMode ? buildHoverRule(hoverClassName, hoverRules) : responsiveHoverCss,
    linkCss,
    responsiveVisibilityCss,
    responsiveCss
  );

  // --- Final Style and Prop Aggregation ---

  // Determine various conditional styles and properties for rendering.
  const hasCustomBorder = borderStyle && borderStyle !== "none";
  // Show a helper border in edit mode for empty containers or columns without a real border.
  const shouldShowHelperBorder = isEditMode && !hasCustomBorder && (!isChildContainer || isEmpty);
  const computedMinHeight = enableMinHeight ? minHeightValue : isEditMode ? "20px" : undefined;
  const hasCustomPosition = position && position !== "default" && position !== "static";
  const formatPositionValue = (value: number | null | undefined, unit: string) => (value !== null && value !== undefined ? `${value}${unit}` : undefined);

  // Assemble the final style object for the main container element from all the helper functions.
  const containerStyle: React.CSSProperties = {
    padding: paddingValue,
    margin: marginValue,
    ...backgroundStyles,
    ...overlayStylesResult.style, // Overlay position relative for pseudo-element
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
    // In edit mode, use inline styles (responsive via responsiveResolver).
    // In preview/export mode, use CSS classes (responsive via media queries).
    display: effectiveLayout === "flex" && !needsContentWrapper ? "flex" : "block",
    flexDirection: isEditMode && effectiveLayout === "flex" && !needsContentWrapper ? (effectiveFlexDirection as React.CSSProperties["flexDirection"]) : undefined,
    justifyContent: isEditMode && effectiveLayout === "flex" && !needsContentWrapper ? (effectiveJustifyContent as React.CSSProperties["justifyContent"]) : undefined,
    alignItems: isEditMode && effectiveLayout === "flex" && !needsContentWrapper ? (equalHeight ? "stretch" : (effectiveAlignItems as React.CSSProperties["alignItems"])) : undefined,
    flexWrap: isEditMode && effectiveLayout === "flex" && !needsContentWrapper ? (effectiveFlexWrap as React.CSSProperties["flexWrap"]) : undefined,
    alignContent: isEditMode && effectiveLayout === "flex" && !needsContentWrapper && effectiveFlexWrap === "wrap" ? (effectiveAlignContent as React.CSSProperties["alignContent"]) : undefined,
    rowGap: isEditMode && effectiveLayout === "flex" && !needsContentWrapper ? rowGapValue : undefined,
    columnGap: isEditMode && effectiveLayout === "flex" && !needsContentWrapper ? columnGapValue : undefined,
    // Sizing properties
    // In edit mode, use inline styles for child container width (responsive via responsiveResolver)
    // In preview/export mode, use CSS classes (responsive via media queries)
    flexBasis: isEditMode ? flexBasisValue : (isChildContainer ? undefined : undefined),
    width: isEditMode 
      ? (isChildContainer && flexBasisValue ? flexBasisValue : "100%")
      : (isChildContainer ? undefined : "100%"),
    maxWidth: isChildContainer ? undefined : containerWidth === "custom" ? customWidthValue : containerWidth === "boxed" ? `${containerDefaults.maxWidth?.boxed ?? 1200}px` : undefined,
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
    maxWidth: needsContentWrapper ? contentBoxWidthValue : undefined,
    marginLeft: needsContentWrapper ? "auto" : undefined,
    marginRight: needsContentWrapper ? "auto" : undefined,
    width: "100%",
    minHeight: "inherit",
    height: isChildContainer ? undefined : equalHeight && effectiveLayout === "flex" ? "100%" : undefined,
    // Flexbox properties are applied here if a content wrapper is used.
    // In edit mode, use inline styles (responsive via responsiveResolver).
    // In preview/export mode, use CSS classes (responsive via media queries).
    display: effectiveLayout === "flex" && needsContentWrapper ? "flex" : undefined,
    flexDirection: isEditMode && effectiveLayout === "flex" && needsContentWrapper ? (effectiveFlexDirection as React.CSSProperties["flexDirection"]) : undefined,
    justifyContent: isEditMode && effectiveLayout === "flex" && needsContentWrapper ? (effectiveJustifyContent as React.CSSProperties["justifyContent"]) : undefined,
    alignItems: isEditMode && effectiveLayout === "flex" && needsContentWrapper ? (equalHeight ? "stretch" : (effectiveAlignItems as React.CSSProperties["alignItems"])) : undefined,
    flexWrap: isEditMode && effectiveLayout === "flex" && needsContentWrapper ? (effectiveFlexWrap as React.CSSProperties["flexWrap"]) : undefined,
    alignContent: isEditMode && effectiveLayout === "flex" && needsContentWrapper && effectiveFlexWrap === "wrap" ? (effectiveAlignContent as React.CSSProperties["alignContent"]) : undefined,
    rowGap: isEditMode && effectiveLayout === "flex" && needsContentWrapper ? rowGapValue : undefined,
    columnGap: isEditMode && effectiveLayout === "flex" && needsContentWrapper ? columnGapValue : undefined,
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
            // Build overlay styles for editor preview (visual feedback)
            const overlayOpacityDecimal = (overlayOpacity ?? 50) / 100;
            let overlayBackgroundStyle: React.CSSProperties = {};
            
            if (enableBackgroundOverlay && overlayType) {
              if (overlayType === "color" && overlayColor) {
                const resolvedOverlayColor = resolveResponsiveValue<string>({
                  resolver: responsiveResolver,
                  responsive: overlayColorResponsive as ResponsiveMap<string>,
                  fallback: overlayColor ?? "rgba(0, 0, 0, 0.5)",
                });
                overlayBackgroundStyle = {
                  backgroundColor: resolvedOverlayColor || "rgba(0, 0, 0, 0.5)",
                };
              } else if (overlayType === "image" && overlayImage) {
                const resolvedPosition = resolveResponsiveValue<string>({
                  resolver: responsiveResolver,
                  responsive: overlayPositionResponsive as ResponsiveMap<string>,
                  fallback: overlayPosition ?? "center",
                });
                const resolvedSize = resolveResponsiveValue<string>({
                  resolver: responsiveResolver,
                  responsive: overlaySizeResponsive as ResponsiveMap<string>,
                  fallback: overlaySize ?? "cover",
                });
                const resolvedRepeat = resolveResponsiveValue<string>({
                  resolver: responsiveResolver,
                  responsive: overlayRepeatResponsive as ResponsiveMap<string>,
                  fallback: overlayRepeat ?? "no-repeat",
                });
                const resolvedAttachment = resolveResponsiveValue<string>({
                  resolver: responsiveResolver,
                  responsive: overlayAttachmentResponsive as ResponsiveMap<string>,
                  fallback: overlayAttachment ?? "scroll",
                });
                overlayBackgroundStyle = {
                  backgroundImage: `url(${overlayImage})`,
                  backgroundPosition: resolvedPosition,
                  backgroundSize: resolvedSize,
                  backgroundRepeat: resolvedRepeat,
                  backgroundAttachment: resolvedAttachment,
                };
              }
              
              const resolvedBlendMode = resolveResponsiveValue<string>({
                resolver: responsiveResolver,
                responsive: overlayBlendModeResponsive as ResponsiveMap<string>,
                fallback: overlayBlendMode ?? "normal",
              });
              
              overlayBackgroundStyle = {
                ...overlayBackgroundStyle,
                mixBlendMode: resolvedBlendMode as React.CSSProperties["mixBlendMode"],
                opacity: overlayOpacityDecimal,
              };
            }

            const content = (
              <>
                {/* Show a "Drop components here" message in edit mode for empty containers. */}
                {isEditMode && isEmpty && <div className="flex items-center justify-center text-gray-400 text-sm h-full min-h-[40px]">Drop components here</div>}

                {/* Render child components passed from the editor. */}
                {children}

                {/* Visual overlay for editor preview (only in edit mode) */}
                {isEditMode && enableBackgroundOverlay && overlayType && Object.keys(overlayBackgroundStyle).length > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      ...overlayBackgroundStyle,
                      zIndex: 1,
                    }}
                  />
                )}
              </>
            );

            // If a content wrapper is needed, wrap the content in it; otherwise, render directly.
            return needsContentWrapper ? (
              <div 
                className={contentWrapperClassName}
                style={contentWrapperStyle}
              >
                {content}
              </div>
            ) : content;
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

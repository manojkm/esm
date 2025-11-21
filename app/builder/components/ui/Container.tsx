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
  const typographyDefaults = settings.typography;
  const borderDefaults = settings.borderDefaults;
  const globalLinkColor = typographyDefaults.linkColor;
  const globalLinkColorHover = typographyDefaults.linkColorHover;
  const globalBorderColor = borderDefaults.borderColor;
  const globalBorderColorHover = borderDefaults.borderColorHover;

  // Props are destructured here. When a user changes a setting in the SettingsPanel,
  // craft.js updates the corresponding prop, and this component re-renders with the new value.
  const {
    children,
    padding = 10, // Default padding for containers (user can clear if needed)
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
    backgroundColor,
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
    borderColor,
    enableBorderColorHover = false,
    borderColorHover,
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

  // Apply global defaults if props are undefined (but not if explicitly null - user cleared it)
  // For padding: default to 10px for containers (can be cleared to null)
  const finalPadding = padding !== undefined ? padding : containerDefaults.padding?.default ?? 10;
  const finalMargin = margin !== undefined ? margin : containerDefaults.margin?.default ?? 0;
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
  const getEditorResponsiveValue = React.useCallback(
    <T,>(values: ResponsiveMap<T> | undefined, fallback: T): T => {
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
    },
    [isEditMode, getResponsiveValue, actualBreakpoint, currentBreakpoint],
  );

  const responsiveResolver: ResponsiveResolver = (values, fallback) => getEditorResponsiveValue(values, fallback);

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

  const effectiveFlexDirection = flexDirectionResponsive ? responsiveResolver(flexDirectionResponsive, isChildContainer ? "column" : "row") : flexDirection ?? (isChildContainer ? "column" : "row");
  const effectiveJustifyContent = justifyContentResponsive ? responsiveResolver(justifyContentResponsive, isChildContainer ? "center" : "flex-start") : justifyContent ?? (isChildContainer ? "center" : "flex-start");
  const effectiveAlignItems = alignItemsResponsive ? responsiveResolver(alignItemsResponsive, isChildContainer ? "center" : "stretch") : alignItems ?? (isChildContainer ? "center" : "stretch");
  const effectiveFlexWrap = flexWrapResponsive ? responsiveResolver(flexWrapResponsive, "nowrap") : flexWrap ?? "nowrap";
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
        const newNodeTree = query.parseReactElement(<Element is={Container} flexBasis={col.width} flexBasisUnit="%" layout="flex" flexDirection="column" justifyContent="center" alignItems="center" flexWrap="nowrap" padding={10} canvas />).toNodeTree();
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

  const flexBasisValue =
    flexBasis !== null && flexBasis !== undefined
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
    color: backgroundColor ?? null,
    colorResponsive: backgroundColorResponsive,
    gradient: backgroundGradient,
    image: backgroundImage,
    resolver: responsiveResolver,
  });

  // Generate a unique, stable class name for this component instance to apply all styles.
  // This must be defined before buildOverlayStyles since it needs className.
  const componentClassName = `container-${id}`;

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
    className: componentClassName,
  });

  // Use global defaults if not set
  const effectiveBorderColor = borderColor ?? globalBorderColor;
  const borderStyles = buildBorderStyles({
    style: borderStyle,
    color: effectiveBorderColor ?? undefined,
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
  const hoverBackgroundCss =
    enableBackgroundColorHover && backgroundType === "color" && backgroundColorHover
      ? buildBackgroundHoverCss({
          type: backgroundType,
          colorHover: backgroundColorHover,
          colorHoverResponsive: backgroundColorHoverResponsive,
          gradientHover: backgroundGradientHover,
          resolver: responsiveResolver,
        })
      : "";

  // Use global defaults if not set, but only if hover is enabled
  const effectiveBorderColorHover = enableBorderColorHover ? borderColorHover ?? globalBorderColorHover : undefined;
  const hoverBorderCss = enableBorderColorHover
    ? buildBorderHoverCss({
        style: borderStyle,
        colorHover: effectiveBorderColorHover ?? undefined,
        colorHoverResponsive: borderColorHoverResponsive,
        resolver: responsiveResolver,
      })
    : "";

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
  // Use global defaults if not set
  const effectiveLinkColor = linkColor ?? globalLinkColor;
  const effectiveLinkColorHover = linkColorHover ?? globalLinkColorHover;
  const linkCss = isEditMode
    ? buildLinkColorCss({
        baseSelector: `.${componentClassName}`,
        linkColor: effectiveLinkColor ?? undefined,
        linkColorHover: effectiveLinkColorHover ?? undefined,
      })
    : "";

  const responsiveVisibilityCss = buildVisibilityCss({
    componentClassName,
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
      responsiveHoverCss += generateHoverBackgroundColorCss(componentClassName, backgroundColorHoverResponsive, backgroundColorHover);
    }

    // Hover border color responsive CSS
    // Use global defaults if not set, but only if hover is enabled
    if (enableBorderColorHover) {
      const effectiveBorderColorHover = borderColorHover ?? globalBorderColorHover;
      if (borderStyle && borderStyle !== "none" && effectiveBorderColorHover) {
        if (borderColorHoverResponsive) {
          responsiveHoverCss += generateHoverBorderColorCss(componentClassName, borderColorHoverResponsive, effectiveBorderColorHover);
        } else {
          // Generate base CSS for non-responsive hover border color
          responsiveHoverCss += `.${componentClassName}:hover { border-color: ${effectiveBorderColorHover} !important; }\n`;
        }
      }
    }
  }

  // Only generate CSS media queries for exported HTML, not for editor preview
  if (shouldGenerateMediaQueries) {
    // Padding responsive CSS - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    if (paddingResponsive) {
      responsiveCss += generatePaddingCss(
        componentClassName,
        paddingResponsive,
        {
          top: paddingTop,
          right: paddingRight,
          bottom: paddingBottom,
          left: paddingLeft,
          defaultValue: padding,
        },
        paddingUnit,
      );
    } else if (padding !== null && padding !== undefined) {
      // Generate base CSS for non-responsive padding only if explicitly set (including 0)
      const top = paddingTop ?? padding;
      const right = paddingRight ?? padding;
      const bottom = paddingBottom ?? padding;
      const left = paddingLeft ?? padding;
      const paddingValue = `${top}${paddingUnit} ${right}${paddingUnit} ${bottom}${paddingUnit} ${left}${paddingUnit}`;
      responsiveCss += `.${componentClassName} { padding: ${paddingValue}; }\n`;
    }

    // Margin responsive CSS - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    if (marginResponsive) {
      responsiveCss += generateMarginCss(
        componentClassName,
        marginResponsive,
        {
          top: marginTop,
          right: marginRight,
          bottom: marginBottom,
          left: marginLeft,
          defaultValue: margin,
        },
        marginUnit,
      );
    } else if (margin !== null && margin !== undefined) {
      // Generate base CSS for non-responsive margin if explicitly set
      const top = marginTop ?? margin ?? 0;
      const right = marginRight ?? margin ?? 0;
      const bottom = marginBottom ?? margin ?? 0;
      const left = marginLeft ?? margin ?? 0;
      const marginValue = `${top}${marginUnit} ${right}${marginUnit} ${bottom}${marginUnit} ${left}${marginUnit}`;
      responsiveCss += `.${componentClassName} { margin: ${marginValue}; }\n`;
    }

    // Gap responsive CSS (only applies to main container when no content wrapper)
    if (!needsContentWrapper && effectiveLayout === "flex") {
      // Generate CSS for row-gap (with or without responsive)
      if (rowGapResponsive) {
        responsiveCss += generateResponsiveCss(componentClassName, "row-gap", rowGapResponsive, rowGap, rowGapUnit);
      } else if (rowGap !== null && rowGap !== undefined) {
        responsiveCss += `.${componentClassName} { row-gap: ${rowGap}${rowGapUnit}; }\n`;
      }

      // Generate CSS for column-gap (with or without responsive)
      if (columnGapResponsive) {
        responsiveCss += generateResponsiveCss(componentClassName, "column-gap", columnGapResponsive, columnGap, columnGapUnit);
      } else if (columnGap !== null && columnGap !== undefined) {
        responsiveCss += `.${componentClassName} { column-gap: ${columnGap}${columnGapUnit}; }\n`;
      }
    }

    // Flex properties responsive CSS (applies to main container when no content wrapper)
    if (!needsContentWrapper && effectiveLayout === "flex") {
      // Generate CSS for flex-direction (with or without responsive)
      const flexDirFallback = flexDirection ?? (isChildContainer ? "column" : "row");
      if (flexDirectionResponsive) {
        responsiveCss += generateResponsiveFlexCss(componentClassName, "flex-direction", flexDirectionResponsive, flexDirFallback);
      } else if (flexDirFallback) {
        responsiveCss += `.${componentClassName} { flex-direction: ${flexDirFallback}; }\n`;
      }

      // Generate CSS for justify-content (with or without responsive)
      const justifyContentFallback = justifyContent ?? (isChildContainer ? "center" : "flex-start");
      if (justifyContentResponsive) {
        responsiveCss += generateResponsiveFlexCss(componentClassName, "justify-content", justifyContentResponsive, justifyContentFallback);
      } else if (justifyContentFallback) {
        responsiveCss += `.${componentClassName} { justify-content: ${justifyContentFallback}; }\n`;
      }

      // Generate CSS for align-items (with or without responsive)
      const alignItemsFallback = alignItems ?? (isChildContainer ? "center" : "stretch");
      if (alignItemsResponsive) {
        responsiveCss += generateResponsiveFlexCss(componentClassName, "align-items", alignItemsResponsive, alignItemsFallback);
      } else if (alignItemsFallback) {
        responsiveCss += `.${componentClassName} { align-items: ${alignItemsFallback}; }\n`;
      }

      // Generate CSS for flex-wrap (with or without responsive)
      const flexWrapFallback = flexWrap ?? "nowrap";
      if (flexWrapResponsive) {
        responsiveCss += generateResponsiveFlexCss(componentClassName, "flex-wrap", flexWrapResponsive, flexWrapFallback);
      } else if (flexWrapFallback) {
        responsiveCss += `.${componentClassName} { flex-wrap: ${flexWrapFallback}; }\n`;
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

    // Background color responsive CSS - apply to wrapper div
    if (backgroundType === "color") {
      if (backgroundColorResponsive) {
        // Extract fallback from backgroundColor or backgroundColorResponsive.desktop
        const fallbackColor = backgroundColor ?? (typeof backgroundColorResponsive.desktop === "string" ? backgroundColorResponsive.desktop : undefined);
        if (fallbackColor) {
          responsiveCss += generateBackgroundColorCss(componentClassName, backgroundColorResponsive, fallbackColor);
        }
      } else if (backgroundColor) {
        // Generate base CSS for non-responsive background color
        responsiveCss += `.${componentClassName} { background-color: ${backgroundColor}; }\n`;
      }
    } else if (backgroundType === "gradient" && backgroundGradient) {
      // Generate CSS for gradient background
      responsiveCss += `.${componentClassName} { background-image: ${backgroundGradient}; }\n`;
    } else if (backgroundType === "image" && backgroundImage) {
      // Generate CSS for image background
      responsiveCss += `.${componentClassName} { background-image: url(${backgroundImage}); background-size: cover; background-position: center; background-repeat: no-repeat; }\n`;
    }

    // Border color responsive CSS - apply to wrapper div
    // Use global defaults if not set
    const effectiveBorderColor = borderColor ?? globalBorderColor;
    if (borderStyle && borderStyle !== "none") {
      if (borderColorResponsive) {
        responsiveCss += generateBorderColorCss(componentClassName, borderColorResponsive, effectiveBorderColor ?? undefined);
      } else if (effectiveBorderColor) {
        // Generate base CSS for non-responsive border color
        responsiveCss += `.${componentClassName} { border-color: ${effectiveBorderColor}; }\n`;
      }
      // Generate base CSS for border style
      responsiveCss += `.${componentClassName} { border-style: ${borderStyle}; }\n`;
    }

    // Border radius responsive CSS - apply to wrapper div
    if (borderRadiusResponsive) {
      responsiveCss += generateResponsiveFourSideCss(
        componentClassName,
        "border-radius",
        borderRadiusResponsive,
        {
          top: borderTopLeftRadius,
          right: borderTopRightRadius,
          bottom: borderBottomRightRadius,
          left: borderBottomLeftRadius,
          defaultValue: borderRadius,
        },
        borderRadiusUnit,
      );
    } else if (borderRadius !== null && borderRadius !== undefined && borderRadius !== 0) {
      // Generate base CSS for non-responsive border radius
      const topLeft = borderTopLeftRadius ?? borderRadius;
      const topRight = borderTopRightRadius ?? borderRadius;
      const bottomRight = borderBottomRightRadius ?? borderRadius;
      const bottomLeft = borderBottomLeftRadius ?? borderRadius;
      const borderRadiusValue = `${topLeft}${borderRadiusUnit} ${topRight}${borderRadiusUnit} ${bottomRight}${borderRadiusUnit} ${bottomLeft}${borderRadiusUnit}`;
      responsiveCss += `.${componentClassName} { border-radius: ${borderRadiusValue}; }\n`;
    }

    // Border width responsive CSS - apply to wrapper div
    if (borderStyle && borderStyle !== "none") {
      if (borderWidthResponsive) {
        responsiveCss += generateResponsiveFourSideCss(
          componentClassName,
          "border-width",
          borderWidthResponsive,
          {
            top: borderTopWidth,
            right: borderRightWidth,
            bottom: borderBottomWidth,
            left: borderLeftWidth,
            defaultValue: borderWidth,
          },
          "px",
        );
      } else if (borderWidth !== null && borderWidth !== undefined) {
        // Generate base CSS for non-responsive border width
        const top = borderTopWidth ?? borderWidth;
        const right = borderRightWidth ?? borderWidth;
        const bottom = borderBottomWidth ?? borderWidth;
        const left = borderLeftWidth ?? borderWidth;
        const borderWidthValue = `${top}px ${right}px ${bottom}px ${left}px`;
        responsiveCss += `.${componentClassName} { border-width: ${borderWidthValue}; }\n`;
      }
    }

    // Flex basis responsive CSS (for child containers)
    // Generate CSS for width/flex-basis even if no responsive prop exists
    if (isChildContainer) {
      if (flexBasisResponsive) {
        responsiveCss += generateResponsiveCss(componentClassName, "flex-basis", flexBasisResponsive, flexBasis, flexBasisUnit ?? "%");
        // Also set width to ensure it works in preview mode
        responsiveCss += generateResponsiveCss(componentClassName, "width", flexBasisResponsive, flexBasis, flexBasisUnit ?? "%");
      } else if (flexBasis !== null && flexBasis !== undefined) {
        // Generate base CSS even without responsive prop
        const baseValue = `${flexBasis}${flexBasisUnit ?? "%"}`;
        responsiveCss += `.${componentClassName} { flex-basis: ${baseValue}; width: ${baseValue}; }\n`;
      }
    }

    // Min height responsive CSS - apply to wrapper div
    if (enableMinHeight) {
      if (minHeightResponsive) {
        responsiveCss += generateResponsiveCss(componentClassName, "min-height", minHeightResponsive, minHeight, minHeightUnit ?? "px");
      } else if (minHeight !== null && minHeight !== undefined) {
        // Generate base CSS for non-responsive min-height
        responsiveCss += `.${componentClassName} { min-height: ${minHeight}${minHeightUnit ?? "px"}; }\n`;
      }
    }

    // Content box width responsive CSS (applies to content wrapper, not main container)
    if (contentBoxWidthResponsive && needsContentWrapper) {
      responsiveCss += generateResponsiveCss(contentWrapperClassName, "max-width", contentBoxWidthResponsive, contentBoxWidth, contentBoxWidthUnit ?? "px");
    }

    // Boxed width CSS (applies to main container when containerWidth is "boxed")
    if (containerWidth === "boxed" && !isChildContainer) {
      const boxedMaxWidth = containerDefaults.maxWidth?.boxed ?? 1200;
      responsiveCss += `.${componentClassName} { max-width: ${boxedMaxWidth}px; margin-left: auto; margin-right: auto; }\n`;
    }

    // Custom width responsive CSS (applies to main container)
    if (customWidthResponsive && containerWidth === "custom") {
      responsiveCss += generateResponsiveCss(componentClassName, "max-width", customWidthResponsive, customWidth, customWidthUnit ?? "px");
    }

    // Box shadow responsive CSS - apply to wrapper div
    if (enableBoxShadow) {
      if (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive) {
        responsiveCss += generateBoxShadowCss(componentClassName, boxShadowHorizontalResponsive, boxShadowVerticalResponsive, boxShadowBlurResponsive, boxShadowSpreadResponsive, boxShadowHorizontal ?? 0, boxShadowVertical ?? 0, boxShadowBlur ?? 0, boxShadowSpread ?? 0, boxShadowColor ?? "rgba(0, 0, 0, 0.1)", boxShadowPosition ?? "outset");
      } else {
        // Generate base CSS for non-responsive box shadow
        const shadowValue = `${boxShadowHorizontal ?? 0}px ${boxShadowVertical ?? 0}px ${boxShadowBlur ?? 0}px ${boxShadowSpread ?? 0}px ${boxShadowColor ?? "rgba(0, 0, 0, 0.1)"}`;
        const insetValue = boxShadowPosition === "inset" ? "inset " : "";
        responsiveCss += `.${componentClassName} { box-shadow: ${insetValue}${shadowValue}; }\n`;
      }
    }

    // Overlay CSS (for export - pure CSS using pseudo-element)
    if (overlayStylesResult.css) {
      responsiveCss += overlayStylesResult.css;
    }

    // Text color responsive CSS - target content class
    if (textColor && textColorResponsive) {
      responsiveCss += generateTextColorCss(`${componentClassName} .container-content`, textColorResponsive, textColor);
    } else if (textColor) {
      // Non-responsive text color
      responsiveCss += `.${componentClassName} .container-content { color: ${textColor}; }\n`;
    }

    // Link color responsive CSS - target content class
    // Use global defaults if not set
    const effectiveLinkColor = linkColor ?? globalLinkColor;
    const effectiveLinkColorHover = linkColorHover ?? globalLinkColorHover;
    if ((effectiveLinkColor || effectiveLinkColorHover) && (linkColorResponsive || linkColorHoverResponsive)) {
      responsiveCss += generateLinkColorCss(`${componentClassName} .container-content`, linkColorResponsive, effectiveLinkColor ?? undefined, linkColorHoverResponsive, effectiveLinkColorHover ?? undefined);
    } else if (effectiveLinkColor || effectiveLinkColorHover) {
      // Non-responsive link colors
      if (effectiveLinkColor) {
        responsiveCss += `.${componentClassName} .container-content a { color: ${effectiveLinkColor}; }\n`;
      }
      if (effectiveLinkColorHover) {
        responsiveCss += `.${componentClassName} .container-content a:hover { color: ${effectiveLinkColorHover}; }\n`;
      }
    }

    // Position responsive CSS (only when position is set and not default/static) - apply to wrapper div
    if (position && position !== "default" && position !== "static") {
      if (positionTopResponsive || positionRightResponsive || positionBottomResponsive || positionLeftResponsive) {
        responsiveCss += generatePositionCss(componentClassName, positionTopResponsive, positionRightResponsive, positionBottomResponsive, positionLeftResponsive, positionTop, positionRight, positionBottom, positionLeft, positionTopUnit, positionRightUnit, positionBottomUnit, positionLeftUnit);
      } else {
        // Generate base CSS for non-responsive position
        responsiveCss += `.${componentClassName} { position: ${position}; }\n`;
        if (positionTop !== null && positionTop !== undefined) {
          responsiveCss += `.${componentClassName} { top: ${positionTop}${positionTopUnit ?? "px"}; }\n`;
        }
        if (positionRight !== null && positionRight !== undefined) {
          responsiveCss += `.${componentClassName} { right: ${positionRight}${positionRightUnit ?? "px"}; }\n`;
        }
        if (positionBottom !== null && positionBottom !== undefined) {
          responsiveCss += `.${componentClassName} { bottom: ${positionBottom}${positionBottomUnit ?? "px"}; }\n`;
        }
        if (positionLeft !== null && positionLeft !== undefined) {
          responsiveCss += `.${componentClassName} { left: ${positionLeft}${positionLeftUnit ?? "px"}; }\n`;
        }
      }

      // Z-index responsive CSS - apply to wrapper div
      if (zIndex !== null && zIndex !== undefined) {
        if (zIndexResponsive) {
          responsiveCss += generateZIndexCss(componentClassName, zIndexResponsive, zIndex);
        } else {
          // Generate base CSS for non-responsive z-index
          responsiveCss += `.${componentClassName} { z-index: ${zIndex}; }\n`;
        }
      }
    }
  }

  const styleTagContent = mergeCssSegments(
    // In editor mode, use buildHoverRule with resolved values
    // In export mode, use responsiveHoverCss which has base + media queries
    isEditMode ? buildHoverRule(componentClassName, hoverRules) : responsiveHoverCss,
    linkCss,
    responsiveVisibilityCss,
    responsiveCss,
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
  // In preview mode, layout styles (padding, margin, background, border, boxShadow) are applied via CSS classes.
  // Only keep inline styles for properties that can't be CSS (like overlay position relative for pseudo-element).
  
  // Check if we need to set marginLeft/marginRight for centering (boxed/custom containers)
  const needsCentering = !isChildContainer && (containerWidth === "boxed" || containerWidth === "custom");
  
  // Build margin styles - avoid mixing shorthand and non-shorthand properties
  // If we need centering, use individual margin properties; otherwise use shorthand
  const marginStyles: React.CSSProperties = isEditMode
    ? needsCentering
      ? (() => {
          // Parse marginValue string (format: "top right bottom left") to extract individual values
          const marginParts = marginValue ? marginValue.split(" ") : ["0px", "0px", "0px", "0px"];
          return {
            marginTop: marginParts[0] || "0px",
            marginRight: "auto", // Override with auto for centering
            marginBottom: marginParts[2] || "0px",
            marginLeft: "auto", // Override with auto for centering
          };
        })()
      : { margin: marginValue }
    : {};
  
  const containerStyle: React.CSSProperties = {
    // Padding and margin only in edit mode (in preview mode, applied via CSS to wrapper)
    padding: isEditMode ? paddingValue : undefined,
    ...marginStyles,
    // Background styles only in edit mode (in preview mode, backgrounds are applied via CSS to wrapper)
    ...(isEditMode ? backgroundStyles : {}),
    // Overlay position relative is needed for pseudo-element in both modes
    ...overlayStylesResult.style, // Overlay position relative for pseudo-element
    // Border styles only in edit mode (in preview mode, borders are applied via CSS to wrapper)
    ...(isEditMode ? borderStyles : {}),
    // Box shadow only in edit mode (in preview mode, applied via CSS to wrapper)
    ...(isEditMode ? boxShadowStyles : {}),
    // Text color styles are NOT included here - they're applied to .container-content via CSS
    ...(shouldShowHelperBorder
      ? {
          border: "1px dashed rgba(148, 163, 184, 0.9)",
        }
      : {}),
    minHeight: isEditMode ? computedMinHeight : undefined, // In preview mode, min-height is applied via CSS
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
    flexBasis: isEditMode ? flexBasisValue : isChildContainer ? undefined : undefined,
    width: isEditMode ? (isChildContainer && flexBasisValue ? flexBasisValue : "100%") : isChildContainer ? undefined : "100%",
    maxWidth: isChildContainer ? undefined : containerWidth === "custom" ? customWidthValue : containerWidth === "boxed" ? `${containerDefaults.maxWidth?.boxed ?? 1200}px` : undefined,
    overflow: overflow as React.CSSProperties["overflow"],
    // Positioning properties only in edit mode (in preview mode, applied via CSS to wrapper)
    position: isEditMode && hasCustomPosition ? (position as React.CSSProperties["position"]) : undefined,
    top: isEditMode && hasCustomPosition ? formatPositionValue(positionTop, positionTopUnit) : undefined,
    right: isEditMode && hasCustomPosition ? formatPositionValue(positionRight, positionRightUnit) : undefined,
    bottom: isEditMode && hasCustomPosition ? formatPositionValue(positionBottom, positionBottomUnit) : undefined,
    left: isEditMode && hasCustomPosition ? formatPositionValue(positionLeft, positionLeftUnit) : undefined,
    zIndex: isEditMode && zIndex ? zIndex : undefined,
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
      ${componentClassName}
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

            // Always wrap content in container-content div for CSS targeting
            // When needsContentWrapper is true, combine both classes on the same element
            // When needsContentWrapper is false, use a simple wrapper that doesn't interfere with flexbox
            if (needsContentWrapper) {
              // Use existing wrapper with both classes
              return (
                <div className={`${contentWrapperClassName} container-content`} style={contentWrapperStyle}>
                  {content}
                </div>
              );
            } else {
              // Simple wrapper that doesn't interfere with flexbox layout
              // Use display: contents so the wrapper doesn't create a new layout context
              // This allows children to remain direct flex items when parent is flex
              return (
                <div className="container-content" style={{ display: "contents" }}>
                  {content}
                </div>
              );
            }
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

"use client";

import React, { useRef, useMemo } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { buildBackgroundHoverCss, buildBackgroundStyles, buildBorderHoverCss, buildBorderStyles, buildBoxShadowStyle, buildTextColorStyles, buildVisibilityCss, mergeCssSegments, parseDataAttributes, type ResponsiveMap, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import { generateHoverBackgroundColorCss, generateHoverBorderColorCss } from "@/app/builder/lib/style-system/css-responsive";
import { generateComponentClassName } from "@/app/builder/lib/component-styles";
import type { HeadingProps } from "./heading/types";
import { resolveHeadingTypography, resolveSubHeadingTypography, resolveSpacing, resolveSeparator, type TypographyDefaults } from "./heading/headingStyleHelpers";
import { generateHeadingCss } from "./heading/headingCssGenerator";
import { useHeadingEditing } from "./heading/useHeadingEditing";
import { HeadingContent } from "./heading/HeadingContent";
import { SubHeadingContent } from "./heading/SubHeadingContent";
import { Separator } from "./heading/Separator";

export const Heading: React.FC<HeadingProps> = (props) => {
  // Get global settings for defaults
  const { settings } = useGlobalSettings();
  const typographyDefaults: TypographyDefaults = settings.typography;
  const borderDefaults = settings.borderDefaults;
  const globalBorderColor = borderDefaults.borderColor;
  const globalBorderColorHover = borderDefaults.borderColorHover;

  const {
    text = "Heading",
    subHeading = "",
    enableSubHeading = false,
    subHeadingPosition = "below",
    headingTag = "h2",
    headingWrapper = "div",
    textAlign,
    textAlignResponsive,
    separatorStyle = "none",
    // Background
    backgroundColor,
    enableBackgroundColorHover = false,
    backgroundColorHover = null,
    backgroundColorResponsive,
    backgroundColorHoverResponsive,
    backgroundType = null,
    backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundImage = "",
    // Border
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
    // Box Shadow
    boxShadowColor = "rgba(0, 0, 0, 0.1)",
    boxShadowHorizontal,
    boxShadowVertical,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowPosition,
    enableBoxShadow = false,
    boxShadowHorizontalResponsive,
    boxShadowVerticalResponsive,
    boxShadowBlurResponsive,
    boxShadowSpreadResponsive,
    // Position
    position,
    top = null,
    right = null,
    bottom = null,
    left = null,
    positionUnit = "px",
    zIndex = null,
    zIndexResponsive,
    // Attributes & Visibility
    className = "",
    cssId,
    dataAttributes,
    ariaLabel,
    hideOnDesktop = false,
    hideOnTablet = false,
    hideOnLandscapeMobile = false,
    hideOnMobile = false,
    // Custom CSS
    customCSS,
    // Hover colors
    headingTextColorHover,
    headingTextColorHoverResponsive,
    subHeadingTextColorHover,
    subHeadingTextColorHoverResponsive,
  } = props;

  const { id, connectors, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const isEditMode = enabled;

  const { getResponsiveValue } = useResponsive();
  const { actualBreakpoint } = useCanvasWidth();

  const getEditorResponsiveValue = React.useCallback(
    <T,>(values: ResponsiveMap<T> | undefined, fallback: T): T => {
      if (!isEditMode || !values) {
        return getResponsiveValue(values ?? {}, fallback);
      }
      if (actualBreakpoint && values[actualBreakpoint] !== undefined) {
        return values[actualBreakpoint];
      }
      return getResponsiveValue(values ?? {}, fallback);
    },
    [isEditMode, getResponsiveValue, actualBreakpoint],
  );

  const responsiveResolver: ResponsiveResolver = React.useCallback((values, fallback) => getEditorResponsiveValue(values, fallback), [getEditorResponsiveValue]);

  // Use editing hook
  const editingState = useHeadingEditing(props);
  const { editableHeading, editableSubHeading, currentHeadingText, currentSubHeadingText, setEditableHeading, setEditableSubHeading, handleHeadingChange: onHeadingChange, handleSubHeadingChange: onSubHeadingChange, selected: isSelected } = editingState;

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Generate unique class name
  const componentClassName = generateComponentClassName(id, cssId, "heading");

  // Resolve responsive values using helpers
  const effectiveTextAlign = textAlignResponsive ? responsiveResolver(textAlignResponsive, textAlign || "left") : textAlign || "left";

  const resolvedHeadingTypography = useMemo(() => resolveHeadingTypography(props, typographyDefaults, headingTag, responsiveResolver), [props, typographyDefaults, headingTag, responsiveResolver]);

  const resolvedSubHeadingTypography = useMemo(() => resolveSubHeadingTypography(props, typographyDefaults, responsiveResolver), [props, typographyDefaults, responsiveResolver]);

  const resolvedSpacing = useMemo(() => resolveSpacing(props, responsiveResolver), [props, responsiveResolver]);

  const resolvedSeparator = useMemo(() => resolveSeparator(props, responsiveResolver), [props, responsiveResolver]);

  // Generate CSS for preview mode
  const { responsiveCss, responsiveHoverCss } = useMemo(
    () =>
      generateHeadingCss({
        componentClassName,
        props,
        resolvedHeadingTypography,
        resolvedSubHeadingTypography,
        resolvedSpacing,
        resolvedSeparator,
        typographyDefaults,
        globalBorderColor: globalBorderColor || "#000000",
        isEditMode,
      }),
    [componentClassName, props, resolvedHeadingTypography, resolvedSubHeadingTypography, resolvedSpacing, resolvedSeparator, typographyDefaults, globalBorderColor, isEditMode],
  );

  // Build styles for edit mode
  const backgroundStyles = buildBackgroundStyles({
    type: backgroundType,
    color: backgroundColor ?? null,
    colorResponsive: backgroundColorResponsive,
    gradient: backgroundGradient,
    image: backgroundImage,
    resolver: responsiveResolver,
  });

  const effectiveBorderColor = borderColor ?? globalBorderColor;
  const borderStyles = buildBorderStyles({
    style: borderStyle === "none" ? undefined : borderStyle,
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

  const boxShadowStyle = buildBoxShadowStyle({
    enable: enableBoxShadow,
    horizontal: boxShadowHorizontal ?? 0,
    vertical: boxShadowVertical ?? 0,
    blur: boxShadowBlur ?? 0,
    spread: boxShadowSpread ?? 0,
    color: boxShadowColor,
    position: boxShadowPosition ?? null,
    resolver: responsiveResolver,
    horizontalResponsive: boxShadowHorizontalResponsive,
    verticalResponsive: boxShadowVerticalResponsive,
    blurResponsive: boxShadowBlurResponsive,
    spreadResponsive: boxShadowSpreadResponsive,
  });

  const headingTextColorStyles = buildTextColorStyles({
    color: resolvedHeadingTypography.textColor,
  });

  const subHeadingTextColorStyles = buildTextColorStyles({
    color: resolvedSubHeadingTypography.textColor,
  });

  // Build hover CSS
  let hoverCss = "";
  if (!isEditMode) {
    hoverCss = responsiveHoverCss;
  } else {
    // Edit mode hover CSS - resolve hover colors and only apply if not null
    if (headingTextColorHover) {
      const resolvedHoverColor = headingTextColorHoverResponsive ? responsiveResolver(headingTextColorHoverResponsive, headingTextColorHover) : headingTextColorHover;
      // Only apply if resolved color is not null (null means reset)
      if (resolvedHoverColor !== null && resolvedHoverColor !== undefined) {
        hoverCss += `.${componentClassName} .heading-text:hover { color: ${resolvedHoverColor} !important; } `;
      }
    }

    if (enableSubHeading && subHeadingTextColorHover) {
      const resolvedSubHoverColor = subHeadingTextColorHoverResponsive ? responsiveResolver(subHeadingTextColorHoverResponsive, subHeadingTextColorHover) : subHeadingTextColorHover;
      // Only apply if resolved color is not null (null means reset)
      if (resolvedSubHoverColor !== null && resolvedSubHoverColor !== undefined) {
        hoverCss += `.${componentClassName} .sub-heading-text:hover { color: ${resolvedSubHoverColor} !important; } `;
      }
    }
  }

  // Background hover CSS
  if (enableBackgroundColorHover && backgroundColorHover) {
    if (!isEditMode) {
      if (backgroundColorHoverResponsive) {
        hoverCss += generateHoverBackgroundColorCss(componentClassName, backgroundColorHoverResponsive, backgroundColorHover);
      } else {
        hoverCss += `.${componentClassName}:hover { background-color: ${backgroundColorHover} !important; } `;
      }
    } else {
      if (backgroundType === "color") {
        const hoverBackgroundCss = buildBackgroundHoverCss({
          type: backgroundType,
          colorHover: backgroundColorHover,
          colorHoverResponsive: backgroundColorHoverResponsive,
          resolver: responsiveResolver,
        });
        if (hoverBackgroundCss) {
          hoverCss += `.${componentClassName}:hover { ${hoverBackgroundCss} } `;
        }
      }
    }
  }

  // Border hover CSS
  if (enableBorderColorHover && borderStyle && borderStyle !== "none") {
    const effectiveBorderColorHover = borderColorHover ?? globalBorderColorHover;
    if (effectiveBorderColorHover) {
      if (!isEditMode) {
        if (borderColorHoverResponsive) {
          hoverCss += generateHoverBorderColorCss(componentClassName, borderColorHoverResponsive, effectiveBorderColorHover);
        } else {
          hoverCss += `.${componentClassName}:hover { border-color: ${effectiveBorderColorHover} !important; } `;
        }
      } else {
        const hoverBorderCss = buildBorderHoverCss({
          style: borderStyle,
          colorHover: effectiveBorderColorHover,
          colorHoverResponsive: borderColorHoverResponsive,
          resolver: responsiveResolver,
        });
        if (hoverBorderCss) {
          hoverCss += `.${componentClassName}:hover { ${hoverBorderCss} } `;
        }
      }
    }
  }

  // Visibility CSS
  const visibilityCss = buildVisibilityCss({
    hoverClassName: componentClassName,
    isEditMode,
    hideOnDesktop,
    hideOnTablet,
    hideOnLandscapeMobile,
    hideOnMobile,
  });

  const hasCustomPosition = position && position !== "default" && position !== "static";
  const formatPositionValue = (value: number | null | undefined, unit: string): string | undefined => {
    if (value === null || value === undefined) return undefined;
    return `${value}${unit}`;
  };

  // Add placeholder CSS for ContentEditable
  const placeholderCss = `
    .${componentClassName} .heading-text[data-placeholder]:empty::before,
    .${componentClassName} .sub-heading-text[data-placeholder]:empty::before {
      content: attr(data-placeholder);
      color: #9ca3af;
      pointer-events: none;
      position: absolute;
    }
    .${componentClassName} .heading-text[data-placeholder]:empty,
    .${componentClassName} .sub-heading-text[data-placeholder]:empty {
      position: relative;
    }
  `;

  // Combine all CSS
  const styleTagContent = mergeCssSegments(responsiveCss, hoverCss, visibilityCss, placeholderCss, customCSS || "");

  // Build inline styles for edit mode
  const wrapperStyle: React.CSSProperties = {
    padding: isEditMode ? resolvedSpacing.padding : undefined,
    margin: isEditMode ? resolvedSpacing.margin : undefined,
    ...(isEditMode ? backgroundStyles : {}),
    ...(isEditMode ? borderStyles : {}),
    ...(isEditMode ? boxShadowStyle : {}),
    position: isEditMode ? undefined : hasCustomPosition ? (position as React.CSSProperties["position"]) : undefined,
    top: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(top, positionUnit) : undefined,
    right: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(right, positionUnit) : undefined,
    bottom: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(bottom, positionUnit) : undefined,
    left: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(left, positionUnit) : undefined,
    zIndex: isEditMode ? undefined : zIndex ? zIndex : undefined,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: isEditMode ? resolvedHeadingTypography.fontFamily : undefined,
    fontSize: isEditMode ? resolvedHeadingTypography.fontSize : undefined,
    fontWeight: isEditMode ? resolvedHeadingTypography.fontWeight : undefined,
    fontStyle: isEditMode ? (resolvedHeadingTypography.fontStyle as React.CSSProperties["fontStyle"]) : undefined,
    textTransform: isEditMode ? (resolvedHeadingTypography.textTransform as React.CSSProperties["textTransform"]) : undefined,
    textDecoration: isEditMode ? (resolvedHeadingTypography.textDecoration as React.CSSProperties["textDecoration"]) : undefined,
    letterSpacing: isEditMode ? resolvedHeadingTypography.letterSpacing : undefined,
    lineHeight: isEditMode ? resolvedHeadingTypography.lineHeight : undefined,
    textAlign: isEditMode ? (effectiveTextAlign as React.CSSProperties["textAlign"]) : undefined,
    marginBottom: isEditMode ? resolvedSpacing.headingBottomSpacing : undefined,
    ...(isEditMode ? headingTextColorStyles : {}),
  };

  const subHeadingStyle: React.CSSProperties = {
    fontFamily: isEditMode ? resolvedSubHeadingTypography.fontFamily : undefined,
    fontSize: isEditMode ? resolvedSubHeadingTypography.fontSize : undefined,
    fontWeight: isEditMode ? resolvedSubHeadingTypography.fontWeight : undefined,
    fontStyle: isEditMode ? (resolvedSubHeadingTypography.fontStyle as React.CSSProperties["fontStyle"]) : undefined,
    textTransform: isEditMode ? (resolvedSubHeadingTypography.textTransform as React.CSSProperties["textTransform"]) : undefined,
    textDecoration: isEditMode ? (resolvedSubHeadingTypography.textDecoration as React.CSSProperties["textDecoration"]) : undefined,
    letterSpacing: isEditMode ? resolvedSubHeadingTypography.letterSpacing : undefined,
    lineHeight: isEditMode ? resolvedSubHeadingTypography.lineHeight : undefined,
    textAlign: isEditMode ? (effectiveTextAlign as React.CSSProperties["textAlign"]) : undefined,
    marginBottom: isEditMode && enableSubHeading ? resolvedSpacing.subHeadingBottomSpacing : undefined,
    ...(isEditMode ? subHeadingTextColorStyles : {}),
  };

  const HeadingTag = headingTag;
  const WrapperTag = headingWrapper;

  const isEmpty = !currentHeadingText || currentHeadingText.trim() === "";
  const isEmptySubHeading = !currentSubHeadingText || currentSubHeadingText.trim() === "";

  // Handle click anywhere on wrapper to edit heading
  const handleWrapperClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".sub-heading-text")) {
      return;
    }
    if (isSelected && !editableHeading && !editableSubHeading && isEditMode) {
      e.stopPropagation();
      setEditableHeading(true);
    }
  };

  const handleHeadingClick = (e: React.MouseEvent) => {
    if (isSelected && !editableHeading && isEditMode) {
      e.stopPropagation();
      setEditableHeading(true);
    }
  };

  const handleSubHeadingClick = (e: React.MouseEvent) => {
    if (isSelected && !editableSubHeading && isEditMode && enableSubHeading) {
      e.stopPropagation();
      setEditableSubHeading(true);
    }
  };

  const handleHeadingChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = (e.currentTarget.textContent || "").replace(/\u00A0/g, " ").trim();
    onHeadingChange(newText);
  };

  const handleSubHeadingChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = (e.currentTarget.textContent || "").replace(/\u00A0/g, " ").trim();
    onSubHeadingChange(newText);
  };

  const handleHeadingBlur = () => {
    setEditableHeading(false);
  };

  const handleSubHeadingBlur = () => {
    setEditableSubHeading(false);
  };

  const headingContentStyle: React.CSSProperties = {
    textAlign: isEditMode ? (effectiveTextAlign as React.CSSProperties["textAlign"]) : undefined,
  };

  const headingContent = (
    <>
      {enableSubHeading && subHeadingPosition === "above" && <SubHeadingContent text={currentSubHeadingText} isEmpty={isEmptySubHeading} isEditMode={isEditMode} isEditing={editableSubHeading} style={subHeadingStyle} onClick={handleSubHeadingClick} onChange={handleSubHeadingChange} onBlur={handleSubHeadingBlur} />}

      <HeadingContent tag={HeadingTag} text={currentHeadingText} isEmpty={isEmpty} isEditMode={isEditMode} isEditing={editableHeading} style={headingStyle} onClick={handleHeadingClick} onChange={handleHeadingChange} onBlur={handleHeadingBlur} />

      <Separator style={separatorStyle} resolvedSeparator={resolvedSeparator} isEditMode={isEditMode} />

      {enableSubHeading && subHeadingPosition === "below" && <SubHeadingContent text={currentSubHeadingText} isEmpty={isEmptySubHeading} isEditMode={isEditMode} isEditing={editableSubHeading} style={subHeadingStyle} onClick={handleSubHeadingClick} onChange={handleSubHeadingChange} onBlur={handleSubHeadingBlur} />}
    </>
  );

  // Determine if any field is being edited
  const isEditing = editableHeading || editableSubHeading;

  const wrapperProps = {
    id: cssId || undefined,
    "aria-label": ariaLabel || undefined,
    ...parseDataAttributes(dataAttributes),
    className: `${componentClassName} ${className}`.trim(),
    style: wrapperStyle,
  };

  return (
    <>
      <style>{styleTagContent}</style>
      {isEditMode ? (
        // Edit mode: Wrap in div for editing experience (similar to Text component)
        <div
          ref={(ref: HTMLDivElement | null) => {
            if (!ref) return;
            wrapperRef.current = ref;
            connectors.connect(connectors.drag(ref));
          }}
          className={`heading-wrapper-${componentClassName.replace(/^heading-/, "")} relative ${selected ? (isEditing ? "ring-2 ring-green-500 bg-green-50" : "ring-2 ring-blue-500 cursor-text") : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"}`}
          onClick={handleWrapperClick}
        >
          {React.createElement(
            WrapperTag,
            wrapperProps,
            <div className="heading-content" style={headingContentStyle}>
              {headingContent}
            </div>,
          )}
        </div>
      ) : (
        // Preview mode: Use WrapperTag directly
        React.createElement(
          WrapperTag,
          {
            ...wrapperProps,
            ref: (ref: HTMLElement | null) => {
              if (!ref) return;
              if (isEditMode) {
                connectors.connect(connectors.drag(ref));
              } else {
                connectors.connect(ref);
              }
            },
          },
          <div className="heading-content" style={headingContentStyle}>
            {headingContent}
          </div>,
        )
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Heading as any).craft = {
  displayName: "Heading",
  props: {
    text: "Heading",
    headingTag: "h2",
    headingWrapper: "div",
    textAlign: "left",
    separatorStyle: "none",
    separatorWidth: 12,
    separatorWidthUnit: "%",
    separatorThickness: 2,
    separatorColor: "#000000",
    separatorBottomSpacing: 16,
    headingBottomSpacing: 16,
    subHeadingBottomSpacing: 16,
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

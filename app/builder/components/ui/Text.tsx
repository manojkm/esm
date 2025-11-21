"use client";

import React, { useRef, useMemo } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { LexicalEditor } from "./LexicalEditor";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { buildBackgroundHoverCss, buildBackgroundStyles, buildBorderHoverCss, buildBorderStyles, buildBoxShadowHoverCss, buildBoxShadowStyle, buildOverlayStyles, buildTextColorStyles, buildVisibilityCss, mergeCssSegments, parseDataAttributes, resolveResponsiveValue, type ResponsiveMap, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import { sanitizeHTML } from "@/app/builder/lib/html-sanitizer";
import type { TextProps } from "./text/types";
import { resolveTextTypography, resolveTextSpacing, getTypographyElement, type TypographyDefaults } from "./text/textStyleHelpers";
import { generateTextCss } from "./text/textCssGenerator";
import { useTextEditing } from "./text/useTextEditing";
import { cleanHTMLForPreview } from "./text/textHtmlUtils";

export const Text: React.FC<TextProps> = (props) => {
  // Get global settings for defaults (reactive to changes)
  const { settings } = useGlobalSettings();
  const typographyDefaults: TypographyDefaults = settings.typography;
  const borderDefaults = settings.borderDefaults;
  const globalBorderColor = borderDefaults.borderColor;
  const globalBorderColorHover = borderDefaults.borderColorHover;
  const globalLinkColor = typographyDefaults.linkColor;
  const globalLinkColorHover = typographyDefaults.linkColorHover;

  // Props destructuring
  const {
    text = "",
    htmlTag = "p",
    // Spacing
    padding,
    margin,
    paddingTop = null,
    paddingRight = null,
    paddingBottom = null,
    paddingLeft = null,
    paddingUnit = "px",
    marginTop = null,
    marginRight = null,
    marginBottom = 16,
    marginLeft = null,
    marginUnit = "px",
    paddingResponsive,
    marginResponsive,
    // Background
    backgroundColor,
    enableBackgroundColorHover = false,
    backgroundColorHover = null,
    backgroundColorResponsive,
    backgroundColorHoverResponsive,
    backgroundType = null,
    backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    // Advanced
    className = "",
    cssId = "",
    dataAttributes = "",
    ariaLabel = "",
    hideOnDesktop = false,
    hideOnTablet = false,
    hideOnLandscapeMobile = false,
    hideOnMobile = false,
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

  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
    id: nodeId,
  } = useNode((state) => ({
    selected: state.events.selected,
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
  const { editable, currentText, handleClick, handleChange, handleBlur, isEmpty } = useTextEditing(props, selected, isEditMode, setProp);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Generate unique class name
  const componentClassName = useMemo(() => `text-${cssId || nodeId}`, [cssId, nodeId]);

  // Resolve responsive values using helpers
  const resolvedTypography = useMemo(() => resolveTextTypography(props, typographyDefaults, responsiveResolver), [props, typographyDefaults, responsiveResolver]);

  const resolvedSpacing = useMemo(() => resolveTextSpacing(props, responsiveResolver), [props, responsiveResolver]);

  // Generate CSS for preview mode
  const cssResult = useMemo(
    () =>
      generateTextCss({
        componentClassName,
        props,
        resolvedTypography,
        resolvedSpacing,
        typographyDefaults,
        globalBorderColor: globalBorderColor || "#000000",
        globalBorderColorHover: globalBorderColorHover || undefined,
        globalLinkColor,
        globalLinkColorHover,
        isEditMode,
        responsiveResolver,
      }),
    [componentClassName, props, resolvedTypography, resolvedSpacing, typographyDefaults, globalBorderColor, globalBorderColorHover, globalLinkColor, globalLinkColorHover, isEditMode, responsiveResolver],
  );

  // Build styles for edit mode
  const backgroundStyles = buildBackgroundStyles({
    type: backgroundType,
    color: backgroundColor ?? "#ffffff",
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
    enableBoxShadow,
    boxShadowHorizontal,
    boxShadowVertical,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowColor,
    boxShadowPosition,
    resolver: responsiveResolver,
    boxShadowHorizontalResponsive,
    boxShadowVerticalResponsive,
    boxShadowBlurResponsive,
    boxShadowSpreadResponsive,
  });

  const textColorStyles = buildTextColorStyles({
    color: resolvedTypography.textColor,
  });

  // Build hover CSS for edit mode
  let hoverCss = "";
  if (isEditMode) {
    // Text color hover
    const isTextColorHoverReset =
      props.textColorHoverResponsive &&
      props.textColorHoverResponsive.desktop === null &&
      props.textColorHoverResponsive.tablet === null &&
      props.textColorHoverResponsive.mobile === null;

    if (!isTextColorHoverReset && props.textColorHover) {
      const resolvedTextColorHover = resolveResponsiveValue<string>({
        resolver: responsiveResolver,
        responsive: props.textColorHoverResponsive as ResponsiveMap<string> | undefined,
        fallback: props.textColorHover,
      });
      if (resolvedTextColorHover !== null && resolvedTextColorHover !== undefined) {
        hoverCss += `.${componentClassName}:hover .text-content { color: ${resolvedTextColorHover} !important; }\n`;
        const uniqueId = componentClassName.replace(/^text-/, "");
        hoverCss += `.text-wrapper-${uniqueId}:hover .${componentClassName} { color: ${resolvedTextColorHover} !important; }\n`;
      }
    }

    // Background hover
    if (enableBackgroundColorHover && backgroundColorHover && backgroundType === "color") {
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

    // Border hover
    if (enableBorderColorHover && borderStyle && borderStyle !== "none") {
      const effectiveBorderColorHover = borderColorHover ?? globalBorderColorHover;
      if (effectiveBorderColorHover) {
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

    // Box shadow hover
    if (enableBoxShadowHover) {
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
      if (hoverBoxShadowCss) {
        hoverCss += `.${componentClassName}:hover { ${hoverBoxShadowCss} } `;
      }
    }
  } else {
    // Preview mode: Use CSS from generator
    hoverCss = cssResult.hoverCss;
  }

  // Combine all CSS
  const styleTagContent = mergeCssSegments(
    cssResult.listStyles,
    cssResult.toolbarResetStyles,
    cssResult.responsiveCss,
    hoverCss,
    cssResult.linkColorCss,
    cssResult.overlayCss,
    cssResult.visibilityCss
  );

  // Position styles
  const hasCustomPosition = position !== "default" && position !== "static";
  const formatPositionValue = (value: number | null | undefined, unit: string): string | undefined => {
    if (value === null || value === undefined) return undefined;
    return `${value}${unit}`;
  };

  // Build inline styles (for edit mode)
  const textStyle: React.CSSProperties = {
    fontFamily: isEditMode ? resolvedTypography.fontFamily : undefined,
    fontSize: isEditMode ? resolvedTypography.fontSize : undefined,
    fontWeight: isEditMode ? resolvedTypography.fontWeight : undefined,
    fontStyle: isEditMode ? resolvedTypography.fontStyle : undefined,
    textTransform: isEditMode ? resolvedTypography.textTransform : undefined,
    textDecoration: isEditMode ? resolvedTypography.textDecoration : undefined,
    letterSpacing: isEditMode ? resolvedTypography.letterSpacing : undefined,
    lineHeight: isEditMode ? resolvedTypography.lineHeight : undefined,
    textAlign: isEditMode ? resolvedTypography.textAlign : undefined,
    padding: isEditMode ? resolvedSpacing.padding : undefined,
    margin: isEditMode ? resolvedSpacing.margin : undefined,
    // Background styles only in edit mode (in preview mode, backgrounds are applied via CSS to wrapper)
    ...(isEditMode ? backgroundStyles : {}),
    // Border styles only in edit mode (in preview mode, borders are applied via CSS to wrapper)
    ...(isEditMode ? borderStyles : {}),
    boxShadow: isEditMode ? boxShadowStyle : undefined,
    position: isEditMode ? undefined : hasCustomPosition ? (position as React.CSSProperties["position"]) : undefined,
    top: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionTop, positionTopUnit) : undefined,
    right: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionRight, positionRightUnit) : undefined,
    bottom: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionBottom, positionBottomUnit) : undefined,
    left: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(positionLeft, positionLeftUnit) : undefined,
    zIndex: isEditMode ? undefined : zIndex ? zIndex : undefined,
  };

  const TextTag = htmlTag;

  const textProps = {
    ref: (ref: HTMLElement | null) => {
      if (!ref) return;
      if (isEditMode) {
        connect(drag(ref));
      } else {
        connect(ref);
      }
    },
    id: cssId || undefined,
    "aria-label": ariaLabel || undefined,
    ...parseDataAttributes(dataAttributes),
    className: `
      ${componentClassName}
      ${className}
    `.trim(),
    style: textStyle,
    onClick: handleClick,
  };

  return (
    <>
      {styleTagContent && <style>{styleTagContent}</style>}
      {isEditMode ? (
        // Edit mode: Keep wrapper for drag/drop functionality
        <div ref={wrapperRef} className={`text-wrapper-${componentClassName.replace(/^text-/, "")} relative ${selected ? (editable ? "ring-2 ring-green-500 bg-green-50" : "ring-2 ring-blue-500 cursor-text") : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"}`}>
          {htmlTag === "p" || htmlTag === "span" ? (
            // For p/span tags, wrap in a div when editable (LexicalEditor may output divs, which can't be inside p tags)
            editable ? (
              <div
                ref={(ref: HTMLDivElement | null) => {
                  if (!ref) return;
                  connect(drag(ref));
                }}
                id={textProps.id}
                aria-label={textProps["aria-label"]}
                {...parseDataAttributes(dataAttributes)}
                className={textProps.className}
                style={textStyle}
              >
                <div className="text-content" style={textColorStyles}>
                  <LexicalEditor value={currentText || ""} onChange={handleChange} onBlur={handleBlur} placeholder="Type your text here" style={{}} readOnly={false} />
                </div>
              </div>
            ) : (
              React.createElement(TextTag, {
                ref: (ref: HTMLElement | null) => {
                  if (!ref) return;
                  connect(drag(ref));
                },
                id: textProps.id,
                "aria-label": textProps["aria-label"],
                ...parseDataAttributes(dataAttributes),
                className: textProps.className,
                style: { ...textStyle, ...textColorStyles },
                onClick: handleClick,
                ...(isEmpty
                  ? {
                      children: (
                        <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                          Type your text here
                        </span>
                      ),
                    }
                  : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentText || "") } }),
              })
            )
          ) : (
            // For div/h1-h6 tags, use them directly
            React.createElement(
              TextTag,
              {
                ...textProps,
                ref: (ref: HTMLElement | null) => {
                  if (!ref) return;
                  connect(drag(ref));
                },
                onClick: handleClick,
                style: editable ? textStyle : { ...textStyle, ...textColorStyles },
                ...(editable
                  ? {}
                  : isEmpty
                  ? {
                      children: (
                        <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                          Type your text here
                        </span>
                      ),
                    }
                  : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentText || "") } }),
              },
              editable ? (
                <div className="text-content" style={textColorStyles}>
                  <LexicalEditor value={currentText || ""} onChange={handleChange} onBlur={handleBlur} placeholder="Type your text here" style={{}} readOnly={false} />
                </div>
              ) : null,
            )
          )}
        </div>
      ) : (
        // Preview mode: Wrap in div with unique class for CSS isolation
        <div className={componentClassName}>
          <style>{styleTagContent}</style>
          <div className="text-content">
            {React.createElement(TextTag, {
              ref: (ref: HTMLElement | null) => {
                if (!ref) return;
                connect(ref);
              },
              id: cssId || undefined,
              "aria-label": ariaLabel || undefined,
              ...parseDataAttributes(dataAttributes),
              className: className.trim() || undefined,
              style: textStyle,
              onClick: handleClick,
              ...(isEmpty
                ? {
                    children: (
                      <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                        Type your text here
                      </span>
                    ),
                  }
                : { dangerouslySetInnerHTML: { __html: cleanHTMLForPreview(currentText || "", htmlTag) } }),
            })}
          </div>
        </div>
      )}
    </>
  );
};

Text.craft = {
  displayName: "Text",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

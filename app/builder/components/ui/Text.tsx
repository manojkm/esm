"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { LexicalEditor } from "./LexicalEditor";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { getTypographyCSS } from "@/app/builder/lib/typography-utils";
import { getGoogleFontFamilyCSS } from "@/app/builder/lib/google-fonts";
import { buildBackgroundHoverCss, buildBackgroundStyles, buildBorderHoverCss, buildBorderStyles, buildBoxShadowHoverCss, buildBoxShadowStyle, buildHoverRule, buildLinkColorCss, buildOverlayStyles, buildResponsiveFourSideValue, buildResponsiveValueWithUnit, buildTextColorStyles, buildVisibilityCss, mergeCssSegments, parseDataAttributes, resolveResponsiveValue, type ResponsiveMap, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import { generatePaddingCss, generateMarginCss, generateResponsiveCss, generateBackgroundColorCss, generateBorderColorCss, generateResponsiveFourSideCss, generateBoxShadowCss, generateHoverBackgroundColorCss, generateHoverBorderColorCss, generateTextColorCss, generateLinkColorCss, generatePositionCss, generateZIndexCss, getMediaQuery, type BreakpointKey } from "@/app/builder/lib/style-system/css-responsive";
import { sanitizeHTML, sanitizeHTMLForPreview } from "@/app/builder/lib/html-sanitizer";
import type { TextProps } from "./text/types";

export const Text: React.FC<TextProps> = (props) => {
  // Get global settings for defaults (reactive to changes)
  const { settings } = useGlobalSettings();
  const typographyDefaults = settings.typography;
  const borderDefaults = settings.borderDefaults;
  const globalBorderColor = borderDefaults.borderColor;
  const globalBorderColorHover = borderDefaults.borderColorHover;

  // Props destructuring with defaults from global typography settings
  const {
    text = "",
    htmlTag = "p",
    textAlign,
    textAlignResponsive,
    textColor,
    textColorResponsive,
    textColorHover,
    textColorHoverResponsive,
    linkColor,
    linkColorResponsive,
    linkColorHover,
    linkColorHoverResponsive,
    fontFamily,
    fontFamilyResponsive,
    fontSize,
    fontSizeResponsive,
    fontSizeUnit = "px",
    fontWeight,
    fontWeightResponsive,
    fontStyle,
    fontStyleResponsive,
    textTransform,
    textTransformResponsive,
    textDecoration,
    textDecorationResponsive,
    letterSpacing,
    letterSpacingResponsive,
    letterSpacingUnit = "px",
    lineHeight,
    lineHeightResponsive,
    lineHeightUnit = "normal",
    // Spacing
    padding, // Default null for text (user can set if needed)
    margin,
    paddingTop = null,
    paddingRight = null,
    paddingBottom = null,
    paddingLeft = null,
    paddingUnit = "px",
    marginTop = null,
    marginRight = null,
    marginBottom = 16, // Default margin-bottom for text (user can clear if needed)
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

  // Get typography defaults based on htmlTag
  const getTypographyElement = (): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" => {
    if (htmlTag.startsWith("h")) {
      return htmlTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    }
    return "body";
  };

  const typographyElement = getTypographyElement();
  const isHeading = typographyElement !== "body";
  const typographyType = isHeading ? "headings" : "body";

  // Apply global typography defaults
  const globalFontFamily = isHeading ? typographyDefaults.googleFonts?.headings || typographyDefaults.fontFamily?.headings : typographyDefaults.googleFonts?.body || typographyDefaults.fontFamily?.body;
  const globalFontSize = typographyDefaults.fontSize?.desktop?.[typographyElement];
  const globalFontWeight = typographyDefaults.fontWeight?.[typographyType];
  const globalFontStyle = typographyDefaults.fontStyle?.[typographyType];
  const globalTextColor = typographyDefaults.textColor?.[typographyType];
  const globalLineHeight = typographyDefaults.lineHeight?.[typographyType];
  const globalLetterSpacing = typographyDefaults.letterSpacing?.[typographyType];
  const globalLinkColor = typographyDefaults.linkColor;
  const globalLinkColorHover = typographyDefaults.linkColorHover;

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

  const { currentBreakpoint, getResponsiveValue } = useResponsive();
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

  const responsiveResolver: ResponsiveResolver = (values, fallback) => getEditorResponsiveValue(values, fallback);

  const [editable, setEditable] = useState(false);
  const [currentText, setCurrentText] = useState(text || "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  useEffect(() => {
    setCurrentText(text || "");
  }, [text]);

  const handleClick = (e: React.MouseEvent) => {
    if (selected && !editable && isEditMode) {
      e.stopPropagation();
      setEditable(true);
    }
  };

  const handleChange = (value: string) => {
    setCurrentText(value);
    // Update the prop immediately for real-time updates
    setProp((props: TextProps) => {
      props.text = value;
    });
  };

  const handleBlur = () => {
    setEditable(false);
  };

  // Check if text is empty for placeholder
  const isEmpty = !currentText || currentText.trim() === "" || currentText === "<p><br></p>" || currentText === "<p></p>" || currentText.replace(/<[^>]*>/g, "").trim() === "";

  // Resolve responsive values
  const effectiveTextAlign = textAlignResponsive ? responsiveResolver(textAlignResponsive, textAlign || "left") : textAlign || "left";

  const effectiveFontSize = fontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: fontSizeResponsive,
        fallbackValue: fontSize ?? globalFontSize ?? 16,
        fallbackUnit: fontSizeUnit,
        resolver: responsiveResolver,
      })
    : `${fontSize ?? globalFontSize ?? 16}${fontSizeUnit}`;

  const effectiveFontWeight = fontWeightResponsive ? responsiveResolver(fontWeightResponsive, fontWeight ?? globalFontWeight ?? 400) : fontWeight ?? globalFontWeight ?? 400;

  const effectiveFontStyle = fontStyleResponsive ? responsiveResolver(fontStyleResponsive, fontStyle ?? globalFontStyle ?? "normal") : fontStyle ?? globalFontStyle ?? "normal";

  const effectiveTextTransform = textTransformResponsive ? responsiveResolver(textTransformResponsive, textTransform ?? "none") : textTransform ?? "none";

  const effectiveTextDecoration = textDecorationResponsive ? responsiveResolver(textDecorationResponsive, textDecoration ?? "none") : textDecoration ?? "none";

  const effectiveLetterSpacing = letterSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: letterSpacingResponsive,
        fallbackValue: letterSpacing ?? globalLetterSpacing ?? 0,
        fallbackUnit: letterSpacingUnit,
        resolver: responsiveResolver,
      })
    : `${letterSpacing ?? globalLetterSpacing ?? 0}${letterSpacingUnit}`;

  const effectiveLineHeight = lineHeightResponsive
    ? buildResponsiveValueWithUnit({
        responsive: lineHeightResponsive,
        fallbackValue: lineHeight ?? globalLineHeight ?? 1.6,
        fallbackUnit: lineHeightUnit,
        resolver: responsiveResolver,
      })
    : lineHeightUnit === "normal" || lineHeightUnit === "number"
    ? lineHeight ?? globalLineHeight ?? 1.6
    : `${lineHeight ?? globalLineHeight ?? 1.6}${lineHeightUnit}`;

  // Font family resolution
  const getEffectiveFontFamily = () => {
    if (fontFamily) return fontFamily;
    if (fontFamilyResponsive) {
      return responsiveResolver(fontFamilyResponsive, globalFontFamily || "sans-serif");
    }
    if (globalFontFamily) {
      // Check if it's a Google Font
      const googleFont = isHeading ? typographyDefaults.googleFonts?.headings : typographyDefaults.googleFonts?.body;
      if (googleFont) {
        return getGoogleFontFamilyCSS(googleFont, globalFontFamily);
      }
      return globalFontFamily;
    }
    return "sans-serif";
  };

  const effectiveFontFamily = getEffectiveFontFamily();

  // Text color resolution
  const effectiveTextColor = textColorResponsive ? responsiveResolver(textColorResponsive, textColor ?? globalTextColor ?? "#1f2937") : textColor ?? globalTextColor ?? "#1f2937";

  // Build styles
  const paddingValue = buildResponsiveFourSideValue({
    responsive: paddingResponsive,
    fallback: {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
      defaultValue: padding ?? 0,
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
      defaultValue: margin ?? 0,
    },
    defaultUnit: marginUnit,
    resolver: responsiveResolver,
  });

  // Generate CSS for preview/export mode
  // Use node ID to ensure each Text component instance has unique CSS classes
  const textClassName = `text-${cssId || nodeId}`;
  const componentClassName = textClassName; // Unique class for this component instance

  let responsiveCss = "";
  let hoverCss = "";
  const shouldGenerateMediaQueries = !isEditMode;

  // Generate hover CSS for both edit and preview modes
  // Text color hover - target content class within wrapper div
  if (textColorHover) {
    if (shouldGenerateMediaQueries) {
      // Preview mode: Generate responsive hover CSS
      if (textColorHoverResponsive) {
        const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];
        hoverCss += `.${componentClassName}:hover .text-content { color: ${textColorHover} !important; }\n`;
        for (const bp of breakpoints) {
          if (textColorHoverResponsive[bp] !== undefined && textColorHoverResponsive[bp] !== null) {
            const value = textColorHoverResponsive[bp];
            if (typeof value === "string" && value !== textColorHover) {
              hoverCss += `${getMediaQuery(bp)} { .${componentClassName}:hover .text-content { color: ${value} !important; } }\n`;
            }
          }
        }
      } else {
        // Non-responsive: Use static value
        hoverCss += `.${componentClassName}:hover .text-content { color: ${textColorHover} !important; }\n`;
      }
    } else {
      // Edit mode: Use resolver to get current breakpoint value
      const resolvedTextColorHover = resolveResponsiveValue<string>({
        resolver: responsiveResolver,
        responsive: textColorHoverResponsive as ResponsiveMap<string> | undefined,
        fallback: textColorHover,
      });
      if (resolvedTextColorHover) {
        // In edit mode, componentClassName is on the inner div
        // We need to target hover on both the componentClassName element and its parent wrapper
        hoverCss += `.${componentClassName}:hover .text-content { color: ${resolvedTextColorHover} !important; }\n`;
        // Target the wrapper that contains componentClassName (using class-based approach for eBay compatibility)
        // Extract the unique ID from componentClassName (e.g., "text-abc123" -> "abc123")
        // Note: We target .${componentClassName} directly (not .text-content) so color inherits to children
        const uniqueId = componentClassName.replace(/^text-/, "");
        hoverCss += `.text-wrapper-${uniqueId}:hover .${componentClassName} { color: ${resolvedTextColorHover} !important; }\n`;
      }
    }
  }

  // Background hover
  if (enableBackgroundColorHover && backgroundColorHover) {
    if (shouldGenerateMediaQueries) {
      // Preview mode: Generate responsive hover CSS
      if (backgroundColorHoverResponsive) {
        hoverCss += generateHoverBackgroundColorCss(componentClassName, backgroundColorHoverResponsive, backgroundColorHover);
      } else {
        hoverCss += `.${componentClassName}:hover { background-color: ${backgroundColorHover} !important; } `;
      }
    } else {
      // Edit mode: Use resolver to get current breakpoint value
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

  // Border hover - only if enabled and border style is set
  // Use global defaults if not set, but only if hover is enabled
  if (enableBorderColorHover && borderStyle && borderStyle !== "none") {
    const effectiveBorderColorHover = borderColorHover ?? globalBorderColorHover;
    if (effectiveBorderColorHover) {
      if (shouldGenerateMediaQueries) {
        // Preview mode: Generate responsive hover CSS
        if (borderColorHoverResponsive) {
          hoverCss += generateHoverBorderColorCss(componentClassName, borderColorHoverResponsive, effectiveBorderColorHover);
        } else {
          hoverCss += `.${componentClassName}:hover { border-color: ${effectiveBorderColorHover} !important; } `;
        }
      } else {
        // Edit mode: Use resolver to get current breakpoint value
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

  // Box shadow hover
  if (enableBoxShadowHover) {
    if (shouldGenerateMediaQueries) {
      // Preview mode: Generate responsive hover CSS
      if (boxShadowHorizontalHoverResponsive || boxShadowVerticalHoverResponsive || boxShadowBlurHoverResponsive || boxShadowSpreadHoverResponsive) {
        hoverCss += generateBoxShadowCss(componentClassName, boxShadowHorizontalHoverResponsive, boxShadowVerticalHoverResponsive, boxShadowBlurHoverResponsive, boxShadowSpreadHoverResponsive, boxShadowHorizontalHover ?? 0, boxShadowVerticalHover ?? 0, boxShadowBlurHover ?? 0, boxShadowSpreadHover ?? 0, boxShadowColorHover);
        hoverCss = hoverCss.replace(/\./g, ".:hover");
      } else {
        const shadowValue = `${boxShadowHorizontalHover ?? 0}px ${boxShadowVerticalHover ?? 0}px ${boxShadowBlurHover ?? 0}px ${boxShadowSpreadHover ?? 0}px ${boxShadowColorHover}`;
        hoverCss += `.${componentClassName}:hover { box-shadow: ${shadowValue} !important; } `;
      }
    } else {
      // Edit mode: Use resolver to get current breakpoint value
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
  }

  if (shouldGenerateMediaQueries) {
    // Padding responsive CSS - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    // Only generate CSS if padding is explicitly set (including 0), not if it's null/undefined
    if (paddingResponsive) {
      // If responsive is set, use padding value or 0 as fallback
      responsiveCss += generatePaddingCss(
        componentClassName,
        paddingResponsive,
        {
          top: paddingTop,
          right: paddingRight,
          bottom: paddingBottom,
          left: paddingLeft,
          defaultValue: padding ?? 0,
        },
        paddingUnit,
      );
    } else if (padding !== null && padding !== undefined) {
      // Generate base CSS for non-responsive padding only if explicitly set (including 0)
      // In preview mode, build static CSS directly without resolver
      const top = paddingTop ?? padding;
      const right = paddingRight ?? padding;
      const bottom = paddingBottom ?? padding;
      const left = paddingLeft ?? padding;
      const paddingValue = `${top}${paddingUnit} ${right}${paddingUnit} ${bottom}${paddingUnit} ${left}${paddingUnit}`;
      responsiveCss += `.${componentClassName} { padding: ${paddingValue}; }\n`;
    }

    // Margin responsive CSS - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    // Generate CSS if margin is explicitly set OR if any individual side is set (e.g., marginBottom = 16)
    const hasMarginValue = margin !== null && margin !== undefined;
    const hasIndividualMargin = marginTop !== null || marginRight !== null || marginBottom !== null || marginLeft !== null;

    if (marginResponsive) {
      // If responsive is set, use margin value or 0 as fallback
      responsiveCss += generateMarginCss(
        componentClassName,
        marginResponsive,
        {
          top: marginTop,
          right: marginRight,
          bottom: marginBottom,
          left: marginLeft,
          defaultValue: margin ?? 0,
        },
        marginUnit,
      );
    } else if (hasMarginValue || hasIndividualMargin) {
      // Generate base CSS for non-responsive margin if explicitly set OR if any individual side is set
      // In preview mode, build static CSS directly without resolver
      const top = marginTop ?? margin ?? 0;
      const right = marginRight ?? margin ?? 0;
      const bottom = marginBottom ?? margin ?? 0;
      const left = marginLeft ?? margin ?? 0;
      const marginValue = `${top}${marginUnit} ${right}${marginUnit} ${bottom}${marginUnit} ${left}${marginUnit}`;
      responsiveCss += `.${componentClassName} { margin: ${marginValue}; }\n`;
    }

    // Text align - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Target content class within wrapper div
    // Use !important to override any inline styles from pasted content
    if (textAlignResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "text-align", textAlignResponsive, textAlign || "left", "", true);
    } else {
      // Always generate base CSS for text-align in preview mode (applies to all breakpoints)
      // Use !important to override any inline styles from pasted content
      const alignValue = textAlign || "left";
      responsiveCss += `.${componentClassName} .text-content { text-align: ${alignValue} !important; }\n`;
    }

    // Font size - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (fontSizeResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-size", fontSizeResponsive, fontSize ?? globalFontSize ?? 16, fontSizeUnit);
    } else {
      // Always generate base CSS for font-size in preview mode (applies to all breakpoints)
      const sizeValue = fontSize ?? globalFontSize ?? 16;
      responsiveCss += `.${componentClassName} .text-content { font-size: ${sizeValue}${fontSizeUnit}; }\n`;
    }

    // Font weight - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (fontWeightResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-weight", fontWeightResponsive, fontWeight ?? globalFontWeight ?? 400, "");
    } else {
      // Always generate base CSS for font-weight in preview mode (applies to all breakpoints)
      const weightValue = fontWeight ?? globalFontWeight ?? 400;
      responsiveCss += `.${componentClassName} .text-content { font-weight: ${weightValue}; }\n`;
    }

    // Font style - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (fontStyleResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-style", fontStyleResponsive, fontStyle ?? globalFontStyle ?? "normal", "");
    } else {
      // Always generate base CSS for font-style in preview mode (applies to all breakpoints)
      const styleValue = fontStyle ?? globalFontStyle ?? "normal";
      responsiveCss += `.${componentClassName} .text-content { font-style: ${styleValue}; }\n`;
    }

    // Text transform - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (textTransformResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "text-transform", textTransformResponsive, textTransform ?? "none", "");
    } else if (textTransform) {
      // Generate base CSS for non-responsive text-transform (applies to all breakpoints)
      responsiveCss += `.${componentClassName} .text-content { text-transform: ${textTransform}; }\n`;
    }

    // Text decoration - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (textDecorationResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "text-decoration", textDecorationResponsive, textDecoration ?? "none", "");
    } else if (textDecoration) {
      // Generate base CSS for non-responsive text-decoration (applies to all breakpoints)
      responsiveCss += `.${componentClassName} .text-content { text-decoration: ${textDecoration}; }\n`;
    }

    // Letter spacing - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (letterSpacingResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "letter-spacing", letterSpacingResponsive, letterSpacing ?? globalLetterSpacing ?? 0, letterSpacingUnit);
    } else {
      // Always generate base CSS for letter-spacing in preview mode (applies to all breakpoints)
      const spacingValue = letterSpacing ?? globalLetterSpacing ?? 0;
      responsiveCss += `.${componentClassName} .text-content { letter-spacing: ${spacingValue}${letterSpacingUnit}; }\n`;
    }

    // Line height - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (lineHeightResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "line-height", lineHeightResponsive, lineHeight ?? globalLineHeight ?? 1.6, lineHeightUnit === "normal" ? "" : lineHeightUnit);
    } else {
      // Always generate base CSS for line-height in preview mode (applies to all breakpoints)
      const heightValue = lineHeight ?? globalLineHeight ?? 1.6;
      const lineHeightValue = lineHeightUnit === "normal" ? "normal" : `${heightValue}${lineHeightUnit}`;
      responsiveCss += `.${componentClassName} .text-content { line-height: ${lineHeightValue}; }\n`;
    }

    // Font family - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (fontFamilyResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-family", fontFamilyResponsive, effectiveFontFamily, "");
    } else if (effectiveFontFamily) {
      // Always generate base CSS for font-family in preview mode (applies to all breakpoints)
      responsiveCss += `.${componentClassName} .text-content { font-family: ${effectiveFontFamily}; }\n`;
    }

    // Text color - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (textColorResponsive) {
      responsiveCss += generateTextColorCss(`${componentClassName} .text-content`, textColorResponsive, textColor ?? globalTextColor ?? "#1f2937");
    } else {
      // Always generate base CSS for text-color in preview mode (applies to all breakpoints)
      const colorValue = effectiveTextColor || globalTextColor || "#1f2937";
      responsiveCss += `.${componentClassName} .text-content { color: ${colorValue}; }\n`;
    }

    // Link color - follows pattern: base value applies to all breakpoints, media queries only for overrides
    const effectiveLinkColor = linkColor ?? globalLinkColor;
    const effectiveLinkColorHover = linkColorHover ?? globalLinkColorHover;
    if (linkColorResponsive || linkColorHoverResponsive) {
      responsiveCss += generateLinkColorCss(`${componentClassName} .text-content`, linkColorResponsive, effectiveLinkColor ?? undefined, linkColorHoverResponsive, effectiveLinkColorHover ?? undefined);
    } else if (effectiveLinkColor || effectiveLinkColorHover) {
      // Generate base CSS for non-responsive link colors (applies to all breakpoints)
      if (effectiveLinkColor) {
        responsiveCss += `.${componentClassName} .text-content a { color: ${effectiveLinkColor}; }\n`;
      }
      if (effectiveLinkColorHover) {
        responsiveCss += `.${componentClassName} .text-content a:hover { color: ${effectiveLinkColorHover}; }\n`;
      }
    }

    // Background color - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    if (backgroundColorResponsive) {
      responsiveCss += generateBackgroundColorCss(componentClassName, backgroundColorResponsive, backgroundColor ?? "#ffffff");
    } else if (backgroundColor && backgroundType === "color") {
      // Generate base CSS for non-responsive background-color (applies to all breakpoints)
      responsiveCss += `.${componentClassName} { background-color: ${backgroundColor}; }\n`;
    }

    // Background image/gradient - base CSS (applies to all breakpoints)
    if (backgroundType === "image" && backgroundImage) {
      responsiveCss += `.${componentClassName} { background-image: url("${backgroundImage}"); background-size: cover; background-position: center; background-repeat: no-repeat; }\n`;
    } else if (backgroundType === "gradient" && backgroundGradient) {
      responsiveCss += `.${componentClassName} { background: ${backgroundGradient}; }\n`;
    }

    // Border color - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    // Use global defaults if not set
    const effectiveBorderColor = borderColor ?? globalBorderColor;
    if (borderStyle && borderStyle !== "none") {
      if (borderColorResponsive) {
        responsiveCss += generateBorderColorCss(componentClassName, borderColorResponsive, effectiveBorderColor ?? undefined);
      } else if (effectiveBorderColor) {
        // Generate base CSS for non-responsive border-color (applies to all breakpoints)
        responsiveCss += `.${componentClassName} { border-color: ${effectiveBorderColor}; }\n`;
      }
    }

    // Border width - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
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
            defaultValue: borderWidth ?? 1,
          },
          "px",
        );
        responsiveCss += `.${componentClassName} { border-style: ${borderStyle}; }\n`;
      } else {
        // Generate base CSS for non-responsive border-width (applies to all breakpoints)
        const borderWidthValue = borderWidth ?? 1;
        if (borderTopWidth !== null || borderRightWidth !== null || borderBottomWidth !== null || borderLeftWidth !== null) {
          const top = borderTopWidth ?? borderWidthValue;
          const right = borderRightWidth ?? borderWidthValue;
          const bottom = borderBottomWidth ?? borderWidthValue;
          const left = borderLeftWidth ?? borderWidthValue;
          responsiveCss += `.${componentClassName} { border-style: ${borderStyle}; border-width: ${top}px ${right}px ${bottom}px ${left}px; }\n`;
        } else {
          responsiveCss += `.${componentClassName} { border-style: ${borderStyle}; border-width: ${borderWidthValue}px; }\n`;
        }
      }
    }

    // Border radius - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
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
          defaultValue: borderRadius ?? 0,
        },
        borderRadiusUnit,
      );
    } else if (borderRadius !== null && borderRadius !== undefined && borderRadius > 0) {
      // Generate base CSS for non-responsive border-radius (applies to all breakpoints)
      if (borderTopLeftRadius !== null || borderTopRightRadius !== null || borderBottomRightRadius !== null || borderBottomLeftRadius !== null) {
        const topLeft = borderTopLeftRadius ?? borderRadius;
        const topRight = borderTopRightRadius ?? borderRadius;
        const bottomRight = borderBottomRightRadius ?? borderRadius;
        const bottomLeft = borderBottomLeftRadius ?? borderRadius;
        responsiveCss += `.${componentClassName} { border-radius: ${topLeft}${borderRadiusUnit} ${topRight}${borderRadiusUnit} ${bottomRight}${borderRadiusUnit} ${bottomLeft}${borderRadiusUnit}; }\n`;
      } else {
        responsiveCss += `.${componentClassName} { border-radius: ${borderRadius}${borderRadiusUnit}; }\n`;
      }
    }

    // Box shadow - follows pattern: base value applies to all breakpoints, media queries only for overrides
    // Apply to wrapper div
    if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
      responsiveCss += generateBoxShadowCss(componentClassName, boxShadowHorizontalResponsive, boxShadowVerticalResponsive, boxShadowBlurResponsive, boxShadowSpreadResponsive, boxShadowHorizontal ?? 0, boxShadowVertical ?? 0, boxShadowBlur ?? 0, boxShadowSpread ?? 0, boxShadowColor);
    } else if (enableBoxShadow && boxShadowHorizontal !== null && boxShadowHorizontal !== undefined && boxShadowVertical !== null && boxShadowVertical !== undefined && boxShadowBlur !== null && boxShadowBlur !== undefined && boxShadowSpread !== null && boxShadowSpread !== undefined) {
      // Generate base CSS for non-responsive box-shadow (applies to all breakpoints)
      const shadowValue = `${boxShadowHorizontal ?? 0}px ${boxShadowVertical ?? 0}px ${boxShadowBlur ?? 0}px ${boxShadowSpread ?? 0}px ${boxShadowColor}`;
      responsiveCss += `.${componentClassName} { box-shadow: ${shadowValue}; }\n`;
    }

    // Position - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (positionTopResponsive || positionRightResponsive || positionBottomResponsive || positionLeftResponsive) {
      responsiveCss += generatePositionCss(componentClassName, positionTopResponsive, positionRightResponsive, positionBottomResponsive, positionLeftResponsive, positionTop, positionRight, positionBottom, positionLeft, positionTopUnit, positionRightUnit, positionBottomUnit, positionLeftUnit);
    }

    // Z-index - follows pattern: base value applies to all breakpoints, media queries only for overrides
    if (zIndexResponsive) {
      responsiveCss += generateZIndexCss(componentClassName, zIndexResponsive, zIndex ?? 0);
    } else if (zIndex !== null && zIndex !== undefined) {
      // Generate base CSS for non-responsive z-index (applies to all breakpoints)
      responsiveCss += `.${componentClassName} { z-index: ${zIndex}; }\n`;
    }
  }

  // Build background styles
  const backgroundStyles = buildBackgroundStyles({
    type: backgroundType,
    color: backgroundColor ?? "#ffffff",
    colorResponsive: backgroundColorResponsive,
    gradient: backgroundGradient,
    image: backgroundImage,
    resolver: responsiveResolver,
  });

  // Build border styles
  // Use global defaults if not set
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

  // Build box shadow style
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

  // Build text color styles
  const textColorStyles = buildTextColorStyles({
    color: effectiveTextColor,
  });

  // Build link color CSS (use global defaults if not set)
  const effectiveLinkColor = linkColor ?? globalLinkColor;
  const effectiveLinkColorHover = linkColorHover ?? globalLinkColorHover;
  const linkColorCss = buildLinkColorCss({
    baseSelector: `.${componentClassName}`,
    linkColor: effectiveLinkColor ?? undefined,
    linkColorHover: effectiveLinkColorHover ?? undefined,
  });

  // Build overlay styles
  const overlayStyles = buildOverlayStyles({
    enableBackgroundOverlay,
    overlayType,
    overlayColor,
    overlayImage,
    overlayPosition,
    overlayAttachment,
    overlayBlendMode,
    overlayRepeat,
    overlaySize,
    overlayOpacity,
    resolver: responsiveResolver,
    overlayColorResponsive,
    overlayPositionResponsive,
    overlayAttachmentResponsive,
    overlayBlendModeResponsive,
    overlayRepeatResponsive,
    overlaySizeResponsive,
    overlayOpacityResponsive,
  });

  // Build visibility CSS
  const visibilityCss = buildVisibilityCss({
    hideOnDesktop,
    hideOnTablet,
    hideOnLandscapeMobile,
    hideOnMobile,
  });

  // Position styles
  const hasCustomPosition = position !== "default" && position !== "static";
  const formatPositionValue = (value: number | null | undefined, unit: string): string | undefined => {
    if (value === null || value === undefined) return undefined;
    return `${value}${unit}`;
  };

  // Add default list styles for preview/export mode (since editor classes are removed)
  // Scope to content class to avoid affecting other lists on the page
  const listStyles = `
    .${componentClassName} .text-content ul {
      list-style-type: disc;
      padding-left: 1.5em;
      margin: 0.5em 0;
    }
    .${componentClassName} .text-content ol {
      list-style-type: decimal;
      padding-left: 1.5em;
      margin: 0.5em 0;
    }
    .${componentClassName} .text-content li {
      margin: 0.25em 0;
    }
  `;

  // Exclude toolbar from text-content styles to prevent font inheritance
  const toolbarResetStyles = `
    .${componentClassName} .text-content .lexical-floating-toolbar,
    .${componentClassName} .text-content .lexical-floating-toolbar * {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      font-style: normal !important;
      text-transform: none !important;
      text-decoration: none !important;
      letter-spacing: normal !important;
      line-height: 1.5 !important;
      color: #1f2937 !important;
    }
  `;

  // Combine all CSS
  const styleTagContent = mergeCssSegments(listStyles, toolbarResetStyles, responsiveCss, hoverCss, linkColorCss, overlayStyles.css, visibilityCss);

  // Build inline styles (for edit mode)
  // Note: Text color is NOT included here - it's only applied to .text-content elements
  const textStyle: React.CSSProperties = {
    fontFamily: isEditMode ? effectiveFontFamily : undefined,
    fontSize: isEditMode ? effectiveFontSize : undefined,
    fontWeight: isEditMode ? effectiveFontWeight : undefined,
    fontStyle: isEditMode ? effectiveFontStyle : undefined,
    textTransform: isEditMode ? effectiveTextTransform : undefined,
    textDecoration: isEditMode ? effectiveTextDecoration : undefined,
    letterSpacing: isEditMode ? effectiveLetterSpacing : undefined,
    lineHeight: isEditMode ? effectiveLineHeight : undefined,
    textAlign: isEditMode ? effectiveTextAlign : undefined,
    padding: isEditMode ? paddingValue : undefined,
    margin: isEditMode ? marginValue : undefined,
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

  // Clean HTML content for preview mode (remove editor classes, fix nested tags, sanitize for XSS)
  const cleanHTMLForPreview = (html: string): string => {
    if (!html) return "";

    // First, sanitize HTML to prevent XSS attacks
    let cleaned = sanitizeHTMLForPreview(html);

    // Remove Lexical editor classes
    cleaned = cleaned.replace(/\s*class="editor-[^"]*"/gi, "");
    cleaned = cleaned.replace(/\s*class=""/gi, "");

    // Remove white-space pre-wrap styles (not needed)
    cleaned = cleaned.replace(/\s*style="white-space:\s*pre-wrap;?"/gi, "");
    cleaned = cleaned.replace(/\s*style=""/gi, "");

    // Remove empty spans
    cleaned = cleaned.replace(/<span[^>]*>\s*<\/span>/gi, "");

    // Handle nested tags based on htmlTag
    if (htmlTag === "p") {
      // If htmlTag is "p" and content starts with <p>, unwrap the inner <p> tag
      const pMatch = cleaned.match(/^<p[^>]*>(.*?)<\/p>$/s);
      if (pMatch && pMatch[1]) {
        cleaned = pMatch[1];
      }
    } else if (htmlTag === "span") {
      // If htmlTag is "span", unwrap any block-level tags like <p>
      const pMatch = cleaned.match(/^<p[^>]*>(.*?)<\/p>$/s);
      if (pMatch && pMatch[1]) {
        cleaned = pMatch[1];
      }
    } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(htmlTag)) {
      // If htmlTag is a heading, unwrap any <p> tags and extract text content
      // Headings cannot contain block-level elements like <p>
      const pMatch = cleaned.match(/^<p[^>]*>(.*?)<\/p>$/s);
      if (pMatch && pMatch[1]) {
        cleaned = pMatch[1];
      }
      // Also unwrap any nested heading tags (shouldn't happen, but just in case)
      const headingMatch = cleaned.match(/^<h[1-6][^>]*>(.*?)<\/h[1-6]>$/s);
      if (headingMatch && headingMatch[1]) {
        cleaned = headingMatch[1];
      }
    } else if (htmlTag === "div") {
      // For div tags, we can keep <p> tags as they're valid block elements
      // But still clean up any nested divs if needed
      cleaned = cleaned.replace(/^<div[^>]*>(.*?)<\/div>$/s, "$1");
    }

    // Remove unnecessary <span> wrappers that only contain text (no attributes or styling)
    // This handles cases like <span>text</span> -> text
    // But preserves spans with attributes like <span style="...">text</span>
    cleaned = cleaned.replace(/<span(?![^>]*\s(style|class|id|data-)[^>]*)>(.*?)<\/span>/gi, "$2");

    // Also remove spans that only have empty or whitespace-only attributes
    cleaned = cleaned.replace(/<span[^>]*class="[^"]*"[^>]*>(.*?)<\/span>/gi, (match, content) => {
      // If the span only has class attribute and no other meaningful attributes, unwrap it
      const hasOtherAttrs = match.match(/\s(style|id|data-|aria-)/i);
      return hasOtherAttrs ? match : content;
    });

    return cleaned.trim();
  };

  return (
    <>
      {styleTagContent && <style>{styleTagContent}</style>}
      {isEditMode ? (
        // Edit mode: Keep wrapper for drag/drop functionality
        // Add wrapper class for hover targeting (eBay-compatible, no data attributes)
        <div ref={wrapperRef} className={`text-wrapper-${componentClassName.replace(/^text-/, "")} relative ${selected ? (editable ? "ring-2 ring-green-500 bg-green-50" : "ring-2 ring-blue-500 cursor-text") : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"}`}>
          {htmlTag === "p" || htmlTag === "span" ? (
            // For p/span tags, wrap in a div when editable (LexicalEditor may output divs, which can't be inside p tags)
            // When not editable, render TextTag directly without wrapper
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
                style: editable ? textStyle : { ...textStyle, ...textColorStyles }, // When not editable, TextTag is the content, so add text color
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
        // Preview mode: Wrap in div with unique class for CSS isolation (like Spectra builder)
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
                : { dangerouslySetInnerHTML: { __html: cleanHTMLForPreview(currentText || "") } }),
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

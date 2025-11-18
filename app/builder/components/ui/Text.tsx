"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { LexicalEditor } from "./LexicalEditor";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { getTypographyCSS } from "@/app/builder/lib/typography-utils";
import { getGoogleFontFamilyCSS } from "@/app/builder/lib/google-fonts";
import {
  buildBackgroundHoverCss,
  buildBackgroundStyles,
  buildBorderHoverCss,
  buildBorderStyles,
  buildBoxShadowHoverCss,
  buildBoxShadowStyle,
  buildHoverRule,
  buildLinkColorCss,
  buildOverlayStyles,
  buildResponsiveFourSideValue,
  buildResponsiveValueWithUnit,
  buildTextColorStyles,
  buildVisibilityCss,
  mergeCssSegments,
  parseDataAttributes,
  resolveResponsiveValue,
  type ResponsiveMap,
  type ResponsiveResolver,
} from "@/app/builder/lib/style-system";
import {
  generatePaddingCss,
  generateMarginCss,
  generateResponsiveCss,
  generateBackgroundColorCss,
  generateBorderColorCss,
  generateResponsiveFourSideCss,
  generateBoxShadowCss,
  generateHoverBackgroundColorCss,
  generateHoverBorderColorCss,
  generateTextColorCss,
  generateLinkColorCss,
  generatePositionCss,
  generateZIndexCss,
  getMediaQuery,
  type BreakpointKey,
} from "@/app/builder/lib/style-system/css-responsive";
import type { TextProps } from "./text/types";

export const Text: React.FC<TextProps> = (props) => {
  // Get global settings for defaults (reactive to changes)
  const { settings } = useGlobalSettings();
  const typographyDefaults = settings.typography;

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
    borderColor = "#000000",
    borderColorHover = "#333333",
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
  const globalFontFamily = isHeading
    ? typographyDefaults.googleFonts?.headings || typographyDefaults.fontFamily?.headings
    : typographyDefaults.googleFonts?.body || typographyDefaults.fontFamily?.body;
  const globalFontSize = typographyDefaults.fontSize?.desktop?.[typographyElement];
  const globalFontWeight = typographyDefaults.fontWeight?.[typographyType];
  const globalFontStyle = typographyDefaults.fontStyle?.[typographyType];
  const globalTextColor = typographyDefaults.textColor?.[typographyType];
  const globalLineHeight = typographyDefaults.lineHeight?.[typographyType];
  const globalLetterSpacing = typographyDefaults.letterSpacing?.[typographyType];

  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const {
    enabled,
  } = useEditor((state) => ({
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
    [isEditMode, getResponsiveValue, actualBreakpoint]
  );

  const responsiveResolver: ResponsiveResolver = (values, fallback) =>
    getEditorResponsiveValue(values, fallback);

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
  const isEmpty = !currentText || 
    currentText.trim() === "" || 
    currentText === "<p><br></p>" ||
    currentText === "<p></p>" ||
    currentText.replace(/<[^>]*>/g, "").trim() === "";


  // Resolve responsive values
  const effectiveTextAlign = textAlignResponsive
    ? responsiveResolver(textAlignResponsive, textAlign || "left")
    : textAlign || "left";

  const effectiveFontSize = fontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: fontSizeResponsive,
        fallbackValue: fontSize ?? globalFontSize ?? 16,
        fallbackUnit: fontSizeUnit,
        resolver: responsiveResolver,
      })
    : `${fontSize ?? globalFontSize ?? 16}${fontSizeUnit}`;

  const effectiveFontWeight = fontWeightResponsive
    ? responsiveResolver(fontWeightResponsive, fontWeight ?? globalFontWeight ?? 400)
    : fontWeight ?? globalFontWeight ?? 400;

  const effectiveFontStyle = fontStyleResponsive
    ? responsiveResolver(fontStyleResponsive, fontStyle ?? globalFontStyle ?? "normal")
    : fontStyle ?? globalFontStyle ?? "normal";

  const effectiveTextTransform = textTransformResponsive
    ? responsiveResolver(textTransformResponsive, textTransform ?? "none")
    : textTransform ?? "none";

  const effectiveTextDecoration = textDecorationResponsive
    ? responsiveResolver(textDecorationResponsive, textDecoration ?? "none")
    : textDecoration ?? "none";

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
      const googleFont = isHeading
        ? typographyDefaults.googleFonts?.headings
        : typographyDefaults.googleFonts?.body;
      if (googleFont) {
        return getGoogleFontFamilyCSS(googleFont, globalFontFamily);
      }
      return globalFontFamily;
    }
    return "sans-serif";
  };

  const effectiveFontFamily = getEffectiveFontFamily();

  // Text color resolution
  const effectiveTextColor = textColorResponsive
    ? responsiveResolver(textColorResponsive, textColor ?? globalTextColor ?? "#1f2937")
    : textColor ?? globalTextColor ?? "#1f2937";

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
  const textClassName = `text-${cssId || "default"}`;
  const hoverClassName = `${textClassName}-hover`;

  let responsiveCss = "";
  const shouldGenerateMediaQueries = !isEditMode;

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

    // Text align responsive CSS
    if (textAlignResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "text-align", textAlignResponsive, textAlign || "left", "");
    }

    // Font size responsive CSS
    if (fontSizeResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "font-size", fontSizeResponsive, fontSize ?? globalFontSize ?? 16, fontSizeUnit);
    }

    // Font weight responsive CSS
    if (fontWeightResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "font-weight", fontWeightResponsive, fontWeight ?? globalFontWeight ?? 400, "");
    }

    // Font style responsive CSS
    if (fontStyleResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "font-style", fontStyleResponsive, fontStyle ?? globalFontStyle ?? "normal", "");
    }

    // Text transform responsive CSS
    if (textTransformResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "text-transform", textTransformResponsive, textTransform ?? "none", "");
    }

    // Text decoration responsive CSS
    if (textDecorationResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "text-decoration", textDecorationResponsive, textDecoration ?? "none", "");
    }

    // Letter spacing responsive CSS
    if (letterSpacingResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "letter-spacing", letterSpacingResponsive, letterSpacing ?? globalLetterSpacing ?? 0, letterSpacingUnit);
    }

    // Line height responsive CSS
    if (lineHeightResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "line-height", lineHeightResponsive, lineHeight ?? globalLineHeight ?? 1.6, lineHeightUnit === "normal" ? "" : lineHeightUnit);
    }

    // Font family responsive CSS
    if (fontFamilyResponsive) {
      responsiveCss += generateResponsiveCss(hoverClassName, "font-family", fontFamilyResponsive, effectiveFontFamily, "");
    }

    // Text color responsive CSS
    if (textColorResponsive) {
      responsiveCss += generateTextColorCss(hoverClassName, textColorResponsive, textColor ?? globalTextColor ?? "#1f2937");
    }

    // Link color responsive CSS
    if (linkColorResponsive || linkColorHoverResponsive) {
      responsiveCss += generateLinkColorCss(hoverClassName, linkColorResponsive, linkColor ?? undefined, linkColorHoverResponsive, linkColorHover ?? undefined);
    }

    // Background responsive CSS
    if (backgroundColorResponsive) {
      responsiveCss += generateBackgroundColorCss(hoverClassName, backgroundColorResponsive, backgroundColor ?? "#ffffff");
    }

    // Border responsive CSS
    if (borderColorResponsive) {
      responsiveCss += generateBorderColorCss(hoverClassName, borderColorResponsive, borderColor ?? "#000000");
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
        boxShadowColor
      );
    }

    // Position responsive CSS
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
    if (zIndexResponsive) {
      responsiveCss += generateZIndexCss(hoverClassName, zIndexResponsive, zIndex ?? 0);
    }
  }

  // Generate hover CSS
  let hoverCss = "";
  if (shouldGenerateMediaQueries) {
    // Text color hover
    if (textColorHover && textColorHoverResponsive) {
      const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];
      hoverCss += `.${hoverClassName}:hover { color: ${textColorHover} !important; }\n`;
      for (const bp of breakpoints) {
        if (textColorHoverResponsive[bp] !== undefined && textColorHoverResponsive[bp] !== null) {
          const value = textColorHoverResponsive[bp];
          if (typeof value === "string" && value !== textColorHover) {
            hoverCss += `${getMediaQuery(bp)} { .${hoverClassName}:hover { color: ${value} !important; } }\n`;
          }
        }
      }
    } else if (textColorHover) {
      hoverCss += `.${hoverClassName}:hover { color: ${textColorHover} !important; } `;
    }

    // Background hover
    if (enableBackgroundColorHover && backgroundColorHover && backgroundColorHoverResponsive) {
      hoverCss += generateHoverBackgroundColorCss(hoverClassName, backgroundColorHoverResponsive, backgroundColorHover);
    } else if (enableBackgroundColorHover && backgroundColorHover) {
      hoverCss += `.${hoverClassName}:hover { background-color: ${backgroundColorHover} !important; } `;
    }

    // Border hover
    if (borderColorHover && borderColorHoverResponsive) {
      hoverCss += generateHoverBorderColorCss(hoverClassName, borderColorHoverResponsive, borderColorHover);
    } else if (borderColorHover) {
      hoverCss += `.${hoverClassName}:hover { border-color: ${borderColorHover} !important; } `;
    }

    // Box shadow hover
    if (enableBoxShadowHover && (boxShadowHorizontalHoverResponsive || boxShadowVerticalHoverResponsive || boxShadowBlurHoverResponsive || boxShadowSpreadHoverResponsive)) {
      hoverCss += generateBoxShadowCss(
        hoverClassName,
        boxShadowHorizontalHoverResponsive,
        boxShadowVerticalHoverResponsive,
        boxShadowBlurHoverResponsive,
        boxShadowSpreadHoverResponsive,
        boxShadowHorizontalHover ?? 0,
        boxShadowVerticalHover ?? 0,
        boxShadowBlurHover ?? 0,
        boxShadowSpreadHover ?? 0,
        boxShadowColorHover
      );
      hoverCss = hoverCss.replace(/\./g, ".:hover");
    } else if (enableBoxShadowHover) {
      const shadowValue = `${boxShadowHorizontalHover ?? 0}px ${boxShadowVerticalHover ?? 0}px ${boxShadowBlurHover ?? 0}px ${boxShadowSpreadHover ?? 0}px ${boxShadowColorHover}`;
      hoverCss += `.${hoverClassName}:hover { box-shadow: ${shadowValue} !important; } `;
    }
  }

  // Build background styles
  const backgroundStyles = buildBackgroundStyles({
    backgroundColor: backgroundColor ?? "#ffffff",
    backgroundType,
    backgroundGradient,
    backgroundImage,
    resolver: responsiveResolver,
    responsive: backgroundColorResponsive,
  });

  // Build border styles
  const borderStyles = buildBorderStyles({
    style: borderStyle === "none" ? undefined : borderStyle,
    color: borderColor === "#000000" && borderStyle === "none" ? undefined : borderColor,
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

  // Build link color CSS
  const linkColorCss = buildLinkColorCss({
    baseSelector: `.${hoverClassName}`,
    linkColor: linkColor ?? undefined,
    linkColorHover: linkColorHover ?? undefined,
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

  // Combine all CSS
  const styleTagContent = mergeCssSegments([
    responsiveCss,
    hoverCss,
    linkColorCss,
    overlayStyles.css,
    visibilityCss,
  ]);

  // Build inline styles (for edit mode)
  const textStyle: React.CSSProperties = {
    ...textColorStyles,
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
    ...backgroundStyles,
    ...borderStyles,
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
      ${hoverClassName}
      ${className}
    `.trim(),
    style: textStyle,
    onClick: handleClick,
  };

  return (
    <>
      <style>{styleTagContent}</style>
      <div
        ref={wrapperRef}
        className={`relative ${isEditMode ? (selected ? (editable ? "ring-2 ring-green-500 bg-green-50" : "ring-2 ring-blue-500 cursor-text") : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer") : ""}`}
      >
        {/* Lexical Editor handles HTML structure properly */}
        {htmlTag === "p" || htmlTag === "span" ? (
          // For p/span tags, wrap in a div to avoid nesting issues
          <div
            ref={(ref: HTMLDivElement | null) => {
              if (!ref) return;
              if (isEditMode) {
                connect(drag(ref));
              } else {
                connect(ref);
              }
            }}
            {...textProps}
            className={`${textProps.className} ${isEditMode ? (selected ? (editable ? "ring-2 ring-green-500 bg-green-50" : "ring-2 ring-blue-500 cursor-text") : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer") : ""}`}
          >
            {isEditMode && editable ? (
              <LexicalEditor
                value={currentText || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Type your text here"
                style={textStyle}
                readOnly={false}
              />
            ) : (
              React.createElement(
                TextTag,
                {
                  className: `outline-none ${isEmpty ? "text-gray-400" : ""}`,
                  style: textStyle,
                  onClick: handleClick,
                  ...(isEmpty 
                    ? { children: (
                        <span 
                          className="pointer-events-none select-none" 
                          style={{ color: "#9ca3af" }}
                        >
                          Type your text here
                        </span>
                      ) }
                    : { dangerouslySetInnerHTML: { __html: currentText || "" } }
                  ),
                }
              )
            )}
          </div>
        ) : (
          // For div/h1-h6 tags, we can use them directly
          React.createElement(
            TextTag,
            {
              ...textProps,
              ref: (ref: HTMLElement | null) => {
                if (!ref) return;
                if (isEditMode) {
                  connect(drag(ref));
                } else {
                  connect(ref);
                }
              },
            },
            isEditMode && editable ? (
              <LexicalEditor
                value={currentText || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Type your text here"
                style={textStyle}
                readOnly={false}
              />
            ) : (
              <div
                className={`outline-none ${isEmpty ? "text-gray-400" : ""}`}
                style={textStyle}
                onClick={handleClick}
                {...(isEmpty 
                  ? { children: (
                      <span 
                        className="pointer-events-none select-none" 
                        style={{ color: "#9ca3af" }}
                      >
                        Type your text here
                      </span>
                    ) }
                  : { dangerouslySetInnerHTML: { __html: currentText || "" } }
                )}
              />
            )
          )
        )}
      </div>
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

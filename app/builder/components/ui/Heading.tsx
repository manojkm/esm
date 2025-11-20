"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import { useCanvasWidth } from "@/app/builder/contexts/CanvasWidthContext";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { getTypographyCSS } from "@/app/builder/lib/typography-utils";
import { getGoogleFontFamilyCSS } from "@/app/builder/lib/google-fonts";
import { buildBackgroundHoverCss, buildBackgroundStyles, buildBorderHoverCss, buildBorderStyles, buildBoxShadowHoverCss, buildBoxShadowStyle, buildHoverRule, buildResponsiveFourSideValue, buildResponsiveValueWithUnit, buildTextColorStyles, buildVisibilityCss, mergeCssSegments, parseDataAttributes, resolveResponsiveValue, type ResponsiveMap, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import { generatePaddingCss, generateMarginCss, generateResponsiveCss, generateBackgroundColorCss, generateBorderColorCss, generateResponsiveFourSideCss, generateBoxShadowCss, generateHoverBackgroundColorCss, generateHoverBorderColorCss, generateTextColorCss, generatePositionCss, generateZIndexCss } from "@/app/builder/lib/style-system/css-responsive";
import { sanitizeHTML, sanitizeHTMLForPreview } from "@/app/builder/lib/html-sanitizer";
import { generateComponentClassName } from "@/app/builder/lib/component-styles";
import type { HeadingProps } from "./heading/types";

export const Heading: React.FC<HeadingProps> = (props) => {
  // Get global settings for defaults
  const { settings } = useGlobalSettings();
  const typographyDefaults = settings.typography;
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
    separatorWidth = 12,
    separatorWidthResponsive,
    separatorWidthUnit = "%",
    separatorThickness = 2,
    separatorColor = "#000000",
    separatorColorResponsive,
    separatorBottomSpacing = 16,
    separatorBottomSpacingResponsive,
    separatorBottomSpacingUnit = "px",
    // Heading Typography
    headingFontFamily,
    headingFontFamilyResponsive,
    headingFontSize,
    headingFontSizeResponsive,
    headingFontSizeUnit = "px",
    headingFontWeight,
    headingFontWeightResponsive,
    headingFontStyle,
    headingFontStyleResponsive,
    headingTextTransform,
    headingTextTransformResponsive,
    headingTextDecoration,
    headingTextDecorationResponsive,
    headingLetterSpacing,
    headingLetterSpacingResponsive,
    headingLetterSpacingUnit = "px",
    headingLineHeight,
    headingLineHeightResponsive,
    headingLineHeightUnit = "normal",
    headingTextColor,
    headingTextColorResponsive,
    headingTextColorHover,
    headingTextColorHoverResponsive,
    headingBottomSpacing = 16,
    headingBottomSpacingResponsive,
    headingBottomSpacingUnit = "px",
    // Sub Heading Typography
    subHeadingFontFamily,
    subHeadingFontFamilyResponsive,
    subHeadingFontSize,
    subHeadingFontSizeResponsive,
    subHeadingFontSizeUnit = "px",
    subHeadingFontWeight,
    subHeadingFontWeightResponsive,
    subHeadingFontStyle,
    subHeadingFontStyleResponsive,
    subHeadingTextTransform,
    subHeadingTextTransformResponsive,
    subHeadingTextDecoration,
    subHeadingTextDecorationResponsive,
    subHeadingLetterSpacing,
    subHeadingLetterSpacingResponsive,
    subHeadingLetterSpacingUnit = "px",
    subHeadingLineHeight,
    subHeadingLineHeightResponsive,
    subHeadingLineHeightUnit = "normal",
    subHeadingTextColor,
    subHeadingTextColorResponsive,
    subHeadingTextColorHover,
    subHeadingTextColorHoverResponsive,
    subHeadingBottomSpacing = 16,
    subHeadingBottomSpacingResponsive,
    subHeadingBottomSpacingUnit = "px",
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
    overlayOpacity = 50,
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
    boxShadowHorizontal,
    boxShadowVertical,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowPosition,
    boxShadowHorizontalHover,
    boxShadowVerticalHover,
    boxShadowBlurHover,
    boxShadowSpreadHover,
    boxShadowPositionHover,
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
    // Position
    position,
    positionResponsive,
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
  } = props;

  const { id, connectors, actions, selected } = useNode((node) => ({
    selected: node.events.selected,
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

  // State for editable text
  const [editableHeading, setEditableHeading] = useState(false);
  const [editableSubHeading, setEditableSubHeading] = useState(false);
  const [currentHeadingText, setCurrentHeadingText] = useState(text || "");
  const [currentSubHeadingText, setCurrentSubHeadingText] = useState(subHeading || "");

  useEffect(() => {
    if (!selected) {
      setEditableHeading(false);
      setEditableSubHeading(false);
    }
  }, [selected]);

  useEffect(() => {
    setCurrentHeadingText(text || "");
  }, [text]);

  useEffect(() => {
    setCurrentSubHeadingText(subHeading || "");
  }, [subHeading]);

  const handleHeadingClick = (e: React.MouseEvent) => {
    if (selected && !editableHeading && isEditMode) {
      e.stopPropagation();
      setEditableHeading(true);
    }
  };

  const handleSubHeadingClick = (e: React.MouseEvent) => {
    if (selected && !editableSubHeading && isEditMode && enableSubHeading) {
      e.stopPropagation();
      setEditableSubHeading(true);
    }
  };

  const handleHeadingChange = (value: string) => {
    setCurrentHeadingText(value);
    actions.setProp((props: HeadingProps) => {
      props.text = value;
    });
  };

  const handleSubHeadingChange = (value: string) => {
    setCurrentSubHeadingText(value);
    actions.setProp((props: HeadingProps) => {
      props.subHeading = value;
    });
  };

  const handleHeadingBlur = () => {
    setEditableHeading(false);
  };

  const handleSubHeadingBlur = () => {
    setEditableSubHeading(false);
  };

  // Generate unique class name
  const componentClassName = generateComponentClassName(id, cssId, "heading");

  // Resolve responsive values
  const effectiveTextAlign = textAlignResponsive ? responsiveResolver(textAlignResponsive, textAlign || "left") : textAlign || "left";

  // Global defaults for heading typography
  const globalHeadingFontSize = typographyDefaults.headingFontSize?.[headingTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"] || (headingTag === "h1" ? 32 : headingTag === "h2" ? 24 : headingTag === "h3" ? 20 : headingTag === "h4" ? 18 : headingTag === "h5" ? 16 : headingTag === "h6" ? 14 : 24);
  const globalHeadingFontWeight = typographyDefaults.headingFontWeight || 700;
  const globalHeadingFontFamily = typographyDefaults.googleFonts?.headings?.family || typographyDefaults.fontFamily || "sans-serif";
  const globalHeadingTextColor = typographyDefaults.headingTextColor || "#1f2937";

  // Resolve heading typography values
  const effectiveHeadingFontSize = headingFontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: headingFontSizeResponsive,
        fallbackValue: headingFontSize ?? globalHeadingFontSize,
        fallbackUnit: headingFontSizeUnit,
        resolver: responsiveResolver,
      })
    : `${headingFontSize ?? globalHeadingFontSize}${headingFontSizeUnit}`;

  const effectiveHeadingFontWeight = headingFontWeightResponsive ? responsiveResolver(headingFontWeightResponsive, headingFontWeight ?? globalHeadingFontWeight) : headingFontWeight ?? globalHeadingFontWeight;
  const effectiveHeadingFontStyle = headingFontStyleResponsive ? responsiveResolver(headingFontStyleResponsive, headingFontStyle ?? "normal") : headingFontStyle ?? "normal";
  const effectiveHeadingTextTransform = headingTextTransformResponsive ? responsiveResolver(headingTextTransformResponsive, headingTextTransform ?? "none") : headingTextTransform ?? "none";
  const effectiveHeadingTextDecoration = headingTextDecorationResponsive ? responsiveResolver(headingTextDecorationResponsive, headingTextDecoration ?? "none") : headingTextDecoration ?? "none";
  const effectiveHeadingLetterSpacing = headingLetterSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: headingLetterSpacingResponsive,
        fallbackValue: headingLetterSpacing ?? 0,
        fallbackUnit: headingLetterSpacingUnit,
        resolver: responsiveResolver,
      })
    : `${headingLetterSpacing ?? 0}${headingLetterSpacingUnit}`;

  const effectiveHeadingLineHeight = headingLineHeightResponsive
    ? buildResponsiveValueWithUnit({
        responsive: headingLineHeightResponsive,
        fallbackValue: headingLineHeight ?? 1.2,
        fallbackUnit: headingLineHeightUnit,
        resolver: responsiveResolver,
      })
    : headingLineHeightUnit === "normal" || headingLineHeightUnit === "number"
    ? headingLineHeight ?? 1.2
    : `${headingLineHeight ?? 1.2}${headingLineHeightUnit}`;

  // Get heading font family
  const getHeadingFontFamily = () => {
    if (headingFontFamily) return headingFontFamily;
    if (headingFontFamilyResponsive) {
      return responsiveResolver(headingFontFamilyResponsive, globalHeadingFontFamily);
    }
    const googleFont = typographyDefaults.googleFonts?.headings;
    if (googleFont) {
      return getGoogleFontFamilyCSS(googleFont, globalHeadingFontFamily);
    }
    return globalHeadingFontFamily;
  };

  const effectiveHeadingFontFamily = getHeadingFontFamily();
  const effectiveHeadingTextColor = headingTextColorResponsive ? responsiveResolver(headingTextColorResponsive, headingTextColor ?? globalHeadingTextColor) : headingTextColor ?? globalHeadingTextColor;

  // Resolve sub heading typography values
  const globalSubHeadingFontSize = typographyDefaults.bodyFontSize || 16;
  const globalSubHeadingFontWeight = typographyDefaults.fontWeight || 400;
  const globalSubHeadingFontFamily = typographyDefaults.googleFonts?.body?.family || typographyDefaults.fontFamily || "sans-serif";
  const globalSubHeadingTextColor = typographyDefaults.textColor || "#6b7280";

  const effectiveSubHeadingFontSize = subHeadingFontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: subHeadingFontSizeResponsive,
        fallbackValue: subHeadingFontSize ?? globalSubHeadingFontSize,
        fallbackUnit: subHeadingFontSizeUnit,
        resolver: responsiveResolver,
      })
    : `${subHeadingFontSize ?? globalSubHeadingFontSize}${subHeadingFontSizeUnit}`;

  const effectiveSubHeadingFontWeight = subHeadingFontWeightResponsive ? responsiveResolver(subHeadingFontWeightResponsive, subHeadingFontWeight ?? globalSubHeadingFontWeight) : subHeadingFontWeight ?? globalSubHeadingFontWeight;
  const effectiveSubHeadingFontStyle = subHeadingFontStyleResponsive ? responsiveResolver(subHeadingFontStyleResponsive, subHeadingFontStyle ?? "normal") : subHeadingFontStyle ?? "normal";
  const effectiveSubHeadingTextTransform = subHeadingTextTransformResponsive ? responsiveResolver(subHeadingTextTransformResponsive, subHeadingTextTransform ?? "none") : subHeadingTextTransform ?? "none";
  const effectiveSubHeadingTextDecoration = subHeadingTextDecorationResponsive ? responsiveResolver(subHeadingTextDecorationResponsive, subHeadingTextDecoration ?? "none") : subHeadingTextDecoration ?? "none";
  const effectiveSubHeadingLetterSpacing = subHeadingLetterSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: subHeadingLetterSpacingResponsive,
        fallbackValue: subHeadingLetterSpacing ?? 0,
        fallbackUnit: subHeadingLetterSpacingUnit,
        resolver: responsiveResolver,
      })
    : `${subHeadingLetterSpacing ?? 0}${subHeadingLetterSpacingUnit}`;

  const effectiveSubHeadingLineHeight = subHeadingLineHeightResponsive
    ? buildResponsiveValueWithUnit({
        responsive: subHeadingLineHeightResponsive,
        fallbackValue: subHeadingLineHeight ?? 1.5,
        fallbackUnit: subHeadingLineHeightUnit,
        resolver: responsiveResolver,
      })
    : subHeadingLineHeightUnit === "normal" || subHeadingLineHeightUnit === "number"
    ? subHeadingLineHeight ?? 1.5
    : `${subHeadingLineHeight ?? 1.5}${subHeadingLineHeightUnit}`;

  const getSubHeadingFontFamily = () => {
    if (subHeadingFontFamily) return subHeadingFontFamily;
    if (subHeadingFontFamilyResponsive) {
      return responsiveResolver(subHeadingFontFamilyResponsive, globalSubHeadingFontFamily);
    }
    const googleFont = typographyDefaults.googleFonts?.body;
    if (googleFont) {
      return getGoogleFontFamilyCSS(googleFont, globalSubHeadingFontFamily);
    }
    return globalSubHeadingFontFamily;
  };

  const effectiveSubHeadingFontFamily = getSubHeadingFontFamily();
  const effectiveSubHeadingTextColor = subHeadingTextColorResponsive ? responsiveResolver(subHeadingTextColorResponsive, subHeadingTextColor ?? globalSubHeadingTextColor) : subHeadingTextColor ?? globalSubHeadingTextColor;

  // Resolve spacing values
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

  // Resolve heading bottom spacing
  const effectiveHeadingBottomSpacing = headingBottomSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: headingBottomSpacingResponsive,
        fallbackValue: headingBottomSpacing ?? 16,
        fallbackUnit: headingBottomSpacingUnit,
        resolver: responsiveResolver,
      })
    : `${headingBottomSpacing ?? 16}${headingBottomSpacingUnit}`;

  // Resolve sub heading bottom spacing
  const effectiveSubHeadingBottomSpacing = subHeadingBottomSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: subHeadingBottomSpacingResponsive,
        fallbackValue: subHeadingBottomSpacing ?? 16,
        fallbackUnit: subHeadingBottomSpacingUnit,
        resolver: responsiveResolver,
      })
    : `${subHeadingBottomSpacing ?? 16}${subHeadingBottomSpacingUnit}`;

  // Resolve separator values
  const effectiveSeparatorWidth = separatorWidthResponsive
    ? buildResponsiveValueWithUnit({
        responsive: separatorWidthResponsive,
        fallbackValue: separatorWidth ?? 12,
        fallbackUnit: separatorWidthUnit,
        resolver: responsiveResolver,
      })
    : `${separatorWidth ?? 12}${separatorWidthUnit}`;

  const effectiveSeparatorColor = separatorColorResponsive ? responsiveResolver(separatorColorResponsive, separatorColor ?? "#000000") : separatorColor ?? "#000000";
  const effectiveSeparatorBottomSpacing = separatorBottomSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: separatorBottomSpacingResponsive,
        fallbackValue: separatorBottomSpacing ?? 16,
        fallbackUnit: separatorBottomSpacingUnit,
        resolver: responsiveResolver,
      })
    : `${separatorBottomSpacing ?? 16}${separatorBottomSpacingUnit}`;

  const effectiveSeparatorThickness = separatorThickness ?? 2;

  // Generate CSS for preview mode
  const shouldGenerateMediaQueries = !isEditMode;
  let responsiveCss = "";
  let responsiveHoverCss = "";

  if (shouldGenerateMediaQueries) {
    // Padding CSS
    if (paddingResponsive) {
      responsiveCss += generatePaddingCss(componentClassName, paddingResponsive, { top: paddingTop, right: paddingRight, bottom: paddingBottom, left: paddingLeft, defaultValue: padding ?? 0 }, paddingUnit);
    } else if (padding !== null && padding !== undefined) {
      const top = paddingTop ?? padding;
      const right = paddingRight ?? padding;
      const bottom = paddingBottom ?? padding;
      const left = paddingLeft ?? padding;
      responsiveCss += `.${componentClassName} { padding: ${top}${paddingUnit} ${right}${paddingUnit} ${bottom}${paddingUnit} ${left}${paddingUnit}; }\n`;
    }

    // Margin CSS
    const hasMarginValue = margin !== null && margin !== undefined;
    const hasIndividualMargin = marginTop !== null || marginRight !== null || marginBottom !== null || marginLeft !== null;
    if (marginResponsive) {
      responsiveCss += generateMarginCss(componentClassName, marginResponsive, { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft, defaultValue: margin ?? 0 }, marginUnit);
    } else if (hasMarginValue || hasIndividualMargin) {
      const top = marginTop ?? margin ?? 0;
      const right = marginRight ?? margin ?? 0;
      const bottom = marginBottom ?? margin ?? 0;
      const left = marginLeft ?? margin ?? 0;
      responsiveCss += `.${componentClassName} { margin: ${top}${marginUnit} ${right}${marginUnit} ${bottom}${marginUnit} ${left}${marginUnit}; }\n`;
    }

    // Text align
    if (textAlignResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-content`, "text-align", textAlignResponsive, textAlign || "left", "", true);
    } else {
      responsiveCss += `.${componentClassName} .heading-content { text-align: ${textAlign || "left"} !important; }\n`;
    }

    // Heading Typography CSS
    if (headingFontSizeResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "font-size", headingFontSizeResponsive, headingFontSize ?? globalHeadingFontSize, headingFontSizeUnit);
    } else {
      responsiveCss += `.${componentClassName} .heading-text { font-size: ${headingFontSize ?? globalHeadingFontSize}${headingFontSizeUnit}; }\n`;
    }

    if (headingFontWeightResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "font-weight", headingFontWeightResponsive, headingFontWeight ?? globalHeadingFontWeight, "");
    } else {
      responsiveCss += `.${componentClassName} .heading-text { font-weight: ${headingFontWeight ?? globalHeadingFontWeight}; }\n`;
    }

    if (headingFontStyleResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "font-style", headingFontStyleResponsive, headingFontStyle ?? "normal", "");
    } else {
      responsiveCss += `.${componentClassName} .heading-text { font-style: ${headingFontStyle ?? "normal"}; }\n`;
    }

    if (headingTextTransformResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "text-transform", headingTextTransformResponsive, headingTextTransform ?? "none", "");
    } else {
      responsiveCss += `.${componentClassName} .heading-text { text-transform: ${headingTextTransform ?? "none"}; }\n`;
    }

    if (headingTextDecorationResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "text-decoration", headingTextDecorationResponsive, headingTextDecoration ?? "none", "");
    } else {
      responsiveCss += `.${componentClassName} .heading-text { text-decoration: ${headingTextDecoration ?? "none"}; }\n`;
    }

    if (headingLetterSpacingResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "letter-spacing", headingLetterSpacingResponsive, headingLetterSpacing ?? 0, headingLetterSpacingUnit);
    } else {
      responsiveCss += `.${componentClassName} .heading-text { letter-spacing: ${headingLetterSpacing ?? 0}${headingLetterSpacingUnit}; }\n`;
    }

    if (headingLineHeightResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "line-height", headingLineHeightResponsive, headingLineHeight ?? 1.2, headingLineHeightUnit === "normal" ? "" : headingLineHeightUnit);
    } else {
      const heightValue = headingLineHeight ?? 1.2;
      const lineHeightValue = headingLineHeightUnit === "normal" ? "normal" : `${heightValue}${headingLineHeightUnit}`;
      responsiveCss += `.${componentClassName} .heading-text { line-height: ${lineHeightValue}; }\n`;
    }

    if (headingFontFamilyResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "font-family", headingFontFamilyResponsive, effectiveHeadingFontFamily, "");
    } else if (effectiveHeadingFontFamily) {
      responsiveCss += `.${componentClassName} .heading-text { font-family: ${effectiveHeadingFontFamily}; }\n`;
    }

    if (headingTextColorResponsive) {
      responsiveCss += generateTextColorCss(`${componentClassName} .heading-text`, headingTextColorResponsive, headingTextColor ?? globalHeadingTextColor);
    } else {
      responsiveCss += `.${componentClassName} .heading-text { color: ${headingTextColor ?? globalHeadingTextColor}; }\n`;
    }

    // Heading hover color
    if (headingTextColorHoverResponsive && headingTextColorHover) {
      responsiveHoverCss += generateTextColorCss(`${componentClassName} .heading-text:hover`, headingTextColorHoverResponsive, headingTextColorHover);
      // Add !important via string replacement
      responsiveHoverCss = responsiveHoverCss.replace(/color:\s*([^;]+);/g, "color: $1 !important;");
    } else if (headingTextColorHover) {
      responsiveHoverCss += `.${componentClassName} .heading-text:hover { color: ${headingTextColorHover} !important; }\n`;
    }

    // Heading bottom spacing
    if (headingBottomSpacingResponsive) {
      responsiveCss += generateResponsiveCss(`${componentClassName} .heading-text`, "margin-bottom", headingBottomSpacingResponsive, headingBottomSpacing ?? 16, headingBottomSpacingUnit);
    } else {
      responsiveCss += `.${componentClassName} .heading-text { margin-bottom: ${headingBottomSpacing ?? 16}${headingBottomSpacingUnit}; }\n`;
    }

    // Sub Heading Typography CSS (only if enabled)
    if (enableSubHeading) {
      if (subHeadingFontSizeResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "font-size", subHeadingFontSizeResponsive, subHeadingFontSize ?? globalSubHeadingFontSize, subHeadingFontSizeUnit);
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { font-size: ${subHeadingFontSize ?? globalSubHeadingFontSize}${subHeadingFontSizeUnit}; }\n`;
      }

      if (subHeadingFontWeightResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "font-weight", subHeadingFontWeightResponsive, subHeadingFontWeight ?? globalSubHeadingFontWeight, "");
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { font-weight: ${subHeadingFontWeight ?? globalSubHeadingFontWeight}; }\n`;
      }

      if (subHeadingFontStyleResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "font-style", subHeadingFontStyleResponsive, subHeadingFontStyle ?? "normal", "");
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { font-style: ${subHeadingFontStyle ?? "normal"}; }\n`;
      }

      if (subHeadingTextTransformResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "text-transform", subHeadingTextTransformResponsive, subHeadingTextTransform ?? "none", "");
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { text-transform: ${subHeadingTextTransform ?? "none"}; }\n`;
      }

      if (subHeadingTextDecorationResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "text-decoration", subHeadingTextDecorationResponsive, subHeadingTextDecoration ?? "none", "");
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { text-decoration: ${subHeadingTextDecoration ?? "none"}; }\n`;
      }

      if (subHeadingLetterSpacingResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "letter-spacing", subHeadingLetterSpacingResponsive, subHeadingLetterSpacing ?? 0, subHeadingLetterSpacingUnit);
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { letter-spacing: ${subHeadingLetterSpacing ?? 0}${subHeadingLetterSpacingUnit}; }\n`;
      }

      if (subHeadingLineHeightResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "line-height", subHeadingLineHeightResponsive, subHeadingLineHeight ?? 1.5, subHeadingLineHeightUnit === "normal" ? "" : subHeadingLineHeightUnit);
      } else {
        const heightValue = subHeadingLineHeight ?? 1.5;
        const lineHeightValue = subHeadingLineHeightUnit === "normal" ? "normal" : `${heightValue}${subHeadingLineHeightUnit}`;
        responsiveCss += `.${componentClassName} .sub-heading-text { line-height: ${lineHeightValue}; }\n`;
      }

      if (subHeadingFontFamilyResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "font-family", subHeadingFontFamilyResponsive, effectiveSubHeadingFontFamily, "");
      } else if (effectiveSubHeadingFontFamily) {
        responsiveCss += `.${componentClassName} .sub-heading-text { font-family: ${effectiveSubHeadingFontFamily}; }\n`;
      }

      if (subHeadingTextColorResponsive) {
        responsiveCss += generateTextColorCss(`${componentClassName} .sub-heading-text`, subHeadingTextColorResponsive, subHeadingTextColor ?? globalSubHeadingTextColor);
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { color: ${subHeadingTextColor ?? globalSubHeadingTextColor}; }\n`;
      }

      // Sub heading hover color
      if (subHeadingTextColorHoverResponsive && subHeadingTextColorHover) {
        responsiveHoverCss += generateTextColorCss(`${componentClassName} .sub-heading-text:hover`, subHeadingTextColorHoverResponsive, subHeadingTextColorHover);
        // Add !important via string replacement
        responsiveHoverCss = responsiveHoverCss.replace(/color:\s*([^;]+);/g, "color: $1 !important;");
      } else if (subHeadingTextColorHover) {
        responsiveHoverCss += `.${componentClassName} .sub-heading-text:hover { color: ${subHeadingTextColorHover} !important; }\n`;
      }

      // Sub heading bottom spacing
      if (subHeadingBottomSpacingResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .sub-heading-text`, "margin-bottom", subHeadingBottomSpacingResponsive, subHeadingBottomSpacing ?? 16, subHeadingBottomSpacingUnit);
      } else {
        responsiveCss += `.${componentClassName} .sub-heading-text { margin-bottom: ${subHeadingBottomSpacing ?? 16}${subHeadingBottomSpacingUnit}; }\n`;
      }
    }

    // Separator CSS (only if enabled)
    if (separatorStyle && separatorStyle !== "none") {
      if (separatorWidthResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .heading-separator`, "width", separatorWidthResponsive, separatorWidth ?? 12, separatorWidthUnit);
      } else {
        responsiveCss += `.${componentClassName} .heading-separator { width: ${separatorWidth ?? 12}${separatorWidthUnit}; }\n`;
      }

      const borderStyle = separatorStyle === "double" ? "double" : separatorStyle === "dashed" ? "dashed" : separatorStyle === "dotted" ? "dotted" : "solid";
      responsiveCss += `.${componentClassName} .heading-separator { border-style: ${borderStyle}; border-width: 0 0 ${effectiveSeparatorThickness}px 0; border-color: ${effectiveSeparatorColor}; }\n`;

      if (separatorBottomSpacingResponsive) {
        responsiveCss += generateResponsiveCss(`${componentClassName} .heading-separator`, "margin-bottom", separatorBottomSpacingResponsive, separatorBottomSpacing ?? 16, separatorBottomSpacingUnit);
      } else {
        responsiveCss += `.${componentClassName} .heading-separator { margin-bottom: ${separatorBottomSpacing ?? 16}${separatorBottomSpacingUnit}; }\n`;
      }
    }

    // Background CSS
    if (backgroundType === "color") {
      if (backgroundColorResponsive || backgroundColor) {
        const fallbackColor = backgroundColor ?? (typeof backgroundColorResponsive?.desktop === "string" ? backgroundColorResponsive.desktop : undefined);
        if (fallbackColor) {
          responsiveCss += generateBackgroundColorCss(componentClassName, backgroundColorResponsive, fallbackColor);
        }
      }
    } else if (backgroundType === "gradient" && backgroundGradient) {
      responsiveCss += `.${componentClassName} { background-image: ${backgroundGradient}; }\n`;
    } else if (backgroundType === "image" && backgroundImage) {
      responsiveCss += `.${componentClassName} { background-image: url("${backgroundImage}"); background-size: cover; background-position: center; background-repeat: no-repeat; }\n`;
    }

    // Border CSS
    const effectiveBorderColor = borderColor ?? globalBorderColor;
    if (borderStyle && borderStyle !== "none") {
      if (borderColorResponsive) {
        responsiveCss += generateBorderColorCss(componentClassName, borderColorResponsive, effectiveBorderColor ?? undefined);
      } else if (effectiveBorderColor) {
        responsiveCss += `.${componentClassName} { border-color: ${effectiveBorderColor}; }\n`;
      }
      responsiveCss += `.${componentClassName} { border-style: ${borderStyle}; }\n`;
    }

    // Box Shadow CSS
    if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
      responsiveCss += generateBoxShadowCss(componentClassName, boxShadowHorizontalResponsive, boxShadowVerticalResponsive, boxShadowBlurResponsive, boxShadowSpreadResponsive, boxShadowHorizontal ?? 0, boxShadowVertical ?? 0, boxShadowBlur ?? 0, boxShadowSpread ?? 0, boxShadowColor);
    }

    // Position CSS
    if (position && position !== "default" && position !== "static") {
      if (position === "relative" || position === "absolute" || position === "fixed" || position === "sticky") {
        responsiveCss += `.${componentClassName} { position: ${position}; }\n`;
      }
    }

    if (zIndex !== null && zIndex !== undefined) {
      if (zIndexResponsive) {
        responsiveCss += generateZIndexCss(componentClassName, zIndexResponsive, zIndex);
      } else {
        responsiveCss += `.${componentClassName} { z-index: ${zIndex}; }\n`;
      }
    }
  }

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

  const headingTextColorStyles = buildTextColorStyles({
    color: effectiveHeadingTextColor,
  });

  const subHeadingTextColorStyles = buildTextColorStyles({
    color: effectiveSubHeadingTextColor,
  });

  // Build hover CSS
  let hoverCss = "";
  if (shouldGenerateMediaQueries) {
    hoverCss = responsiveHoverCss;
  } else {
    // Edit mode hover CSS
    if (headingTextColorHover) {
      hoverCss += `.${componentClassName} .heading-text:hover { color: ${headingTextColorHover} !important; } `;
    }
    if (enableSubHeading && subHeadingTextColorHover) {
      hoverCss += `.${componentClassName} .sub-heading-text:hover { color: ${subHeadingTextColorHover} !important; } `;
    }
  }

  // Background hover CSS
  if (enableBackgroundColorHover && backgroundColorHover) {
    if (shouldGenerateMediaQueries) {
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
      if (shouldGenerateMediaQueries) {
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

  // Combine all CSS
  const styleTagContent = mergeCssSegments(responsiveCss, hoverCss, visibilityCss, customCSS || "");

  // Build inline styles for edit mode
  const wrapperStyle: React.CSSProperties = {
    padding: isEditMode ? paddingValue : undefined,
    margin: isEditMode ? marginValue : undefined,
    ...(isEditMode ? backgroundStyles : {}),
    ...(isEditMode ? borderStyles : {}),
    boxShadow: isEditMode ? boxShadowStyle : undefined,
    position: isEditMode ? undefined : hasCustomPosition ? (position as React.CSSProperties["position"]) : undefined,
    top: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(top, positionUnit) : undefined,
    right: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(right, positionUnit) : undefined,
    bottom: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(bottom, positionUnit) : undefined,
    left: isEditMode ? undefined : hasCustomPosition ? formatPositionValue(left, positionUnit) : undefined,
    zIndex: isEditMode ? undefined : zIndex ? zIndex : undefined,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: isEditMode ? effectiveHeadingFontFamily : undefined,
    fontSize: isEditMode ? effectiveHeadingFontSize : undefined,
    fontWeight: isEditMode ? effectiveHeadingFontWeight : undefined,
    fontStyle: isEditMode ? effectiveHeadingFontStyle : undefined,
    textTransform: isEditMode ? effectiveHeadingTextTransform : undefined,
    textDecoration: isEditMode ? effectiveHeadingTextDecoration : undefined,
    letterSpacing: isEditMode ? effectiveHeadingLetterSpacing : undefined,
    lineHeight: isEditMode ? effectiveHeadingLineHeight : undefined,
    textAlign: isEditMode ? effectiveTextAlign : undefined,
    marginBottom: isEditMode ? effectiveHeadingBottomSpacing : undefined,
    ...headingTextColorStyles,
  };

  const subHeadingStyle: React.CSSProperties = {
    fontFamily: isEditMode ? effectiveSubHeadingFontFamily : undefined,
    fontSize: isEditMode ? effectiveSubHeadingFontSize : undefined,
    fontWeight: isEditMode ? effectiveSubHeadingFontWeight : undefined,
    fontStyle: isEditMode ? effectiveSubHeadingFontStyle : undefined,
    textTransform: isEditMode ? effectiveSubHeadingTextTransform : undefined,
    textDecoration: isEditMode ? effectiveSubHeadingTextDecoration : undefined,
    letterSpacing: isEditMode ? effectiveSubHeadingLetterSpacing : undefined,
    lineHeight: isEditMode ? effectiveSubHeadingLineHeight : undefined,
    textAlign: isEditMode ? effectiveTextAlign : undefined,
    marginBottom: isEditMode && enableSubHeading ? effectiveSubHeadingBottomSpacing : undefined,
    ...subHeadingTextColorStyles,
  };

  const separatorStyleCss: React.CSSProperties = {
    width: isEditMode && separatorStyle !== "none" ? effectiveSeparatorWidth : undefined,
    borderStyle: isEditMode && separatorStyle !== "none" ? (separatorStyle === "double" ? "double" : separatorStyle === "dashed" ? "dashed" : separatorStyle === "dotted" ? "dotted" : "solid") : undefined,
    borderWidth: isEditMode && separatorStyle !== "none" ? `0 0 ${effectiveSeparatorThickness}px 0` : undefined,
    borderColor: isEditMode && separatorStyle !== "none" ? effectiveSeparatorColor : undefined,
    marginBottom: isEditMode && separatorStyle !== "none" ? effectiveSeparatorBottomSpacing : undefined,
  };

  const HeadingTag = headingTag;
  const WrapperTag = headingWrapper;

  const isEmpty = !currentHeadingText || currentHeadingText.trim() === "";
  const isEmptySubHeading = !currentSubHeadingText || currentSubHeadingText.trim() === "";

  const headingContent = (
    <>
      {enableSubHeading && subHeadingPosition === "above" && (
        <>
          {editableSubHeading && isEditMode ? (
            <input
              type="text"
              value={currentSubHeadingText}
              onChange={(e) => handleSubHeadingChange(e.target.value)}
              onBlur={handleSubHeadingBlur}
              className="sub-heading-text"
              style={subHeadingStyle}
              autoFocus
            />
          ) : (
            <p
              className="sub-heading-text"
              style={subHeadingStyle}
              onClick={handleSubHeadingClick}
              {...(isEmptySubHeading && isEditMode
                ? {
                    children: (
                      <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                        Sub Heading
                      </span>
                    ),
                  }
                : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentSubHeadingText) } })}
            />
          )}
        </>
      )}

      {editableHeading && isEditMode ? (
        <input
          type="text"
          value={currentHeadingText}
          onChange={(e) => handleHeadingChange(e.target.value)}
          onBlur={handleHeadingBlur}
          className="heading-text"
          style={headingStyle}
          autoFocus
        />
      ) : (
        React.createElement(
          HeadingTag,
          {
            className: "heading-text",
            style: headingStyle,
            onClick: handleHeadingClick,
            ...(isEmpty && isEditMode
              ? {
                  children: (
                    <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                      Heading
                    </span>
                  ),
                }
              : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentHeadingText) } }),
          },
          undefined
        )
      )}

      {separatorStyle !== "none" && <hr className="heading-separator" style={separatorStyleCss} />}

      {enableSubHeading && subHeadingPosition === "below" && (
        <>
          {editableSubHeading && isEditMode ? (
            <input
              type="text"
              value={currentSubHeadingText}
              onChange={(e) => handleSubHeadingChange(e.target.value)}
              onBlur={handleSubHeadingBlur}
              className="sub-heading-text"
              style={subHeadingStyle}
              autoFocus
            />
          ) : (
            <p
              className="sub-heading-text"
              style={subHeadingStyle}
              onClick={handleSubHeadingClick}
              {...(isEmptySubHeading && isEditMode
                ? {
                    children: (
                      <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                        Sub Heading
                      </span>
                    ),
                  }
                : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentSubHeadingText) } })}
            />
          )}
        </>
      )}
    </>
  );

  const wrapperProps = {
    ref: (ref: HTMLElement | null) => {
      if (!ref) return;
      if (isEditMode) {
        connectors.connect(connectors.drag(ref));
      } else {
        connectors.connect(ref);
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
    style: wrapperStyle,
  };

  return (
    <>
      <style>{styleTagContent}</style>
      {React.createElement(WrapperTag, wrapperProps, <div className="heading-content">{headingContent}</div>)}
    </>
  );
};

Heading.craft = {
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


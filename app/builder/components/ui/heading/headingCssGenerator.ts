import {
  generatePaddingCss,
  generateMarginCss,
  generateResponsiveCss,
  generateTextColorCss,
  generateHoverTextColorCss,
  generateBackgroundColorCss,
  generateBorderColorCss,
  generateBoxShadowCss,
  generateZIndexCss,
} from "@/app/builder/lib/style-system/css-responsive";
import { classNameToSelector } from "@/app/builder/lib/component-styles";
import type { HeadingProps } from "./types";
import type {
  ResolvedHeadingTypography,
  ResolvedSubHeadingTypography,
  ResolvedSpacing,
  ResolvedSeparator,
  TypographyDefaults,
} from "./headingStyleHelpers";

interface CssGeneratorParams {
  componentClassName: string;
  props: HeadingProps;
  resolvedHeadingTypography: ResolvedHeadingTypography;
  resolvedSubHeadingTypography: ResolvedSubHeadingTypography;
  resolvedSpacing: ResolvedSpacing;
  resolvedSeparator: ResolvedSeparator;
  typographyDefaults: TypographyDefaults;
  globalBorderColor: string;
  isEditMode: boolean;
}

/**
 * Generates CSS for Heading component (for preview/export mode)
 */
export function generateHeadingCss(params: CssGeneratorParams): {
  responsiveCss: string;
  responsiveHoverCss: string;
} {
  const {
    componentClassName,
    props,
    resolvedHeadingTypography,
    resolvedSubHeadingTypography,
    resolvedSpacing,
    resolvedSeparator,
    typographyDefaults,
    globalBorderColor,
    isEditMode,
  } = params;

  // Convert className to CSS selector (e.g., "heading heading-abc123" -> ".heading.heading-abc123")
  // First, ensure componentClassName has no leading dot (safeguard)
  const cleanedComponentClassName = componentClassName.trim().replace(/^\.+/, '');
  const selector = classNameToSelector(cleanedComponentClassName);
  // Extract class names without dot for functions that add their own dot (e.g., generatePaddingCss)
  // "heading heading-abc123" -> "heading.heading-abc123" (for CSS functions that expect class name)
  // Ensure no leading dot (safeguard against double dots) - strip any dots from the start
  const rawClassName = cleanedComponentClassName.replace(/\s+/g, '.');
  const classNameForCssFunctions = rawClassName.startsWith('.') ? rawClassName.substring(1) : rawClassName;

  const shouldGenerateMediaQueries = !isEditMode;
  let responsiveCss = "";
  let responsiveHoverCss = "";

  if (!shouldGenerateMediaQueries) {
    return { responsiveCss: "", responsiveHoverCss: "" };
  }

  const {
    textAlign,
    textAlignResponsive,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingResponsive,
    paddingUnit,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    marginResponsive,
    marginUnit,
    enableSubHeading,
    separatorStyle,
    backgroundType,
    backgroundColor,
    backgroundColorResponsive,
    backgroundGradient,
    backgroundImage,
    borderStyle,
    borderColor,
    borderColorResponsive,
    enableBoxShadow,
    boxShadowHorizontal,
    boxShadowVertical,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowColor,
    boxShadowHorizontalResponsive,
    boxShadowVerticalResponsive,
    boxShadowBlurResponsive,
    boxShadowSpreadResponsive,
    position,
    zIndex,
    zIndexResponsive,
    headingFontSize,
    headingFontSizeResponsive,
    headingFontSizeUnit,
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
    headingLetterSpacingUnit,
    headingLineHeight,
    headingLineHeightResponsive,
    headingLineHeightUnit,
    headingFontFamilyResponsive,
    headingTextColor,
    headingTextColorResponsive,
    headingTextColorHover,
    headingTextColorHoverResponsive,
    headingBottomSpacing,
    headingBottomSpacingResponsive,
    headingBottomSpacingUnit,
    subHeadingFontSize,
    subHeadingFontSizeResponsive,
    subHeadingFontSizeUnit,
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
    subHeadingLetterSpacingUnit,
    subHeadingLineHeight,
    subHeadingLineHeightResponsive,
    subHeadingLineHeightUnit,
    subHeadingFontFamilyResponsive,
    subHeadingTextColor,
    subHeadingTextColorResponsive,
    subHeadingTextColorHover,
    subHeadingTextColorHoverResponsive,
    subHeadingBottomSpacing,
    subHeadingBottomSpacingResponsive,
    subHeadingBottomSpacingUnit,
    separatorWidth,
    separatorWidthResponsive,
    separatorWidthUnit,
    separatorBottomSpacing,
    separatorBottomSpacingResponsive,
    separatorBottomSpacingUnit,
  } = props;

  const desktopFontSize = typographyDefaults.fontSize?.desktop?.[props.headingTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"];
  const globalHeadingFontSize =
    desktopFontSize ||
    (props.headingTag === "h1" ? 32 : props.headingTag === "h2" ? 24 : props.headingTag === "h3" ? 20 : props.headingTag === "h4" ? 18 : props.headingTag === "h5" ? 16 : props.headingTag === "h6" ? 14 : 24);
  const globalHeadingFontWeight = (typographyDefaults.fontWeight?.headings as number) || 700;
  const globalHeadingTextColor = typographyDefaults.textColor?.headings || "#1f2937";
  const globalSubHeadingFontSize = typographyDefaults.fontSize?.desktop?.body || 16;
  const globalSubHeadingFontWeight = (typographyDefaults.fontWeight?.body as number) || 400;
  const globalSubHeadingTextColor = typographyDefaults.textColor?.headings || "#1f2937";

  // Padding CSS
  if (paddingResponsive) {
    responsiveCss += generatePaddingCss(
      classNameForCssFunctions,
      paddingResponsive,
      { top: paddingTop, right: paddingRight, bottom: paddingBottom, left: paddingLeft, defaultValue: padding ?? 0 },
      paddingUnit || "px"
    );
  } else if (padding !== null && padding !== undefined) {
    const top = paddingTop ?? padding;
    const right = paddingRight ?? padding;
    const bottom = paddingBottom ?? padding;
    const left = paddingLeft ?? padding;
    responsiveCss += `${selector} { padding: ${top}${paddingUnit || "px"} ${right}${paddingUnit || "px"} ${bottom}${paddingUnit || "px"} ${left}${paddingUnit || "px"}; }\n`;
  }

  // Margin CSS
  const hasMarginValue = margin !== null && margin !== undefined;
  const hasIndividualMargin = marginTop !== null || marginRight !== null || marginBottom !== null || marginLeft !== null;
  if (marginResponsive) {
    responsiveCss += generateMarginCss(
      classNameForCssFunctions,
      marginResponsive,
      { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft, defaultValue: margin ?? 0 },
      marginUnit || "px"
    );
  } else if (hasMarginValue || hasIndividualMargin) {
    const top = marginTop ?? margin ?? 0;
    const right = marginRight ?? margin ?? 0;
    const bottom = marginBottom ?? margin ?? 0;
    const left = marginLeft ?? margin ?? 0;
    responsiveCss += `${selector} { margin: ${top}${marginUnit || "px"} ${right}${marginUnit || "px"} ${bottom}${marginUnit || "px"} ${left}${marginUnit || "px"}; }\n`;
  }

  // Text align
  if (textAlignResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "text-align", textAlignResponsive, textAlign || "left", "", true);
  } else {
    responsiveCss += `${selector} { text-align: ${textAlign || "left"} !important; }\n`;
  }

  // Heading Typography CSS
  if (headingFontSizeResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "font-size", headingFontSizeResponsive, headingFontSize ?? globalHeadingFontSize, headingFontSizeUnit || "px");
  } else {
    responsiveCss += `${selector} .heading-text { font-size: ${headingFontSize ?? globalHeadingFontSize}${headingFontSizeUnit || "px"}; }\n`;
  }

  if (headingFontWeightResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "font-weight", headingFontWeightResponsive, headingFontWeight ?? globalHeadingFontWeight, "");
  } else {
    responsiveCss += `${selector} .heading-text { font-weight: ${headingFontWeight ?? globalHeadingFontWeight}; }\n`;
  }

  if (headingFontStyleResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "font-style", headingFontStyleResponsive, headingFontStyle ?? "normal", "");
  } else {
    responsiveCss += `${selector} .heading-text { font-style: ${headingFontStyle ?? "normal"}; }\n`;
  }

  if (headingTextTransformResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "text-transform", headingTextTransformResponsive, headingTextTransform ?? "none", "");
  } else {
    responsiveCss += `${selector} .heading-text { text-transform: ${headingTextTransform ?? "none"}; }\n`;
  }

  if (headingTextDecorationResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "text-decoration", headingTextDecorationResponsive, headingTextDecoration ?? "none", "");
  } else {
    responsiveCss += `${selector} .heading-text { text-decoration: ${headingTextDecoration ?? "none"}; }\n`;
  }

  if (headingLetterSpacingResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "letter-spacing", headingLetterSpacingResponsive, headingLetterSpacing ?? 0, headingLetterSpacingUnit || "px");
  } else {
    responsiveCss += `${selector} .heading-text { letter-spacing: ${headingLetterSpacing ?? 0}${headingLetterSpacingUnit || "px"}; }\n`;
  }

  if (headingLineHeightResponsive) {
    responsiveCss += generateResponsiveCss(
      `${classNameForCssFunctions} .heading-text`,
      "line-height",
      headingLineHeightResponsive,
      headingLineHeight ?? 1.2,
      headingLineHeightUnit === "normal" ? "" : headingLineHeightUnit || ""
    );
  } else {
    const heightValue = headingLineHeight ?? 1.2;
    let lineHeightValue: string;
    if (headingLineHeightUnit === "normal") {
      lineHeightValue = "normal";
    } else if (headingLineHeightUnit === "number" || !headingLineHeightUnit) {
      lineHeightValue = String(heightValue);
    } else {
      lineHeightValue = `${heightValue}${headingLineHeightUnit}`;
    }
    responsiveCss += `${selector} .heading-text { line-height: ${lineHeightValue}; }\n`;
  }

  if (headingFontFamilyResponsive) {
    responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .heading-text`, "font-family", headingFontFamilyResponsive, resolvedHeadingTypography.fontFamily, "");
  } else if (resolvedHeadingTypography.fontFamily) {
    responsiveCss += `${selector} .heading-text { font-family: ${resolvedHeadingTypography.fontFamily}; }\n`;
  }

  // Check if text color is reset (all responsive values are null)
  const isTextColorReset = headingTextColorResponsive && 
    headingTextColorResponsive.desktop === null && 
    headingTextColorResponsive.tablet === null && 
    headingTextColorResponsive.mobile === null;
  
  if (!isTextColorReset) {
    if (headingTextColorResponsive) {
      responsiveCss += generateTextColorCss(`${classNameForCssFunctions} .heading-text`, headingTextColorResponsive, headingTextColor ?? globalHeadingTextColor);
    } else {
      responsiveCss += `${selector} .heading-text { color: ${headingTextColor ?? globalHeadingTextColor}; }\n`;
    }
  }

  // Heading hover color - only generate if not reset
  // Check if all responsive values are null (reset case)
  const isHeadingHoverColorReset = headingTextColorHoverResponsive && 
    headingTextColorHoverResponsive.desktop === null && 
    headingTextColorHoverResponsive.tablet === null && 
    headingTextColorHoverResponsive.mobile === null;
  
  if (!isHeadingHoverColorReset && headingTextColorHover) {
    if (headingTextColorHoverResponsive) {
      responsiveHoverCss += generateHoverTextColorCss(`${classNameForCssFunctions} .heading-text`, headingTextColorHoverResponsive, headingTextColorHover);
    } else {
      responsiveHoverCss += `${selector} .heading-text:hover { color: ${headingTextColorHover} !important; }\n`;
    }
  }

  // Heading bottom spacing
  if (headingBottomSpacingResponsive) {
    responsiveCss += generateResponsiveCss(
      `${classNameForCssFunctions} .heading-text`,
      "margin-bottom",
      headingBottomSpacingResponsive,
      headingBottomSpacing ?? 16,
      headingBottomSpacingUnit || "px"
    );
  } else {
    responsiveCss += `${selector} .heading-text { margin-bottom: ${headingBottomSpacing ?? 16}${headingBottomSpacingUnit || "px"}; }\n`;
  }

  // Sub Heading Typography CSS (only if enabled)
  if (enableSubHeading) {
    if (subHeadingFontSizeResponsive) {
      responsiveCss += generateResponsiveCss(
        `${classNameForCssFunctions} .sub-heading-text`,
        "font-size",
        subHeadingFontSizeResponsive,
        subHeadingFontSize ?? globalSubHeadingFontSize,
        subHeadingFontSizeUnit || "px"
      );
    } else {
      responsiveCss += `${selector} .sub-heading-text { font-size: ${subHeadingFontSize ?? globalSubHeadingFontSize}${subHeadingFontSizeUnit || "px"}; }\n`;
    }

    if (subHeadingFontWeightResponsive) {
      responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .sub-heading-text`, "font-weight", subHeadingFontWeightResponsive, subHeadingFontWeight ?? globalSubHeadingFontWeight, "");
    } else {
      responsiveCss += `${selector} .sub-heading-text { font-weight: ${subHeadingFontWeight ?? globalSubHeadingFontWeight}; }\n`;
    }

    if (subHeadingFontStyleResponsive) {
      responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .sub-heading-text`, "font-style", subHeadingFontStyleResponsive, subHeadingFontStyle ?? "normal", "");
    } else {
      responsiveCss += `${selector} .sub-heading-text { font-style: ${subHeadingFontStyle ?? "normal"}; }\n`;
    }

    if (subHeadingTextTransformResponsive) {
      responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .sub-heading-text`, "text-transform", subHeadingTextTransformResponsive, subHeadingTextTransform ?? "none", "");
    } else {
      responsiveCss += `${selector} .sub-heading-text { text-transform: ${subHeadingTextTransform ?? "none"}; }\n`;
    }

    if (subHeadingTextDecorationResponsive) {
      responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .sub-heading-text`, "text-decoration", subHeadingTextDecorationResponsive, subHeadingTextDecoration ?? "none", "");
    } else {
      responsiveCss += `${selector} .sub-heading-text { text-decoration: ${subHeadingTextDecoration ?? "none"}; }\n`;
    }

    if (subHeadingLetterSpacingResponsive) {
      responsiveCss += generateResponsiveCss(
        `${classNameForCssFunctions} .sub-heading-text`,
        "letter-spacing",
        subHeadingLetterSpacingResponsive,
        subHeadingLetterSpacing ?? 0,
        subHeadingLetterSpacingUnit || "px"
      );
    } else {
      responsiveCss += `${selector} .sub-heading-text { letter-spacing: ${subHeadingLetterSpacing ?? 0}${subHeadingLetterSpacingUnit || "px"}; }\n`;
    }

    if (subHeadingLineHeightResponsive) {
      responsiveCss += generateResponsiveCss(
        `${classNameForCssFunctions} .sub-heading-text`,
        "line-height",
        subHeadingLineHeightResponsive,
        subHeadingLineHeight ?? 1.5,
        subHeadingLineHeightUnit === "normal" ? "" : subHeadingLineHeightUnit || ""
      );
    } else {
      const heightValue = subHeadingLineHeight ?? 1.5;
      let lineHeightValue: string;
      if (subHeadingLineHeightUnit === "normal") {
        lineHeightValue = "normal";
      } else if (subHeadingLineHeightUnit === "number" || !subHeadingLineHeightUnit) {
        lineHeightValue = String(heightValue);
      } else {
        lineHeightValue = `${heightValue}${subHeadingLineHeightUnit}`;
      }
      responsiveCss += `${selector} .sub-heading-text { line-height: ${lineHeightValue}; }\n`;
    }

    if (subHeadingFontFamilyResponsive) {
      responsiveCss += generateResponsiveCss(`${classNameForCssFunctions} .sub-heading-text`, "font-family", subHeadingFontFamilyResponsive, resolvedSubHeadingTypography.fontFamily, "");
    } else if (resolvedSubHeadingTypography.fontFamily) {
      responsiveCss += `${selector} .sub-heading-text { font-family: ${resolvedSubHeadingTypography.fontFamily}; }\n`;
    }

    // Check if sub-heading text color is reset (all responsive values are null)
    const isSubHeadingTextColorReset = subHeadingTextColorResponsive && 
      subHeadingTextColorResponsive.desktop === null && 
      subHeadingTextColorResponsive.tablet === null && 
      subHeadingTextColorResponsive.mobile === null;
    
    if (!isSubHeadingTextColorReset) {
      if (subHeadingTextColorResponsive) {
        responsiveCss += generateTextColorCss(`${classNameForCssFunctions} .sub-heading-text`, subHeadingTextColorResponsive, subHeadingTextColor ?? globalSubHeadingTextColor);
      } else {
        responsiveCss += `${selector} .sub-heading-text { color: ${subHeadingTextColor ?? globalSubHeadingTextColor}; }\n`;
      }
    }

    // Sub heading hover color - only generate if not reset
    // Check if all responsive values are null (reset case)
    const isSubHeadingHoverColorReset = subHeadingTextColorHoverResponsive && 
      subHeadingTextColorHoverResponsive.desktop === null && 
      subHeadingTextColorHoverResponsive.tablet === null && 
      subHeadingTextColorHoverResponsive.mobile === null;
    
    if (!isSubHeadingHoverColorReset && subHeadingTextColorHover) {
      if (subHeadingTextColorHoverResponsive) {
        responsiveHoverCss += generateHoverTextColorCss(`${classNameForCssFunctions} .sub-heading-text`, subHeadingTextColorHoverResponsive, subHeadingTextColorHover);
      } else {
        responsiveHoverCss += `${selector} .sub-heading-text:hover { color: ${subHeadingTextColorHover} !important; }\n`;
      }
    }

    // Sub heading bottom spacing
    if (subHeadingBottomSpacingResponsive) {
      responsiveCss += generateResponsiveCss(
        `${classNameForCssFunctions} .sub-heading-text`,
        "margin-bottom",
        subHeadingBottomSpacingResponsive,
        subHeadingBottomSpacing ?? 16,
        subHeadingBottomSpacingUnit || "px"
      );
    } else {
      responsiveCss += `${selector} .sub-heading-text { margin-bottom: ${subHeadingBottomSpacing ?? 16}${subHeadingBottomSpacingUnit || "px"}; }\n`;
    }
  }

  // Separator CSS (only if enabled)
  if (separatorStyle && separatorStyle !== "none") {
    if (separatorWidthResponsive) {
      responsiveCss += generateResponsiveCss(
        `${classNameForCssFunctions} .heading-separator`,
        "width",
        separatorWidthResponsive,
        separatorWidth ?? 12,
        separatorWidthUnit || "%"
      );
    } else {
      responsiveCss += `${selector} .heading-separator { width: ${separatorWidth ?? 12}${separatorWidthUnit || "%"}; }\n`;
    }

    const borderStyle = separatorStyle === "double" ? "double" : separatorStyle === "dashed" ? "dashed" : separatorStyle === "dotted" ? "dotted" : "solid";
    responsiveCss += `${selector} .heading-separator { 
      border-top-style: ${borderStyle}; 
      border-top-width: ${resolvedSeparator.thickness}px; 
      border-top-color: ${resolvedSeparator.color}; 
      border-bottom: none; 
      border-left: none; 
      border-right: none; 
      height: 0; 
      display: inline-block; 
    }\n`;

    if (separatorBottomSpacingResponsive) {
      responsiveCss += generateResponsiveCss(
        `${classNameForCssFunctions} .heading-separator`,
        "margin-bottom",
        separatorBottomSpacingResponsive,
        separatorBottomSpacing ?? 16,
        separatorBottomSpacingUnit || "px"
      );
    } else {
      responsiveCss += `${selector} .heading-separator { margin-bottom: ${separatorBottomSpacing ?? 16}${separatorBottomSpacingUnit || "px"}; }\n`;
    }
  }

  // Background CSS
  if (backgroundType === "color") {
    if (backgroundColorResponsive || backgroundColor) {
      const fallbackColor = backgroundColor ?? (typeof backgroundColorResponsive?.desktop === "string" ? backgroundColorResponsive.desktop : undefined);
      if (fallbackColor) {
        responsiveCss += generateBackgroundColorCss(classNameForCssFunctions, backgroundColorResponsive, fallbackColor);
      }
    }
  } else if (backgroundType === "gradient" && backgroundGradient) {
    responsiveCss += `${selector} { background-image: ${backgroundGradient}; }\n`;
  } else if (backgroundType === "image" && backgroundImage) {
    responsiveCss += `${selector} { background-image: url("${backgroundImage}"); background-size: cover; background-position: center; background-repeat: no-repeat; }\n`;
  }

  // Border CSS
  const effectiveBorderColor = borderColor ?? globalBorderColor;
  if (borderStyle && borderStyle !== "none") {
    if (borderColorResponsive) {
      responsiveCss += generateBorderColorCss(classNameForCssFunctions, borderColorResponsive, effectiveBorderColor ?? undefined);
    } else if (effectiveBorderColor) {
      responsiveCss += `${selector} { border-color: ${effectiveBorderColor}; }\n`;
    }
    responsiveCss += `${selector} { border-style: ${borderStyle}; }\n`;
  }

  // Box Shadow CSS
  if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
    responsiveCss += generateBoxShadowCss(
      classNameForCssFunctions,
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

  // Position CSS
  if (position && position !== "default" && position !== "static") {
    if (position === "relative" || position === "absolute" || position === "fixed" || position === "sticky") {
      responsiveCss += `${selector} { position: ${position}; }\n`;
    }
  }

  if (zIndex !== null && zIndex !== undefined) {
    if (zIndexResponsive) {
      responsiveCss += generateZIndexCss(classNameForCssFunctions, zIndexResponsive, zIndex);
    } else {
      responsiveCss += `${selector} { z-index: ${zIndex}; }\n`;
    }
  }

  return { responsiveCss, responsiveHoverCss };
}


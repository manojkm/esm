import {
  generatePaddingCss,
  generateMarginCss,
  generateResponsiveCss,
  generateTextColorCss,
  generateHoverTextColorCss,
  generateBackgroundColorCss,
  generateBorderColorCss,
  generateResponsiveFourSideCss,
  generateBoxShadowCss,
  generateHoverBackgroundColorCss,
  generateHoverBorderColorCss,
  generateLinkColorCss,
  generatePositionCss,
  generateZIndexCss,
  getMediaQuery,
  type BreakpointKey,
} from "@/app/builder/lib/style-system/css-responsive";
import { buildBackgroundHoverCss, buildBorderHoverCss, buildBoxShadowHoverCss, buildOverlayStyles, buildVisibilityCss, resolveResponsiveValue, type ResponsiveMap, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import { classNameToSelector } from "@/app/builder/lib/component-styles";
import type { TextProps } from "./types";
import type { ResolvedTextTypography, ResolvedTextSpacing, TypographyDefaults } from "./textStyleHelpers";
import { getTypographyElement } from "./textStyleHelpers";

interface CssGeneratorParams {
  componentClassName: string;
  props: TextProps;
  resolvedTypography: ResolvedTextTypography;
  resolvedSpacing: ResolvedTextSpacing;
  typographyDefaults: TypographyDefaults;
  globalBorderColor: string;
  globalBorderColorHover: string;
  globalLinkColor?: string;
  globalLinkColorHover?: string;
  isEditMode: boolean;
  responsiveResolver: ResponsiveResolver;
}

/**
 * Generates CSS for Text component (for preview/export mode)
 */
export function generateTextCss(params: CssGeneratorParams): {
  responsiveCss: string;
  hoverCss: string;
  listStyles: string;
  toolbarResetStyles: string;
  linkColorCss: string;
  overlayCss: string;
  visibilityCss: string;
} {
  const {
    componentClassName,
    props,
    resolvedTypography,
    resolvedSpacing,
    typographyDefaults,
    globalBorderColor,
    globalBorderColorHover,
    globalLinkColor,
    globalLinkColorHover,
    isEditMode,
    responsiveResolver,
  } = params;

  const shouldGenerateMediaQueries = !isEditMode;
  let responsiveCss = "";
  let hoverCss = "";

  // Convert className to CSS selector (e.g., "text text-abc123" -> ".text.text-abc123")
  // First, ensure componentClassName has no leading dot (safeguard)
  const cleanedComponentClassName = componentClassName.trim().replace(/^\.+/, '');
  const selector = classNameToSelector(cleanedComponentClassName);
  // Extract class names without dot for functions that add their own dot (e.g., generatePaddingCss)
  // "text text-abc123" -> "text.text-abc123" (for CSS functions that expect class name)
  // Ensure no leading dot (safeguard against double dots) - strip any dots from the start
  const rawClassName = cleanedComponentClassName.replace(/\s+/g, '.');
  const classNameForCssFunctions = rawClassName.startsWith('.') ? rawClassName.substring(1) : rawClassName;

  if (!shouldGenerateMediaQueries) {
    // In edit mode, we still need to generate hover CSS for the current breakpoint
    // Text color hover - check if hover color is reset
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
        hoverCss += `.${selector}:hover { color: ${resolvedTextColorHover} !important; }\n`;
        const uniqueId = componentClassName.split(' ')[1] || "";
        hoverCss += `.text-wrapper-${uniqueId}:hover .${selector} { color: ${resolvedTextColorHover} !important; }\n`;
      }
    }

    // Background hover
    if (props.enableBackgroundColorHover && props.backgroundColorHover && props.backgroundType === "color") {
      const hoverBackgroundCss = buildBackgroundHoverCss({
        type: props.backgroundType,
        colorHover: props.backgroundColorHover,
        colorHoverResponsive: props.backgroundColorHoverResponsive,
        resolver: responsiveResolver,
      });
      if (hoverBackgroundCss) {
        hoverCss += `.${selector}:hover { ${hoverBackgroundCss} } `;
      }
    }

    // Border hover
    if (props.enableBorderColorHover && props.borderStyle && props.borderStyle !== "none") {
      const effectiveBorderColorHover = props.borderColorHover ?? globalBorderColorHover;
      if (effectiveBorderColorHover) {
        const hoverBorderCss = buildBorderHoverCss({
          style: props.borderStyle,
          colorHover: effectiveBorderColorHover,
          colorHoverResponsive: props.borderColorHoverResponsive,
          resolver: responsiveResolver,
        });
        if (hoverBorderCss) {
          hoverCss += `.${selector}:hover { ${hoverBorderCss} } `;
        }
      }
    }

    // Box shadow hover
    if (props.enableBoxShadowHover) {
      const hoverBoxShadowCss = buildBoxShadowHoverCss({
        enableHover: props.enableBoxShadowHover,
        preset: props.boxShadowPreset,
        hoverPosition: props.boxShadowPositionHover,
        colorHover: props.boxShadowColorHover,
        color: props.boxShadowColor,
        horizontal: props.boxShadowHorizontalHover,
        vertical: props.boxShadowVerticalHover,
        blur: props.boxShadowBlurHover,
        spread: props.boxShadowSpreadHover,
        horizontalResponsive: props.boxShadowHorizontalHoverResponsive,
        verticalResponsive: props.boxShadowVerticalHoverResponsive,
        blurResponsive: props.boxShadowBlurHoverResponsive,
        spreadResponsive: props.boxShadowSpreadHoverResponsive,
        resolver: responsiveResolver,
      });
      if (hoverBoxShadowCss) {
        hoverCss += `.${selector}:hover { ${hoverBoxShadowCss} } `;
      }
    }

    return {
      responsiveCss: "",
      hoverCss,
      listStyles: "",
      toolbarResetStyles: "",
      linkColorCss: "",
      overlayCss: "",
      visibilityCss: "",
    };
  }

  // Preview mode: Generate all CSS
  const {
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
    textAlign,
    textAlignResponsive,
    fontSize,
    fontSizeResponsive,
    fontSizeUnit,
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
    letterSpacingUnit,
    lineHeight,
    lineHeightResponsive,
    lineHeightUnit,
    fontFamily,
    fontFamilyResponsive,
    textColor,
    textColorResponsive,
    textColorHover,
    textColorHoverResponsive,
    linkColor,
    linkColorResponsive,
    linkColorHover,
    linkColorHoverResponsive,
    backgroundColor,
    enableBackgroundColorHover,
    backgroundColorHover,
    backgroundColorResponsive,
    backgroundColorHoverResponsive,
    backgroundType,
    backgroundGradient,
    backgroundImage,
    enableBackgroundOverlay,
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
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderRadiusUnit,
    borderRadiusResponsive,
    borderWidthResponsive,
    borderStyle,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderColor,
    enableBorderColorHover,
    borderColorHover,
    borderColorResponsive,
    borderColorHoverResponsive,
    boxShadowColor,
    boxShadowColorHover,
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
    boxShadowPreset,
    enableBoxShadow,
    enableBoxShadowHover,
    boxShadowHorizontalResponsive,
    boxShadowVerticalResponsive,
    boxShadowBlurResponsive,
    boxShadowSpreadResponsive,
    boxShadowHorizontalHoverResponsive,
    boxShadowVerticalHoverResponsive,
    boxShadowBlurHoverResponsive,
    boxShadowSpreadHoverResponsive,
    positionTop,
    positionRight,
    positionBottom,
    positionLeft,
    positionTopUnit,
    positionRightUnit,
    positionBottomUnit,
    positionLeftUnit,
    positionTopResponsive,
    positionRightResponsive,
    positionBottomResponsive,
    positionLeftResponsive,
    zIndex,
    zIndexResponsive,
    hideOnDesktop,
    hideOnTablet,
    hideOnLandscapeMobile,
    hideOnMobile,
  } = props;

  // Get typography element for defaults based on htmlTag
  const typographyElement = getTypographyElement(props.htmlTag || "p");
  const isHeading = typographyElement !== "body";
  const typographyType = isHeading ? "headings" : "body";
  const globalFontSize = typographyDefaults.fontSize?.desktop?.[typographyElement];
  const globalFontWeight = typographyDefaults.fontWeight?.[typographyType];
  const globalFontStyle = typographyDefaults.fontStyle?.[typographyType];
  const globalTextColor = typographyDefaults.textColor?.[typographyType];
  const globalLineHeight = typographyDefaults.lineHeight?.[typographyType];
  const globalLetterSpacing = typographyDefaults.letterSpacing?.[typographyType];

  // Generate hover CSS for preview mode
  const isTextColorHoverReset =
    textColorHoverResponsive &&
    textColorHoverResponsive.desktop === null &&
    textColorHoverResponsive.tablet === null &&
    textColorHoverResponsive.mobile === null;

  if (!isTextColorHoverReset && textColorHover) {
    if (textColorHoverResponsive) {
      hoverCss += generateHoverTextColorCss(classNameForCssFunctions, textColorHoverResponsive, textColorHover);
    } else {
      hoverCss += `.${selector}:hover { color: ${textColorHover} !important; }\n`;
    }
  }

  // Background hover
  if (enableBackgroundColorHover && backgroundColorHover) {
    if (backgroundColorHoverResponsive) {
      hoverCss += generateHoverBackgroundColorCss(classNameForCssFunctions, backgroundColorHoverResponsive, backgroundColorHover);
    } else {
      hoverCss += `.${selector}:hover { background-color: ${backgroundColorHover} !important; } `;
    }
  }

  // Border hover
  if (enableBorderColorHover && borderStyle && borderStyle !== "none") {
    const effectiveBorderColorHover = borderColorHover ?? globalBorderColorHover;
    if (effectiveBorderColorHover) {
      if (borderColorHoverResponsive) {
        hoverCss += generateHoverBorderColorCss(classNameForCssFunctions, borderColorHoverResponsive, effectiveBorderColorHover);
      } else {
        hoverCss += `.${selector}:hover { border-color: ${effectiveBorderColorHover} !important; } `;
      }
    }
  }

  // Box shadow hover
  if (enableBoxShadowHover) {
    if (boxShadowHorizontalHoverResponsive || boxShadowVerticalHoverResponsive || boxShadowBlurHoverResponsive || boxShadowSpreadHoverResponsive) {
      hoverCss += generateBoxShadowCss(
        classNameForCssFunctions,
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
    } else {
      const shadowValue = `${boxShadowHorizontalHover ?? 0}px ${boxShadowVerticalHover ?? 0}px ${boxShadowBlurHover ?? 0}px ${boxShadowSpreadHover ?? 0}px ${boxShadowColorHover}`;
      hoverCss += `.${selector}:hover { box-shadow: ${shadowValue} !important; } `;
    }
  }

  // Padding CSS
  if (paddingResponsive) {
    responsiveCss += generatePaddingCss(
      classNameForCssFunctions,
      paddingResponsive,
      {
        top: paddingTop,
        right: paddingRight,
        bottom: paddingBottom,
        left: paddingLeft,
        defaultValue: padding ?? 0,
      },
      paddingUnit || "px"
    );
  } else if (padding !== null && padding !== undefined) {
    const top = paddingTop ?? padding;
    const right = paddingRight ?? padding;
    const bottom = paddingBottom ?? padding;
    const left = paddingLeft ?? padding;
    const paddingValue = `${top}${paddingUnit || "px"} ${right}${paddingUnit || "px"} ${bottom}${paddingUnit || "px"} ${left}${paddingUnit || "px"}`;
    responsiveCss += `${selector} { padding: ${paddingValue}; }\n`;
  }

  // Margin CSS
  const hasMarginValue = margin !== null && margin !== undefined;
  const hasIndividualMargin = marginTop !== null || marginRight !== null || marginBottom !== null || marginLeft !== null;

  if (marginResponsive) {
    responsiveCss += generateMarginCss(
      classNameForCssFunctions,
      marginResponsive,
      {
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
        defaultValue: margin ?? 0,
      },
      marginUnit || "px"
    );
  } else if (hasMarginValue || hasIndividualMargin) {
    const top = marginTop ?? margin ?? 0;
    const right = marginRight ?? margin ?? 0;
    const bottom = marginBottom ?? margin ?? 0;
    const left = marginLeft ?? margin ?? 0;
    const marginValue = `${top}${marginUnit || "px"} ${right}${marginUnit || "px"} ${bottom}${marginUnit || "px"} ${left}${marginUnit || "px"}`;
    responsiveCss += `${selector} { margin: ${marginValue}; }\n`;
  }

  // Typography CSS
  if (textAlignResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "text-align", textAlignResponsive, textAlign || "left", "", true);
  } else {
    const alignValue = textAlign || "left";
    responsiveCss += `${selector} { text-align: ${alignValue} !important; }\n`;
  }

  if (fontSizeResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "font-size", fontSizeResponsive, fontSize ?? globalFontSize ?? 16, fontSizeUnit || "px");
  } else {
    const sizeValue = fontSize ?? globalFontSize ?? 16;
    responsiveCss += `${selector} { font-size: ${sizeValue}${fontSizeUnit || "px"}; }\n`;
  }

  if (fontWeightResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "font-weight", fontWeightResponsive, fontWeight ?? globalFontWeight ?? 400, "");
  } else {
    const weightValue = fontWeight ?? globalFontWeight ?? 400;
    responsiveCss += `${selector} { font-weight: ${weightValue}; }\n`;
  }

  if (fontStyleResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "font-style", fontStyleResponsive, fontStyle ?? globalFontStyle ?? "normal", "");
  } else {
    const styleValue = fontStyle ?? globalFontStyle ?? "normal";
    responsiveCss += `${selector} { font-style: ${styleValue}; }\n`;
  }

  if (textTransformResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "text-transform", textTransformResponsive, textTransform ?? "none", "");
  } else if (textTransform) {
    responsiveCss += `${selector} { text-transform: ${textTransform}; }\n`;
  }

  if (textDecorationResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "text-decoration", textDecorationResponsive, textDecoration ?? "none", "");
  } else if (textDecoration) {
    responsiveCss += `${selector} { text-decoration: ${textDecoration}; }\n`;
  }

  if (letterSpacingResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "letter-spacing", letterSpacingResponsive, letterSpacing ?? globalLetterSpacing ?? 0, letterSpacingUnit || "px");
  } else {
    const spacingValue = letterSpacing ?? globalLetterSpacing ?? 0;
    responsiveCss += `${selector} { letter-spacing: ${spacingValue}${letterSpacingUnit || "px"}; }\n`;
  }

  if (lineHeightResponsive) {
    responsiveCss += generateResponsiveCss(
      classNameForCssFunctions,
      "line-height",
      lineHeightResponsive,
      lineHeight ?? globalLineHeight ?? 1.6,
      lineHeightUnit === "normal" ? "" : lineHeightUnit || ""
    );
  } else {
    const heightValue = lineHeight ?? globalLineHeight ?? 1.6;
    const lineHeightValue = lineHeightUnit === "normal" ? "normal" : `${heightValue}${lineHeightUnit || ""}`;
    responsiveCss += `${selector} { line-height: ${lineHeightValue}; }\n`;
  }

  if (fontFamilyResponsive) {
    responsiveCss += generateResponsiveCss(classNameForCssFunctions, "font-family", fontFamilyResponsive, resolvedTypography.fontFamily, "");
  } else if (resolvedTypography.fontFamily) {
    responsiveCss += `${selector} { font-family: ${resolvedTypography.fontFamily}; }\n`;
  }

  // Text color CSS
  const isTextColorReset =
    textColorResponsive &&
    textColorResponsive.desktop === null &&
    textColorResponsive.tablet === null &&
    textColorResponsive.mobile === null;

  if (!isTextColorReset) {
    if (textColorResponsive) {
      responsiveCss += generateTextColorCss(classNameForCssFunctions, textColorResponsive, textColor ?? globalTextColor ?? "#1f2937");
    } else {
      const colorValue = resolvedTypography.textColor || globalTextColor || "#1f2937";
      responsiveCss += `${selector} { color: ${colorValue}; }\n`;
    }
  }

  // Link color CSS
  const effectiveLinkColor = linkColor ?? globalLinkColor;
  const effectiveLinkColorHover = linkColorHover ?? globalLinkColorHover;
  if (linkColorResponsive || linkColorHoverResponsive) {
      responsiveCss += generateLinkColorCss(
      classNameForCssFunctions,
      linkColorResponsive,
      effectiveLinkColor ?? undefined,
      linkColorHoverResponsive,
      effectiveLinkColorHover ?? undefined
    );
  } else if (effectiveLinkColor || effectiveLinkColorHover) {
    if (effectiveLinkColor) {
      responsiveCss += `${selector} a { color: ${effectiveLinkColor}; }\n`;
    }
    if (effectiveLinkColorHover) {
      responsiveCss += `${selector} a:hover { color: ${effectiveLinkColorHover}; }\n`;
    }
  }

  // Background CSS
  if (backgroundColorResponsive) {
      responsiveCss += generateBackgroundColorCss(classNameForCssFunctions, backgroundColorResponsive, backgroundColor ?? "#ffffff");
  } else if (backgroundColor && backgroundType === "color") {
    responsiveCss += `${selector} { background-color: ${backgroundColor}; }\n`;
  }

  if (backgroundType === "image" && backgroundImage) {
    responsiveCss += `${selector} { background-image: url("${backgroundImage}"); background-size: cover; background-position: center; background-repeat: no-repeat; }\n`;
  } else if (backgroundType === "gradient" && backgroundGradient) {
    responsiveCss += `${selector} { background: ${backgroundGradient}; }\n`;
  }

  // Border CSS
  const effectiveBorderColor = borderColor ?? globalBorderColor;
  if (borderStyle && borderStyle !== "none") {
    if (borderColorResponsive) {
      responsiveCss += generateBorderColorCss(classNameForCssFunctions, borderColorResponsive, effectiveBorderColor ?? undefined);
    } else if (effectiveBorderColor) {
      responsiveCss += `${selector} { border-color: ${effectiveBorderColor}; }\n`;
    }

    if (borderWidthResponsive) {
      responsiveCss += generateResponsiveFourSideCss(
        classNameForCssFunctions,
        "border-width",
        borderWidthResponsive,
        {
          top: borderTopWidth,
          right: borderRightWidth,
          bottom: borderBottomWidth,
          left: borderLeftWidth,
          defaultValue: borderWidth ?? 1,
        },
        "px"
      );
      responsiveCss += `${selector} { border-style: ${borderStyle}; }\n`;
    } else {
      const borderWidthValue = borderWidth ?? 1;
      if (borderTopWidth !== null || borderRightWidth !== null || borderBottomWidth !== null || borderLeftWidth !== null) {
        const top = borderTopWidth ?? borderWidthValue;
        const right = borderRightWidth ?? borderWidthValue;
        const bottom = borderBottomWidth ?? borderWidthValue;
        const left = borderLeftWidth ?? borderWidthValue;
        responsiveCss += `${selector} { border-style: ${borderStyle}; border-width: ${top}px ${right}px ${bottom}px ${left}px; }\n`;
      } else {
        responsiveCss += `${selector} { border-style: ${borderStyle}; border-width: ${borderWidthValue}px; }\n`;
      }
    }
  }

  // Border radius CSS
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
      borderRadiusUnit || "px"
    );
  } else if (borderRadius !== null && borderRadius !== undefined && borderRadius > 0) {
    if (borderTopLeftRadius !== null || borderTopRightRadius !== null || borderBottomRightRadius !== null || borderBottomLeftRadius !== null) {
      const topLeft = borderTopLeftRadius ?? borderRadius;
      const topRight = borderTopRightRadius ?? borderRadius;
      const bottomRight = borderBottomRightRadius ?? borderRadius;
      const bottomLeft = borderBottomLeftRadius ?? borderRadius;
      responsiveCss += `${selector} { border-radius: ${topLeft}${borderRadiusUnit || "px"} ${topRight}${borderRadiusUnit || "px"} ${bottomRight}${borderRadiusUnit || "px"} ${bottomLeft}${borderRadiusUnit || "px"}; }\n`;
    } else {
      responsiveCss += `${selector} { border-radius: ${borderRadius}${borderRadiusUnit || "px"}; }\n`;
    }
  }

  // Box shadow CSS
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
  } else if (
    enableBoxShadow &&
    boxShadowHorizontal !== null &&
    boxShadowHorizontal !== undefined &&
    boxShadowVertical !== null &&
    boxShadowVertical !== undefined &&
    boxShadowBlur !== null &&
    boxShadowBlur !== undefined &&
    boxShadowSpread !== null &&
    boxShadowSpread !== undefined
  ) {
    const shadowValue = `${boxShadowHorizontal ?? 0}px ${boxShadowVertical ?? 0}px ${boxShadowBlur ?? 0}px ${boxShadowSpread ?? 0}px ${boxShadowColor}`;
    responsiveCss += `${selector} { box-shadow: ${shadowValue}; }\n`;
  }

  // Position CSS
  if (positionTopResponsive || positionRightResponsive || positionBottomResponsive || positionLeftResponsive) {
    responsiveCss += generatePositionCss(
      classNameForCssFunctions,
      positionTopResponsive,
      positionRightResponsive,
      positionBottomResponsive,
      positionLeftResponsive,
      positionTop,
      positionRight,
      positionBottom,
      positionLeft,
      positionTopUnit || "px",
      positionRightUnit || "px",
      positionBottomUnit || "px",
      positionLeftUnit || "px"
    );
  }

  // Z-index CSS
  if (zIndexResponsive) {
    responsiveCss += generateZIndexCss(classNameForCssFunctions, zIndexResponsive, zIndex ?? 0);
  } else if (zIndex !== null && zIndex !== undefined) {
    responsiveCss += `${selector} { z-index: ${zIndex}; }\n`;
  }

  // List styles
  const listStyles = `
    ${selector} ul {
      list-style-type: disc;
      padding-left: 1.5em;
      margin: 0.5em 0;
    }
    ${selector} ol {
      list-style-type: decimal;
      padding-left: 1.5em;
      margin: 0.5em 0;
    }
    ${selector} li {
      margin: 0.25em 0;
    }
  `;

  // Toolbar reset styles
  const toolbarResetStyles = `
    ${selector} .lexical-floating-toolbar,
    ${selector} .lexical-floating-toolbar * {
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

  // Link color CSS is already generated above using generateLinkColorCss
  // No need for additional linkColorCss here
  const linkColorCss = "";

  // Overlay CSS
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

  // Visibility CSS
  // buildVisibilityCss expects className without dot, and it adds the dot itself
  // So we pass the CSS selector format (text.text-abc123) without the leading dot
  const visibilityCss = buildVisibilityCss({
    hoverClassName: selector.replace(/^\./, ''),
    isEditMode,
    hideOnDesktop,
    hideOnTablet,
    hideOnLandscapeMobile,
    hideOnMobile,
  });

  return {
    responsiveCss,
    hoverCss,
    listStyles,
    toolbarResetStyles,
    linkColorCss,
    overlayCss: overlayStyles.css,
    visibilityCss,
  };
}


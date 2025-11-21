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
import type { TextProps } from "./types";
import type { ResolvedTextTypography, ResolvedTextSpacing, TypographyDefaults } from "./textStyleHelpers";

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
        hoverCss += `.${componentClassName}:hover .text-content { color: ${resolvedTextColorHover} !important; }\n`;
        const uniqueId = componentClassName.replace(/^text-/, "");
        hoverCss += `.text-wrapper-${uniqueId}:hover .${componentClassName} { color: ${resolvedTextColorHover} !important; }\n`;
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
        hoverCss += `.${componentClassName}:hover { ${hoverBackgroundCss} } `;
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
          hoverCss += `.${componentClassName}:hover { ${hoverBorderCss} } `;
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
        hoverCss += `.${componentClassName}:hover { ${hoverBoxShadowCss} } `;
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

  // Get typography element for defaults
  const typographyElement = resolvedTypography.textColor ? "body" : "h1"; // Simplified - actual logic in helpers
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
      hoverCss += generateHoverTextColorCss(`${componentClassName} .text-content`, textColorHoverResponsive, textColorHover);
    } else {
      hoverCss += `.${componentClassName}:hover .text-content { color: ${textColorHover} !important; }\n`;
    }
  }

  // Background hover
  if (enableBackgroundColorHover && backgroundColorHover) {
    if (backgroundColorHoverResponsive) {
      hoverCss += generateHoverBackgroundColorCss(componentClassName, backgroundColorHoverResponsive, backgroundColorHover);
    } else {
      hoverCss += `.${componentClassName}:hover { background-color: ${backgroundColorHover} !important; } `;
    }
  }

  // Border hover
  if (enableBorderColorHover && borderStyle && borderStyle !== "none") {
    const effectiveBorderColorHover = borderColorHover ?? globalBorderColorHover;
    if (effectiveBorderColorHover) {
      if (borderColorHoverResponsive) {
        hoverCss += generateHoverBorderColorCss(componentClassName, borderColorHoverResponsive, effectiveBorderColorHover);
      } else {
        hoverCss += `.${componentClassName}:hover { border-color: ${effectiveBorderColorHover} !important; } `;
      }
    }
  }

  // Box shadow hover
  if (enableBoxShadowHover) {
    if (boxShadowHorizontalHoverResponsive || boxShadowVerticalHoverResponsive || boxShadowBlurHoverResponsive || boxShadowSpreadHoverResponsive) {
      hoverCss += generateBoxShadowCss(
        componentClassName,
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
      hoverCss += `.${componentClassName}:hover { box-shadow: ${shadowValue} !important; } `;
    }
  }

  // Padding CSS
  if (paddingResponsive) {
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
      paddingUnit || "px"
    );
  } else if (padding !== null && padding !== undefined) {
    const top = paddingTop ?? padding;
    const right = paddingRight ?? padding;
    const bottom = paddingBottom ?? padding;
    const left = paddingLeft ?? padding;
    const paddingValue = `${top}${paddingUnit || "px"} ${right}${paddingUnit || "px"} ${bottom}${paddingUnit || "px"} ${left}${paddingUnit || "px"}`;
    responsiveCss += `.${componentClassName} { padding: ${paddingValue}; }\n`;
  }

  // Margin CSS
  const hasMarginValue = margin !== null && margin !== undefined;
  const hasIndividualMargin = marginTop !== null || marginRight !== null || marginBottom !== null || marginLeft !== null;

  if (marginResponsive) {
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
      marginUnit || "px"
    );
  } else if (hasMarginValue || hasIndividualMargin) {
    const top = marginTop ?? margin ?? 0;
    const right = marginRight ?? margin ?? 0;
    const bottom = marginBottom ?? margin ?? 0;
    const left = marginLeft ?? margin ?? 0;
    const marginValue = `${top}${marginUnit || "px"} ${right}${marginUnit || "px"} ${bottom}${marginUnit || "px"} ${left}${marginUnit || "px"}`;
    responsiveCss += `.${componentClassName} { margin: ${marginValue}; }\n`;
  }

  // Typography CSS
  if (textAlignResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "text-align", textAlignResponsive, textAlign || "left", "", true);
  } else {
    const alignValue = textAlign || "left";
    responsiveCss += `.${componentClassName} .text-content { text-align: ${alignValue} !important; }\n`;
  }

  if (fontSizeResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-size", fontSizeResponsive, fontSize ?? globalFontSize ?? 16, fontSizeUnit || "px");
  } else {
    const sizeValue = fontSize ?? globalFontSize ?? 16;
    responsiveCss += `.${componentClassName} .text-content { font-size: ${sizeValue}${fontSizeUnit || "px"}; }\n`;
  }

  if (fontWeightResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-weight", fontWeightResponsive, fontWeight ?? globalFontWeight ?? 400, "");
  } else {
    const weightValue = fontWeight ?? globalFontWeight ?? 400;
    responsiveCss += `.${componentClassName} .text-content { font-weight: ${weightValue}; }\n`;
  }

  if (fontStyleResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-style", fontStyleResponsive, fontStyle ?? globalFontStyle ?? "normal", "");
  } else {
    const styleValue = fontStyle ?? globalFontStyle ?? "normal";
    responsiveCss += `.${componentClassName} .text-content { font-style: ${styleValue}; }\n`;
  }

  if (textTransformResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "text-transform", textTransformResponsive, textTransform ?? "none", "");
  } else if (textTransform) {
    responsiveCss += `.${componentClassName} .text-content { text-transform: ${textTransform}; }\n`;
  }

  if (textDecorationResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "text-decoration", textDecorationResponsive, textDecoration ?? "none", "");
  } else if (textDecoration) {
    responsiveCss += `.${componentClassName} .text-content { text-decoration: ${textDecoration}; }\n`;
  }

  if (letterSpacingResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "letter-spacing", letterSpacingResponsive, letterSpacing ?? globalLetterSpacing ?? 0, letterSpacingUnit || "px");
  } else {
    const spacingValue = letterSpacing ?? globalLetterSpacing ?? 0;
    responsiveCss += `.${componentClassName} .text-content { letter-spacing: ${spacingValue}${letterSpacingUnit || "px"}; }\n`;
  }

  if (lineHeightResponsive) {
    responsiveCss += generateResponsiveCss(
      `${componentClassName} .text-content`,
      "line-height",
      lineHeightResponsive,
      lineHeight ?? globalLineHeight ?? 1.6,
      lineHeightUnit === "normal" ? "" : lineHeightUnit || ""
    );
  } else {
    const heightValue = lineHeight ?? globalLineHeight ?? 1.6;
    const lineHeightValue = lineHeightUnit === "normal" ? "normal" : `${heightValue}${lineHeightUnit || ""}`;
    responsiveCss += `.${componentClassName} .text-content { line-height: ${lineHeightValue}; }\n`;
  }

  if (fontFamilyResponsive) {
    responsiveCss += generateResponsiveCss(`${componentClassName} .text-content`, "font-family", fontFamilyResponsive, resolvedTypography.fontFamily, "");
  } else if (resolvedTypography.fontFamily) {
    responsiveCss += `.${componentClassName} .text-content { font-family: ${resolvedTypography.fontFamily}; }\n`;
  }

  // Text color CSS
  const isTextColorReset =
    textColorResponsive &&
    textColorResponsive.desktop === null &&
    textColorResponsive.tablet === null &&
    textColorResponsive.mobile === null;

  if (!isTextColorReset) {
    if (textColorResponsive) {
      responsiveCss += generateTextColorCss(`${componentClassName} .text-content`, textColorResponsive, textColor ?? globalTextColor ?? "#1f2937");
    } else {
      const colorValue = resolvedTypography.textColor || globalTextColor || "#1f2937";
      responsiveCss += `.${componentClassName} .text-content { color: ${colorValue}; }\n`;
    }
  }

  // Link color CSS
  const effectiveLinkColor = linkColor ?? globalLinkColor;
  const effectiveLinkColorHover = linkColorHover ?? globalLinkColorHover;
  if (linkColorResponsive || linkColorHoverResponsive) {
    responsiveCss += generateLinkColorCss(
      `${componentClassName} .text-content`,
      linkColorResponsive,
      effectiveLinkColor ?? undefined,
      linkColorHoverResponsive,
      effectiveLinkColorHover ?? undefined
    );
  } else if (effectiveLinkColor || effectiveLinkColorHover) {
    if (effectiveLinkColor) {
      responsiveCss += `.${componentClassName} .text-content a { color: ${effectiveLinkColor}; }\n`;
    }
    if (effectiveLinkColorHover) {
      responsiveCss += `.${componentClassName} .text-content a:hover { color: ${effectiveLinkColorHover}; }\n`;
    }
  }

  // Background CSS
  if (backgroundColorResponsive) {
    responsiveCss += generateBackgroundColorCss(componentClassName, backgroundColorResponsive, backgroundColor ?? "#ffffff");
  } else if (backgroundColor && backgroundType === "color") {
    responsiveCss += `.${componentClassName} { background-color: ${backgroundColor}; }\n`;
  }

  if (backgroundType === "image" && backgroundImage) {
    responsiveCss += `.${componentClassName} { background-image: url("${backgroundImage}"); background-size: cover; background-position: center; background-repeat: no-repeat; }\n`;
  } else if (backgroundType === "gradient" && backgroundGradient) {
    responsiveCss += `.${componentClassName} { background: ${backgroundGradient}; }\n`;
  }

  // Border CSS
  const effectiveBorderColor = borderColor ?? globalBorderColor;
  if (borderStyle && borderStyle !== "none") {
    if (borderColorResponsive) {
      responsiveCss += generateBorderColorCss(componentClassName, borderColorResponsive, effectiveBorderColor ?? undefined);
    } else if (effectiveBorderColor) {
      responsiveCss += `.${componentClassName} { border-color: ${effectiveBorderColor}; }\n`;
    }

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
        "px"
      );
      responsiveCss += `.${componentClassName} { border-style: ${borderStyle}; }\n`;
    } else {
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
      responsiveCss += `.${componentClassName} { border-radius: ${topLeft}${borderRadiusUnit || "px"} ${topRight}${borderRadiusUnit || "px"} ${bottomRight}${borderRadiusUnit || "px"} ${bottomLeft}${borderRadiusUnit || "px"}; }\n`;
    } else {
      responsiveCss += `.${componentClassName} { border-radius: ${borderRadius}${borderRadiusUnit || "px"}; }\n`;
    }
  }

  // Box shadow CSS
  if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
    responsiveCss += generateBoxShadowCss(
      componentClassName,
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
    responsiveCss += `.${componentClassName} { box-shadow: ${shadowValue}; }\n`;
  }

  // Position CSS
  if (positionTopResponsive || positionRightResponsive || positionBottomResponsive || positionLeftResponsive) {
    responsiveCss += generatePositionCss(
      componentClassName,
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
    responsiveCss += generateZIndexCss(componentClassName, zIndexResponsive, zIndex ?? 0);
  } else if (zIndex !== null && zIndex !== undefined) {
    responsiveCss += `.${componentClassName} { z-index: ${zIndex}; }\n`;
  }

  // List styles
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

  // Toolbar reset styles
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
  const visibilityCss = buildVisibilityCss({
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


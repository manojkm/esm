import { getGoogleFontFamilyCSS } from "@/app/builder/lib/google-fonts";
import { buildResponsiveValueWithUnit, buildResponsiveFourSideValue, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import type { HeadingProps } from "./types";

import type { TypographySettings } from "@/app/builder/contexts/GlobalSettingsContext";

export type TypographyDefaults = TypographySettings;

export interface ResolvedHeadingTypography {
  fontSize: string;
  fontWeight: number | string;
  fontStyle: string;
  textTransform: string;
  textDecoration: string;
  letterSpacing: string;
  lineHeight: string | number;
  fontFamily: string;
  textColor: string;
}

export interface ResolvedSubHeadingTypography {
  fontSize: string;
  fontWeight: number | string;
  fontStyle: string;
  textTransform: string;
  textDecoration: string;
  letterSpacing: string;
  lineHeight: string | number;
  fontFamily: string;
  textColor: string;
}

export interface ResolvedSpacing {
  padding: string;
  margin: string;
  headingBottomSpacing: string;
  subHeadingBottomSpacing: string;
}

export interface ResolvedSeparator {
  width: string;
  color: string;
  bottomSpacing: string;
  thickness: number;
}

/**
 * Resolves heading typography values from props and global defaults
 */
export function resolveHeadingTypography(
  props: HeadingProps,
  typographyDefaults: TypographyDefaults,
  headingTag: string,
  responsiveResolver: ResponsiveResolver
): ResolvedHeadingTypography {
  // Get font size from TypographySettings structure (fontSize.desktop.h1, etc.)
  const desktopFontSize = typographyDefaults.fontSize?.desktop?.[headingTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"];
  const globalHeadingFontSize =
    desktopFontSize ||
    (headingTag === "h1" ? 32 : headingTag === "h2" ? 24 : headingTag === "h3" ? 20 : headingTag === "h4" ? 18 : headingTag === "h5" ? 16 : headingTag === "h6" ? 14 : 24);
  const globalHeadingFontWeight = (typographyDefaults.fontWeight?.headings as number) || 700;
  const globalHeadingFontFamily = typographyDefaults.googleFonts?.headings?.family || typographyDefaults.fontFamily?.headings || "sans-serif";
  const globalHeadingTextColor = typographyDefaults.textColor?.headings || "#1f2937";

  const fontSize = props.headingFontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.headingFontSizeResponsive,
        fallbackValue: props.headingFontSize ?? globalHeadingFontSize,
        fallbackUnit: props.headingFontSizeUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.headingFontSize ?? globalHeadingFontSize}${props.headingFontSizeUnit || "px"}`;

  const fontWeight = props.headingFontWeightResponsive
    ? responsiveResolver(props.headingFontWeightResponsive, props.headingFontWeight ?? globalHeadingFontWeight)
    : props.headingFontWeight ?? globalHeadingFontWeight;

  const fontStyle = props.headingFontStyleResponsive
    ? responsiveResolver(props.headingFontStyleResponsive, props.headingFontStyle ?? "normal")
    : props.headingFontStyle ?? "normal";

  const textTransform = props.headingTextTransformResponsive
    ? responsiveResolver(props.headingTextTransformResponsive, props.headingTextTransform ?? "none")
    : props.headingTextTransform ?? "none";

  const textDecoration = props.headingTextDecorationResponsive
    ? responsiveResolver(props.headingTextDecorationResponsive, props.headingTextDecoration ?? "none")
    : props.headingTextDecoration ?? "none";

  const letterSpacing = props.headingLetterSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.headingLetterSpacingResponsive,
        fallbackValue: props.headingLetterSpacing ?? 0,
        fallbackUnit: props.headingLetterSpacingUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.headingLetterSpacing ?? 0}${props.headingLetterSpacingUnit || "px"}`;

  const lineHeight = props.headingLineHeightResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.headingLineHeightResponsive,
        fallbackValue: props.headingLineHeight ?? 1.2,
        fallbackUnit: props.headingLineHeightUnit || "normal",
        resolver: responsiveResolver,
      })
    : props.headingLineHeightUnit === "normal" || props.headingLineHeightUnit === "number"
    ? props.headingLineHeight ?? 1.2
    : `${props.headingLineHeight ?? 1.2}${props.headingLineHeightUnit || "normal"}`;

  const getFontFamily = () => {
    if (props.headingFontFamily) return props.headingFontFamily;
    if (props.headingFontFamilyResponsive) {
      return responsiveResolver(props.headingFontFamilyResponsive, globalHeadingFontFamily);
    }
    const googleFont = typographyDefaults.googleFonts?.headings;
    if (googleFont) {
      return getGoogleFontFamilyCSS(googleFont, globalHeadingFontFamily);
    }
    return globalHeadingFontFamily;
  };

  const fontFamily = getFontFamily();
  // Resolve text color, handling reset (null) values
  let textColor: string | undefined;
  if (props.headingTextColorResponsive) {
    const resolved = responsiveResolver(props.headingTextColorResponsive, null);
    // If resolved is null, it means all responsive values were reset, so use global default
    // If resolved is a string, use it
    textColor = resolved === null ? globalHeadingTextColor : (resolved || undefined);
  } else {
    textColor = props.headingTextColor ?? globalHeadingTextColor;
  }

  return {
    fontSize,
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    letterSpacing,
    lineHeight,
    fontFamily,
    textColor,
  };
}

/**
 * Resolves sub-heading typography values from props and global defaults
 */
export function resolveSubHeadingTypography(
  props: HeadingProps,
  typographyDefaults: TypographyDefaults,
  responsiveResolver: ResponsiveResolver
): ResolvedSubHeadingTypography {
  const globalSubHeadingFontSize = typographyDefaults.fontSize?.desktop?.body || 16;
  const globalSubHeadingFontWeight = (typographyDefaults.fontWeight?.body as number) || 400;
  const globalSubHeadingFontFamily = typographyDefaults.googleFonts?.body?.family || typographyDefaults.fontFamily?.body || "sans-serif";
  const globalSubHeadingTextColor = typographyDefaults.textColor?.headings || "#1f2937"; // Use heading color for sub-heading too

  const fontSize = props.subHeadingFontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.subHeadingFontSizeResponsive,
        fallbackValue: props.subHeadingFontSize ?? globalSubHeadingFontSize,
        fallbackUnit: props.subHeadingFontSizeUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.subHeadingFontSize ?? globalSubHeadingFontSize}${props.subHeadingFontSizeUnit || "px"}`;

  const fontWeight = props.subHeadingFontWeightResponsive
    ? responsiveResolver(props.subHeadingFontWeightResponsive, props.subHeadingFontWeight ?? globalSubHeadingFontWeight)
    : props.subHeadingFontWeight ?? globalSubHeadingFontWeight;

  const fontStyle = props.subHeadingFontStyleResponsive
    ? responsiveResolver(props.subHeadingFontStyleResponsive, props.subHeadingFontStyle ?? "normal")
    : props.subHeadingFontStyle ?? "normal";

  const textTransform = props.subHeadingTextTransformResponsive
    ? responsiveResolver(props.subHeadingTextTransformResponsive, props.subHeadingTextTransform ?? "none")
    : props.subHeadingTextTransform ?? "none";

  const textDecoration = props.subHeadingTextDecorationResponsive
    ? responsiveResolver(props.subHeadingTextDecorationResponsive, props.subHeadingTextDecoration ?? "none")
    : props.subHeadingTextDecoration ?? "none";

  const letterSpacing = props.subHeadingLetterSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.subHeadingLetterSpacingResponsive,
        fallbackValue: props.subHeadingLetterSpacing ?? 0,
        fallbackUnit: props.subHeadingLetterSpacingUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.subHeadingLetterSpacing ?? 0}${props.subHeadingLetterSpacingUnit || "px"}`;

  const lineHeight = props.subHeadingLineHeightResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.subHeadingLineHeightResponsive,
        fallbackValue: props.subHeadingLineHeight ?? 1.5,
        fallbackUnit: props.subHeadingLineHeightUnit || "normal",
        resolver: responsiveResolver,
      })
    : props.subHeadingLineHeightUnit === "normal" || props.subHeadingLineHeightUnit === "number"
    ? props.subHeadingLineHeight ?? 1.5
    : `${props.subHeadingLineHeight ?? 1.5}${props.subHeadingLineHeightUnit || "normal"}`;

  const getFontFamily = () => {
    if (props.subHeadingFontFamily) return props.subHeadingFontFamily;
    if (props.subHeadingFontFamilyResponsive) {
      return responsiveResolver(props.subHeadingFontFamilyResponsive, globalSubHeadingFontFamily);
    }
    const googleFont = typographyDefaults.googleFonts?.body;
    if (googleFont) {
      return getGoogleFontFamilyCSS(googleFont, globalSubHeadingFontFamily);
    }
    return globalSubHeadingFontFamily;
  };

  const fontFamily = getFontFamily();
  // Resolve text color, handling reset (null) values
  let textColor: string | undefined;
  if (props.subHeadingTextColorResponsive) {
    const resolved = responsiveResolver(props.subHeadingTextColorResponsive, null);
    // If resolved is null, it means all responsive values were reset, so use global default
    // If resolved is a string, use it
    textColor = resolved === null ? globalSubHeadingTextColor : (resolved || undefined);
  } else {
    textColor = props.subHeadingTextColor ?? globalSubHeadingTextColor;
  }

  return {
    fontSize,
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    letterSpacing,
    lineHeight,
    fontFamily,
    textColor,
  };
}

/**
 * Resolves spacing values (padding, margin, bottom spacing)
 */
export function resolveSpacing(
  props: HeadingProps,
  responsiveResolver: ResponsiveResolver
): ResolvedSpacing {
  const padding = buildResponsiveFourSideValue({
    responsive: props.paddingResponsive,
    fallback: {
      top: props.paddingTop,
      right: props.paddingRight,
      bottom: props.paddingBottom,
      left: props.paddingLeft,
      defaultValue: props.padding ?? 0,
    },
    defaultUnit: props.paddingUnit || "px",
    resolver: responsiveResolver,
  });

  const margin = buildResponsiveFourSideValue({
    responsive: props.marginResponsive,
    fallback: {
      top: props.marginTop,
      right: props.marginRight,
      bottom: props.marginBottom,
      left: props.marginLeft,
      defaultValue: props.margin ?? 0,
    },
    defaultUnit: props.marginUnit || "px",
    resolver: responsiveResolver,
  });

  const headingBottomSpacing = props.headingBottomSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.headingBottomSpacingResponsive,
        fallbackValue: props.headingBottomSpacing ?? 16,
        fallbackUnit: props.headingBottomSpacingUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.headingBottomSpacing ?? 16}${props.headingBottomSpacingUnit || "px"}`;

  const subHeadingBottomSpacing = props.subHeadingBottomSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.subHeadingBottomSpacingResponsive,
        fallbackValue: props.subHeadingBottomSpacing ?? 16,
        fallbackUnit: props.subHeadingBottomSpacingUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.subHeadingBottomSpacing ?? 16}${props.subHeadingBottomSpacingUnit || "px"}`;

  return {
    padding,
    margin,
    headingBottomSpacing,
    subHeadingBottomSpacing,
  };
}

/**
 * Resolves separator values
 */
export function resolveSeparator(
  props: HeadingProps,
  responsiveResolver: ResponsiveResolver
): ResolvedSeparator {
  const width = props.separatorWidthResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.separatorWidthResponsive,
        fallbackValue: props.separatorWidth ?? 12,
        fallbackUnit: props.separatorWidthUnit || "%",
        resolver: responsiveResolver,
      })
    : `${props.separatorWidth ?? 12}${props.separatorWidthUnit || "%"}`;

  const color = props.separatorColorResponsive
    ? responsiveResolver(props.separatorColorResponsive, props.separatorColor ?? "#000000")
    : props.separatorColor ?? "#000000";

  const bottomSpacing = props.separatorBottomSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.separatorBottomSpacingResponsive,
        fallbackValue: props.separatorBottomSpacing ?? 16,
        fallbackUnit: props.separatorBottomSpacingUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.separatorBottomSpacing ?? 16}${props.separatorBottomSpacingUnit || "px"}`;

  const thickness = props.separatorThickness ?? 2;

  return {
    width,
    color,
    bottomSpacing,
    thickness,
  };
}


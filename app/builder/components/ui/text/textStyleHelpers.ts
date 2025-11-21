import { getGoogleFontFamilyCSS } from "@/app/builder/lib/google-fonts";
import { buildResponsiveValueWithUnit, buildResponsiveFourSideValue, type ResponsiveResolver } from "@/app/builder/lib/style-system";
import type { TextProps } from "./types";
import type { TypographySettings } from "@/app/builder/contexts/GlobalSettingsContext";

export type TypographyDefaults = TypographySettings;

export interface ResolvedTextTypography {
  fontSize: string;
  fontWeight: number | string;
  fontStyle: string;
  textTransform: string;
  textDecoration: string;
  letterSpacing: string;
  lineHeight: string | number;
  fontFamily: string;
  textColor: string | undefined;
  textAlign: string;
}

export interface ResolvedTextSpacing {
  padding: string;
  margin: string;
}

/**
 * Gets the typography element type based on htmlTag
 */
export function getTypographyElement(htmlTag: string): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" {
  if (htmlTag.startsWith("h")) {
    return htmlTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
  return "body";
}

/**
 * Resolves text typography values from props and global defaults
 */
export function resolveTextTypography(
  props: TextProps,
  typographyDefaults: TypographyDefaults,
  responsiveResolver: ResponsiveResolver
): ResolvedTextTypography {
  const typographyElement = getTypographyElement(props.htmlTag || "p");
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

  const fontSize = props.fontSizeResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.fontSizeResponsive,
        fallbackValue: props.fontSize ?? globalFontSize ?? 16,
        fallbackUnit: props.fontSizeUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.fontSize ?? globalFontSize ?? 16}${props.fontSizeUnit || "px"}`;

  const fontWeight = props.fontWeightResponsive
    ? responsiveResolver(props.fontWeightResponsive, props.fontWeight ?? globalFontWeight ?? 400)
    : props.fontWeight ?? globalFontWeight ?? 400;

  const fontStyle = props.fontStyleResponsive
    ? responsiveResolver(props.fontStyleResponsive, props.fontStyle ?? globalFontStyle ?? "normal")
    : props.fontStyle ?? globalFontStyle ?? "normal";

  const textTransform = props.textTransformResponsive
    ? responsiveResolver(props.textTransformResponsive, props.textTransform ?? "none")
    : props.textTransform ?? "none";

  const textDecoration = props.textDecorationResponsive
    ? responsiveResolver(props.textDecorationResponsive, props.textDecoration ?? "none")
    : props.textDecoration ?? "none";

  const letterSpacing = props.letterSpacingResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.letterSpacingResponsive,
        fallbackValue: props.letterSpacing ?? globalLetterSpacing ?? 0,
        fallbackUnit: props.letterSpacingUnit || "px",
        resolver: responsiveResolver,
      })
    : `${props.letterSpacing ?? globalLetterSpacing ?? 0}${props.letterSpacingUnit || "px"}`;

  const lineHeight = props.lineHeightResponsive
    ? buildResponsiveValueWithUnit({
        responsive: props.lineHeightResponsive,
        fallbackValue: props.lineHeight ?? globalLineHeight ?? 1.6,
        fallbackUnit: props.lineHeightUnit || "normal",
        resolver: responsiveResolver,
      })
    : props.lineHeightUnit === "normal" || props.lineHeightUnit === "number"
    ? props.lineHeight ?? globalLineHeight ?? 1.6
    : `${props.lineHeight ?? globalLineHeight ?? 1.6}${props.lineHeightUnit || "normal"}`;

  // Font family resolution
  const getEffectiveFontFamily = () => {
    if (props.fontFamily) return props.fontFamily;
    if (props.fontFamilyResponsive) {
      return responsiveResolver(props.fontFamilyResponsive, globalFontFamily || "sans-serif");
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

  const fontFamily = getEffectiveFontFamily();

  // Text color resolution - handle reset (null) values
  let textColor: string | undefined;
  if (props.textColorResponsive) {
    const resolved = responsiveResolver(props.textColorResponsive, null);
    // If resolved is null, it means all responsive values were reset, so use global default
    // If resolved is a string, use it
    textColor = resolved === null ? (globalTextColor ?? "#1f2937") : (resolved || undefined);
  } else {
    textColor = props.textColor ?? globalTextColor ?? "#1f2937";
  }

  // Text align
  const textAlign = props.textAlignResponsive
    ? responsiveResolver(props.textAlignResponsive, props.textAlign || "left")
    : props.textAlign || "left";

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
    textAlign,
  };
}

/**
 * Resolves spacing values (padding, margin)
 */
export function resolveTextSpacing(
  props: TextProps,
  responsiveResolver: ResponsiveResolver
): ResolvedTextSpacing {
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

  return {
    padding,
    margin,
  };
}


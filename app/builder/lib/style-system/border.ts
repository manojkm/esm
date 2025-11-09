import type { CSSProperties } from "react";
import type { ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { buildResponsiveFourSideValue } from "./spacing";
import { resolveResponsiveValue } from "./responsive";

interface BorderOptions {
  style?: string | null;
  color?: string | null;
  colorResponsive?: ResponsiveValue;
  radiusResponsive?: ResponsiveValue;
  widthResponsive?: ResponsiveValue;
  radiusFallback: {
    topLeft?: number | null;
    topRight?: number | null;
    bottomRight?: number | null;
    bottomLeft?: number | null;
    defaultValue: number;
    defaultUnit: string;
  };
  widthFallback: {
    top?: number | null;
    right?: number | null;
    bottom?: number | null;
    left?: number | null;
    defaultValue: number;
    defaultUnit: string;
  };
  resolver: ResponsiveResolver;
}

export const buildBorderStyles = ({
  style,
  color,
  colorResponsive,
  radiusResponsive,
  widthResponsive,
  radiusFallback,
  widthFallback,
  resolver,
}: BorderOptions): CSSProperties => {
  const styles: CSSProperties = {
    borderRadius: buildResponsiveFourSideValue({
      responsive: radiusResponsive,
      fallback: {
        top: radiusFallback.topLeft,
        right: radiusFallback.topRight,
        bottom: radiusFallback.bottomRight,
        left: radiusFallback.bottomLeft,
        defaultValue: radiusFallback.defaultValue,
      },
      defaultUnit: radiusFallback.defaultUnit,
      resolver,
    }),
  };

  if (style && style !== "none") {
    styles.borderStyle = style as CSSProperties["borderStyle"];
    styles.borderWidth = buildResponsiveFourSideValue({
      responsive: widthResponsive,
      fallback: {
        top: widthFallback.top,
        right: widthFallback.right,
        bottom: widthFallback.bottom,
        left: widthFallback.left,
        defaultValue: widthFallback.defaultValue,
      },
      defaultUnit: widthFallback.defaultUnit,
      resolver,
    });
    const resolvedColor = resolveResponsiveValue<string>({
      resolver,
      responsive: colorResponsive as ResponsiveMap<string>,
      fallback: color ?? "",
    });
    styles.borderColor = resolvedColor;
  }

  return styles;
};


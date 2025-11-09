import type { ResponsiveDirectional, ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { resolveResponsiveValue } from "./responsive";

interface FourSideFallback {
  top?: number | null;
  right?: number | null;
  bottom?: number | null;
  left?: number | null;
  defaultValue: number;
}

interface FourSideOptions {
  responsive?: ResponsiveValue;
  fallback: FourSideFallback;
  defaultUnit: string;
  resolver: ResponsiveResolver;
}

const resolveFallback = (value: number | null | undefined, defaultValue: number) => (value ?? defaultValue);

export const buildResponsiveFourSideValue = ({ responsive, fallback, defaultUnit, resolver }: FourSideOptions) => {
  const baseTop = resolveFallback(fallback.top, fallback.defaultValue);
  const baseRight = resolveFallback(fallback.right, fallback.defaultValue);
  const baseBottom = resolveFallback(fallback.bottom, fallback.defaultValue);
  const baseLeft = resolveFallback(fallback.left, fallback.defaultValue);

  if (responsive) {
    const unit = resolveResponsiveValue({
      resolver,
      responsive: responsive.unit,
      fallback: defaultUnit,
    });

    const top = resolveResponsiveValue({
      resolver,
      responsive: responsive.top as ResponsiveDirectional["top"],
      fallback: baseTop,
    });
    const right = resolveResponsiveValue({
      resolver,
      responsive: responsive.right as ResponsiveDirectional["right"],
      fallback: baseRight,
    });
    const bottom = resolveResponsiveValue({
      resolver,
      responsive: responsive.bottom as ResponsiveDirectional["bottom"],
      fallback: baseBottom,
    });
    const left = resolveResponsiveValue({
      resolver,
      responsive: responsive.left as ResponsiveDirectional["left"],
      fallback: baseLeft,
    });

    return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
  }

  return `${baseTop}${defaultUnit} ${baseRight}${defaultUnit} ${baseBottom}${defaultUnit} ${baseLeft}${defaultUnit}`;
};

interface SingleValueOptions {
  responsive?: ResponsiveValue;
  fallbackValue: number;
  fallbackUnit: string;
  resolver: ResponsiveResolver;
}

export const buildResponsiveValueWithUnit = ({ responsive, fallbackValue, fallbackUnit, resolver }: SingleValueOptions) => {
  if (!responsive) {
    return `${fallbackValue}${fallbackUnit}`;
  }

  const unit = resolveResponsiveValue({
    resolver,
    responsive: responsive.unit,
    fallback: fallbackUnit,
  });

  const value = resolveResponsiveValue({
    resolver,
    responsive: responsive as ResponsiveMap<number>,
    fallback: fallbackValue,
  });

  return `${value}${unit}`;
};


import type { ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { resolveResponsiveValue } from "./responsive";

interface BoxShadowValues {
  horizontal: number;
  vertical: number;
  blur: number;
  spread: number;
}

interface BoxShadowOptions {
  enable: boolean;
  preset?: string | null;
  position?: string | null;
  color: string;
  horizontal: number;
  vertical: number;
  blur: number;
  spread: number;
  horizontalResponsive?: ResponsiveValue;
  verticalResponsive?: ResponsiveValue;
  blurResponsive?: ResponsiveValue;
  spreadResponsive?: ResponsiveValue;
  resolver: ResponsiveResolver;
}

interface BoxShadowHoverOptions extends Omit<BoxShadowOptions, "enable" | "position"> {
  enableHover: boolean;
  hoverPosition?: string | null;
  colorHover: string;
  preset?: string | null;
}

const resolveResponsiveShadowValues = ({
  resolver,
  horizontal,
  vertical,
  blur,
  spread,
  horizontalResponsive,
  verticalResponsive,
  blurResponsive,
  spreadResponsive,
}: Omit<BoxShadowOptions, "enable" | "preset" | "position" | "color">): BoxShadowValues => {
  const resolvedHorizontal = resolveResponsiveValue({
    resolver,
    responsive: horizontalResponsive as ResponsiveMap<number> | undefined,
    fallback: horizontal,
  });
  const resolvedVertical = resolveResponsiveValue({
    resolver,
    responsive: verticalResponsive as ResponsiveMap<number> | undefined,
    fallback: vertical,
  });
  const resolvedBlur = resolveResponsiveValue({
    resolver,
    responsive: blurResponsive as ResponsiveMap<number> | undefined,
    fallback: blur,
  });
  const resolvedSpread = resolveResponsiveValue({
    resolver,
    responsive: spreadResponsive as ResponsiveMap<number> | undefined,
    fallback: spread,
  });

  return {
    horizontal: resolvedHorizontal,
    vertical: resolvedVertical,
    blur: resolvedBlur,
    spread: resolvedSpread,
  };
};

export const buildBoxShadowStyle = (options: BoxShadowOptions) => {
  if (!options.enable) {
    return {};
  }

  const shadowValues = resolveResponsiveShadowValues(options);

  if (!options.preset && shadowValues.horizontal === 0 && shadowValues.vertical === 0 && shadowValues.blur === 0) {
    return {};
  }

  const inset = options.position === "inset" ? "inset " : "";
  const boxShadowValue = `${inset}${shadowValues.horizontal}px ${shadowValues.vertical}px ${shadowValues.blur}px ${shadowValues.spread}px ${options.color}`;

  return {
    boxShadow: boxShadowValue,
  };
};

export const buildBoxShadowHoverCss = (options: BoxShadowHoverOptions) => {
  if (!options.enableHover) {
    return "";
  }

  const shadowValues = resolveResponsiveShadowValues({
    resolver: options.resolver,
    horizontal: options.horizontal,
    vertical: options.vertical,
    blur: options.blur,
    spread: options.spread,
    horizontalResponsive: options.horizontalResponsive,
    verticalResponsive: options.verticalResponsive,
    blurResponsive: options.blurResponsive,
    spreadResponsive: options.spreadResponsive,
  });

  if (shadowValues.horizontal === 0 && shadowValues.vertical === 0 && shadowValues.blur === 0 && !options.preset) {
    return "";
  }

  const inset = options.hoverPosition === "inset" ? "inset " : "";
  const boxShadowValue = `${inset}${shadowValues.horizontal}px ${shadowValues.vertical}px ${shadowValues.blur}px ${shadowValues.spread}px ${options.colorHover}`;

  return `box-shadow: ${boxShadowValue} !important; `;
};


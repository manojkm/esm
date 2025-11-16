import type { ResponsiveMap, ResponsiveValue } from "./types";

// Breakpoints matching ResponsiveContext
export const BREAKPOINTS = {
  desktop: { min: 1024, label: "Desktop" },
  tablet: { min: 768, max: 1023, label: "Tablet" },
  mobile: { max: 767, label: "Mobile" },
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Generates CSS media query string for a breakpoint
 */
export const getMediaQuery = (breakpoint: BreakpointKey): string => {
  const bp = BREAKPOINTS[breakpoint];
  if ("min" in bp && "max" in bp) {
    return `@media (min-width: ${bp.min}px) and (max-width: ${bp.max}px)`;
  }
  if ("min" in bp) {
    return `@media (min-width: ${bp.min}px)`;
  }
  if ("max" in bp) {
    return `@media (max-width: ${bp.max}px)`;
  }
  return "";
};

/**
 * Generates CSS rules for responsive values using media queries
 * This is used for exported HTML/CSS (no JS required)
 */
export const generateResponsiveCss = (
  className: string,
  property: string,
  responsive?: ResponsiveValue,
  fallbackValue?: string | number,
  fallbackUnit: string = ""
): string => {
  if (!responsive) {
    // No responsive values, return empty string (use inline style for base)
    return "";
  }

  let css = "";
  const hasValue = (bp: BreakpointKey) => responsive[bp] !== undefined;

  // Generate media queries for each breakpoint that has a different value
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];
  
  for (const bp of breakpoints) {
    if (hasValue(bp)) {
      const value = responsive[bp];
      if (value !== undefined && value !== null) {
        const unit = (responsive.unit && responsive.unit[bp]) || fallbackUnit;
        const cssValue = typeof value === "number" ? `${value}${unit}` : value;
        css += `${getMediaQuery(bp)} { .${className} { ${property}: ${cssValue} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive four-side values (padding, margin, border-radius, etc.)
 */
export const generateResponsiveFourSideCss = (
  className: string,
  property: string,
  responsive?: ResponsiveValue,
  fallback?: {
    top?: number | null;
    right?: number | null;
    bottom?: number | null;
    left?: number | null;
    defaultValue: number;
  },
  defaultUnit: string = "px"
): string => {
  if (!responsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  for (const bp of breakpoints) {
    const topVal = (responsive.top as ResponsiveMap<number> | undefined)?.[bp];
    const rightVal = (responsive.right as ResponsiveMap<number> | undefined)?.[bp];
    const bottomVal = (responsive.bottom as ResponsiveMap<number> | undefined)?.[bp];
    const leftVal = (responsive.left as ResponsiveMap<number> | undefined)?.[bp];
    const unit = (responsive.unit as ResponsiveMap<string> | undefined)?.[bp] || defaultUnit;

    // Check if this breakpoint has any custom values
    const hasTop = topVal !== undefined && topVal !== null;
    const hasRight = rightVal !== undefined && rightVal !== null;
    const hasBottom = bottomVal !== undefined && bottomVal !== null;
    const hasLeft = leftVal !== undefined && leftVal !== null;

    if (hasTop || hasRight || hasBottom || hasLeft) {
      const top = hasTop ? topVal : fallback?.top ?? fallback?.defaultValue ?? 0;
      const right = hasRight ? rightVal : fallback?.right ?? fallback?.defaultValue ?? 0;
      const bottom = hasBottom ? bottomVal : fallback?.bottom ?? fallback?.defaultValue ?? 0;
      const left = hasLeft ? leftVal : fallback?.left ?? fallback?.defaultValue ?? 0;

      css += `${getMediaQuery(bp)} { .${className} { ${property}: ${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit} !important; } }\n`;
    }
  }

  return css;
};

/**
 * Helper to generate CSS for padding with responsive values
 */
export const generatePaddingCss = (
  className: string,
  responsive?: ResponsiveValue,
  fallback?: {
    top?: number | null;
    right?: number | null;
    bottom?: number | null;
    left?: number | null;
    defaultValue: number;
  },
  defaultUnit: string = "px"
): string => {
  return generateResponsiveFourSideCss(className, "padding", responsive, fallback, defaultUnit);
};

/**
 * Helper to generate CSS for margin with responsive values
 */
export const generateMarginCss = (
  className: string,
  responsive?: ResponsiveValue,
  fallback?: {
    top?: number | null;
    right?: number | null;
    bottom?: number | null;
    left?: number | null;
    defaultValue: number;
  },
  defaultUnit: string = "px"
): string => {
  return generateResponsiveFourSideCss(className, "margin", responsive, fallback, defaultUnit);
};

/**
 * Generates CSS for responsive flex-direction, justifyContent, alignItems, etc.
 */
export const generateResponsiveFlexCss = (
  className: string,
  property: "flex-direction" | "justify-content" | "align-items" | "flex-wrap" | "align-content",
  responsive?: ResponsiveMap<string>,
  fallback?: string
): string => {
  if (!responsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== fallback) {
      css += `${getMediaQuery(bp)} { .${className} { ${property}: ${responsive[bp]} !important; } }\n`;
    }
  }

  return css;
};

/**
 * Generates CSS for responsive background color
 */
export const generateBackgroundColorCss = (
  className: string,
  responsive?: ResponsiveValue,
  fallback?: string
): string => {
  if (!responsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== fallback) {
        css += `${getMediaQuery(bp)} { .${className} { background-color: ${value} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive border color
 */
export const generateBorderColorCss = (
  className: string,
  responsive?: ResponsiveValue,
  fallback?: string
): string => {
  if (!responsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== fallback) {
        css += `${getMediaQuery(bp)} { .${className} { border-color: ${value} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive box-shadow
 * Box shadow format: [inset] horizontal vertical blur spread color
 */
export const generateBoxShadowCss = (
  className: string,
  horizontalResponsive?: ResponsiveValue,
  verticalResponsive?: ResponsiveValue,
  blurResponsive?: ResponsiveValue,
  spreadResponsive?: ResponsiveValue,
  horizontalFallback: number = 0,
  verticalFallback: number = 0,
  blurFallback: number = 0,
  spreadFallback: number = 0,
  color: string = "rgba(0, 0, 0, 0.1)",
  position: string = "outset"
): string => {
  // Check if any responsive values exist
  const hasResponsive = 
    horizontalResponsive || 
    verticalResponsive || 
    blurResponsive || 
    spreadResponsive;

  if (!hasResponsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  for (const bp of breakpoints) {
    // Get values for this breakpoint, fallback to base values if not set
    const hVal = (horizontalResponsive as ResponsiveMap<number> | undefined)?.[bp];
    const vVal = (verticalResponsive as ResponsiveMap<number> | undefined)?.[bp];
    const bVal = (blurResponsive as ResponsiveMap<number> | undefined)?.[bp];
    const sVal = (spreadResponsive as ResponsiveMap<number> | undefined)?.[bp];

    // Check if this breakpoint has any custom values
    const hasHorizontal = hVal !== undefined && hVal !== null;
    const hasVertical = vVal !== undefined && vVal !== null;
    const hasBlur = bVal !== undefined && bVal !== null;
    const hasSpread = sVal !== undefined && sVal !== null;

    // Only generate CSS if there's at least one custom value for this breakpoint
    if (hasHorizontal || hasVertical || hasBlur || hasSpread) {
      const h = hasHorizontal ? hVal : horizontalFallback;
      const v = hasVertical ? vVal : verticalFallback;
      const b = hasBlur ? bVal : blurFallback;
      const s = hasSpread ? sVal : spreadFallback;

      const inset = position === "inset" ? "inset " : "";
      const boxShadowValue = `${inset}${h}px ${v}px ${b}px ${s}px ${color}`;
      css += `${getMediaQuery(bp)} { .${className} { box-shadow: ${boxShadowValue} !important; } }\n`;
    }
  }

  return css;
};

/**
 * Generates base inline styles (non-responsive) that can be applied directly
 * Returns an object with CSS properties and their values
 */
export const generateBaseStyles = (
  values: Record<string, string | number | undefined | null>
): Record<string, string> => {
  const styles: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null) {
      styles[key] = String(value);
    }
  }
  return styles;
};


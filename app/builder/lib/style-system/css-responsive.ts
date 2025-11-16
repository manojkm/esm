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
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateResponsiveCss = (
  className: string,
  property: string,
  responsive?: ResponsiveValue,
  fallbackValue?: string | number,
  fallbackUnit: string = ""
): string => {
  if (!responsive || fallbackValue === undefined) {
    // No responsive values or no fallback, return empty string (use inline style for base)
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];
  
  // Generate base CSS rule with fallback value (applies to all breakpoints)
  const baseUnit = (responsive.unit && responsive.unit.desktop) || fallbackUnit;
  const baseValue = typeof fallbackValue === "number" ? `${fallbackValue}${baseUnit}` : fallbackValue;
  css += `.${className} { ${property}: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from fallback)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      const unit = (responsive.unit && responsive.unit[bp]) || fallbackUnit;
      const cssValue = typeof value === "number" ? `${value}${unit}` : value;
      
      // Only generate media query if value differs from fallback
      if (cssValue !== baseValue) {
        css += `${getMediaQuery(bp)} { .${className} { ${property}: ${cssValue} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive four-side values (padding, margin, border-radius, etc.)
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
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
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with fallback values (applies to all breakpoints)
  const baseTop = fallback.top ?? fallback.defaultValue;
  const baseRight = fallback.right ?? fallback.defaultValue;
  const baseBottom = fallback.bottom ?? fallback.defaultValue;
  const baseLeft = fallback.left ?? fallback.defaultValue;
  const baseUnit = (responsive.unit as ResponsiveMap<string> | undefined)?.desktop || defaultUnit;
  css += `.${className} { ${property}: ${baseTop}${baseUnit} ${baseRight}${baseUnit} ${baseBottom}${baseUnit} ${baseLeft}${baseUnit}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides
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

    // Only generate media query if there are custom values that differ from base
    if (hasTop || hasRight || hasBottom || hasLeft) {
      const top = hasTop ? topVal : baseTop;
      const right = hasRight ? rightVal : baseRight;
      const bottom = hasBottom ? bottomVal : baseBottom;
      const left = hasLeft ? leftVal : baseLeft;

      // Check if any value differs from base
      const differsFromBase = 
        (hasTop && top !== baseTop) ||
        (hasRight && right !== baseRight) ||
        (hasBottom && bottom !== baseBottom) ||
        (hasLeft && left !== baseLeft) ||
        unit !== baseUnit;

      if (differsFromBase) {
        css += `${getMediaQuery(bp)} { .${className} { ${property}: ${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit} !important; } }\n`;
      }
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
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateResponsiveFlexCss = (
  className: string,
  property: "flex-direction" | "justify-content" | "align-items" | "flex-wrap" | "align-content",
  responsive?: ResponsiveMap<string>,
  fallback?: string
): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with fallback value (applies to all breakpoints)
  css += `.${className} { ${property}: ${fallback}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from fallback)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null && responsive[bp] !== fallback) {
      css += `${getMediaQuery(bp)} { .${className} { ${property}: ${responsive[bp]} !important; } }\n`;
    }
  }

  return css;
};

/**
 * Generates CSS for responsive background color
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateBackgroundColorCss = (
  className: string,
  responsive?: ResponsiveValue,
  fallback?: string
): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with fallback value (applies to all breakpoints)
  css += `.${className} { background-color: ${fallback}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from fallback)
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
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateBorderColorCss = (
  className: string,
  responsive?: ResponsiveValue,
  fallback?: string
): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with fallback value (applies to all breakpoints)
  css += `.${className} { border-color: ${fallback}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from fallback)
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
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
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

  // Generate base CSS rule with fallback values (applies to all breakpoints)
  const inset = position === "inset" ? "inset " : "";
  const baseBoxShadowValue = `${inset}${horizontalFallback}px ${verticalFallback}px ${blurFallback}px ${spreadFallback}px ${color}`;
  css += `.${className} { box-shadow: ${baseBoxShadowValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides
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

      const boxShadowValue = `${inset}${h}px ${v}px ${b}px ${s}px ${color}`;
      
      // Only generate media query if value differs from base
      if (boxShadowValue !== baseBoxShadowValue) {
        css += `${getMediaQuery(bp)} { .${className} { box-shadow: ${boxShadowValue} !important; } }\n`;
      }
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


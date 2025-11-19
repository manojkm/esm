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
 *
 * **CRITICAL PATTERN**: Desktop values are used as base, media queries only for mobile/tablet overrides
 * - Base CSS uses `responsive.desktop` value (if exists), otherwise uses fallback
 * - Media queries are generated ONLY for mobile/tablet when they differ from desktop/base
 * - Desktop is never included in media queries (it's already the base)
 *
 * See `app/builder/docs/RESPONSIVE_PATTERN_GUIDE.md` for detailed usage guide.
 */
export const generateResponsiveCss = (className: string, property: string, responsive?: ResponsiveValue, fallbackValue?: string | number, fallbackUnit: string = ""): string => {
  if (!responsive || fallbackValue === undefined) {
    // No responsive values or no fallback, return empty string (use inline style for base)
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const desktopUnit = (responsive.unit && responsive.unit.desktop) || fallbackUnit;
  const baseValue = desktopValue !== undefined && desktopValue !== null ? (typeof desktopValue === "number" ? `${desktopValue}${desktopUnit}` : desktopValue) : typeof fallbackValue === "number" ? `${fallbackValue}${desktopUnit}` : fallbackValue;
  css += `.${className} { ${property}: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      const unit = (responsive.unit && responsive.unit[bp]) || fallbackUnit;
      const cssValue = typeof value === "number" ? `${value}${unit}` : value;

      // Only generate media query if value differs from base (not just fallback)
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
  defaultUnit: string = "px",
): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop values from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopTop = (responsive.top as ResponsiveMap<number> | undefined)?.desktop;
  const desktopRight = (responsive.right as ResponsiveMap<number> | undefined)?.desktop;
  const desktopBottom = (responsive.bottom as ResponsiveMap<number> | undefined)?.desktop;
  const desktopLeft = (responsive.left as ResponsiveMap<number> | undefined)?.desktop;

  const baseTop = desktopTop ?? fallback.top ?? fallback.defaultValue;
  const baseRight = desktopRight ?? fallback.right ?? fallback.defaultValue;
  const baseBottom = desktopBottom ?? fallback.bottom ?? fallback.defaultValue;
  const baseLeft = desktopLeft ?? fallback.left ?? fallback.defaultValue;
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
      const differsFromBase = (hasTop && top !== baseTop) || (hasRight && right !== baseRight) || (hasBottom && bottom !== baseBottom) || (hasLeft && left !== baseLeft) || unit !== baseUnit;

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
  defaultUnit: string = "px",
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
  defaultUnit: string = "px",
): string => {
  return generateResponsiveFourSideCss(className, "margin", responsive, fallback, defaultUnit);
};

/**
 * Generates CSS for responsive flex-direction, justifyContent, alignItems, etc.
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateResponsiveFlexCss = (className: string, property: "flex-direction" | "justify-content" | "align-items" | "flex-wrap" | "align-content", responsive?: ResponsiveMap<string>, fallback?: string): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "string" ? desktopValue : fallback;
  css += `.${className} { ${property}: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null && responsive[bp] !== baseValue) {
      css += `${getMediaQuery(bp)} { .${className} { ${property}: ${responsive[bp]} !important; } }\n`;
    }
  }

  return css;
};

/**
 * Generates CSS for responsive background color
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateBackgroundColorCss = (className: string, responsive?: ResponsiveValue, fallback?: string): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "string" ? desktopValue : fallback;
  css += `.${className} { background-color: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== baseValue) {
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
export const generateBorderColorCss = (className: string, responsive?: ResponsiveValue, fallback?: string): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "string" ? desktopValue : fallback;
  css += `.${className} { border-color: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== baseValue) {
        css += `${getMediaQuery(bp)} { .${className} { border-color: ${value} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive hover background color
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 * This generates CSS for :hover pseudo-class
 */
export const generateHoverBackgroundColorCss = (className: string, responsive?: ResponsiveValue, fallback?: string): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "string" ? desktopValue : fallback;
  css += `.${className}:hover { background-color: ${baseValue} !important; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== baseValue) {
        css += `${getMediaQuery(bp)} { .${className}:hover { background-color: ${value} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive hover border color
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 * This generates CSS for :hover pseudo-class
 */
export const generateHoverBorderColorCss = (className: string, responsive?: ResponsiveValue, fallback?: string): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "string" ? desktopValue : fallback;
  css += `.${className}:hover { border-color: ${baseValue} !important; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== baseValue) {
        css += `${getMediaQuery(bp)} { .${className}:hover { border-color: ${value} !important; } }\n`;
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
export const generateBoxShadowCss = (className: string, horizontalResponsive?: ResponsiveValue, verticalResponsive?: ResponsiveValue, blurResponsive?: ResponsiveValue, spreadResponsive?: ResponsiveValue, horizontalFallback: number = 0, verticalFallback: number = 0, blurFallback: number = 0, spreadFallback: number = 0, color: string = "rgba(0, 0, 0, 0.1)", position: string = "outset"): string => {
  // Check if any responsive values exist
  const hasResponsive = horizontalResponsive || verticalResponsive || blurResponsive || spreadResponsive;

  if (!hasResponsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop values from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const inset = position === "inset" ? "inset " : "";
  const desktopHorizontal = (horizontalResponsive as ResponsiveMap<number> | undefined)?.desktop;
  const desktopVertical = (verticalResponsive as ResponsiveMap<number> | undefined)?.desktop;
  const desktopBlur = (blurResponsive as ResponsiveMap<number> | undefined)?.desktop;
  const desktopSpread = (spreadResponsive as ResponsiveMap<number> | undefined)?.desktop;

  const baseHorizontal = desktopHorizontal ?? horizontalFallback;
  const baseVertical = desktopVertical ?? verticalFallback;
  const baseBlur = desktopBlur ?? blurFallback;
  const baseSpread = desktopSpread ?? spreadFallback;

  const baseBoxShadowValue = `${inset}${baseHorizontal}px ${baseVertical}px ${baseBlur}px ${baseSpread}px ${color}`;
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
      const h = hasHorizontal ? hVal : baseHorizontal;
      const v = hasVertical ? vVal : baseVertical;
      const b = hasBlur ? bVal : baseBlur;
      const s = hasSpread ? sVal : baseSpread;

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
 * Generates CSS for responsive text color
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateTextColorCss = (className: string, responsive?: ResponsiveValue, fallback?: string): string => {
  if (!responsive || !fallback) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "string" ? desktopValue : fallback;
  css += `.${className} { color: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "string" && value !== baseValue) {
        css += `${getMediaQuery(bp)} { .${className} { color: ${value} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive link color
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 * This generates CSS for anchor tags within the component
 */
export const generateLinkColorCss = (className: string, linkColorResponsive?: ResponsiveValue, linkColor?: string, linkColorHoverResponsive?: ResponsiveValue, linkColorHover?: string): string => {
  let css = "";

  // Link color
  if (linkColorResponsive && linkColor) {
    const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

    // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
    // Desktop values are used as the base since they apply to all breakpoints by default
    const desktopLinkColor = linkColorResponsive.desktop;
    const baseLinkColor = desktopLinkColor !== undefined && desktopLinkColor !== null && typeof desktopLinkColor === "string" ? desktopLinkColor : linkColor;
    css += `.${className} a { color: ${baseLinkColor} !important; }\n`;

    // Generate media queries only for breakpoints that have explicit overrides (different from base)
    for (const bp of breakpoints) {
      if (linkColorResponsive[bp] !== undefined && linkColorResponsive[bp] !== null) {
        const value = linkColorResponsive[bp];
        if (typeof value === "string" && value !== baseLinkColor) {
          css += `${getMediaQuery(bp)} { .${className} a { color: ${value} !important; } }\n`;
        }
      }
    }
  }

  // Link hover color
  if (linkColorHoverResponsive && linkColorHover) {
    const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

    // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
    // Desktop values are used as the base since they apply to all breakpoints by default
    const desktopLinkColorHover = linkColorHoverResponsive.desktop;
    const baseLinkColorHover = desktopLinkColorHover !== undefined && desktopLinkColorHover !== null && typeof desktopLinkColorHover === "string" ? desktopLinkColorHover : linkColorHover;
    css += `.${className} a:hover { color: ${baseLinkColorHover} !important; }\n`;

    // Generate media queries only for breakpoints that have explicit overrides (different from base)
    for (const bp of breakpoints) {
      if (linkColorHoverResponsive[bp] !== undefined && linkColorHoverResponsive[bp] !== null) {
        const value = linkColorHoverResponsive[bp];
        if (typeof value === "string" && value !== baseLinkColorHover) {
          css += `${getMediaQuery(bp)} { .${className} a:hover { color: ${value} !important; } }\n`;
        }
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive position offsets (top, right, bottom, left)
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generatePositionCss = (className: string, positionTopResponsive?: ResponsiveValue, positionRightResponsive?: ResponsiveValue, positionBottomResponsive?: ResponsiveValue, positionLeftResponsive?: ResponsiveValue, positionTop?: number | null, positionRight?: number | null, positionBottom?: number | null, positionLeft?: number | null, positionTopUnit: string = "px", positionRightUnit: string = "px", positionBottomUnit: string = "px", positionLeftUnit: string = "px"): string => {
  // Check if any responsive values exist
  const hasResponsive = positionTopResponsive || positionRightResponsive || positionBottomResponsive || positionLeftResponsive;

  if (!hasResponsive) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop values from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopTop = (positionTopResponsive as ResponsiveMap<number> | undefined)?.desktop;
  const desktopRight = (positionRightResponsive as ResponsiveMap<number> | undefined)?.desktop;
  const desktopBottom = (positionBottomResponsive as ResponsiveMap<number> | undefined)?.desktop;
  const desktopLeft = (positionLeftResponsive as ResponsiveMap<number> | undefined)?.desktop;

  const desktopTopUnit = (positionTopResponsive?.unit as ResponsiveMap<string> | undefined)?.desktop || positionTopUnit;
  const desktopRightUnit = (positionRightResponsive?.unit as ResponsiveMap<string> | undefined)?.desktop || positionRightUnit;
  const desktopBottomUnit = (positionBottomResponsive?.unit as ResponsiveMap<string> | undefined)?.desktop || positionBottomUnit;
  const desktopLeftUnit = (positionLeftResponsive?.unit as ResponsiveMap<string> | undefined)?.desktop || positionLeftUnit;

  const baseTop = desktopTop !== undefined && desktopTop !== null ? `${desktopTop}${desktopTopUnit}` : positionTop !== null && positionTop !== undefined ? `${positionTop}${positionTopUnit}` : "auto";
  const baseRight = desktopRight !== undefined && desktopRight !== null ? `${desktopRight}${desktopRightUnit}` : positionRight !== null && positionRight !== undefined ? `${positionRight}${positionRightUnit}` : "auto";
  const baseBottom = desktopBottom !== undefined && desktopBottom !== null ? `${desktopBottom}${desktopBottomUnit}` : positionBottom !== null && positionBottom !== undefined ? `${positionBottom}${positionBottomUnit}` : "auto";
  const baseLeft = desktopLeft !== undefined && desktopLeft !== null ? `${desktopLeft}${desktopLeftUnit}` : positionLeft !== null && positionLeft !== undefined ? `${positionLeft}${positionLeftUnit}` : "auto";

  // Only generate base CSS if at least one position value is set
  if ((positionTop !== null && positionTop !== undefined) || (desktopTop !== undefined && desktopTop !== null)) {
    css += `.${className} { top: ${baseTop}; }\n`;
  }
  if ((positionRight !== null && positionRight !== undefined) || (desktopRight !== undefined && desktopRight !== null)) {
    css += `.${className} { right: ${baseRight}; }\n`;
  }
  if ((positionBottom !== null && positionBottom !== undefined) || (desktopBottom !== undefined && desktopBottom !== null)) {
    css += `.${className} { bottom: ${baseBottom}; }\n`;
  }
  if ((positionLeft !== null && positionLeft !== undefined) || (desktopLeft !== undefined && desktopLeft !== null)) {
    css += `.${className} { left: ${baseLeft}; }\n`;
  }

  // Generate media queries only for breakpoints that have explicit overrides
  for (const bp of breakpoints) {
    const topVal = (positionTopResponsive as ResponsiveMap<number> | undefined)?.[bp];
    const rightVal = (positionRightResponsive as ResponsiveMap<number> | undefined)?.[bp];
    const bottomVal = (positionBottomResponsive as ResponsiveMap<number> | undefined)?.[bp];
    const leftVal = (positionLeftResponsive as ResponsiveMap<number> | undefined)?.[bp];

    const topUnit = (positionTopResponsive?.unit as ResponsiveMap<string> | undefined)?.[bp] || positionTopUnit;
    const rightUnit = (positionRightResponsive?.unit as ResponsiveMap<string> | undefined)?.[bp] || positionRightUnit;
    const bottomUnit = (positionBottomResponsive?.unit as ResponsiveMap<string> | undefined)?.[bp] || positionBottomUnit;
    const leftUnit = (positionLeftResponsive?.unit as ResponsiveMap<string> | undefined)?.[bp] || positionLeftUnit;

    // Check if this breakpoint has any custom values
    const hasTop = topVal !== undefined && topVal !== null;
    const hasRight = rightVal !== undefined && rightVal !== null;
    const hasBottom = bottomVal !== undefined && bottomVal !== null;
    const hasLeft = leftVal !== undefined && leftVal !== null;

    // Only generate media query if there are custom values that differ from base
    if (hasTop || hasRight || hasBottom || hasLeft) {
      const top = hasTop ? `${topVal}${topUnit}` : baseTop;
      const right = hasRight ? `${rightVal}${rightUnit}` : baseRight;
      const bottom = hasBottom ? `${bottomVal}${bottomUnit}` : baseBottom;
      const left = hasLeft ? `${leftVal}${leftUnit}` : baseLeft;

      // Check if any value differs from base
      const differsFromBase = (hasTop && top !== baseTop) || (hasRight && right !== baseRight) || (hasBottom && bottom !== baseBottom) || (hasLeft && left !== baseLeft);

      if (differsFromBase) {
        let positionCss = "";
        if (hasTop && top !== baseTop) positionCss += `top: ${top}; `;
        if (hasRight && right !== baseRight) positionCss += `right: ${right}; `;
        if (hasBottom && bottom !== baseBottom) positionCss += `bottom: ${bottom}; `;
        if (hasLeft && left !== baseLeft) positionCss += `left: ${left}; `;

        if (positionCss) {
          css += `${getMediaQuery(bp)} { .${className} { ${positionCss.trim()} !important; } }\n`;
        }
      }
    }
  }

  return css;
};

/**
 * Generates CSS for responsive z-index
 * Pattern: Base value applies to all breakpoints, media queries only for overrides
 */
export const generateZIndexCss = (className: string, responsive?: ResponsiveValue, fallback?: number | null): string => {
  if (!responsive || fallback === null || fallback === undefined) {
    return "";
  }

  let css = "";
  const breakpoints: BreakpointKey[] = ["mobile", "tablet", "desktop"];

  // Generate base CSS rule with desktop value from responsive (if exists), otherwise use fallback
  // Desktop values are used as the base since they apply to all breakpoints by default
  const desktopValue = responsive.desktop;
  const baseValue = desktopValue !== undefined && desktopValue !== null && typeof desktopValue === "number" ? desktopValue : fallback;
  css += `.${className} { z-index: ${baseValue}; }\n`;

  // Generate media queries only for breakpoints that have explicit overrides (different from base)
  for (const bp of breakpoints) {
    if (responsive[bp] !== undefined && responsive[bp] !== null) {
      const value = responsive[bp];
      if (typeof value === "number" && value !== baseValue) {
        css += `${getMediaQuery(bp)} { .${className} { z-index: ${value} !important; } }\n`;
      }
    }
  }

  return css;
};

/**
 * Generates base inline styles (non-responsive) that can be applied directly
 * Returns an object with CSS properties and their values
 */
export const generateBaseStyles = (values: Record<string, string | number | undefined | null>): Record<string, string> => {
  const styles: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null) {
      styles[key] = String(value);
    }
  }
  return styles;
};

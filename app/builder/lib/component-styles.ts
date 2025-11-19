/**
 * Reusable utilities for component style generation following the Text component pattern.
 * 
 * Pattern:
 * - Edit mode: Apply styles as inline styles to the element for immediate visual feedback
 * - Preview mode: Generate CSS targeting wrapper div (for layout styles) and child element (for typography)
 * - Use unique component class name per instance (component-{nodeId})
 */

import type { CSSProperties } from "react";
import type { ResponsiveResolver } from "./style-system/types";

export interface ComponentStyleOptions {
  /** Unique node ID from useNode() */
  nodeId: string;
  /** Optional CSS ID prop */
  cssId?: string;
  /** Component name prefix (e.g., "text", "button") */
  componentName: string;
  /** Whether we're in edit mode */
  isEditMode: boolean;
}

export interface LayoutStyleProps {
  /** Layout styles that should be applied to wrapper div in preview mode */
  padding?: string | null;
  margin?: string | null;
  background?: CSSProperties;
  border?: CSSProperties;
  boxShadow?: string | null;
  position?: CSSProperties["position"];
  positionOffsets?: {
    top?: string | null;
    right?: string | null;
    bottom?: string | null;
    left?: string | null;
  };
  zIndex?: number | null;
}

export interface TypographyStyleProps {
  /** Typography styles that should be applied to child element in preview mode */
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  letterSpacing?: string;
  lineHeight?: string;
  color?: string;
}

/**
 * Generate unique component class name for CSS isolation
 * Format: {componentName}-{cssId || nodeId}
 */
export const generateComponentClassName = (nodeId: string, cssId: string | undefined, componentName: string): string => {
  return `${componentName}-${cssId || nodeId}`;
};

/**
 * Build inline styles for edit mode
 * Layout styles (padding, margin, background, border, box-shadow) are applied directly
 * Typography styles are applied directly
 */
export const buildEditModeStyles = <T extends Record<string, unknown>>(
  layoutStyles: LayoutStyleProps,
  typographyStyles: TypographyStyleProps,
  additionalStyles?: T
): CSSProperties => {
  return {
    // Layout styles
    padding: layoutStyles.padding || undefined,
    margin: layoutStyles.margin || undefined,
    ...layoutStyles.background,
    ...layoutStyles.border,
    boxShadow: layoutStyles.boxShadow || undefined,
    position: layoutStyles.position,
    top: layoutStyles.positionOffsets?.top || undefined,
    right: layoutStyles.positionOffsets?.right || undefined,
    bottom: layoutStyles.positionOffsets?.bottom || undefined,
    left: layoutStyles.positionOffsets?.left || undefined,
    zIndex: layoutStyles.zIndex || undefined,
    // Typography styles
    fontFamily: typographyStyles.fontFamily,
    fontSize: typographyStyles.fontSize,
    fontWeight: typographyStyles.fontWeight,
    fontStyle: typographyStyles.fontStyle as CSSProperties["fontStyle"],
    textAlign: typographyStyles.textAlign as CSSProperties["textAlign"],
    textTransform: typographyStyles.textTransform as CSSProperties["textTransform"],
    textDecoration: typographyStyles.textDecoration as CSSProperties["textDecoration"],
    letterSpacing: typographyStyles.letterSpacing,
    lineHeight: typographyStyles.lineHeight,
    color: typographyStyles.color,
    // Additional styles
    ...additionalStyles,
  };
};

/**
 * Build CSS selector for wrapper div (layout styles)
 * Use: `.${componentClassName} { ... }`
 */
export const getWrapperSelector = (componentClassName: string): string => {
  return `.${componentClassName}`;
};

/**
 * Build CSS selector for content element (typography styles)
 * Use: `.${componentClassName} .${componentName}-content { ... }`
 * Pattern: Each component has a content class (e.g., `.text-content`, `.container-content`)
 * This ensures styles only target actual content, not editor UI elements
 */
export const getContentSelector = (componentClassName: string, componentName: string): string => {
  return `.${componentClassName} .${componentName}-content`;
};

/**
 * @deprecated Use getContentSelector instead. This is kept for backward compatibility.
 * Build CSS selector for child element (typography styles)
 * Use: `.${componentClassName} > * { ... }`
 */
export const getChildSelector = (componentClassName: string): string => {
  return `.${componentClassName} > *`;
};

/**
 * Build CSS selector for hover states on wrapper
 * Use: `.${componentClassName}:hover { ... }`
 */
export const getWrapperHoverSelector = (componentClassName: string): string => {
  return `.${componentClassName}:hover`;
};

/**
 * Build CSS selector for hover states on content element
 * Use: `.${componentClassName}:hover .${componentName}-content { ... }`
 */
export const getContentHoverSelector = (componentClassName: string, componentName: string): string => {
  return `.${componentClassName}:hover .${componentName}-content`;
};

/**
 * @deprecated Use getContentHoverSelector instead. This is kept for backward compatibility.
 * Build CSS selector for hover states on child element
 * Use: `.${componentClassName}:hover > * { ... }`
 */
export const getChildHoverSelector = (componentClassName: string): string => {
  return `.${componentClassName}:hover > *`;
};

/**
 * Hook to generate component class name and check edit mode
 * Simplifies the pattern for future components
 */
export const useComponentStyles = (componentName: string, cssId?: string) => {
  // This hook should be used within a component that has access to useNode()
  // For now, it's a utility function - components should call useNode() themselves
  return {
    /**
     * Generate component class name
     * Call this with nodeId from useNode(): generateComponentClassName(nodeId, cssId, componentName)
     */
    generateClassName: (nodeId: string) => generateComponentClassName(nodeId, cssId, componentName),
    getWrapperSelector: (componentClassName: string) => getWrapperSelector(componentClassName),
    getContentSelector: (componentClassName: string) => getContentSelector(componentClassName, componentName),
    getWrapperHoverSelector: (componentClassName: string) => getWrapperHoverSelector(componentClassName),
    getContentHoverSelector: (componentClassName: string) => getContentHoverSelector(componentClassName, componentName),
    // Deprecated - kept for backward compatibility
    getChildSelector: (componentClassName: string) => getChildSelector(componentClassName),
    getChildHoverSelector: (componentClassName: string) => getChildHoverSelector(componentClassName),
  };
};

/**
 * Component style generation pattern guide
 * 
 * @example
 * ```typescript
 * // 1. Generate unique class name
 * const componentClassName = generateComponentClassName(nodeId, cssId, "button");
 * 
 * // 2. Generate CSS for preview mode
 * let responsiveCss = "";
 * if (!isEditMode) {
 *   // Layout styles → wrapper div
 *   responsiveCss += `${getWrapperSelector(componentClassName)} { padding: 10px; }\n`;
 *   // Typography styles → child element
 *   responsiveCss += `${getChildSelector(componentClassName)} { color: #000; }\n`;
 * }
 * 
 * // 3. Build inline styles for edit mode
 * const elementStyle = isEditMode 
 *   ? buildEditModeStyles(
 *       { padding: "10px", margin: "0", background: {...}, border: {...} },
 *       { color: "#000", fontSize: "16px" }
 *     )
 *   : {}; // No inline styles in preview mode
 * 
 * // 4. Render with wrapper in preview mode
 * return (
 *   <>
 *     <style>{responsiveCss}</style>
 *     {isEditMode ? (
 *       <button style={elementStyle}>Content</button>
 *     ) : (
 *       <div className={componentClassName}>
 *         <button style={elementStyle}>Content</button>
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 */
export const COMPONENT_STYLE_PATTERN = {
  /**
   * Pattern Summary:
   * 
   * 1. **Unique Class Names**: Use `generateComponentClassName()` to create unique CSS classes per instance
   * 
   * 2. **Edit Mode**: Apply all styles as inline styles directly to the element
   *    - Use `buildEditModeStyles()` helper or manually build CSSProperties
   *    - Styles apply immediately for visual feedback
   * 
 * 3. **Preview Mode**: Generate CSS targeting:
 *    - Wrapper div (`.${componentClassName}`) for: padding, margin, background, border, box-shadow, position, z-index
 *    - Content class (`.${componentClassName} .${componentName}-content`) for: typography (font, color, text-align, etc.)
 *    - Pattern: Each component uses a content class (e.g., `.text-content`, `.container-content`) to scope styles
   * 
   * 4. **Responsive Pattern**: 
   *    - Desktop values are used as base CSS (if set in responsive object)
   *    - Media queries only generated for mobile/tablet when they differ from desktop
   *    - ALWAYS use functions from `css-responsive.ts` for generation (they handle pattern automatically)
   *    - NEVER manually build responsive CSS - use the provided functions
   *    - See `RESPONSIVE_PATTERN_GUIDE.md` for detailed guide
   * 
   * 5. **Wrapper Structure**:
   *    - Edit mode: No wrapper needed (inline styles)
   *    - Preview mode: Wrap content in `<div className={componentClassName}>` for CSS targeting
   * 
 * 6. **Style Separation**:
 *    - Layout styles (spacing, background, border, shadow) → wrapper div
 *    - Typography styles (font, color, text) → content class (e.g., `.text-content`, `.container-content`)
 *    - This prevents style conflicts and ensures proper CSS isolation
 *    - Content classes ensure styles only target actual content, not editor UI elements
   * 
   * 7. **No Duplication**:
   *    - Layout styles (padding, margin, background, border, box-shadow) should NOT be applied as inline styles in preview mode
   *    - Only apply them conditionally: `...(isEditMode ? layoutStyles : {})`
   */
} as const;


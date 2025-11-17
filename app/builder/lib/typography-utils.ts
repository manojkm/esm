import type { GlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";

/**
 * Gets typography CSS for a given element type and breakpoint
 * This can be used by components to apply global typography defaults
 */
export const getTypographyCSS = (
  settings: GlobalSettings,
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body",
  breakpoint: "desktop" | "tablet" | "mobile" = "desktop"
): React.CSSProperties => {
  const typo = settings.typography;
  const isHeading = element !== "body";
  const type = isHeading ? "headings" : "body";

  const styles: React.CSSProperties = {};

  // Font family
  if (typo.fontFamily?.[type]) {
    styles.fontFamily = typo.fontFamily[type];
  }

  // Font size
  const fontSize = typo.fontSize?.[breakpoint]?.[element];
  if (fontSize !== undefined) {
    styles.fontSize = `${fontSize}px`;
  }

  // Line height
  if (typo.lineHeight?.[type] !== undefined) {
    styles.lineHeight = typo.lineHeight[type];
  }

  // Letter spacing
  if (typo.letterSpacing?.[type] !== undefined) {
    styles.letterSpacing = `${typo.letterSpacing[type]}px`;
  }

  return styles;
};

/**
 * Gets typography CSS string for export (for use in CSS generation)
 */
export const getTypographyCSSString = (
  settings: GlobalSettings,
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body",
  breakpoint: "desktop" | "tablet" | "mobile" = "desktop"
): string => {
  const typo = settings.typography;
  const isHeading = element !== "body";
  const type = isHeading ? "headings" : "body";

  const rules: string[] = [];

  // Font family
  if (typo.fontFamily?.[type]) {
    rules.push(`font-family: ${typo.fontFamily[type]}`);
  }

  // Font size
  const fontSize = typo.fontSize?.[breakpoint]?.[element];
  if (fontSize !== undefined) {
    rules.push(`font-size: ${fontSize}px`);
  }

  // Line height
  if (typo.lineHeight?.[type] !== undefined) {
    rules.push(`line-height: ${typo.lineHeight[type]}`);
  }

  // Letter spacing
  if (typo.letterSpacing?.[type] !== undefined) {
    rules.push(`letter-spacing: ${typo.letterSpacing[type]}px`);
  }

  return rules.join("; ");
};


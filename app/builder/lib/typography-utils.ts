import type { GlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { getGoogleFontFamilyCSS } from "./google-fonts";

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

  // Font family - prioritize Google Fonts, fallback to fontFamily
  const googleFont = isHeading ? typo.googleFonts?.headings : typo.googleFonts?.body;
  const fallbackFont = typo.fontFamily?.[type] || "sans-serif";
  
  if (googleFont) {
    styles.fontFamily = getGoogleFontFamilyCSS(googleFont, fallbackFont);
  } else if (typo.fontFamily?.[type]) {
    styles.fontFamily = typo.fontFamily[type];
  }

  // Font size
  const fontSize = typo.fontSize?.[breakpoint]?.[element];
  if (fontSize !== undefined) {
    styles.fontSize = `${fontSize}px`;
  }

  // Font weight
  if (typo.fontWeight?.[type] !== undefined) {
    styles.fontWeight = typo.fontWeight[type];
  }

  // Font style
  if (typo.fontStyle?.[type]) {
    styles.fontStyle = typo.fontStyle[type];
  }

  // Text color
  if (typo.textColor?.[type]) {
    styles.color = typo.textColor[type];
  }

  // Line height
  if (typo.lineHeight?.[type] !== undefined) {
    styles.lineHeight = typo.lineHeight[type];
  }

  // Letter spacing
  if (typo.letterSpacing?.[type] !== undefined) {
    styles.letterSpacing = `${typo.letterSpacing[type]}px`;
  }

  // Paragraph spacing (only for body/paragraphs)
  if (element === "body" && typo.paragraphSpacing?.[breakpoint] !== undefined) {
    styles.marginBottom = `${typo.paragraphSpacing[breakpoint]}px`;
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

  // Font family - prioritize Google Fonts, fallback to fontFamily
  const googleFont = isHeading ? typo.googleFonts?.headings : typo.googleFonts?.body;
  const fallbackFont = typo.fontFamily?.[type] || "sans-serif";
  
  if (googleFont) {
    rules.push(`font-family: ${getGoogleFontFamilyCSS(googleFont, fallbackFont)}`);
  } else if (typo.fontFamily?.[type]) {
    rules.push(`font-family: ${typo.fontFamily[type]}`);
  }

  // Font size
  const fontSize = typo.fontSize?.[breakpoint]?.[element];
  if (fontSize !== undefined) {
    rules.push(`font-size: ${fontSize}px`);
  }

  // Font weight
  if (typo.fontWeight?.[type] !== undefined) {
    rules.push(`font-weight: ${typo.fontWeight[type]}`);
  }

  // Font style
  if (typo.fontStyle?.[type]) {
    rules.push(`font-style: ${typo.fontStyle[type]}`);
  }

  // Text color
  if (typo.textColor?.[type]) {
    rules.push(`color: ${typo.textColor[type]}`);
  }

  // Line height
  if (typo.lineHeight?.[type] !== undefined) {
    rules.push(`line-height: ${typo.lineHeight[type]}`);
  }

  // Letter spacing
  if (typo.letterSpacing?.[type] !== undefined) {
    rules.push(`letter-spacing: ${typo.letterSpacing[type]}px`);
  }

  // Paragraph spacing (only for body/paragraphs)
  if (element === "body" && typo.paragraphSpacing?.[breakpoint] !== undefined) {
    rules.push(`margin-bottom: ${typo.paragraphSpacing[breakpoint]}px`);
  }

  return rules.join("; ");
};


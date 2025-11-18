import type { GoogleFont } from "@/app/builder/contexts/GlobalSettingsContext";

/**
 * Popular Google Fonts list for quick selection
 */
export const POPULAR_GOOGLE_FONTS = [
  { family: "Roboto", weights: ["300", "400", "500", "700"], styles: ["normal", "italic"] },
  { family: "Open Sans", weights: ["300", "400", "600", "700"], styles: ["normal", "italic"] },
  { family: "Lato", weights: ["300", "400", "700"], styles: ["normal", "italic"] },
  { family: "Montserrat", weights: ["300", "400", "500", "600", "700"], styles: ["normal", "italic"] },
  { family: "Oswald", weights: ["300", "400", "500", "600", "700"], styles: ["normal"] },
  { family: "Source Sans Pro", weights: ["300", "400", "600", "700"], styles: ["normal", "italic"] },
  { family: "Raleway", weights: ["300", "400", "500", "600", "700"], styles: ["normal", "italic"] },
  { family: "PT Sans", weights: ["400", "700"], styles: ["normal", "italic"] },
  { family: "Merriweather", weights: ["300", "400", "700"], styles: ["normal", "italic"] },
  { family: "Playfair Display", weights: ["400", "700"], styles: ["normal", "italic"] },
  { family: "Lora", weights: ["400", "700"], styles: ["normal", "italic"] },
  { family: "Poppins", weights: ["300", "400", "500", "600", "700"], styles: ["normal", "italic"] },
  { family: "Nunito", weights: ["300", "400", "600", "700"], styles: ["normal", "italic"] },
  { family: "Inter", weights: ["300", "400", "500", "600", "700"], styles: ["normal"] },
  { family: "Ubuntu", weights: ["300", "400", "500", "700"], styles: ["normal", "italic"] },
];

/**
 * Generates Google Fonts URL for loading fonts
 */
export const generateGoogleFontsURL = (fonts: { headings?: GoogleFont; body?: GoogleFont }): string => {
  const fontFamilies: string[] = [];
  
  if (fonts.headings?.family) {
    const weights = fonts.headings.weights?.join(",") || "400";
    const styles = fonts.headings.styles?.includes("italic") ? "0,1" : "0";
    fontFamilies.push(`${fonts.headings.family.replace(/\s+/g, "+")}:wght@${weights}${styles !== "0" ? `:ital@${styles}` : ""}`);
  }
  
  if (fonts.body?.family && fonts.body.family !== fonts.headings?.family) {
    const weights = fonts.body.weights?.join(",") || "400";
    const styles = fonts.body.styles?.includes("italic") ? "0,1" : "0";
    fontFamilies.push(`${fonts.body.family.replace(/\s+/g, "+")}:wght@${weights}${styles !== "0" ? `:ital@${styles}` : ""}`);
  }
  
  if (fontFamilies.length === 0) {
    return "";
  }
  
  return `https://fonts.googleapis.com/css2?${fontFamilies.join("&")}&display=swap`;
};

/**
 * Generates Google Fonts link tag HTML
 */
export const generateGoogleFontsLinkTag = (fonts: { headings?: GoogleFont; body?: GoogleFont }): string => {
  const url = generateGoogleFontsURL(fonts);
  if (!url) {
    return "";
  }
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${url}" rel="stylesheet">`;
};

/**
 * Gets the CSS font-family value for a Google Font
 */
export const getGoogleFontFamilyCSS = (font: GoogleFont | undefined, fallback: string = "sans-serif"): string => {
  if (!font?.family) {
    return fallback;
  }
  return `"${font.family}", ${fallback}`;
};

/**
 * Loads Google Fonts dynamically in the browser
 */
export const loadGoogleFonts = (fonts: { headings?: GoogleFont; body?: GoogleFont }): void => {
  if (typeof window === "undefined") {
    return;
  }
  
  const url = generateGoogleFontsURL(fonts);
  if (!url) {
    return;
  }
  
  // Check if link already exists
  const existingLink = document.querySelector(`link[href*="fonts.googleapis.com"]`);
  if (existingLink) {
    existingLink.setAttribute("href", url);
    return;
  }
  
  // Create and add preconnect links
  const preconnect1 = document.createElement("link");
  preconnect1.rel = "preconnect";
  preconnect1.href = "https://fonts.googleapis.com";
  document.head.appendChild(preconnect1);
  
  const preconnect2 = document.createElement("link");
  preconnect2.rel = "preconnect";
  preconnect2.href = "https://fonts.gstatic.com";
  preconnect2.crossOrigin = "anonymous";
  document.head.appendChild(preconnect2);
  
  // Create and add font stylesheet
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
};


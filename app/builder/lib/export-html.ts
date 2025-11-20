import type { Editor } from "@craftjs/core";
import { generateGoogleFontsLinkTag } from "./google-fonts";
import { sanitizeHTMLForExport } from "./html-sanitizer";

/**
 * Extracts all CSS styles from style tags in the rendered HTML
 */
const extractStylesFromHTML = (html: string): string => {
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const styles: string[] = [];
  let match;

  while ((match = styleRegex.exec(html)) !== null) {
    if (match[1]) {
      styles.push(match[1].trim());
    }
  }

  return styles.join("\n");
};

/**
 * Removes style tags from HTML (styles are extracted separately)
 */
const removeStyleTags = (html: string): string => {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
};

/**
 * Extracts and consolidates all CSS from the document
 */
const consolidateStyles = (html: string): string => {
  const styles = extractStylesFromHTML(html);
  
  // Remove duplicate styles (basic deduplication)
  const styleLines = styles.split("\n");
  const uniqueStyles = new Set<string>();
  
  for (const line of styleLines) {
    const trimmed = line.trim();
    if (trimmed && !uniqueStyles.has(trimmed)) {
      uniqueStyles.add(trimmed);
    }
  }

  return Array.from(uniqueStyles).join("\n");
};

/**
 * Extracts images and converts them to base64 or keeps their URLs
 */
const processImages = (html: string): { html: string; images: Map<string, string> } => {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const images = new Map<string, string>();
  let match;
  let imageIndex = 0;

  // Find all image sources
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src && !src.startsWith("data:") && !images.has(src)) {
      // Keep external URLs as-is for now
      // In a full implementation, you might want to download and convert to base64
      images.set(src, src);
    }
  }

  return { html, images };
};

/**
 * Generates a complete HTML document from Craft.js editor state
 * This exports pure HTML/CSS without any JavaScript for eBay compatibility
 */
export const exportToHTML = async (query: ReturnType<Editor["query"]>): Promise<string> => {
  try {
    // Get the serialized state and render it to HTML
    const serialized = query.serialize();
    
    // Render the React tree to static HTML
    // Note: This is a simplified version. In production, you might need to use ReactDOMServer
    // or traverse the node tree directly to generate HTML
    
    // For now, we'll generate HTML by getting the current HTML from the editor's DOM
    // This requires access to the DOM, so we'll need to pass the rendered HTML
    
    // This is a placeholder - in actual implementation, you'd render the components
    // and extract their HTML/CSS
    
    return "";
  } catch (error) {
    console.error("Error exporting to HTML:", error);
    throw error;
  }
};

/**
 * Generates HTML from the rendered DOM (client-side)
 * This extracts the actual HTML and CSS from the browser
 * @param customCSS - Optional custom CSS to include in the export
 */
export const exportRenderedHTML = (customCSS: string = ""): string => {
  // Find the Frame element (the actual content)
  // Craft.js uses a Frame component that renders with data-craftjs="frame"
  let frame = document.querySelector('[data-craftjs="frame"]') as HTMLElement;
  
  // If not found, try to find by class or other identifiers
  if (!frame) {
    // Try to find the canvas area or editor container
    const canvasArea = document.querySelector('.flex-1.overflow-auto, [class*="canvas"]');
    if (canvasArea) {
      frame = canvasArea.querySelector('[data-craftjs="frame"]') as HTMLElement;
    }
  }
  
  if (!frame) {
    throw new Error("Craft.js Frame not found. Make sure you're exporting from the builder page.");
  }

  // Clone the frame to avoid modifying the original
  const clonedFrame = frame.cloneNode(true) as HTMLElement;

  // Extract all styles from style tags within the frame and its children
  const allStyles = new Set<string>();
  
  // Get all style tags in the frame and its descendants
  const styleTags = clonedFrame.querySelectorAll("style");
  styleTags.forEach((styleTag) => {
    const css = styleTag.textContent || styleTag.innerHTML;
    if (css && css.trim()) {
      allStyles.add(css.trim());
    }
    // Remove the style tag from cloned content (we'll add it to head)
    styleTag.remove();
  });

  // Also check for styles in the document (might be outside the frame)
  const documentStyleTags = document.querySelectorAll("style");
  documentStyleTags.forEach((styleTag) => {
    // Only include styles that are related to our components
    const css = styleTag.textContent || styleTag.innerHTML;
    if (css && css.trim()) {
      // Check if the style contains container-hover or other component classes
      if (css.includes("container-hover") || css.includes("container-content")) {
        allStyles.add(css.trim());
      }
    }
  });

  // Get the HTML content
  let htmlContent = clonedFrame.innerHTML;

  // Remove Craft.js editor-specific attributes and classes
  // These are only needed for the editor, not for exported HTML
  htmlContent = htmlContent.replace(/\s*data-craftjs[^=]*="[^"]*"/gi, "");
  htmlContent = htmlContent.replace(/\s*data-cy="[^"]*"/gi, "");
  htmlContent = htmlContent.replace(/\s*ring-[^"]*/gi, "");
  htmlContent = htmlContent.replace(/\s*ring-offset-[^"]*/gi, "");
  htmlContent = htmlContent.replace(/\s*hover:ring-[^"]*/gi, "");
  
  // Remove helper borders and editor-specific styling
  htmlContent = htmlContent.replace(/\s*border.*dashed.*gray-300/gi, "");
  
  // Remove editor tooltips and helper text
  const helperTextRegex = /<div[^>]*>Drop components here<\/div>/gi;
  htmlContent = htmlContent.replace(helperTextRegex, "");
  
  // Remove Lexical editor classes
  htmlContent = htmlContent.replace(/\s*class="editor-[^"]*"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="outline-none"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="text-gray-400"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="pointer-events-none select-none"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="text-default-hover"/gi, ""); // Remove editor-only class
  htmlContent = htmlContent.replace(/\s*class=""/gi, "");
  
  // Remove unnecessary wrapper divs (relative, text-default-hover)
  htmlContent = htmlContent.replace(/<div[^>]*class="[^"]*relative[^"]*"[^>]*>/gi, "");
  htmlContent = htmlContent.replace(/<div[^>]*class="[^"]*text-default-hover[^"]*"[^>]*>/gi, "");
  htmlContent = htmlContent.replace(/<\/div>\s*<\/div>/gi, "</div>");
  
  // Remove draggable attributes
  htmlContent = htmlContent.replace(/\s*draggable="false"/gi, "");
  
  // Remove white-space pre-wrap styles
  htmlContent = htmlContent.replace(/\s*style="white-space:\s*pre-wrap;?"/gi, "");
  htmlContent = htmlContent.replace(/\s*style=""/gi, "");
  
  // Remove empty spans
  htmlContent = htmlContent.replace(/<span[^>]*>\s*<\/span>/gi, "");
  
  // Remove redundant formatting tags: <b><strong> -> <strong>, <i><em> -> <em>
  // Handle both orders: <b><strong> and <strong><b>
  htmlContent = htmlContent.replace(/<b[^>]*>(<strong[^>]*>.*?<\/strong>)<\/b>/gi, "$1");
  htmlContent = htmlContent.replace(/<strong[^>]*>(<b[^>]*>.*?<\/b>)<\/strong>/gi, "$1");
  htmlContent = htmlContent.replace(/<i[^>]*>(<em[^>]*>.*?<\/em>)<\/i>/gi, "$1");
  htmlContent = htmlContent.replace(/<em[^>]*>(<i[^>]*>.*?<\/i>)<\/em>/gi, "$1");
  
  // Fix nested <p> tags - unwrap inner <p> if outer is also <p>
  htmlContent = htmlContent.replace(/<p([^>]*)><p([^>]*)>(.*?)<\/p><\/p>/gi, "<p$1>$3</p>");
  
  // Fix invalid nesting: unwrap <p> tags inside heading tags (h1-h6)
  htmlContent = htmlContent.replace(/<(h[1-6])([^>]*)><p([^>]*)>(.*?)<\/p><\/\1>/gi, "<$1$2>$4</$1>");
  
  // Fix invalid nesting: unwrap <p> tags inside span tags
  htmlContent = htmlContent.replace(/<span([^>]*)><p([^>]*)>(.*?)<\/p><\/span>/gi, "<span$1>$3</span>");
  
  // Remove unnecessary <span> wrappers that only contain text (no meaningful attributes)
  // This handles cases like <span>text</span> -> text
  // But preserves spans with style attributes like <span style="color: red;">text</span>
  htmlContent = htmlContent.replace(/<span(?![^>]*\s(style|class|id|data-|aria-)[^>]*)>(.*?)<\/span>/gi, "$2");
  
  // Remove spans that only have empty class attribute or no meaningful attributes
  htmlContent = htmlContent.replace(/<span[^>]*class="[^"]*"[^>]*>(.*?)<\/span>/gi, (match, content) => {
    // Check if span has style, id, data-*, or aria- attributes
    const hasMeaningfulAttrs = match.match(/\s(style|id|data-|aria-)/i);
    // If no meaningful attributes, unwrap the span
    return hasMeaningfulAttrs ? match : content;
  });

  // CRITICAL SECURITY: Sanitize HTML before export to prevent XSS attacks
  const sanitizedHTML = sanitizeHTMLForExport(htmlContent);
  
  // Process images
  const { html: processedHTML, images } = processImages(sanitizedHTML);

  // Consolidate all styles
  const consolidatedStyles = Array.from(allStyles).join("\n\n");

  // Add default list styles for eBay compatibility (since editor classes are removed)
  const defaultListStyles = `
/* Default list styles for eBay compatibility */
ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.5em 0;
}
ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.5em 0;
}
li {
  margin: 0.25em 0;
}
`;

  // Combine component styles with custom CSS
  const allCSS = [defaultListStyles, consolidatedStyles, customCSS].filter(Boolean).join("\n\n");

  // Generate the complete HTML document
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eBay Template</title>
    <style>
/* eBay Template Styles - No JavaScript Required */
${allCSS}
    </style>
</head>
<body>
    ${processedHTML}
</body>
</html>`;

  return fullHTML;
};

/**
 * Generates HTML with Google Fonts included
 * @param customCSS - Optional custom CSS to include in the export
 * @param googleFonts - Optional Google Fonts configuration
 */
export const exportRenderedHTMLWithFonts = (customCSS: string = "", googleFonts?: { headings?: { family: string; weights?: string[]; styles?: string[] }; body?: { family: string; weights?: string[]; styles?: string[] } }): string => {
  // Find the Frame element (the actual content)
  let frame = document.querySelector('[data-craftjs="frame"]') as HTMLElement;
  
  if (!frame) {
    const canvasArea = document.querySelector('.flex-1.overflow-auto, [class*="canvas"]');
    if (canvasArea) {
      frame = canvasArea.querySelector('[data-craftjs="frame"]') as HTMLElement;
    }
  }
  
  if (!frame) {
    throw new Error("Craft.js Frame not found. Make sure you're exporting from the builder page.");
  }

  const clonedFrame = frame.cloneNode(true) as HTMLElement;
  const allStyles = new Set<string>();
  
  const styleTags = clonedFrame.querySelectorAll("style");
  styleTags.forEach((styleTag) => {
    const css = styleTag.textContent || styleTag.innerHTML;
    if (css && css.trim()) {
      allStyles.add(css.trim());
    }
    styleTag.remove();
  });

  const documentStyleTags = document.querySelectorAll("style");
  documentStyleTags.forEach((styleTag) => {
    const css = styleTag.textContent || styleTag.innerHTML;
    if (css && css.trim()) {
      if (css.includes("container-hover") || css.includes("container-content")) {
        allStyles.add(css.trim());
      }
    }
  });

  let htmlContent = clonedFrame.innerHTML;
  
  // CRITICAL SECURITY: Sanitize HTML before export to prevent XSS attacks
  htmlContent = sanitizeHTMLForExport(htmlContent);
  
  htmlContent = htmlContent.replace(/\s*data-craftjs[^=]*="[^"]*"/gi, "");
  htmlContent = htmlContent.replace(/\s*data-cy="[^"]*"/gi, "");
  htmlContent = htmlContent.replace(/\s*ring-[^"]*/gi, "");
  htmlContent = htmlContent.replace(/\s*ring-offset-[^"]*/gi, "");
  htmlContent = htmlContent.replace(/\s*hover:ring-[^"]*/gi, "");
  htmlContent = htmlContent.replace(/\s*border.*dashed.*gray-300/gi, "");
  
  const helperTextRegex = /<div[^>]*>Drop components here<\/div>/gi;
  htmlContent = htmlContent.replace(helperTextRegex, "");
  
  // Remove Lexical editor classes
  htmlContent = htmlContent.replace(/\s*class="editor-[^"]*"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="outline-none"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="text-gray-400"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="pointer-events-none select-none"/gi, "");
  htmlContent = htmlContent.replace(/\s*class="text-default-hover"/gi, ""); // Remove editor-only class
  htmlContent = htmlContent.replace(/\s*class=""/gi, "");
  
  // Remove unnecessary wrapper divs (relative, text-default-hover)
  htmlContent = htmlContent.replace(/<div[^>]*class="[^"]*relative[^"]*"[^>]*>/gi, "");
  htmlContent = htmlContent.replace(/<div[^>]*class="[^"]*text-default-hover[^"]*"[^>]*>/gi, "");
  htmlContent = htmlContent.replace(/<\/div>\s*<\/div>/gi, "</div>");
  
  // Remove draggable attributes
  htmlContent = htmlContent.replace(/\s*draggable="false"/gi, "");
  
  // Remove white-space pre-wrap styles
  htmlContent = htmlContent.replace(/\s*style="white-space:\s*pre-wrap;?"/gi, "");
  htmlContent = htmlContent.replace(/\s*style=""/gi, "");
  
  // Remove empty spans
  htmlContent = htmlContent.replace(/<span[^>]*>\s*<\/span>/gi, "");
  
  // Remove redundant formatting tags: <b><strong> -> <strong>, <i><em> -> <em>
  // Handle both orders: <b><strong> and <strong><b>
  htmlContent = htmlContent.replace(/<b[^>]*>(<strong[^>]*>.*?<\/strong>)<\/b>/gi, "$1");
  htmlContent = htmlContent.replace(/<strong[^>]*>(<b[^>]*>.*?<\/b>)<\/strong>/gi, "$1");
  htmlContent = htmlContent.replace(/<i[^>]*>(<em[^>]*>.*?<\/em>)<\/i>/gi, "$1");
  htmlContent = htmlContent.replace(/<em[^>]*>(<i[^>]*>.*?<\/i>)<\/em>/gi, "$1");
  
  // Fix nested <p> tags - unwrap inner <p> if outer is also <p>
  htmlContent = htmlContent.replace(/<p([^>]*)><p([^>]*)>(.*?)<\/p><\/p>/gi, "<p$1>$3</p>");
  
  // Fix invalid nesting: unwrap <p> tags inside heading tags (h1-h6)
  htmlContent = htmlContent.replace(/<(h[1-6])([^>]*)><p([^>]*)>(.*?)<\/p><\/\1>/gi, "<$1$2>$4</$1>");
  
  // Fix invalid nesting: unwrap <p> tags inside span tags
  htmlContent = htmlContent.replace(/<span([^>]*)><p([^>]*)>(.*?)<\/p><\/span>/gi, "<span$1>$3</span>");
  
  // Remove unnecessary <span> wrappers that only contain text (no meaningful attributes)
  // This handles cases like <span>text</span> -> text
  // But preserves spans with style attributes like <span style="color: red;">text</span>
  htmlContent = htmlContent.replace(/<span(?![^>]*\s(style|class|id|data-|aria-)[^>]*)>(.*?)<\/span>/gi, "$2");
  
  // Remove spans that only have empty class attribute or no meaningful attributes
  htmlContent = htmlContent.replace(/<span[^>]*class="[^"]*"[^>]*>(.*?)<\/span>/gi, (match, content) => {
    // Check if span has style, id, data-*, or aria- attributes
    const hasMeaningfulAttrs = match.match(/\s(style|id|data-|aria-)/i);
    // If no meaningful attributes, unwrap the span
    return hasMeaningfulAttrs ? match : content;
  });

  const { html: processedHTML } = processImages(htmlContent);
  const consolidatedStyles = Array.from(allStyles).join("\n\n");
  
  // Add default list styles for eBay compatibility (since editor classes are removed)
  const defaultListStyles = `
/* Default list styles for eBay compatibility */
ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.5em 0;
}
ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.5em 0;
}
li {
  margin: 0.25em 0;
}
`;

  const allCSS = [defaultListStyles, consolidatedStyles, customCSS].filter(Boolean).join("\n\n");

  // Generate Google Fonts links if provided
  let fontLinks = "";
  if (googleFonts) {
    fontLinks = generateGoogleFontsLinkTag(googleFonts);
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eBay Template</title>
    ${fontLinks}
    <style>
/* eBay Template Styles - No JavaScript Required */
${allCSS}
    </style>
</head>
<body>
    ${processedHTML}
</body>
</html>`;

  return fullHTML;
};

/**
 * Downloads the HTML as a file
 */
export const downloadHTML = (html: string, filename: string = "ebay-template.html"): void => {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Copies HTML to clipboard
 */
export const copyHTMLToClipboard = async (html: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(html);
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = html;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};


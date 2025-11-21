import { sanitizeHTML, sanitizeHTMLForPreview } from "@/app/builder/lib/html-sanitizer";

/**
 * Cleans HTML content for preview mode (remove editor classes, fix nested tags, sanitize for XSS)
 */
export function cleanHTMLForPreview(html: string, htmlTag: string): string {
  if (!html) return "";

  // First, sanitize HTML to prevent XSS attacks
  let cleaned = sanitizeHTMLForPreview(html);

  // Remove Lexical editor classes
  cleaned = cleaned.replace(/\s*class="editor-[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*class=""/gi, "");

  // Remove white-space pre-wrap styles (not needed)
  cleaned = cleaned.replace(/\s*style="white-space:\s*pre-wrap;?"/gi, "");
  cleaned = cleaned.replace(/\s*style=""/gi, "");

  // Remove empty spans
  cleaned = cleaned.replace(/<span[^>]*>\s*<\/span>/gi, "");

  // Handle nested tags based on htmlTag
  if (htmlTag === "p") {
    // If htmlTag is "p" and content starts with <p>, unwrap the inner <p> tag
    const pMatch = cleaned.match(/^<p[^>]*>(.*?)<\/p>$/s);
    if (pMatch && pMatch[1]) {
      cleaned = pMatch[1];
    }
  } else if (htmlTag === "span") {
    // If htmlTag is "span", unwrap any block-level tags like <p>
    const pMatch = cleaned.match(/^<p[^>]*>(.*?)<\/p>$/s);
    if (pMatch && pMatch[1]) {
      cleaned = pMatch[1];
    }
  } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(htmlTag)) {
    // If htmlTag is a heading, unwrap any <p> tags and extract text content
    // Headings cannot contain block-level elements like <p>
    const pMatch = cleaned.match(/^<p[^>]*>(.*?)<\/p>$/s);
    if (pMatch && pMatch[1]) {
      cleaned = pMatch[1];
    }
    // Also unwrap any nested heading tags (shouldn't happen, but just in case)
    const headingMatch = cleaned.match(/^<h[1-6][^>]*>(.*?)<\/h[1-6]>$/s);
    if (headingMatch && headingMatch[1]) {
      cleaned = headingMatch[1];
    }
  } else if (htmlTag === "div") {
    // For div tags, we can keep <p> tags as they're valid block elements
    // But still clean up any nested divs if needed
    cleaned = cleaned.replace(/^<div[^>]*>(.*?)<\/div>$/s, "$1");
  }

  // Remove unnecessary <span> wrappers that only contain text (no attributes or styling)
  // This handles cases like <span>text</span> -> text
  // But preserves spans with attributes like <span style="...">text</span>
  cleaned = cleaned.replace(/<span(?![^>]*\s(style|class|id|data-)[^>]*)>(.*?)<\/span>/gi, "$2");

  // Also remove spans that only have empty or whitespace-only attributes
  cleaned = cleaned.replace(/<span[^>]*class="[^"]*"[^>]*>(.*?)<\/span>/gi, (match, content) => {
    // If the span only has class attribute and no other meaningful attributes, unwrap it
    const hasOtherAttrs = match.match(/\s(style|id|data-|aria-)/i);
    return hasOtherAttrs ? match : content;
  });

  return cleaned.trim();
}

/**
 * Sanitizes HTML for edit mode
 */
export function sanitizeHTMLForEdit(html: string): string {
  return sanitizeHTML(html);
}


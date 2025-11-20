/**
 * HTML Sanitization Utility
 * 
 * Provides comprehensive XSS protection for user-generated HTML content.
 * Uses DOMPurify to sanitize HTML and prevent script injection attacks.
 */

import DOMPurify from "dompurify";

/**
 * Configuration for HTML sanitization
 * Allows safe HTML tags and attributes while blocking dangerous ones
 */
const SANITIZE_CONFIG: DOMPurify.Config = {
  // Allow safe HTML tags for rich text editing
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "a", "blockquote", "code", "pre",
    "span", "div",
    "img",
  ],
  
  // Allow safe attributes
  ALLOWED_ATTR: [
    "href", "title", "alt", "src", "width", "height",
    "class", "id", "style", // style is allowed but will be sanitized
    "target", "rel", // For links
  ],
  
  // Allow data URIs for images (but will be sanitized)
  ALLOW_DATA_ATTR: false,
  
  // Keep relative URLs (don't convert to absolute)
  KEEP_CONTENT: true,
  
  // Return DOM instead of string for further processing
  RETURN_DOM: false,
  
  // Return DOM fragment instead of full document
  RETURN_DOM_FRAGMENT: false,
  
  // Sanitize style attributes
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Additional sanitization for style attributes
 * Removes dangerous CSS properties that could execute JavaScript
 */
const DANGEROUS_CSS_PROPERTIES = [
  "expression",
  "javascript:",
  "vbscript:",
  "onload",
  "onerror",
  "onclick",
  "onmouseover",
  "onfocus",
  "onblur",
  "import",
  "behavior",
  "-moz-binding",
  "binding",
];

/**
 * Sanitizes inline styles to remove dangerous CSS
 */
function sanitizeStyleAttribute(style: string): string {
  if (!style) return "";
  
  // Remove dangerous CSS properties
  let sanitized = style;
  for (const prop of DANGEROUS_CSS_PROPERTIES) {
    const regex = new RegExp(`[^a-z]${prop}[^a-z]`, "gi");
    sanitized = sanitized.replace(regex, "");
  }
  
  // Remove javascript: and data: URLs from CSS
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/data:\s*text\/html/gi, "");
  
  return sanitized.trim();
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * 
 * @param html - The HTML string to sanitize
 * @param options - Optional configuration overrides
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * ```typescript
 * const safeHTML = sanitizeHTML('<p>Hello <script>alert("XSS")</script></p>');
 * // Returns: '<p>Hello </p>' (script tag removed)
 * ```
 */
export function sanitizeHTML(html: string, options?: Partial<DOMPurify.Config>): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  // Merge custom options with default config
  const config: DOMPurify.Config = {
    ...SANITIZE_CONFIG,
    ...options,
  };

  // First pass: Use DOMPurify to remove dangerous tags and attributes
  let sanitized = DOMPurify.sanitize(html, config);

  // Second pass: Additional sanitization for style attributes
  // DOMPurify handles most cases, but we add extra protection
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, "text/html");
  
  // Sanitize style attributes on all elements
  const allElements = doc.querySelectorAll("*");
  allElements.forEach((el) => {
    const style = el.getAttribute("style");
    if (style) {
      const sanitizedStyle = sanitizeStyleAttribute(style);
      if (sanitizedStyle) {
        el.setAttribute("style", sanitizedStyle);
      } else {
        el.removeAttribute("style");
      }
    }
    
    // Remove any event handler attributes that might have slipped through
    const eventHandlers = [
      "onclick", "onmouseover", "onmouseout", "onfocus", "onblur",
      "onload", "onerror", "onchange", "onsubmit", "onreset",
      "onselect", "onkeydown", "onkeypress", "onkeyup",
    ];
    eventHandlers.forEach((handler) => {
      el.removeAttribute(handler);
    });
    
    // Remove javascript: and data: URLs from href/src attributes
    const href = el.getAttribute("href");
    if (href && (href.toLowerCase().startsWith("javascript:") || href.toLowerCase().startsWith("data:text/html"))) {
      el.removeAttribute("href");
    }
    
    const src = el.getAttribute("src");
    if (src && (src.toLowerCase().startsWith("javascript:") || src.toLowerCase().startsWith("data:text/html"))) {
      el.removeAttribute("src");
    }
  });

  // Get sanitized HTML
  sanitized = doc.body.innerHTML;

  return sanitized;
}

/**
 * Sanitizes HTML specifically for Lexical editor paste events
 * More permissive than general sanitization to allow rich text formatting
 */
export function sanitizeHTMLForPaste(html: string): string {
  return sanitizeHTML(html, {
    // Allow more tags for rich text editing
    ALLOWED_TAGS: [
      ...SANITIZE_CONFIG.ALLOWED_TAGS!,
      "sub", "sup", "mark", "del", "ins",
    ],
  });
}

/**
 * Sanitizes HTML for preview/export mode
 * More restrictive to ensure safe rendering
 */
export function sanitizeHTMLForPreview(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  // Use stricter config for preview/export
  const strictConfig: DOMPurify.Config = {
    ...SANITIZE_CONFIG,
    // Remove style attributes in preview mode (styles come from CSS classes)
    ALLOWED_ATTR: SANITIZE_CONFIG.ALLOWED_ATTR!.filter(attr => attr !== "style"),
  };

  return sanitizeHTML(html, strictConfig);
}

/**
 * Sanitizes HTML for export (most restrictive)
 * Removes all inline styles and focuses on content only
 */
export function sanitizeHTMLForExport(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  const exportConfig: DOMPurify.Config = {
    ...SANITIZE_CONFIG,
    // Remove style and class attributes (styles come from CSS)
    ALLOWED_ATTR: ["href", "title", "alt", "src", "width", "height", "target", "rel"],
    // Remove data attributes
    ALLOW_DATA_ATTR: false,
  };

  return sanitizeHTML(html, exportConfig);
}

/**
 * Validates if a string contains potentially dangerous HTML
 * Useful for logging or warning users
 */
export function containsDangerousHTML(html: string): boolean {
  if (!html || typeof html !== "string") {
    return false;
  }

  const dangerousPatterns = [
    /<script[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /<style[^>]*>/gi,
    /expression\s*\(/gi, // CSS expressions
    /vbscript:/gi,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(html));
}


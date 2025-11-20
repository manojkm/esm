# Security Documentation

## Overview

This document describes the security measures implemented in the builder to protect against XSS (Cross-Site Scripting) attacks and other security vulnerabilities.

**⚠️ IMPORTANT**: All components that accept user-generated HTML content **MUST** implement proper sanitization. Failure to do so can result in serious security vulnerabilities.

## XSS Protection

The Text component and HTML editor implement comprehensive XSS (Cross-Site Scripting) protection to prevent malicious code injection.

### Security Measures

#### 1. **HTML Sanitization with DOMPurify**

All user-generated HTML content is sanitized using [DOMPurify](https://github.com/cure53/DOMPurify), a battle-tested HTML sanitizer library.

**Location**: `app/builder/lib/html-sanitizer.ts`

**Features**:
- Removes dangerous HTML tags (`<script>`, `<iframe>`, `<object>`, `<embed>`, etc.)
- Strips event handler attributes (`onclick`, `onerror`, `onload`, etc.)
- Sanitizes inline styles to remove dangerous CSS (javascript:, expression(), etc.)
- Removes `javascript:` and `data:text/html` URLs from links and images
- Allows only safe HTML tags and attributes

#### 2. **Paste Event Sanitization**

When users paste content from external sources, the HTML is sanitized before being processed by the Lexical editor.

**Location**: `app/builder/components/ui/LexicalEditor.tsx` - `PasteSanitizePlugin`

**Protection**:
- Intercepts paste events at high priority
- Sanitizes HTML before Lexical processes it
- Removes dangerous scripts, event handlers, and malicious attributes

#### 3. **HTML Output Sanitization**

All HTML output is sanitized before being rendered via `dangerouslySetInnerHTML`.

**Locations**:
- `app/builder/components/ui/Text.tsx` - All `dangerouslySetInnerHTML` calls
- `app/builder/components/ui/LexicalEditor.tsx` - HTML serialization

**Protection**:
- Sanitizes HTML before rendering in edit mode
- Sanitizes HTML before rendering in preview mode
- Uses stricter sanitization for preview/export mode

#### 4. **Export Sanitization**

Exported HTML is sanitized to ensure no malicious code is included in the final output.

**Location**: `app/builder/lib/export-html.ts`

**Protection**:
- Most restrictive sanitization for exported HTML
- Removes all inline styles and data attributes
- Ensures safe HTML for eBay listings

### Sanitization Levels

#### 1. **Paste Sanitization** (`sanitizeHTMLForPaste`)
- **Purpose**: Allow rich text formatting while preventing XSS
- **Allowed**: Safe HTML tags, formatting tags, links, images
- **Blocked**: Scripts, iframes, event handlers, dangerous CSS

#### 2. **Preview Sanitization** (`sanitizeHTMLForPreview`)
- **Purpose**: Safe rendering in preview mode
- **Allowed**: Content tags, formatting, links (no inline styles)
- **Blocked**: Scripts, iframes, event handlers, inline styles

#### 3. **Export Sanitization** (`sanitizeHTMLForExport`)
- **Purpose**: Maximum security for exported HTML
- **Allowed**: Content only, no inline styles or classes
- **Blocked**: Scripts, iframes, event handlers, inline styles, data attributes

### Blocked Attack Vectors

The sanitization protects against:

1. **Script Injection**
   - `<script>alert('XSS')</script>` → Removed
   - `<img src=x onerror=alert('XSS')>` → `onerror` removed
   - `<div onclick=alert('XSS')>` → `onclick` removed

2. **JavaScript URLs**
   - `<a href="javascript:alert('XSS')">` → `href` removed
   - `<img src="javascript:alert('XSS')">` → `src` removed

3. **CSS Expression Attacks**
   - `style="expression(alert('XSS'))"` → Expression removed
   - `style="background: url('javascript:alert(1)')"` → URL removed

4. **Data URI Attacks**
   - `<img src="data:text/html,<script>alert('XSS')</script>">` → Blocked
   - `<a href="data:text/html,<script>alert('XSS')</script>">` → Blocked

5. **Event Handler Injection**
   - All `on*` attributes are stripped
   - Event handlers in HTML are removed

6. **Iframe/Object/Embed Tags**
   - All potentially dangerous embedding tags are blocked

### Testing Security

To verify security, try pasting these malicious payloads (they should be blocked):

```html
<!-- Script tag -->
<script>alert('XSS')</script>

<!-- Event handler -->
<img src=x onerror=alert('XSS')>

<!-- JavaScript URL -->
<a href="javascript:alert('XSS')">Click me</a>

<!-- CSS expression -->
<div style="background: expression(alert('XSS'))">Test</div>

<!-- Data URI -->
<img src="data:text/html,<script>alert('XSS')</script>">

<!-- Iframe -->
<iframe src="javascript:alert('XSS')"></iframe>
```

All of these should be sanitized and rendered safely (or removed entirely).

### Best Practices

1. **Always use sanitization functions** - Never use `dangerouslySetInnerHTML` without sanitization
2. **Use appropriate sanitization level** - Choose the right function for the context
3. **Test with malicious input** - Regularly test with XSS payloads
4. **Keep DOMPurify updated** - Update the library regularly for latest security fixes
5. **Monitor security advisories** - Stay informed about new XSS vectors
6. **Sanitize at multiple layers** - Sanitize on paste, render, and export
7. **Never trust user input** - Always assume user input is malicious
8. **Use TypeScript** - Type safety helps prevent security issues
9. **Code reviews** - Always review code that handles user input
10. **Regular audits** - Periodically audit the codebase for security issues

### Integration with Component Development

When creating new components that accept HTML content:

1. **Import sanitization utilities**:
   ```typescript
   import { sanitizeHTML, sanitizeHTMLForPreview } from "@/app/builder/lib/html-sanitizer";
   ```

2. **Sanitize before rendering**:
   ```typescript
   // Edit mode
   dangerouslySetInnerHTML: { __html: sanitizeHTML(content) }
   
   // Preview mode
   dangerouslySetInnerHTML: { __html: sanitizeHTMLForPreview(content) }
   ```

3. **Sanitize pasted content** (if using Lexical editor):
   ```typescript
   const sanitizedHtml = sanitizeHTMLForPaste(clipboardData.getData("text/html"));
   ```

4. **Sanitize exported content**:
   ```typescript
   const sanitizedHtml = sanitizeHTMLForExport(content);
   ```

See `COMPONENT_CREATION_GUIDE.md` for complete component development guidelines.

### Additional Security Considerations

1. **Content Security Policy (CSP)**: Consider implementing CSP headers for additional protection
2. **Server-side validation**: Always validate and sanitize HTML on the server side as well
3. **Rate limiting**: Implement rate limiting to prevent abuse
4. **Input length limits**: Limit the size of HTML input to prevent DoS attacks
5. **Regular audits**: Regularly audit the codebase for security vulnerabilities
6. **Dependency updates**: Keep all dependencies, especially security-related ones, up to date
7. **Error handling**: Don't expose sensitive information in error messages
8. **Authentication**: Implement proper authentication and authorization
9. **HTTPS**: Always use HTTPS in production
10. **Input validation**: Validate all user input on both client and server side

### Security Checklist for New Components

When creating a new component that handles user content:

- [ ] HTML content is sanitized before rendering
- [ ] Pasted content is sanitized (if applicable)
- [ ] Exported content is sanitized (if applicable)
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] No inline event handlers in user content
- [ ] No `javascript:` URLs allowed
- [ ] No `<script>` tags allowed
- [ ] No `<iframe>`, `<object>`, or `<embed>` tags allowed
- [ ] CSS expressions are blocked
- [ ] Data URIs with HTML are blocked
- [ ] Component tested with XSS payloads

### Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do not create a public issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure


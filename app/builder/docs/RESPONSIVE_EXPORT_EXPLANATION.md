# Container Component: Responsive Behavior in Editor vs. Export

## Overview

The Container component uses a **dual-system approach** to handle responsive behavior:
- **In Editor**: JavaScript-based responsive simulation (for real-time preview)
- **In Export**: Pure CSS media queries (for eBay compatibility - no JavaScript)

---

## How It Works

### 1. **In Editor Mode** (JavaScript-Based)

When you're editing in the builder:

#### A. Canvas Width Detection
- `ResizeObserver` in `CanvasArea.tsx` watches the canvas width
- When canvas resizes (e.g., switching to mobile = 375px), it updates `CanvasWidthContext`
- This triggers all Container components to re-render

#### B. Responsive Value Resolution
```typescript
// Container.tsx - Line 162-188
const { actualBreakpoint } = useCanvasWidth(); // Gets "mobile", "tablet", or "desktop"

const getEditorResponsiveValue = (values, fallback) => {
  if (actualBreakpoint && values[actualBreakpoint] !== undefined) {
    return values[actualBreakpoint]; // Returns mobile/tablet/desktop value
  }
  return fallback;
};
```

#### C. Inline Styles Applied
```typescript
// Container.tsx - Line 255-279
const paddingValue = buildResponsiveFourSideValue({
  responsive: paddingResponsive, // e.g., { mobile: 10, tablet: 20, desktop: 30 }
  fallback: { defaultValue: padding },
  resolver: responsiveResolver, // Uses actualBreakpoint from context
});

// Result: Inline style like style="padding: 10px" (when on mobile breakpoint)
```

#### D. CSS Media Queries Disabled
```typescript
// Container.tsx - Line 456
const shouldGenerateMediaQueries = !isEditMode; // FALSE in editor

if (shouldGenerateMediaQueries) {
  // This block is SKIPPED in editor mode
  responsiveCss += generatePaddingCss(...); // CSS media queries NOT generated
}
```

**Result in Editor:**
- ✅ Responsive styles work based on **canvas width** (not browser window)
- ✅ Uses **inline styles** that update when you switch breakpoints
- ✅ No CSS media queries in `<style>` tags (they would respond to browser window, not canvas)

---

### 2. **In Export Mode** (Pure CSS)

When you export the HTML:

#### A. CSS Media Queries Generated
```typescript
// Container.tsx - Line 456
const shouldGenerateMediaQueries = !isEditMode; // TRUE in export (not in editor)

if (shouldGenerateMediaQueries) {
  // This block RUNS when exporting
  responsiveCss += generatePaddingCss(hoverClassName, paddingResponsive, ...);
}
```

#### B. CSS Generation Process
```typescript
// css-responsive.ts - generatePaddingCss()
// Input: paddingResponsive = { mobile: 10, tablet: 20, desktop: 30 }

// Output CSS:
@media (max-width: 767px) {
  .container-hover-abc123 { padding: 10px !important; }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .container-hover-abc123 { padding: 20px !important; }
}
@media (min-width: 1024px) {
  .container-hover-abc123 { padding: 30px !important; }
}
```

#### C. Styles Injected into `<style>` Tag
```typescript
// Container.tsx - Line 578-583
const styleTagContent = mergeCssSegments(
  buildHoverRule(hoverClassName, hoverRules),
  linkCss,
  responsiveVisibilityCss,
  responsiveCss // ← All CSS media queries go here
);

// Rendered as:
<style>
  .container-hover-abc123:hover { ... }
  @media (max-width: 767px) { .container-hover-abc123 { padding: 10px !important; } }
  @media (min-width: 768px) and (max-width: 1023px) { .container-hover-abc123 { padding: 20px !important; } }
  ...
</style>
```

#### D. Export Process
```typescript
// export-html.ts - exportRenderedHTML()
1. Extracts all <style> tags from the DOM
2. Removes editor-specific attributes (data-craftjs, ring classes, etc.)
3. Consolidates all CSS into a single <style> tag in <head>
4. Generates pure HTML with embedded CSS
```

**Result in Export:**
- ✅ Pure CSS media queries in `<style>` tag
- ✅ No JavaScript dependencies
- ✅ Works in eBay listings (eBay blocks JavaScript)
- ✅ Responsive behavior works based on **browser viewport** (standard CSS behavior)

---

## Key Differences

| Aspect | Editor Mode | Export Mode |
|--------|-------------|-------------|
| **Responsive Detection** | JavaScript (ResizeObserver + Context) | CSS Media Queries |
| **Style Application** | Inline styles (`style="padding: 10px"`) | CSS classes + media queries |
| **Breakpoint Source** | Canvas width (375px, 768px, etc.) | Browser viewport width |
| **CSS Media Queries** | ❌ Disabled (would respond to browser, not canvas) | ✅ Enabled (responds to browser viewport) |
| **JavaScript Required** | ✅ Yes (for editor functionality) | ❌ No (pure CSS) |
| **eBay Compatible** | N/A (editor only) | ✅ Yes |

---

## Example Flow

### Scenario: Container with responsive padding
- **Desktop**: 30px padding
- **Tablet**: 20px padding  
- **Mobile**: 10px padding

### In Editor (Mobile Breakpoint Selected):
1. Canvas resizes to 375px
2. `actualBreakpoint` = "mobile"
3. `responsiveResolver` returns `10` (mobile value)
4. Inline style applied: `style="padding: 10px"`
5. **No CSS media queries** generated

### In Exported HTML:
1. Base inline style: `style="padding: 30px"` (desktop fallback)
2. CSS media queries in `<style>` tag:
   ```css
   @media (max-width: 767px) {
     .container-hover-abc123 { padding: 10px !important; }
   }
   @media (min-width: 768px) and (max-width: 1023px) {
     .container-hover-abc123 { padding: 20px !important; }
   }
   ```
3. When browser viewport < 768px → CSS applies `padding: 10px`
4. When browser viewport 768-1023px → CSS applies `padding: 20px`
5. When browser viewport ≥ 1024px → Uses base inline style `padding: 30px`

---

## Why This Approach?

### Problem:
- CSS media queries respond to **browser viewport**, not canvas width
- In editor, we want responsive styles based on **canvas width** (375px, 768px)
- eBay doesn't allow JavaScript, so exported HTML must use pure CSS

### Solution:
- **Editor**: Use JavaScript to simulate responsive behavior based on canvas width
- **Export**: Generate CSS media queries that work without JavaScript
- **Best of both worlds**: Great editor experience + eBay-compatible export

---

## Code Locations

- **Editor Responsive Logic**: `app/builder/components/ui/Container.tsx` (lines 162-188)
- **CSS Media Query Generation**: `app/builder/lib/style-system/css-responsive.ts`
- **Export Function**: `app/builder/lib/export-html.ts`
- **Canvas Width Tracking**: `app/builder/contexts/CanvasWidthContext.tsx`


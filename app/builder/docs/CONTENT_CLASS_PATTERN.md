# Content Class Pattern Guide

This guide explains the **content class pattern** used throughout the builder to ensure proper CSS isolation and prevent style conflicts.

## Why Content Classes?

### Problem
When applying styles to components, we need to ensure:
1. **Styles only target actual content**, not editor UI elements (toolbars, wrappers, etc.)
2. **No style conflicts** between components
3. **Proper CSS isolation** for each component instance
4. **Editor UI isolation** - formatting toolbars and other editor elements shouldn't inherit component styles

### Solution: Content Class Pattern

Each component uses a **content class** (e.g., `.text-content`, `.container-content`, `.button-content`) to scope typography and content-specific styles, while layout styles are applied to the wrapper div.

## Pattern Structure

### Two-Level CSS Targeting

```
┌─────────────────────────────────────────┐
│ .component-abc123 (Wrapper)             │
│ - Layout styles: padding, margin,       │
│   background, border, box-shadow        │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ .component-abc123 .text-content │   │
│   │ - Typography styles: font,      │   │
│   │   color, text-align, etc.       │   │
│   │                                 │   │
│   │   [Actual Content]              │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Style Categories

#### Layout Styles → Wrapper Div (`.${componentClassName}`)
Apply to the wrapper div that wraps the entire component. In preview mode, these are applied via CSS classes. In edit mode, they are applied as inline styles:
- ✅ Padding
- ✅ Margin
- ✅ Background (color/image/gradient)
- ✅ Border (color/width/radius)
- ✅ Box Shadow
- ✅ Position (top, right, bottom, left)
- ✅ Z-index
- ✅ Min-height
- ✅ Width/Height/Max-width
- ✅ Display/Flex properties (flex-direction, justify-content, align-items, flex-wrap, gap)

#### Typography Styles → Content Class (`.${componentClassName} .${componentName}-content`)
Apply to the content class within the wrapper. In preview mode, these are applied via CSS classes. In edit mode, they are applied as inline styles:
- ✅ Font Family
- ✅ Font Size
- ✅ Font Weight
- ✅ Font Style
- ✅ Text Align
- ✅ Text Transform
- ✅ Text Decoration
- ✅ Letter Spacing
- ✅ Line Height
- ✅ Color (text color)
- ✅ Link Colors

## Implementation

### 1. Generate Component Class Name

```typescript
import { generateComponentClassName } from "@/app/builder/lib/component-styles";

const componentClassName = generateComponentClassName(nodeId, cssId, "button");
// Result: "button-abc123" (or "button-custom-id" if cssId is provided)
```

### 2. CSS Generation (Preview Mode)

```typescript
let responsiveCss = "";
const shouldGenerateMediaQueries = !isEditMode;

if (shouldGenerateMediaQueries) {
  // Layout styles → wrapper div
  responsiveCss += `.${componentClassName} { padding: 10px; margin: 0; }\n`;
  responsiveCss += `.${componentClassName} { background-color: #fff; }\n`;
  responsiveCss += `.${componentClassName} { border: 1px solid #000; }\n`;
  
  // Typography styles → content class
  responsiveCss += `.${componentClassName} .button-content { color: #000; }\n`;
  responsiveCss += `.${componentClassName} .button-content { font-size: 16px; }\n`;
  responsiveCss += `.${componentClassName} .button-content { font-weight: 400; }\n`;
}
```

### 3. HTML Structure

#### Edit Mode
```typescript
{isEditMode ? (
  <div className="button-content">
    <button style={{ 
      /* inline styles for layout and typography */
      padding: paddingValue,
      margin: marginValue,
      backgroundColor: backgroundColor,
      color: textColor,
      fontSize: fontSize,
      // ... etc
    }}>
      {props.text}
    </button>
  </div>
) : (
  // Preview mode structure below
)}
```

**Note**: In edit mode, all styles (layout and typography) are applied as inline styles for immediate visual feedback.

#### Preview Mode
```typescript
<div className={componentClassName}>
  <div className="button-content">
    <button>{props.text}</button>
  </div>
</div>
```

**Note**: In preview mode, layout styles are applied via CSS classes to `.${componentClassName}`, and typography styles are applied via CSS classes to `.${componentClassName} .button-content`. No inline styles for layout/typography should be present in preview mode.

### 4. Using Helper Functions

```typescript
import {
  getContentSelector,
  getContentHoverSelector,
} from "@/app/builder/lib/component-styles";

// Get content selector for CSS generation
const contentSelector = getContentSelector(componentClassName, "button");
// Result: ".button-abc123 .button-content"

// Use in CSS generation
if (fontSizeResponsive) {
  responsiveCss += generateResponsiveCss(
    contentSelector, // Use helper instead of manual string
    "font-size",
    fontSizeResponsive,
    fontSize ?? 16,
    "px"
  );
}
```

## Real-World Examples

### Example 1: Text Component

**CSS Generation**:
```typescript
// Layout styles → wrapper
responsiveCss += `.${componentClassName} { padding: ${padding}px; }\n`;
responsiveCss += `.${componentClassName} { background-color: ${backgroundColor}; }\n`;

// Typography styles → content class
responsiveCss += `.${componentClassName} .text-content { color: ${textColor}; }\n`;
responsiveCss += `.${componentClassName} .text-content { font-size: ${fontSize}px; }\n`;
responsiveCss += `.${componentClassName} .text-content { text-align: ${textAlign}; }\n`;
```

**HTML Structure**:
```typescript
// Edit mode
<div className="text-content">
  <LexicalEditor ... />
</div>

// Preview mode
<div className={componentClassName}>
  <div className="text-content">
    <p>{content}</p>
  </div>
</div>
```

**Why**: The Lexical editor toolbar and other editor UI elements are excluded from `.text-content` styles, preventing font/color inheritance.

### Example 2: Container Component

**CSS Generation (Preview Mode Only)**:
```typescript
// Layout styles → wrapper (only generated when !isEditMode)
if (!isEditMode) {
  responsiveCss += `.${componentClassName} { padding: ${padding}px; }\n`;
  responsiveCss += `.${componentClassName} { background-color: ${backgroundColor}; }\n`;
  responsiveCss += `.${componentClassName} { border: ${borderWidth}px solid ${borderColor}; }\n`;
  responsiveCss += `.${componentClassName} { box-shadow: ${boxShadow}; }\n`;
  responsiveCss += `.${componentClassName} { min-height: ${minHeight}px; }\n`;
  // Flexbox properties
  responsiveCss += `.${componentClassName} { flex-direction: ${flexDirection}; }\n`;
  responsiveCss += `.${componentClassName} { justify-content: ${justifyContent}; }\n`;
  // Position and z-index
  responsiveCss += `.${componentClassName} { position: ${position}; }\n`;
  responsiveCss += `.${componentClassName} { z-index: ${zIndex}; }\n`;
  
  // Typography styles → content class
  responsiveCss += `.${componentClassName} .container-content { color: ${textColor}; }\n`;
  responsiveCss += `.${componentClassName} .container-content { font-size: ${fontSize}px; }\n`;
}
```

**Inline Styles (Edit Mode Only)**:
```typescript
const containerStyle: React.CSSProperties = {
  // Layout styles - only in edit mode
  padding: isEditMode ? paddingValue : undefined,
  margin: isEditMode ? marginValue : undefined,
  ...(isEditMode ? backgroundStyles : {}),
  ...(isEditMode ? borderStyles : {}),
  boxShadow: isEditMode ? boxShadowStyle : undefined,
  minHeight: isEditMode ? computedMinHeight : undefined,
  flexDirection: isEditMode ? effectiveFlexDirection : undefined,
  position: isEditMode && hasCustomPosition ? position : undefined,
  zIndex: isEditMode && zIndex ? zIndex : undefined,
  // Typography styles are applied to .container-content element in edit mode
};
```

**HTML Structure**:
```typescript
// When needsContentWrapper is true (Full Width + Boxed Content)
<div className={componentClassName} style={containerStyle}>
  <div className={`${contentWrapperClassName} container-content`} style={contentWrapperStyle}>
    {children}
  </div>
</div>

// When needsContentWrapper is false
<div className={componentClassName} style={containerStyle}>
  <div className="container-content" style={{ display: "contents" }}>
    {children}
  </div>
</div>
```

**Why**: 
- In preview mode, layout styles are applied via CSS classes (no inline styles), ensuring eBay compatibility.
- The `display: contents` wrapper doesn't interfere with flexbox layouts while still allowing CSS targeting.
- In edit mode, inline styles provide immediate visual feedback based on the current canvas breakpoint.

## Special Cases

### Case 1: Editor UI Exclusion

If your component has editor UI elements (like toolbars), exclude them from content styles:

```typescript
// In Text component - exclude toolbar from text-content styles
const toolbarResetStyles = `
  .${componentClassName} .text-content .lexical-floating-toolbar,
  .${componentClassName} .text-content .lexical-floating-toolbar * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    color: #1f2937 !important;
  }
`;
```

### Case 2: Flexbox Layouts

When using flexbox, use `display: contents` on the content wrapper to avoid layout interference:

```typescript
// Container component - doesn't interfere with flex layouts
<div className="container-content" style={{ display: "contents" }}>
  {children}
</div>
```

**Why**: `display: contents` makes the wrapper "invisible" to the layout, allowing children to participate directly in the parent's flex layout.

### Case 3: List Styles

For components with lists, scope list styles to the content class:

```typescript
const listStyles = `
  .${componentClassName} .text-content ul {
    list-style-type: disc;
    padding-left: 1.5em;
  }
  .${componentClassName} .text-content ol {
    list-style-type: decimal;
    padding-left: 1.5em;
  }
  .${componentClassName} .text-content li {
    margin: 0.25em 0;
  }
`;
```

## Benefits

### ✅ CSS Isolation
- Each component instance has unique CSS classes
- No style conflicts between components
- Styles are scoped to specific component instances

### ✅ Editor UI Isolation
- Editor toolbars, wrappers, and UI elements don't inherit component styles
- Content styles only apply to actual content
- Better editor experience

### ✅ Maintainability
- Clear separation between layout and typography styles
- Easy to understand and modify
- Consistent pattern across all components

### ✅ eBay Compatibility
- Pure CSS, no JavaScript dependencies
- Works in exported HTML
- No runtime style conflicts

## Common Mistakes

### ❌ Wrong: Applying typography to wrapper
```typescript
// DON'T DO THIS
responsiveCss += `.${componentClassName} { font-size: 16px; }\n`;
responsiveCss += `.${componentClassName} { color: #000; }\n`;
```

**Problem**: This would apply styles to editor UI elements and wrappers.

### ✅ Correct: Apply typography to content class
```typescript
// DO THIS
responsiveCss += `.${componentClassName} .button-content { font-size: 16px; }\n`;
responsiveCss += `.${componentClassName} .button-content { color: #000; }\n`;
```

### ❌ Wrong: Not wrapping content
```typescript
// DON'T DO THIS
<div className={componentClassName}>
  <button>{props.text}</button>
</div>
```

**Problem**: No way to target content separately from wrapper.

### ✅ Correct: Wrap content in content class
```typescript
// DO THIS
<div className={componentClassName}>
  <div className="button-content">
    <button>{props.text}</button>
  </div>
</div>
```

### ❌ Wrong: Using `> *` selector
```typescript
// DON'T DO THIS (old pattern)
responsiveCss += `.${componentClassName} > * { color: #000; }\n`;
```

**Problem**: This targets all direct children, including editor UI elements.

### ✅ Correct: Use content class
```typescript
// DO THIS (new pattern)
responsiveCss += `.${componentClassName} .button-content { color: #000; }\n`;
```

## Checklist for New Components

- [ ] Generate unique component class name using `generateComponentClassName()`
- [ ] Wrap actual content in `<div className="${componentName}-content">` (e.g., `text-content`, `button-content`)
- [ ] Generate CSS classes for layout styles targeting wrapper div (`.${componentClassName}`) in preview mode only (`!isEditMode`)
- [ ] Generate CSS classes for typography styles targeting content class (`.${componentClassName} .${componentName}-content`) in preview mode only (`!isEditMode`)
- [ ] Apply layout styles as inline styles in edit mode only (`isEditMode ? styles : undefined`)
- [ ] Apply typography styles as inline styles in edit mode only (`isEditMode ? styles : undefined`)
- [ ] Use `getContentSelector()` helper for CSS generation
- [ ] Exclude editor UI elements from content styles (if applicable)
- [ ] Use `display: contents` on content wrapper if flexbox interference is a concern
- [ ] Test that editor UI elements don't inherit component styles
- [ ] Verify content classes are preserved in exported HTML
- [ ] Ensure no layout/typography inline styles are present in preview mode (they should be `undefined`)

## Reference Implementation

- **Text Component**: `app/builder/components/ui/Text.tsx`
- **Container Component**: `app/builder/components/ui/Container.tsx`
- **Helper Functions**: `app/builder/lib/component-styles.ts`

## Related Documentation

- **Component Style Pattern**: See `COMPONENT_STYLE_PATTERN.md` for overall component styling guide
- **Responsive Pattern**: See `RESPONSIVE_PATTERN_GUIDE.md` for responsive CSS generation
- **Component Styles Utilities**: See `app/builder/lib/component-styles.ts` for helper functions


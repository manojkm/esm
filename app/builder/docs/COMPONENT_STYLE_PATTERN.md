# Component Style Pattern Guide

This guide documents the standard pattern for implementing styles in user components, following the Text component as the reference implementation.

## Overview

The pattern ensures:
- ✅ **CSS Isolation**: Each component instance has unique CSS classes
- ✅ **Scoped Targeting**: Content classes (e.g., `.text-content`, `.container-content`) ensure styles only target actual content, not editor UI elements
- ✅ **Responsive Design**: Desktop values cascade, media queries only for overrides
- ✅ **Edit/Preview Consistency**: Styles work correctly in both modes
- ✅ **No Duplication**: Styles aren't applied twice (wrapper + element)
- ✅ **eBay Compatibility**: Pure CSS, no JavaScript dependencies
- ✅ **Editor Isolation**: Editor UI elements (toolbars, wrappers) don't inherit component styles

## Pattern Structure

### 1. Generate Unique Component Class Name

```typescript
import { generateComponentClassName } from "@/app/builder/lib/component-styles";

const componentClassName = generateComponentClassName(nodeId, cssId, "button");
// Result: "button-abc123" (or "button-custom-id" if cssId is provided)
```

### 2. CSS Generation (Preview Mode Only)

Generate CSS only when `!isEditMode`:

```typescript
let responsiveCss = "";
const shouldGenerateMediaQueries = !isEditMode;

if (shouldGenerateMediaQueries) {
  // Layout styles → wrapper div
  responsiveCss += `.${componentClassName} { padding: 10px; margin: 0; }\n`;
  responsiveCss += `.${componentClassName} { background-color: #fff; }\n`;
  responsiveCss += `.${componentClassName} { border: 1px solid #000; }\n`;
  
  // Typography styles → content class
  responsiveCss += `.${componentClassName} .button-content { color: #000; font-size: 16px; }\n`;
}
```

### 3. Inline Styles (Edit Mode Only)

Build inline styles only for edit mode:

```typescript
import { buildEditModeStyles } from "@/app/builder/lib/component-styles";

const elementStyle: React.CSSProperties = {
  // Layout styles - only in edit mode
  padding: isEditMode ? paddingValue : undefined,
  margin: isEditMode ? marginValue : undefined,
  ...(isEditMode ? backgroundStyles : {}),
  ...(isEditMode ? borderStyles : {}),
  boxShadow: isEditMode ? boxShadowStyle : undefined,
  
  // Typography styles - only in edit mode
  fontFamily: isEditMode ? effectiveFontFamily : undefined,
  fontSize: isEditMode ? effectiveFontSize : undefined,
  color: isEditMode ? effectiveTextColor : undefined,
  // ... etc
};
```

### 4. Render Structure

```typescript
return (
  <>
    <style>{styleTagContent}</style>
    {isEditMode ? (
      // Edit mode: No wrapper, inline styles on element
      <button style={elementStyle} {...props}>
        Content
      </button>
    ) : (
      // Preview mode: Wrapper div with unique class, no inline styles
      <div className={componentClassName}>
        <button {...props}>
          Content
        </button>
      </div>
    )}
  </>
);
```

## Style Categories

### Layout Styles (Wrapper Div)
Apply to `.${componentClassName}`:
- ✅ Padding
- ✅ Margin
- ✅ Background (color/image/gradient)
- ✅ Border (color/width/radius)
- ✅ Box Shadow
- ✅ Position
- ✅ Z-index

### Typography Styles (Content Class)
Apply to `.${componentClassName} .${componentName}-content` (e.g., `.text-content`, `.container-content`):
- ✅ Font Family
- ✅ Font Size
- ✅ Font Weight
- ✅ Font Style
- ✅ Text Align
- ✅ Text Transform
- ✅ Text Decoration
- ✅ Letter Spacing
- ✅ Line Height
- ✅ Color
- ✅ Link Colors

## Responsive Pattern

Always follow: **Base value applies to all breakpoints, media queries only for overrides**

```typescript
// ✅ Correct: Base CSS + media queries for overrides
const contentSelector = `${componentClassName} .button-content`;
if (fontSizeResponsive) {
  responsiveCss += generateResponsiveCss(
    contentSelector,
    "font-size",
    fontSizeResponsive,
    fontSize ?? 16, // Base value
    "px"
  );
} else {
  // Always generate base CSS even without responsive
  responsiveCss += `${contentSelector} { font-size: ${fontSize ?? 16}px; }\n`;
}
```

## Helper Functions

Use utilities from `@/app/builder/lib/component-styles`:

```typescript
import {
  generateComponentClassName,
  buildEditModeStyles,
  getWrapperSelector,
  getContentSelector,
  getWrapperHoverSelector,
  getContentHoverSelector,
} from "@/app/builder/lib/component-styles";

// Usage:
const contentSelector = getContentSelector(componentClassName, "button");
// Result: ".button-abc123 .button-content"
```

## Example: Button Component

```typescript
export const Button: React.FC<ButtonProps> = (props) => {
  const { id: nodeId } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const isEditMode = enabled;
  
  // 1. Generate unique class name
  const componentClassName = generateComponentClassName(nodeId, props.cssId, "button");
  
  // 2. Generate CSS for preview mode
  let responsiveCss = "";
  if (!isEditMode) {
    // Layout styles → wrapper
    if (props.paddingResponsive) {
      responsiveCss += generatePaddingCss(componentClassName, props.paddingResponsive, {...}, "px");
    } else if (props.padding !== null && props.padding !== undefined) {
      responsiveCss += `.${componentClassName} { padding: ${props.padding}px; }\n`;
    }
    
    // Typography styles → content class
    responsiveCss += `.${componentClassName} .button-content { color: ${props.textColor ?? "#000"}; }\n`;
  }
  
  // 3. Build inline styles for edit mode
  const buttonStyle: React.CSSProperties = {
    padding: isEditMode ? `${props.padding ?? 10}px` : undefined,
    color: isEditMode ? props.textColor : undefined,
    ...(isEditMode ? backgroundStyles : {}),
    ...(isEditMode ? borderStyles : {}),
  };
  
  // 4. Render
  return (
    <>
      <style>{responsiveCss}</style>
      {isEditMode ? (
        <div className="button-content">
          <button style={buttonStyle}>{props.text}</button>
        </div>
      ) : (
        <div className={componentClassName}>
          <div className="button-content">
            <button>{props.text}</button>
          </div>
        </div>
      )}
    </>
  );
};
```

## Checklist for New Components

- [ ] Generate unique component class name using `generateComponentClassName()`
- [ ] Generate CSS only when `!isEditMode`
- [ ] Apply layout styles to wrapper div (`.${componentClassName}`)
- [ ] Apply typography styles to content class (`.${componentClassName} .${componentName}-content`)
- [ ] Wrap actual content in `<div className="${componentName}-content">` (e.g., `text-content`, `container-content`)
- [ ] Apply inline styles only in edit mode (`isEditMode ? styles : undefined`)
- [ ] Wrap content in `<div className={componentClassName}>` in preview mode
- [ ] Follow responsive pattern: base value + media queries for overrides
- [ ] Test in both edit and preview modes
- [ ] Verify no style duplication (check browser inspector)
- [ ] Ensure content classes are preserved in exported HTML

## Reference Implementation

See `app/builder/components/ui/Text.tsx` for the complete reference implementation.


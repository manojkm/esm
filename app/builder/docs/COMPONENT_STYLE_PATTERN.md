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

**CRITICAL**: Always follow: **Desktop values are used as base, media queries only for mobile/tablet overrides**

### Pattern Rules

1. **Base CSS uses desktop values** (if set in responsive object), otherwise uses fallback
2. **Media queries only generated** for mobile/tablet when they differ from desktop/base
3. **All responsive CSS generation functions** automatically handle this pattern

### Available Responsive Functions

All functions in `css-responsive.ts` follow the desktop-as-base pattern:

#### Single Value Properties
```typescript
// Typography, colors, etc.
if (fontSizeResponsive) {
  responsiveCss += generateResponsiveCss(
    `${componentClassName} .button-content`,
    "font-size",
    fontSizeResponsive,
    fontSize ?? 16, // Fallback if desktop not set
    "px"
  );
} else {
  // Non-responsive: Generate static CSS
  responsiveCss += `${componentClassName} .button-content { font-size: ${fontSize ?? 16}px; }\n`;
}
```

#### Four-Side Properties (Padding, Margin, Border)
```typescript
// Padding, margin, border-width, border-radius
if (paddingResponsive) {
  responsiveCss += generatePaddingCss(
    componentClassName,
    paddingResponsive,
    {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
      defaultValue: padding ?? 0, // Fallback if desktop not set
    },
    paddingUnit
  );
} else if (padding !== null && padding !== undefined) {
  // Non-responsive: Build static CSS directly
  const top = paddingTop ?? padding;
  const right = paddingRight ?? padding;
  const bottom = paddingBottom ?? padding;
  const left = paddingLeft ?? padding;
  responsiveCss += `.${componentClassName} { padding: ${top}${paddingUnit} ${right}${paddingUnit} ${bottom}${paddingUnit} ${left}${paddingUnit}; }\n`;
}
```

#### Color Properties
```typescript
// Text color, background color, border color
if (textColorResponsive) {
  responsiveCss += generateTextColorCss(
    `${componentClassName} .button-content`,
    textColorResponsive,
    textColor ?? "#000" // Fallback if desktop not set
  );
} else if (textColor) {
  // Non-responsive: Generate static CSS
  responsiveCss += `.${componentClassName} .button-content { color: ${textColor}; }\n`;
}
```

#### Link Colors
```typescript
// Link color and hover
if (linkColorResponsive || linkColorHoverResponsive) {
  responsiveCss += generateLinkColorCss(
    `${componentClassName} .button-content`,
    linkColorResponsive,
    linkColor ?? undefined,
    linkColorHoverResponsive,
    linkColorHover ?? undefined
  );
} else if (linkColor || linkColorHover) {
  // Non-responsive: Generate static CSS
  if (linkColor) {
    responsiveCss += `.${componentClassName} .button-content a { color: ${linkColor}; }\n`;
  }
  if (linkColorHover) {
    responsiveCss += `.${componentClassName} .button-content a:hover { color: ${linkColorHover}; }\n`;
  }
}
```

#### Box Shadow
```typescript
// Box shadow (multiple values)
if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
  responsiveCss += generateBoxShadowCss(
    componentClassName,
    boxShadowHorizontalResponsive,
    boxShadowVerticalResponsive,
    boxShadowBlurResponsive,
    boxShadowSpreadResponsive,
    boxShadowHorizontal ?? 0, // Fallback if desktop not set
    boxShadowVertical ?? 0,
    boxShadowBlur ?? 0,
    boxShadowSpread ?? 0,
    boxShadowColor
  );
}
```

### How It Works

**Example: Font Size with responsive values**
- Responsive object: `{ mobile: 14, tablet: 16, desktop: 18 }`
- Generated CSS:
  ```css
  /* Base CSS uses desktop value (18px) */
  .button-abc123 .button-content { font-size: 18px; }
  
  /* Media queries only for mobile/tablet (differ from desktop) */
  @media (max-width: 767px) {
    .button-abc123 .button-content { font-size: 14px !important; }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    .button-abc123 .button-content { font-size: 16px !important; }
  }
  ```

**Important**: All functions automatically:
- ✅ Use `responsive.desktop` as base (if exists)
- ✅ Fall back to provided fallback value if desktop not set
- ✅ Generate media queries only for mobile/tablet when they differ
- ✅ Skip desktop in media query loop (it's already the base)

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

### Basic Structure
- [ ] Generate unique component class name using `generateComponentClassName(nodeId, cssId, "componentName")`
- [ ] Generate CSS only when `!isEditMode` (`const shouldGenerateMediaQueries = !isEditMode`)
- [ ] Wrap actual content in `<div className="${componentName}-content">` (e.g., `text-content`, `button-content`)
- [ ] Wrap content in `<div className={componentClassName}>` in preview mode
- [ ] Apply inline styles only in edit mode (`isEditMode ? styles : undefined`)

### Style Application
- [ ] Apply layout styles to wrapper div (`.${componentClassName}`): padding, margin, background, border, box-shadow, position, z-index
- [ ] Apply typography styles to content class (`.${componentClassName} .${componentName}-content`): font, color, text-align, etc.
- [ ] Exclude editor UI elements (toolbars, wrappers) from content styles using CSS reset if needed

### Responsive CSS Generation
- [ ] **ALWAYS use responsive generation functions** from `css-responsive.ts` (they handle desktop-as-base automatically)
- [ ] For single values: Use `generateResponsiveCss()` for typography, `generateTextColorCss()`, `generateBackgroundColorCss()`, etc.
- [ ] For four-side values: Use `generatePaddingCss()`, `generateMarginCss()`, `generateResponsiveFourSideCss()` for borders
- [ ] For colors: Use `generateTextColorCss()`, `generateLinkColorCss()`, `generateBorderColorCss()`, etc.
- [ ] For complex: Use `generateBoxShadowCss()`, `generatePositionCss()`, `generateZIndexCss()`
- [ ] **NEVER manually build responsive CSS** - always use the provided functions
- [ ] For non-responsive values: Build static CSS directly (don't use resolver in preview mode)

### Testing
- [ ] Test in both edit and preview modes
- [ ] Test responsive settings: Set desktop, tablet, mobile values and verify media queries
- [ ] Verify no style duplication (check browser inspector)
- [ ] Ensure content classes are preserved in exported HTML
- [ ] Verify editor UI elements don't inherit component styles
- [ ] Test hover states work correctly

## Reference Implementation

See `app/builder/components/ui/Text.tsx` for the complete reference implementation.

## Additional Resources

- **Responsive Pattern Guide**: See `RESPONSIVE_PATTERN_GUIDE.md` for detailed responsive CSS generation patterns
- **Responsive Export Explanation**: See `RESPONSIVE_EXPORT_EXPLANATION.md` for how responsive works in editor vs export
- **Component Styles Utilities**: See `app/builder/lib/component-styles.ts` for helper functions
- **CSS Responsive Functions**: See `app/builder/lib/style-system/css-responsive.ts` for all available generation functions


# Component Style Pattern Guide

This guide documents the standard pattern for implementing styles in user components, following the Text component as the reference implementation.

## Overview

The pattern ensures:
- ✅ **CSS Isolation**: Each component instance has unique CSS classes
- ✅ **Scoped Targeting**: Content classes (e.g., `.text-content`, `.container-content`) ensure styles only target actual content, not editor UI elements
- ✅ **Responsive Design**: Desktop values cascade, media queries only for overrides
- ✅ **Edit/Preview Consistency**: Styles work correctly in both modes
- ✅ **No Duplication**: Styles aren't applied twice (wrapper + element)
- ✅ **eBay Compatibility**: Pure CSS, no JavaScript dependencies - all layout/typography styles are CSS classes in preview/export mode
- ✅ **Editor Isolation**: Editor UI elements (toolbars, wrappers) don't inherit component styles
- ✅ **Mode Separation**: 
  - **Edit Mode**: Inline styles for immediate visual feedback based on canvas breakpoint
  - **Preview/Export Mode**: CSS classes only (no inline styles for layout/typography), ensuring eBay compatibility

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

Build inline styles only for edit mode. In preview mode, layout styles are applied via CSS classes:

```typescript
const containerStyle: React.CSSProperties = {
  // Layout styles - only in edit mode (in preview mode, applied via CSS to wrapper)
  padding: isEditMode ? paddingValue : undefined,
  margin: isEditMode ? marginValue : undefined,
  ...(isEditMode ? backgroundStyles : {}),
  ...(isEditMode ? borderStyles : {}),
  boxShadow: isEditMode ? boxShadowStyle : undefined,
  minHeight: isEditMode ? computedMinHeight : undefined,
  // Flexbox properties - only in edit mode (in preview mode, applied via CSS)
  flexDirection: isEditMode ? effectiveFlexDirection : undefined,
  justifyContent: isEditMode ? effectiveJustifyContent : undefined,
  alignItems: isEditMode ? effectiveAlignItems : undefined,
  // Positioning - only in edit mode (in preview mode, applied via CSS)
  position: isEditMode && hasCustomPosition ? position : undefined,
  top: isEditMode && hasCustomPosition ? positionTop : undefined,
  zIndex: isEditMode && zIndex ? zIndex : undefined,
  
  // Typography styles - only in edit mode (in preview mode, applied via CSS to content class)
  fontFamily: isEditMode ? effectiveFontFamily : undefined,
  fontSize: isEditMode ? effectiveFontSize : undefined,
  color: isEditMode ? effectiveTextColor : undefined,
  // ... etc
};
```

**Important**: In preview mode, layout styles (padding, margin, background, border, box-shadow, min-height, flexbox properties, sizing, position, z-index) should be set to `undefined` in the inline style object. They are applied via CSS classes generated in the `<style>` tag instead.

### 4. Render Structure

```typescript
return (
  <>
    <style>{styleTagContent}</style>
    {isEditMode ? (
      // Edit mode: Content wrapper with inline styles
      <div className="button-content">
        <button style={elementStyle} {...props}>
          Content
        </button>
      </div>
    ) : (
      // Preview mode: Wrapper div with unique class, content wrapper inside
      <div className={componentClassName}>
        <div className="button-content">
          <button {...props}>
            Content
          </button>
        </div>
      </div>
    )}
  </>
);
```

**Note**: The content wrapper (`button-content`) is always present to ensure CSS targeting works correctly. In edit mode, it allows for proper style scoping. In preview mode, it ensures the content class pattern is followed.

## Style Categories

### Layout Styles (Wrapper Div)
Apply to `.${componentClassName}` in preview mode via CSS classes. In edit mode, apply as inline styles:
- ✅ Padding
- ✅ Margin
- ✅ Background (color/image/gradient)
- ✅ Border (color/width/radius)
- ✅ Box Shadow
- ✅ Position (top, right, bottom, left)
- ✅ Z-index
- ✅ Min-height
- ✅ Flexbox properties (flex-direction, justify-content, align-items, flex-wrap, gap)
- ✅ Sizing (width, max-width, flex-basis)

### Typography Styles (Content Class)
Apply to `.${componentClassName} .${componentName}-content` (e.g., `.text-content`, `.container-content`) in preview mode via CSS classes. In edit mode, apply as inline styles:
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
- [ ] Apply layout styles to wrapper div (`.${componentClassName}`) in preview mode via CSS classes: padding, margin, background, border, box-shadow, position, z-index, min-height, flexbox properties, sizing
- [ ] Apply layout styles as inline styles in edit mode only (`isEditMode ? styles : undefined`)
- [ ] Apply typography styles to content class (`.${componentClassName} .${componentName}-content`) in preview mode via CSS classes: font, color, text-align, etc.
- [ ] Apply typography styles as inline styles in edit mode only (`isEditMode ? styles : undefined`)
- [ ] Exclude editor UI elements (toolbars, wrappers) from content styles using CSS reset if needed
- [ ] Ensure no layout styles are applied as inline styles in preview mode (they should be `undefined`)

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

Both `Text` and `Container` components fully adhere to this pattern:

- **Text Component**: `app/builder/components/ui/Text.tsx`
  - Layout styles (padding, margin, background, border, box-shadow) are applied via CSS classes in preview mode
  - Typography styles are applied via CSS classes targeting `.text-content` in preview mode
  - All styles are applied as inline styles in edit mode only

- **Container Component**: `app/builder/components/ui/Container.tsx`
  - Layout styles (padding, margin, background, border, box-shadow, min-height, flexbox properties, sizing, position, z-index) are applied via CSS classes in preview mode
  - Typography styles are applied via CSS classes targeting `.container-content` in preview mode
  - All styles are applied as inline styles in edit mode only
  - Uses `display: contents` on content wrapper when flexbox interference is a concern

## Additional Resources

- **Content Class Pattern**: See `CONTENT_CLASS_PATTERN.md` for detailed guide on using content classes for CSS isolation
- **Responsive Pattern Guide**: See `RESPONSIVE_PATTERN_GUIDE.md` for detailed responsive CSS generation patterns
- **Responsive Export Explanation**: See `RESPONSIVE_EXPORT_EXPLANATION.md` for how responsive works in editor vs export
- **Component Styles Utilities**: See `app/builder/lib/component-styles.ts` for helper functions
- **CSS Responsive Functions**: See `app/builder/lib/style-system/css-responsive.ts` for all available generation functions


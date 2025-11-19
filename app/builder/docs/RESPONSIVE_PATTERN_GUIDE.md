# Responsive Pattern Guide for Components

This guide ensures all future components follow the correct responsive pattern used throughout the builder.

## Core Principle

**Desktop values are used as the base CSS, media queries only for mobile/tablet overrides**

## Why This Pattern?

1. **Desktop-first approach**: Desktop is typically the primary design target
2. **Efficient CSS**: Base CSS applies to all breakpoints, media queries only when needed
3. **Consistent behavior**: All components work the same way
4. **eBay compatibility**: Pure CSS, no JavaScript required

## Pattern Implementation

### ✅ Correct Pattern

All responsive CSS generation functions automatically:
- Use `responsive.desktop` as base value (if exists)
- Fall back to provided fallback value if desktop not set
- Generate media queries only for mobile/tablet when they differ from desktop
- Skip desktop in media query generation (it's already the base)

### Available Functions

All functions are in `app/builder/lib/style-system/css-responsive.ts`:

#### 1. Single Value Properties
```typescript
generateResponsiveCss(className, property, responsive, fallbackValue, fallbackUnit)
```
**Use for**: Font size, font weight, font style, text align, text transform, text decoration, letter spacing, line height, font family, z-index

**Example**:
```typescript
if (fontSizeResponsive) {
  responsiveCss += generateResponsiveCss(
    `${componentClassName} .button-content`,
    "font-size",
    fontSizeResponsive,
    fontSize ?? 16, // Fallback
    "px"
  );
} else {
  responsiveCss += `${componentClassName} .button-content { font-size: ${fontSize ?? 16}px; }\n`;
}
```

#### 2. Four-Side Properties
```typescript
generatePaddingCss(className, responsive, fallback, defaultUnit)
generateMarginCss(className, responsive, fallback, defaultUnit)
generateResponsiveFourSideCss(className, property, responsive, fallback, defaultUnit)
```
**Use for**: Padding, margin, border-width, border-radius

**Example**:
```typescript
if (paddingResponsive) {
  responsiveCss += generatePaddingCss(
    componentClassName,
    paddingResponsive,
    {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
      defaultValue: padding ?? 0, // Fallback
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

#### 3. Color Properties
```typescript
generateTextColorCss(className, responsive, fallback)
generateBackgroundColorCss(className, responsive, fallback)
generateBorderColorCss(className, responsive, fallback)
generateLinkColorCss(className, linkColorResponsive, linkColor, linkColorHoverResponsive, linkColorHover)
```
**Use for**: Text color, background color, border color, link colors

**Example**:
```typescript
if (textColorResponsive) {
  responsiveCss += generateTextColorCss(
    `${componentClassName} .button-content`,
    textColorResponsive,
    textColor ?? "#000" // Fallback
  );
} else if (textColor) {
  responsiveCss += `.${componentClassName} .button-content { color: ${textColor}; }\n`;
}
```

#### 4. Hover Colors
```typescript
generateHoverBackgroundColorCss(className, responsive, fallback)
generateHoverBorderColorCss(className, responsive, fallback)
```
**Use for**: Background hover, border hover

**Example**:
```typescript
if (enableBackgroundColorHover && backgroundColorHover && backgroundColorHoverResponsive) {
  hoverCss += generateHoverBackgroundColorCss(
    componentClassName,
    backgroundColorHoverResponsive,
    backgroundColorHover
  );
} else if (enableBackgroundColorHover && backgroundColorHover) {
  hoverCss += `.${componentClassName}:hover { background-color: ${backgroundColorHover} !important; }\n`;
}
```

#### 5. Box Shadow
```typescript
generateBoxShadowCss(className, horizontalResponsive, verticalResponsive, blurResponsive, spreadResponsive, horizontalFallback, verticalFallback, blurFallback, spreadFallback, color, position)
```
**Use for**: Box shadow

**Example**:
```typescript
if (enableBoxShadow && (boxShadowHorizontalResponsive || boxShadowVerticalResponsive || boxShadowBlurResponsive || boxShadowSpreadResponsive)) {
  responsiveCss += generateBoxShadowCss(
    componentClassName,
    boxShadowHorizontalResponsive,
    boxShadowVerticalResponsive,
    boxShadowBlurResponsive,
    boxShadowSpreadResponsive,
    boxShadowHorizontal ?? 0, // Fallback
    boxShadowVertical ?? 0,
    boxShadowBlur ?? 0,
    boxShadowSpread ?? 0,
    boxShadowColor
  );
}
```

#### 6. Position
```typescript
generatePositionCss(className, positionTopResponsive, positionRightResponsive, positionBottomResponsive, positionLeftResponsive, positionTop, positionRight, positionBottom, positionLeft, positionTopUnit, positionRightUnit, positionBottomUnit, positionLeftUnit)
```
**Use for**: Position offsets (top, right, bottom, left)

#### 7. Flex Properties
```typescript
generateResponsiveFlexCss(className, property, responsive, fallback)
```
**Use for**: Flex-direction, justify-content, align-items, flex-wrap, align-content

## Generated CSS Structure

### Example Output

**Input**: `fontSizeResponsive = { mobile: 14, tablet: 16, desktop: 18 }`, `fontSize = 16`

**Generated CSS**:
```css
/* Base CSS uses desktop value (18px) - applies to all breakpoints */
.button-abc123 .button-content { font-size: 18px; }

/* Media queries only for mobile/tablet (differ from desktop) */
@media (max-width: 767px) {
  .button-abc123 .button-content { font-size: 14px !important; }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .button-abc123 .button-content { font-size: 16px !important; }
}
/* Desktop (18px) uses base CSS, no media query needed */
```

## Common Mistakes to Avoid

### ❌ Wrong: Using resolver in preview mode
```typescript
// DON'T DO THIS in preview mode
const paddingValue = buildResponsiveFourSideValue({
  responsive: paddingResponsive,
  fallback: { defaultValue: padding },
  resolver: responsiveResolver, // ❌ Resolver is for edit mode only
});
```

### ✅ Correct: Use generation functions
```typescript
// DO THIS in preview mode
if (paddingResponsive) {
  responsiveCss += generatePaddingCss(componentClassName, paddingResponsive, {...}, "px");
}
```

### ❌ Wrong: Manually building responsive CSS
```typescript
// DON'T manually build media queries
responsiveCss += `.${className} { font-size: ${fallback}px; }\n`;
for (const bp of breakpoints) {
  if (responsive[bp] !== fallback) {
    responsiveCss += `${getMediaQuery(bp)} { .${className} { font-size: ${responsive[bp]}px; } }\n`;
  }
}
```

### ✅ Correct: Use generation functions
```typescript
// DO use the provided functions
responsiveCss += generateResponsiveCss(className, "font-size", fontSizeResponsive, fontSize ?? 16, "px");
```

## Complete Example: Button Component

```typescript
export const Button: React.FC<ButtonProps> = (props) => {
  const { id: nodeId } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const isEditMode = enabled;
  
  const componentClassName = generateComponentClassName(nodeId, props.cssId, "button");
  const shouldGenerateMediaQueries = !isEditMode;
  
  let responsiveCss = "";
  let hoverCss = "";
  
  if (shouldGenerateMediaQueries) {
    // Padding - use generation function
    if (props.paddingResponsive) {
      responsiveCss += generatePaddingCss(
        componentClassName,
        props.paddingResponsive,
        {
          top: props.paddingTop,
          right: props.paddingRight,
          bottom: props.paddingBottom,
          left: props.paddingLeft,
          defaultValue: props.padding ?? 0,
        },
        props.paddingUnit ?? "px"
      );
    } else if (props.padding !== null && props.padding !== undefined) {
      // Non-responsive: Build static CSS
      const top = props.paddingTop ?? props.padding;
      const right = props.paddingRight ?? props.padding;
      const bottom = props.paddingBottom ?? props.padding;
      const left = props.paddingLeft ?? props.padding;
      responsiveCss += `.${componentClassName} { padding: ${top}${props.paddingUnit} ${right}${props.paddingUnit} ${bottom}${props.paddingUnit} ${left}${props.paddingUnit}; }\n`;
    }
    
    // Font Size - use generation function
    if (props.fontSizeResponsive) {
      responsiveCss += generateResponsiveCss(
        `${componentClassName} .button-content`,
        "font-size",
        props.fontSizeResponsive,
        props.fontSize ?? 16,
        props.fontSizeUnit ?? "px"
      );
    } else {
      responsiveCss += `${componentClassName} .button-content { font-size: ${props.fontSize ?? 16}${props.fontSizeUnit ?? "px"}; }\n`;
    }
    
    // Text Color - use generation function
    if (props.textColorResponsive) {
      responsiveCss += generateTextColorCss(
        `${componentClassName} .button-content`,
        props.textColorResponsive,
        props.textColor ?? "#000"
      );
    } else if (props.textColor) {
      responsiveCss += `${componentClassName} .button-content { color: ${props.textColor}; }\n`;
    }
    
    // Background Color - use generation function
    if (props.backgroundColorResponsive) {
      responsiveCss += generateBackgroundColorCss(
        componentClassName,
        props.backgroundColorResponsive,
        props.backgroundColor ?? "#fff"
      );
    } else if (props.backgroundColor) {
      responsiveCss += `.${componentClassName} { background-color: ${props.backgroundColor}; }\n`;
    }
    
    // Border - use generation functions
    if (props.borderColorResponsive) {
      responsiveCss += generateBorderColorCss(
        componentClassName,
        props.borderColorResponsive,
        props.borderColor ?? "#000"
      );
    }
    
    if (props.borderWidthResponsive) {
      responsiveCss += generateResponsiveFourSideCss(
        componentClassName,
        "border-width",
        props.borderWidthResponsive,
        {
          top: props.borderTopWidth,
          right: props.borderRightWidth,
          bottom: props.borderBottomWidth,
          left: props.borderLeftWidth,
          defaultValue: props.borderWidth ?? 1,
        },
        "px"
      );
    }
    
    // Hover - use generation functions
    if (props.textColorHover && props.textColorHoverResponsive) {
      hoverCss += generateTextColorCss(
        `${componentClassName}:hover .button-content`,
        props.textColorHoverResponsive,
        props.textColorHover
      );
    } else if (props.textColorHover) {
      hoverCss += `${componentClassName}:hover .button-content { color: ${props.textColorHover} !important; }\n`;
    }
  }
  
  const styleTagContent = mergeCssSegments(responsiveCss, hoverCss);
  
  return (
    <>
      <style>{styleTagContent}</style>
      {isEditMode ? (
        <div className="button-content">
          <button style={{ /* inline styles for edit mode */ }}>
            {props.text}
          </button>
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

## Quick Reference

| Property Type | Function | Example |
|--------------|----------|---------|
| Single value (typography) | `generateResponsiveCss()` | Font size, weight, style, align |
| Single value (color) | `generateTextColorCss()`, `generateBackgroundColorCss()`, `generateBorderColorCss()` | Text, background, border colors |
| Four-side | `generatePaddingCss()`, `generateMarginCss()`, `generateResponsiveFourSideCss()` | Padding, margin, border-width, border-radius |
| Link colors | `generateLinkColorCss()` | Link color, link hover |
| Hover colors | `generateHoverBackgroundColorCss()`, `generateHoverBorderColorCss()` | Background hover, border hover |
| Box shadow | `generateBoxShadowCss()` | Box shadow |
| Position | `generatePositionCss()` | Top, right, bottom, left |
| Z-index | `generateZIndexCss()` | Z-index |
| Flex | `generateResponsiveFlexCss()` | Flex-direction, justify-content, etc. |

## Testing Checklist

- [ ] Set desktop value → Verify base CSS uses desktop value
- [ ] Set mobile/tablet values → Verify media queries generated
- [ ] Set all breakpoints → Verify desktop is base, mobile/tablet have media queries
- [ ] Test in preview mode → Verify CSS is generated correctly
- [ ] Test in edit mode → Verify inline styles work (no CSS generation)
- [ ] Export HTML → Verify media queries are present and work correctly

## Reference Implementation

See `app/builder/components/ui/Text.tsx` for the complete reference implementation with all responsive patterns.


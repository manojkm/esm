# Codebase Readiness for Component Development

This document provides a comprehensive overview of the codebase readiness for creating new components, including available patterns, reusable features, and best practices.

## ✅ Current Status

### Component Architecture
- ✅ **Feature Registry System**: Centralized registry for reusable feature controls
- ✅ **Global Defaults System**: Centralized settings for typography, colors, borders, spacing
- ✅ **Consistent Styling Patterns**: Edit/preview mode separation, content class pattern
- ✅ **Component Editing Experience**: Standardized click-to-edit with visual feedback
- ✅ **Security**: HTML sanitization system in place
- ✅ **Documentation**: Comprehensive guides for component creation

### Refactored Components
- ✅ **Heading Component**: Fully refactored (521 lines) with:
  - Extracted style helpers (`headingStyleHelpers.ts`)
  - Extracted CSS generator (`headingCssGenerator.ts`)
  - Extracted editing hook (`useHeadingEditing.ts`)
  - Extracted sub-components (`HeadingContent.tsx`, `SubHeadingContent.tsx`, `Separator.tsx`)

- ✅ **Text Component**: Fully refactored (526 lines, down from 1166 lines - 55% reduction) with:
  - Extracted style helpers (`textStyleHelpers.ts`)
  - Extracted CSS generator (`textCssGenerator.ts`)
  - Extracted editing hook (`useTextEditing.ts`)
  - Extracted HTML utilities (`textHtmlUtils.ts`)

## 📚 Available Reusable Feature Controls

All feature controls are registered in `app/builder/components/settings/shared/featureRegistry.tsx` and can be reused across components.

### Layout & Spacing
- **`spacing`**: Padding and margin controls with responsive support
- **`layout`**: Flexbox layout controls (Container-specific)
- **`childSizing`**: Child element sizing (Container-specific)
- **`parentSizing`**: Parent container sizing (Container-specific)
- **`minHeight`**: Minimum height control
- **`equalHeight`**: Equal height toggle for flex children

### Styling
- **`background`**: Background color, gradient, and image controls
- **`border`**: Border style, width, color, radius controls
- **`boxShadow`**: Box shadow controls with presets
- **`color`**: Text and link color controls

### Typography
- **`textTypography`**: Complete typography controls (Text component)
- **`headingTypography`**: Heading-specific typography controls
- **`subHeadingTypography`**: Sub-heading typography controls

#### TypographyControls Prefix Pattern

The `TypographyControls` component uses a **prefix pattern** to handle different prop naming conventions:

- **No Prefix** (e.g., Text component): Uses camelCase props directly
  - Props: `fontSize`, `fontWeight`, `textColor`, `fontSizeResponsive`, etc.
  - Config: `prefix: ""`
  
- **With Prefix** (e.g., Heading component): Uses prefixed props
  - Props: `headingFontSize`, `headingFontWeight`, `headingTextColor`, `headingFontSizeResponsive`, etc.
  - Config: `prefix: "heading"`

**Important**: When `prefix` is empty, `TypographyControls` automatically converts PascalCase keys (like `"FontSize"`) to camelCase prop names (like `"fontSize"`). This ensures proper prop name mapping for components that don't use prefixes.

**Example Usage**:
```typescript
// Text component (no prefix)
const config: TypographyConfig = {
  prefix: "", // Empty prefix = camelCase props
  // ... other config
};

// Heading component (with prefix)
const config: TypographyConfig = {
  prefix: "heading", // Prefix = headingFontSize, headingFontWeight, etc.
  // ... other config
};
```

#### Component Class Name Pattern

Both Text and Heading components follow a consistent class naming pattern:

**Pattern**: `{componentName} {componentName}-{uniqueId}`

- **Base Class**: `{componentName}` (e.g., `"text"`, `"heading"`) - Identifies component type
- **Unique Instance Class**: `{componentName}-{uniqueId}` (e.g., `"text-abc123"`, `"heading-xyz789"`) - Unique per instance

**Example**: `"text text-abc123"` or `"heading heading-xyz789"`

This matches Spectra's pattern: `"wp-block-uagb-text uagb-block-abc123"`

**CSS Generation Pattern**:
```typescript
import { generateComponentClassName, classNameToSelector } from "@/app/builder/lib/component-styles";

// Generate class name
const componentClassName = generateComponentClassName(nodeId, cssId, "button");
// Result: "button button-abc123"

// For CSS generation, convert to selector with safeguards
const cleanedComponentClassName = componentClassName.trim().replace(/^\.+/, '');
const selector = classNameToSelector(cleanedComponentClassName);
// Result: ".button.button-abc123" (with leading dot)

// For CSS functions that add their own dot
const rawClassName = cleanedComponentClassName.replace(/\s+/g, '.');
const classNameForCssFunctions = rawClassName.startsWith('.') ? rawClassName.substring(1) : rawClassName;
// Result: "button.button-abc123" (without leading dot)

// Usage in CSS generation:
// ✅ Correct: Use selector (with dot) for direct CSS
responsiveCss += `${selector} { padding: 10px; }\n`;

// ✅ Correct: Use classNameForCssFunctions (without dot) for functions
responsiveCss += generateResponsiveCss(`${classNameForCssFunctions}`, "font-size", fontSizeResponsive, 16, "px");

// ❌ Wrong: Never use .${selector} - creates double dots
responsiveCss += `.${selector} { padding: 10px; }\n`; // Results in ..button.button-abc123
```

### Advanced
- **`css`**: Custom CSS editor
- **`attributes`**: HTML attributes editor
- **`responsive`**: Responsive visibility controls
- **`position`**: Position and z-index controls
- **`htmlTag`**: HTML tag selector
- **`overflow`**: Overflow control

### Component-Specific
- **`headingContent`**: Heading content controls (tag, wrapper, alignment)
- **`headingSubHeading`**: Sub-heading enable/position controls
- **`headingSeparator`**: Separator style controls
- **`headingBottomSpacing`**: Heading bottom spacing
- **`subHeadingBottomSpacing`**: Sub-heading bottom spacing
- **`headingSeparatorStyle`**: Separator styling controls
- **`textGeneral`**: Text general settings

## 🎯 Global Defaults System

### Available Global Settings

Access via `useGlobalSettings()` hook:

```typescript
const { settings } = useGlobalSettings();
```

#### Typography Defaults (`settings.typography`)
- `fontSize`: Per-breakpoint, per-element (h1-h6, body)
- `fontWeight`: Per-type (headings, body)
- `fontStyle`: Per-type
- `textColor`: Per-type (headings, body)
- `headingTextColor`: Global heading color
- `lineHeight`: Per-type
- `letterSpacing`: Per-type
- `fontFamily`: Per-type
- `googleFonts`: Per-type
- `linkColor`: Global link color
- `linkColorHover`: Global link hover color

#### Border Defaults (`settings.borderDefaults`)
- `borderColor`: Default border color
- `borderColorHover`: Default border hover color

#### Spacing Scale (`settings.spacingScale`)
- Predefined spacing values for consistent spacing

#### Container Defaults (`settings.containerDefaults`)
- Default container settings

### Usage Pattern

```typescript
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";

const { settings } = useGlobalSettings();
const typographyDefaults = settings.typography;
const borderDefaults = settings.borderDefaults;

// Use defaults with fallbacks
const textColor = props.textColor ?? typographyDefaults.textColor?.body ?? "#1f2937";
const borderColor = props.borderColor ?? borderDefaults.borderColor;
```

## 🎨 Consistent Styling Patterns

### 1. Content Class Pattern
- **Purpose**: Isolate component styles from editor UI
- **Pattern**: `.${componentClassName} .${componentName}-content`
- **Example**: `.heading-abc123 .heading-text`
- **Documentation**: See `CONTENT_CLASS_PATTERN.md`

### 2. Edit/Preview Mode Separation
- **Edit Mode**: Inline styles for immediate visual feedback
- **Preview Mode**: CSS classes only (no inline styles for layout/typography)
- **Documentation**: See `COMPONENT_STYLE_PATTERN.md`

### 3. Responsive Pattern
- **Base**: Desktop values apply to all breakpoints
- **Media Queries**: Only for mobile/tablet overrides
- **Functions**: Use `generateResponsiveCss()`, `generateTextColorCss()`, etc.
- **Documentation**: See `RESPONSIVE_PATTERN_GUIDE.md`

### 4. CSS Generation Functions
All available in `app/builder/lib/style-system/css-responsive.ts`:
- `generateResponsiveCss()`: Single value properties
- `generatePaddingCss()`: Four-side padding
- `generateMarginCss()`: Four-side margin
- `generateTextColorCss()`: Text color
- `generateHoverTextColorCss()`: Hover text color
- `generateBackgroundColorCss()`: Background color
- `generateHoverBackgroundColorCss()`: Hover background color
- `generateBorderColorCss()`: Border color
- `generateHoverBorderColorCss()`: Hover border color
- `generateBoxShadowCss()`: Box shadow
- `generateLinkColorCss()`: Link colors
- `generatePositionCss()`: Position offsets
- `generateZIndexCss()`: Z-index

## 📖 Documentation

### Core Guides
1. **`COMPONENT_CREATION_GUIDE.md`**: Step-by-step guide for creating new components
2. **`COMPONENT_STYLE_PATTERN.md`**: Styling patterns and CSS generation
3. **`COMPONENT_EDITING_EXPERIENCE.md`**: Standard editing experience pattern
4. **`CONTENT_CLASS_PATTERN.md`**: Content class naming conventions
5. **`SECURITY.md`**: HTML sanitization and XSS protection
6. **`RESPONSIVE_PATTERN_GUIDE.md`**: Responsive CSS generation patterns
7. **`RESPONSIVE_EXPORT_EXPLANATION.md`**: How responsive works in editor vs export

### Key Patterns Documented
- ✅ Component creation workflow
- ✅ Feature registry usage
- ✅ Global defaults integration
- ✅ Style pattern (edit/preview separation)
- ✅ Content class pattern
- ✅ Responsive CSS generation
- ✅ Editing experience
- ✅ Security requirements

## 🔧 Feature Registry System

### How It Works

1. **Define Feature Controls**: Create feature control components in `app/builder/components/settings/features/`
2. **Register Features**: Add to `featureRegistry.tsx`:
   ```typescript
   export const yourComponentFeatureRegistry = createFeatureRegistry({
     yourFeature: ({ props, actions, controlId }) => (
       <YourFeatureControls props={props} actions={actions} controlId={controlId} />
     ),
     // Reuse existing features
     spacing: ({ props, actions, controlId, meta }) => (
       <SpacingControls props={props} actions={actions} controlId={controlId} />
     ),
   });
   ```
3. **Use in Settings**: Reference in JSON config and use `FeatureSettingsAccordion`

### Conditional Sections

Sections can be conditionally shown:

```typescript
{
  id: "subHeading",
  title: "Sub Heading",
  features: ["subHeadingTypography"],
  condition: (props: YourProps) => props.enableSubHeading === true
}
```

## 🏗️ Component Structure Pattern

### Recommended Structure (After Refactoring)

```
app/builder/components/ui/YourComponent/
├── types.ts                    # Component props interface
├── YourComponent.tsx           # Main component (300-500 lines)
├── yourComponentStyleHelpers.ts # Style resolution helpers
├── yourComponentCssGenerator.ts # CSS generation for preview mode
├── useYourComponentEditing.ts  # Editing state hook
├── YourComponentContent.tsx    # Content rendering component
└── SubComponent.tsx            # Sub-components (if needed)
```

### File Size Guidelines
- **Main Component**: 300-500 lines (after refactoring)
- **Helper Files**: 100-200 lines each
- **Sub-components**: 50-100 lines each

## ✅ Checklist for New Components

### Setup
- [ ] Create component types file
- [ ] Create main component file
- [ ] Create settings JSON config
- [ ] Create settings components (General, Style, Advanced)
- [ ] Register in feature registry
- [ ] Add to Toolbox
- [ ] Register in Craft.js resolver
- [ ] Export from index

### Implementation
- [ ] Use global defaults (no hardcoded values)
- [ ] Follow content class pattern
- [ ] Implement edit/preview mode separation
- [ ] Use responsive CSS generation functions
- [ ] Implement editing experience (if editable)
- [ ] Sanitize HTML content (if applicable)
- [ ] Add conditional section support (if needed)

### Refactoring (For Large Components)
- [ ] Extract style helpers
- [ ] Extract CSS generator
- [ ] Extract editing hooks
- [ ] Extract sub-components
- [ ] Keep main component under 500 lines

## 🚀 Next Steps

### Immediate
1. ✅ Heading component refactored and documented
2. ✅ Text component refactored and documented

### Future Components
- Follow Heading/Text component refactoring pattern
- Use feature registry for reusable controls
- Leverage global defaults
- Follow documented patterns
- Keep main component files under 500-600 lines

## 📝 Notes

- **Feature Registry**: All reusable features are centralized and easy to extend
- **Global Defaults**: Comprehensive system for consistent styling
- **Documentation**: Complete guides for all patterns
- **Refactoring Pattern**: Both Heading and Text components serve as reference implementations
- **Code Organization**: Clear separation of concerns (styles, CSS, editing, rendering)
- **File Size**: Both refactored components are now ~500-600 lines (down from 1000+ lines)

## 🔗 Related Files

- **Feature Registry**: `app/builder/components/settings/shared/featureRegistry.tsx`
- **Global Settings**: `app/builder/contexts/GlobalSettingsContext.tsx`
- **CSS Functions**: `app/builder/lib/style-system/css-responsive.ts`
- **Style Helpers**: `app/builder/lib/style-system/`
- **Component Styles**: `app/builder/lib/component-styles.ts`


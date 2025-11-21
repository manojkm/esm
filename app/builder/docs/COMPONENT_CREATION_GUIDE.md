# Component Creation Guide

This guide walks you through creating a new user component that integrates with the builder's feature system, settings panel, and styling patterns.

## Overview

When creating a new component, you need to:
1. Create the component file with proper props interface
2. Create the component types file
3. Create settings configuration JSON
4. Create settings components (General, Style, Advanced)
5. Register the component in the feature registry
6. Add to Toolbox
7. Register in Craft.js resolver
8. **Implement consistent editing experience** (see [Component Editing Experience Guide](./COMPONENT_EDITING_EXPERIENCE.md))

## Step-by-Step Guide

### Step 1: Create Component Types

Create `app/builder/components/ui/[component-name]/types.ts`:

```typescript
import type { ReactNode } from "react";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

export interface [ComponentName]Props {
  // Content
  text?: string;
  children?: ReactNode;
  
  // Spacing (if needed)
  padding?: number | null;
  margin?: number | null;
  paddingResponsive?: ResponsiveValue;
  marginResponsive?: ResponsiveValue;
  
  // Background (if needed)
  backgroundColor?: string;
  backgroundColorResponsive?: ResponsiveValue;
  backgroundType?: "color" | "gradient" | "image" | null;
  
  // Border (if needed)
  borderStyle?: string;
  borderColor?: string;
  enableBorderColorHover?: boolean;
  borderColorHover?: string;
  borderColorResponsive?: ResponsiveValue;
  borderColorHoverResponsive?: ResponsiveValue;
  
  // Typography (if needed)
  textColor?: string;
  textColorResponsive?: ResponsiveValue;
  
  // Add component-specific props here
  // ...
  
  // Standard props (always include)
  className?: string;
  cssId?: string;
  dataAttributes?: string;
  ariaLabel?: string;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
}
```

### Step 2: Create Component File

Create `app/builder/components/ui/[ComponentName].tsx`:

```typescript
"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { generateComponentClassName } from "@/app/builder/lib/component-styles";
import type { [ComponentName]Props } from "./[component-name]/types";

export const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  const { id, connectors, actions } = useNode();
  const { settings } = useGlobalSettings();
  
  // Get global defaults
  const globalDefaults = settings.[componentDefaults]; // e.g., typographyDefaults
  
  // Generate unique class name
  const componentClassName = generateComponentClassName(
    id,
    props.cssId,
    "[component-name]"
  );
  
  // Destructure props with defaults
  const {
    text = "",
    // ... other props
  } = props;
  
  // Build styles (see COMPONENT_STYLE_PATTERN.md for details)
  // ...
  
  // Render component
  return (
    <div
      ref={(ref) => connectors.connect(connectors.drag(ref))}
      className={componentClassName}
      // ... other props
    >
      <div className="[component-name]-content">
        {text}
      </div>
    </div>
  );
};

[ComponentName].craft = {
  displayName: "[Component Name]",
  props: {
    // Default props
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    settings: [ComponentName]Settings,
  },
};
```

### Step 3: Create Settings Configuration

Create `app/builder/components/settings/config/[component-name].settings.json`:

```json
{
  "general": [
    { "id": "general", "title": "General", "features": ["[componentName]General"] }
  ],
  "style": [
    { "id": "spacing", "title": "Spacing", "features": [{ "feature": "spacing", "meta": { "showGaps": false, "defaultPadding": null, "defaultMargin": null } }] },
    { "id": "background", "title": "Background", "features": ["background"] },
    { "id": "border", "title": "Border", "features": ["border"] },
    { "id": "boxShadow", "title": "Box Shadow", "features": ["boxShadow"] }
  ],
  "advanced": [
    { "id": "css", "title": "CSS", "features": ["css"] },
    { "id": "attributes", "title": "Attributes", "features": ["attributes"] },
    { "id": "responsive", "title": "Responsive", "features": ["responsive"] },
    { "id": "position", "title": "Position", "features": ["position"] }
  ]
}
```

### Step 4: Create Settings Components

Create `app/builder/components/settings/[ComponentName]Settings.tsx`:

```typescript
"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { [ComponentName]GeneralSettings } from "./[component-name]/[ComponentName]GeneralSettings";
import { [ComponentName]StyleSettings } from "./[component-name]/[ComponentName]StyleSettings";
import { [ComponentName]AdvancedSettings } from "./[component-name]/[ComponentName]AdvancedSettings";
import type { [ComponentName]Props } from "../ui/[component-name]/types";
import type { [ComponentName]ControlActions } from "./shared/types";
import { usePersistedTabState } from "../../hooks/usePersistedTabState";

const TABS = [
  { id: "general", label: "General" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
] as const;

export const [ComponentName]Settings: React.FC = () => {
  const { id, actions, props } = useNode((node) => ({
    props: node.data.props as [ComponentName]Props,
  }));

  const componentProps = props as [ComponentName]Props;
  const componentActions = actions as [ComponentName]ControlActions;

  const [activeTab, setActiveTab] = usePersistedTabState("[ComponentName]", "general");

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <[ComponentName]GeneralSettings props={componentProps} actions={componentActions} />
      )}

      {activeTab === "style" && (
        <[ComponentName]StyleSettings props={componentProps} actions={componentActions} />
      )}

      {activeTab === "advanced" && (
        <[ComponentName]AdvancedSettings props={componentProps} actions={componentActions} />
      )}
    </div>
  );
};
```

### Step 5: Create Settings Tab Components

Create the three settings tab components following the pattern from `ContainerSettings` or `TextSettings`:

- `[ComponentName]GeneralSettings.tsx` - Component-specific general settings
- `[ComponentName]StyleSettings.tsx` - Uses FeatureSettingsAccordion with JSON config
- `[ComponentName]AdvancedSettings.tsx` - Uses FeatureSettingsAccordion with JSON config

Example Style Settings:

```typescript
"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { [componentName]FeatureRegistry } from "../shared/featureRegistry";
import settingsConfig from "../config/[component-name].settings.json";
import type { [ComponentName]Props } from "../../ui/[component-name]/types";
import type { [ComponentName]ControlActions } from "../shared/types";

export const [ComponentName]StyleSettings: React.FC<{
  props: [ComponentName]Props;
  actions: [ComponentName]ControlActions;
}> = ({ props, actions }) => {
  return (
    <FeatureSettingsAccordion
      sections={settingsConfig.style}
      registry={[componentName]FeatureRegistry}
      props={props}
      actions={actions}
      componentType="[ComponentName]-Style"
    />
  );
};
```

### Step 6: Register in Feature Registry

Update `app/builder/components/settings/shared/featureRegistry.tsx`:

```typescript
import type { [ComponentName]Props } from "../../ui/[component-name]/types";

// Add to FeatureKey type
export type FeatureKey = "spacing" | "background" | "border" | ... | "[componentName]General";

// Create feature registry
export const [componentName]FeatureRegistry: Partial<FeatureRegistry<[ComponentName]Props>> = createFeatureRegistry({
  // Reuse shared features
  spacing: ({ props, actions, controlId, meta }) => (
    <SpacingControls
      props={props}
      actions={actions}
      controlId={`${controlId}-spacing`}
      showGaps={meta?.showGaps !== false}
      defaultPadding={meta?.defaultPadding as number | null | undefined}
      defaultMargin={meta?.defaultMargin as number | null | undefined}
    />
  ),
  background: ({ props, actions, controlId }) => (
    <BackgroundControls props={props} actions={actions} controlId={`${controlId}-background`} />
  ),
  border: ({ props, actions, controlId }) => (
    <BorderControls props={props} actions={actions} controlId={`${controlId}-border`} />
  ),
  // Add component-specific features
  [componentName]General: ({ props, actions, controlId }) => (
    <[ComponentName]GeneralControls props={props} actions={actions} controlId={`${controlId}-general`} />
  ),
});
```

### Step 7: Add to Toolbox

Update `app/builder/components/layout/Toolbox.tsx`:

```typescript
import { [ComponentName] } from "../ui";

// Add to toolbox
<div
  ref={(ref) => {
    if (ref) {
      connectors.create(ref, <[ComponentName] text="New [Component Name]" />);
    }
  }}
  className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
>
  <span className="text-gray-700">🔘 [Component Name]</span>
</div>
```

### Step 8: Register in Craft.js Resolver

Update `app/builder/components/craft-configs.ts`:

```typescript
import { [ComponentName] } from "./ui/[ComponentName]";

export const resolver = {
  [ComponentName],
  // ... other components
};
```

### Step 9: Export Component

Update `app/builder/components/ui/index.ts`:

```typescript
export { [ComponentName] } from "./[ComponentName]";
```

## Key Patterns to Follow

1. **Use Global Defaults**: Always use global settings for defaults (typography, borders, etc.)
2. **Content Class Pattern**: Apply typography styles to `.${componentClassName}-content` (see CONTENT_CLASS_PATTERN.md)
3. **Style Pattern**: Follow COMPONENT_STYLE_PATTERN.md for edit/preview mode handling
4. **Feature Reuse**: Use existing features (spacing, background, border) when possible
5. **Responsive**: Support responsive values for all style properties
6. **Hover Toggles**: Use toggles for hover effects (enableBackgroundColorHover, enableBorderColorHover)
7. **Security**: **CRITICAL** - Always sanitize HTML content to prevent XSS attacks (see SECURITY.md)

## Checklist

- [ ] Component types file created
- [ ] Component file created with proper Craft.js integration
- [ ] Settings JSON config created
- [ ] Settings component created
- [ ] General/Style/Advanced settings components created
- [ ] Feature registry updated
- [ ] Component added to Toolbox
- [ ] Component registered in Craft.js resolver
- [ ] Component exported from index
- [ ] Global defaults used (no hardcoded colors)
- [ ] Content class pattern followed
- [ ] Responsive support added
- [ ] Hover toggles implemented (if needed)
- [ ] **Editing experience implemented** (see [Component Editing Experience Guide](./COMPONENT_EDITING_EXPERIENCE.md))

## Examples

- **Text Component**: `app/builder/components/ui/Text.tsx` - Uses LexicalEditor for rich text editing
- **Heading Component**: `app/builder/components/ui/Heading.tsx` - Uses ContentEditable for simple text editing
- **Container Component**: `app/builder/components/ui/Container.tsx`
- **Text Settings**: `app/builder/components/settings/TextSettings.tsx`
- **Container Settings**: `app/builder/components/settings/ContainerSettings.tsx`

## Related Guides

- **[Component Editing Experience Guide](./COMPONENT_EDITING_EXPERIENCE.md)** - Standard editing experience pattern for all components
- **[Security Guide](./SECURITY.md)** - HTML sanitization and XSS protection
- **[Component Style Pattern](./COMPONENT_STYLE_PATTERN.md)** - Styling patterns and CSS generation
- **[Content Class Pattern](./CONTENT_CLASS_PATTERN.md)** - Content class naming conventions

## Security Requirements

### ⚠️ CRITICAL: HTML Sanitization

If your component accepts HTML content (like the Text component), you **MUST** sanitize it to prevent XSS attacks.

**Required Steps**:

1. **Import sanitization functions**:
```typescript
import { sanitizeHTML, sanitizeHTMLForPreview } from "@/app/builder/lib/html-sanitizer";
```

2. **Sanitize before rendering**:
```typescript
// ❌ WRONG - Never do this without sanitization
dangerouslySetInnerHTML: { __html: userContent }

// ✅ CORRECT - Always sanitize first
dangerouslySetInnerHTML: { __html: sanitizeHTML(userContent) }
```

3. **Use appropriate sanitization level**:
- `sanitizeHTML()` - General sanitization for edit mode
- `sanitizeHTMLForPreview()` - Stricter sanitization for preview mode
- `sanitizeHTMLForExport()` - Most restrictive for exported HTML

4. **Sanitize pasted content** (if using Lexical editor):
```typescript
// In LexicalEditor paste handler
const sanitizedHtml = sanitizeHTMLForPaste(clipboardData.getData("text/html"));
```

**See `SECURITY.md` for comprehensive security guidelines.**

## Common Pitfalls

1. **Hardcoded Defaults**: Always use global settings, never hardcode colors like `#000000`
2. **Missing Content Class**: Typography styles must target `.${componentClassName}-content`
3. **Inline Styles in Preview**: Only use inline styles in edit mode, use CSS classes in preview
4. **Missing Hover Toggle**: Always add a toggle for hover effects (enableBackgroundColorHover, etc.)
5. **Not Using Feature Registry**: Don't duplicate feature controls, reuse from registry
6. **⚠️ Missing HTML Sanitization**: **CRITICAL SECURITY ISSUE** - Never use `dangerouslySetInnerHTML` without sanitization


# Component Editing Experience Guide

This guide documents the standard editing experience pattern that all user components should follow for consistency across the builder.

## Overview

All user components that support inline text editing should provide a consistent editing experience:

1. **Click-to-edit**: Users can click anywhere on the component to start editing
2. **Visual feedback**: Clear visual indicators show when a component is selected or being edited
3. **Seamless editing**: No visible input borders or boxes - editing happens inline
4. **Consistent styling**: Green border and light green background when editing, blue border when selected

## Visual States

### 1. Not Selected (Default)
- **Appearance**: Dashed gray border with hover effect
- **Classes**: `border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer`
- **Behavior**: Shows that the component is interactive but not currently selected

### 2. Selected (Not Editing)
- **Appearance**: Blue ring border
- **Classes**: `ring-2 ring-blue-500 cursor-text`
- **Behavior**: Indicates the component is selected and ready to edit

### 3. Editing (Active)
- **Appearance**: Green ring border with light green background
- **Classes**: `ring-2 ring-green-500 bg-green-50`
- **Behavior**: Indicates the component is currently being edited

## Implementation Pattern

### Step 1: Import Required Dependencies

```typescript
import React, { useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { useNode, useEditor } from "@craftjs/core";
```

### Step 2: Set Up State Management

```typescript
export const YourComponent: React.FC<YourComponentProps> = (props) => {
  const { connectors, actions, selected, id } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const isEditMode = enabled;
  const wrapperRef = useRef<HTMLDivElement>(null);

  // State for editable content
  const [editable, setEditable] = useState(false);
  const [currentText, setCurrentText] = useState(props.text || "");

  // Reset editing state when component is deselected
  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  // Sync local state with props
  useEffect(() => {
    setCurrentText(props.text || "");
  }, [props.text]);
```

### Step 3: Implement Click Handlers

```typescript
// Handle click anywhere on wrapper to edit
const handleWrapperClick = (e: React.MouseEvent) => {
  // Prevent triggering if clicking on nested editable elements
  const target = e.target as HTMLElement;
  if (target.closest('.nested-editable-class')) {
    return;
  }
  
  if (selected && !editable && isEditMode) {
    e.stopPropagation();
    setEditable(true);
  }
};

// Handle click on specific editable element (if needed)
const handleTextClick = (e: React.MouseEvent) => {
  if (selected && !editable && isEditMode) {
    e.stopPropagation();
    setEditable(true);
  }
};
```

### Step 4: Implement Change Handlers

```typescript
// Handle content change from ContentEditable
const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
  const newText = e.currentTarget.textContent || "";
  setCurrentText(newText);
  actions.setProp((props: YourComponentProps) => {
    props.text = newText;
  });
};

// Handle blur event
const handleBlur = () => {
  setEditable(false);
};
```

### Step 5: Render with Visual Feedback

```typescript
// Determine if component is being edited
const isEditing = editable;

// Component content
const componentContent = (
  <>
    {editable && isEditMode ? (
      <ContentEditable
        html={currentText || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        tagName="div" // or appropriate tag (h1, h2, p, etc.)
        className="your-content-class"
        style={{
          ...yourStyles,
          border: "none",
          outline: "none",
          background: "transparent",
          width: "100%"
        }}
      />
    ) : (
      <div
        className="your-content-class"
        style={yourStyles}
        onClick={handleTextClick}
        {...(isEmpty && isEditMode
          ? {
              children: (
                <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                  Placeholder Text
                </span>
              ),
            }
          : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentText) } })}
      />
    )}
  </>
);

// Wrapper props
const wrapperProps = {
  id: cssId || undefined,
  "aria-label": ariaLabel || undefined,
  ...parseDataAttributes(dataAttributes),
  className: `${componentClassName} ${className}`.trim(),
  style: wrapperStyle,
};

// Render with wrapper for edit mode
return (
  <>
    <style>{styleTagContent}</style>
    {isEditMode ? (
      // Edit mode: Wrap in div for editing experience
      <div
        ref={(ref: HTMLDivElement | null) => {
          if (!ref) return;
          wrapperRef.current = ref;
          connectors.connect(connectors.drag(ref));
        }}
        className={`your-wrapper-${componentClassName.replace(/^your-component-/, "")} relative ${
          selected
            ? isEditing
              ? "ring-2 ring-green-500 bg-green-50"
              : "ring-2 ring-blue-500 cursor-text"
            : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"
        }`}
        onClick={handleWrapperClick}
      >
        {React.createElement(WrapperTag, wrapperProps, componentContent)}
      </div>
    ) : (
      // Preview mode: Use WrapperTag directly
      React.createElement(
        WrapperTag,
        {
          ...wrapperProps,
          ref: (ref: HTMLElement | null) => {
            if (!ref) return;
            connectors.connect(ref);
          },
        },
        componentContent
      )
    )}
  </>
);
```

## Complete Example: Single Editable Field

Here's a complete example for a component with a single editable text field:

```typescript
"use client";

import React, { useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { useNode, useEditor } from "@craftjs/core";
import { sanitizeHTML } from "@/app/builder/lib/html-sanitizer";

export const ExampleComponent: React.FC<ExampleComponentProps> = (props) => {
  const { connectors, actions, selected, id } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const isEditMode = enabled;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [editable, setEditable] = useState(false);
  const [currentText, setCurrentText] = useState(props.text || "");

  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  useEffect(() => {
    setCurrentText(props.text || "");
  }, [props.text]);

  const handleWrapperClick = (e: React.MouseEvent) => {
    if (selected && !editable && isEditMode) {
      e.stopPropagation();
      setEditable(true);
    }
  };

  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    setCurrentText(newText);
    actions.setProp((props: ExampleComponentProps) => {
      props.text = newText;
    });
  };

  const handleBlur = () => {
    setEditable(false);
  };

  const isEmpty = !currentText || currentText.trim() === "";
  const isEditing = editable;

  const content = (
    <>
      {editable && isEditMode ? (
        <ContentEditable
          html={currentText || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          tagName="div"
          className="example-content"
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%"
          }}
        />
      ) : (
        <div
          className="example-content"
          onClick={handleWrapperClick}
          {...(isEmpty && isEditMode
            ? {
                children: (
                  <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
                    Click to edit
                  </span>
                ),
              }
            : { dangerouslySetInnerHTML: { __html: sanitizeHTML(currentText) } })}
        />
      )}
    </>
  );

  return (
    <>
      {isEditMode ? (
        <div
          ref={(ref: HTMLDivElement | null) => {
            if (!ref) return;
            wrapperRef.current = ref;
            connectors.connect(connectors.drag(ref));
          }}
          className={`example-wrapper relative ${
            selected
              ? isEditing
                ? "ring-2 ring-green-500 bg-green-50"
                : "ring-2 ring-blue-500 cursor-text"
              : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"
          }`}
          onClick={handleWrapperClick}
        >
          {content}
        </div>
      ) : (
        <div
          ref={(ref: HTMLDivElement | null) => {
            if (!ref) return;
            connectors.connect(ref);
          }}
        >
          {content}
        </div>
      )}
    </>
  );
};
```

## Multiple Editable Fields

For components with multiple editable fields (like Heading with heading and sub-heading):

```typescript
// State for multiple editable fields
const [editableHeading, setEditableHeading] = useState(false);
const [editableSubHeading, setEditableSubHeading] = useState(false);
const [currentHeadingText, setCurrentHeadingText] = useState(props.heading || "");
const [currentSubHeadingText, setCurrentSubHeadingText] = useState(props.subHeading || "");

// Determine if any field is being edited
const isEditing = editableHeading || editableSubHeading;

// Handle wrapper click - edit heading by default
const handleWrapperClick = (e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
  // Don't trigger if clicking on sub-heading
  if (target.closest('.sub-heading-text')) {
    return;
  }
  if (selected && !editableHeading && !editableSubHeading && isEditMode) {
    e.stopPropagation();
    setEditableHeading(true);
  }
};

// Separate handlers for each field
const handleHeadingChange = (e: React.FormEvent<HTMLDivElement>) => {
  const newText = e.currentTarget.textContent || "";
  setCurrentHeadingText(newText);
  actions.setProp((props: YourComponentProps) => {
    props.heading = newText;
  });
};

const handleSubHeadingChange = (e: React.FormEvent<HTMLDivElement>) => {
  const newText = e.currentTarget.textContent || "";
  setCurrentSubHeadingText(newText);
  actions.setProp((props: YourComponentProps) => {
    props.subHeading = newText;
  });
};
```

## Key Requirements

### 1. Use `react-contenteditable`
- Always use `ContentEditable` from `react-contenteditable` for inline editing
- Never use plain `<input>` or `<textarea>` elements
- Set `border: "none"`, `outline: "none"`, and `background: "transparent"` on ContentEditable

### 2. Visual Feedback Classes
- **Not selected**: `border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer`
- **Selected (not editing)**: `ring-2 ring-blue-500 cursor-text`
- **Editing**: `ring-2 ring-green-500 bg-green-50`

### 3. Click Handling
- Wrapper div should handle clicks to initiate editing
- Use `e.stopPropagation()` to prevent Craft.js selection conflicts
- Check for nested editable elements to avoid conflicts

### 4. State Management
- Track editing state with `useState`
- Reset editing state when component is deselected
- Sync local state with props using `useEffect`

### 5. Content Sanitization
- Always sanitize HTML content using `sanitizeHTML()` before rendering
- Use `dangerouslySetInnerHTML` only with sanitized content
- Never render unsanitized user content

### 6. Placeholder Handling
- Show placeholder text when content is empty and in edit mode
- Use `pointer-events-none select-none` classes on placeholder
- Use gray color (`#9ca3af`) for placeholder text

## Best Practices

1. **Consistency**: Always follow the same pattern for all editable components
2. **Accessibility**: Include proper `aria-label` attributes
3. **Performance**: Update props only on blur or change, not on every keystroke (if needed)
4. **Security**: Always sanitize HTML content before rendering
5. **User Experience**: Provide clear visual feedback for all interaction states
6. **Code Organization**: Keep editing logic separate from rendering logic

## Checklist for New Components

When creating a new editable component, ensure:

- [ ] Import `ContentEditable` from `react-contenteditable`
- [ ] Set up state for editable content (`editable`, `currentText`)
- [ ] Implement `handleWrapperClick` for click-to-edit
- [ ] Implement `handleChange` using `e.currentTarget.textContent`
- [ ] Implement `handleBlur` to exit editing mode
- [ ] Add wrapper div in edit mode with proper classes
- [ ] Apply visual feedback classes based on state
- [ ] Remove borders/outlines from ContentEditable
- [ ] Sanitize HTML content before rendering
- [ ] Handle empty state with placeholder
- [ ] Reset editing state when deselected
- [ ] Connect drag handler to wrapper ref
- [ ] Test click-to-edit functionality
- [ ] Test visual feedback states
- [ ] Test with multiple editable fields (if applicable)

## Reference Components

- **Text Component**: `app/builder/components/ui/Text.tsx` - Uses LexicalEditor for rich text
- **Heading Component**: `app/builder/components/ui/Heading.tsx` - Uses ContentEditable for simple text editing

## Notes

- The Text component uses `LexicalEditor` instead of `ContentEditable` because it supports rich text formatting
- For simple text editing (like headings), use `ContentEditable`
- For rich text editing (with formatting, links, etc.), use `LexicalEditor`
- Both follow the same visual feedback pattern (green border/background when editing)


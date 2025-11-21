"use client";

import React from "react";
import { TypographyControls, type TypographyConfig } from "../shared/TypographyControls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

export interface TextTypographyFeatureProps {
  textColor?: string | null;
  textColorResponsive?: ResponsiveValue;
  textColorHover?: string | null;
  textColorHoverResponsive?: ResponsiveValue;
  linkColor?: string | null;
  linkColorResponsive?: ResponsiveValue;
  linkColorHover?: string | null;
  linkColorHoverResponsive?: ResponsiveValue;
  fontFamily?: string | null;
  fontFamilyResponsive?: ResponsiveValue;
  fontSize?: number;
  fontSizeResponsive?: ResponsiveValue;
  fontSizeUnit?: "px" | "rem" | "em" | "%";
  fontWeight?: number | string;
  fontWeightResponsive?: ResponsiveValue;
  fontStyle?: "normal" | "italic" | "oblique";
  fontStyleResponsive?: ResponsiveValue;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textTransformResponsive?: ResponsiveValue;
  textDecoration?: "none" | "underline" | "overline" | "line-through" | "underline overline";
  textDecorationResponsive?: ResponsiveValue;
  letterSpacing?: number;
  letterSpacingResponsive?: ResponsiveValue;
  letterSpacingUnit?: "px" | "em";
  lineHeight?: number;
  lineHeightResponsive?: ResponsiveValue;
  lineHeightUnit?: "px" | "em" | "rem" | "normal" | "number";
  htmlTag?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface TextTypographyControlsProps<TProps extends TextTypographyFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const TextTypographyControls = <TProps extends TextTypographyFeatureProps>({ props, actions, controlId = "text-typography" }: TextTypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const baseId = `text-typography-${controlId}`;

  // Get typography defaults based on htmlTag
  const getTypographyElement = (): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" => {
    if (props.htmlTag?.startsWith("h")) {
      return props.htmlTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    }
    return "body";
  };

  const typographyElement = getTypographyElement();
  const isHeading = typographyElement !== "body";
  const typographyType = isHeading ? "headings" : "body";

  // Get global defaults
  const globalFontSize = settings.typography.fontSize?.desktop?.[typographyElement];
  const globalFontWeight = settings.typography.fontWeight?.[typographyType];
  const globalFontStyle = settings.typography.fontStyle?.[typographyType];
  const globalTextColor = settings.typography.textColor?.[typographyType];
  const globalLineHeight = settings.typography.lineHeight?.[typographyType];
  const globalLetterSpacing = settings.typography.letterSpacing?.[typographyType];

  const config: TypographyConfig = {
    prefix: "", // Text component uses no prefix
    baseId,
    controlId,
    typographyElement,
    defaults: {
      fontSize: globalFontSize ?? 16,
      fontWeight: globalFontWeight ?? 400,
      fontStyle: globalFontStyle || "normal",
      lineHeight: globalLineHeight ?? 1.6,
      letterSpacing: globalLetterSpacing ?? 0,
      textColor: globalTextColor || "#1f2937",
    },
    features: {
      linkColors: true, // Text component has link colors
      lineHeightUnitStyle: "select", // Use select style for consistency
    },
  };

  return <TypographyControls props={props} actions={actions} config={config} />;
};

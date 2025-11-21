"use client";

import React from "react";
import { TypographyControls, type TypographyConfig } from "../shared/TypographyControls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

export interface HeadingTypographyFeatureProps {
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  headingTextColor?: string;
  headingTextColorResponsive?: ResponsiveValue;
  headingTextColorHover?: string;
  headingTextColorHoverResponsive?: ResponsiveValue;
  headingFontFamily?: string;
  headingFontFamilyResponsive?: ResponsiveValue;
  headingFontSize?: number;
  headingFontSizeResponsive?: ResponsiveValue;
  headingFontSizeUnit?: string;
  headingFontWeight?: string;
  headingFontWeightResponsive?: ResponsiveValue;
  headingFontStyle?: string;
  headingFontStyleResponsive?: ResponsiveValue;
  headingTextTransform?: string;
  headingTextTransformResponsive?: ResponsiveValue;
  headingTextDecoration?: string;
  headingTextDecorationResponsive?: ResponsiveValue;
  headingLetterSpacing?: number;
  headingLetterSpacingResponsive?: ResponsiveValue;
  headingLetterSpacingUnit?: string;
  headingLineHeight?: number | string;
  headingLineHeightResponsive?: ResponsiveValue;
  headingLineHeightUnit?: string;
}

export interface HeadingTypographyControlsProps<TProps extends HeadingTypographyFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const HeadingTypographyControls = <TProps extends HeadingTypographyFeatureProps>({ props, actions, controlId = "heading-typography" }: HeadingTypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const baseId = `heading-typography-${controlId}`;

  // Get typography defaults based on headingTag
  const getTypographyElement = (): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" => {
    if (props.headingTag?.startsWith("h")) {
      return props.headingTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
    prefix: "heading", // Heading component uses "heading" prefix
    baseId,
    controlId,
    typographyElement,
    defaults: {
      fontSize: globalFontSize ?? 24,
      fontWeight: globalFontWeight ?? 700,
      fontStyle: globalFontStyle || "normal",
      lineHeight: globalLineHeight ?? 1.2,
      letterSpacing: globalLetterSpacing ?? 0,
      textColor: globalTextColor || "#1f2937",
    },
    features: {
      linkColors: false, // Heading component doesn't have link colors
      lineHeightUnitStyle: "select", // Heading uses select style for line height unit
    },
  };

  return <TypographyControls props={props} actions={actions} config={config} />;
};

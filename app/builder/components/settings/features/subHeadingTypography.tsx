"use client";

import React from "react";
import { TypographyControls, type TypographyConfig } from "../shared/TypographyControls";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

export interface SubHeadingTypographyFeatureProps {
  subHeadingTextColor?: string;
  subHeadingTextColorResponsive?: ResponsiveValue;
  subHeadingTextColorHover?: string;
  subHeadingTextColorHoverResponsive?: ResponsiveValue;
  subHeadingFontFamily?: string;
  subHeadingFontFamilyResponsive?: ResponsiveValue;
  subHeadingFontSize?: number;
  subHeadingFontSizeResponsive?: ResponsiveValue;
  subHeadingFontSizeUnit?: string;
  subHeadingFontWeight?: string;
  subHeadingFontWeightResponsive?: ResponsiveValue;
  subHeadingFontStyle?: string;
  subHeadingFontStyleResponsive?: ResponsiveValue;
  subHeadingTextTransform?: string;
  subHeadingTextTransformResponsive?: ResponsiveValue;
  subHeadingTextDecoration?: string;
  subHeadingTextDecorationResponsive?: ResponsiveValue;
  subHeadingLetterSpacing?: number;
  subHeadingLetterSpacingResponsive?: ResponsiveValue;
  subHeadingLetterSpacingUnit?: string;
  subHeadingLineHeight?: number | string;
  subHeadingLineHeightResponsive?: ResponsiveValue;
  subHeadingLineHeightUnit?: string;
}

export interface SubHeadingTypographyControlsProps<TProps extends SubHeadingTypographyFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const SubHeadingTypographyControls = <TProps extends SubHeadingTypographyFeatureProps>({ props, actions, controlId = "sub-heading-typography" }: SubHeadingTypographyControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const baseId = `sub-heading-typography-${controlId}`;

  // Get global defaults for body/sub-heading
  const globalFontSize = settings.typography.fontSize?.desktop?.body;
  const globalFontWeight = settings.typography.fontWeight?.body;
  const globalFontStyle = settings.typography.fontStyle?.body;
  const globalTextColor = settings.typography.textColor?.body;
  const globalLineHeight = settings.typography.lineHeight?.body;
  const globalLetterSpacing = settings.typography.letterSpacing?.body;

  const config: TypographyConfig = {
    prefix: "subHeading", // Sub-heading component uses "subHeading" prefix
    baseId,
    controlId,
    typographyElement: "body", // Sub-heading uses body typography defaults
    defaults: {
      fontSize: globalFontSize ?? 16,
      fontWeight: globalFontWeight ?? 400,
      fontStyle: globalFontStyle || "normal",
      lineHeight: globalLineHeight ?? 1.6,
      letterSpacing: globalLetterSpacing ?? 0,
      textColor: globalTextColor || "#1f2937",
    },
    features: {
      linkColors: false, // Sub-heading component doesn't have link colors
      lineHeightUnitStyle: "select", // Sub-heading uses select style for line height unit
    },
  };

  return <TypographyControls props={props} actions={actions} config={config} />;
};

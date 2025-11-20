import type { ReactNode } from "react";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

export interface HeadingProps {
  // Content
  text?: string;
  subHeading?: string;
  enableSubHeading?: boolean;
  subHeadingPosition?: "above" | "below";
  
  // Heading configuration
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  headingWrapper?: "div" | "header";
  textAlign?: string;
  textAlignResponsive?: ResponsiveValue;
  
  // Separator
  separatorStyle?: "none" | "solid" | "double" | "dashed" | "dotted";
  separatorWidth?: number;
  separatorWidthResponsive?: ResponsiveValue;
  separatorWidthUnit?: string;
  separatorThickness?: number;
  separatorColor?: string;
  separatorColorResponsive?: ResponsiveValue;
  separatorBottomSpacing?: number;
  separatorBottomSpacingResponsive?: ResponsiveValue;
  separatorBottomSpacingUnit?: string;
  
  // Typography - Heading
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
  headingTextColor?: string;
  headingTextColorResponsive?: ResponsiveValue;
  headingTextColorHover?: string;
  headingTextColorHoverResponsive?: ResponsiveValue;
  headingBottomSpacing?: number;
  headingBottomSpacingResponsive?: ResponsiveValue;
  headingBottomSpacingUnit?: string;
  
  // Typography - Sub Heading
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
  subHeadingTextColor?: string;
  subHeadingTextColorResponsive?: ResponsiveValue;
  subHeadingTextColorHover?: string;
  subHeadingTextColorHoverResponsive?: ResponsiveValue;
  subHeadingBottomSpacing?: number;
  subHeadingBottomSpacingResponsive?: ResponsiveValue;
  subHeadingBottomSpacingUnit?: string;
  
  // Spacing
  padding?: number | null;
  margin?: number | null;
  paddingTop?: number | null;
  paddingRight?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
  paddingUnit?: string;
  marginTop?: number | null;
  marginRight?: number | null;
  marginBottom?: number | null;
  marginLeft?: number | null;
  marginUnit?: string;
  paddingResponsive?: ResponsiveValue;
  marginResponsive?: ResponsiveValue;
  
  // Background
  backgroundColor?: string;
  enableBackgroundColorHover?: boolean;
  backgroundColorHover?: string | null;
  backgroundColorResponsive?: ResponsiveValue;
  backgroundColorHoverResponsive?: ResponsiveValue;
  backgroundType?: "color" | "gradient" | "image" | null;
  backgroundGradient?: string;
  backgroundGradientHover?: string;
  backgroundImage?: string;
  enableBackgroundOverlay?: boolean;
  overlayType?: "color" | "gradient" | "image" | null;
  overlayColor?: string | null;
  overlayColorResponsive?: ResponsiveValue;
  overlayImage?: string;
  overlayPosition?: string;
  overlayPositionResponsive?: ResponsiveValue;
  overlayAttachment?: string;
  overlayAttachmentResponsive?: ResponsiveValue;
  overlayBlendMode?: string;
  overlayBlendModeResponsive?: ResponsiveValue;
  overlayRepeat?: string;
  overlayRepeatResponsive?: ResponsiveValue;
  overlayOpacity?: number;
  
  // Border
  borderRadius?: number;
  borderTopLeftRadius?: number | null;
  borderTopRightRadius?: number | null;
  borderBottomRightRadius?: number | null;
  borderBottomLeftRadius?: number | null;
  borderRadiusUnit?: string;
  borderRadiusResponsive?: ResponsiveValue;
  borderWidthResponsive?: ResponsiveValue;
  borderStyle?: string;
  borderWidth?: number;
  borderTopWidth?: number | null;
  borderRightWidth?: number | null;
  borderBottomWidth?: number | null;
  borderLeftWidth?: number | null;
  borderColor?: string;
  enableBorderColorHover?: boolean;
  borderColorHover?: string;
  borderColorResponsive?: ResponsiveValue;
  borderColorHoverResponsive?: ResponsiveValue;
  
  // Box Shadow
  boxShadowColor?: string;
  boxShadowColorHover?: string;
  boxShadowHorizontal?: number;
  boxShadowVertical?: number;
  boxShadowBlur?: number;
  boxShadowSpread?: number;
  boxShadowPosition?: string;
  boxShadowHorizontalHover?: number;
  boxShadowVerticalHover?: number;
  boxShadowBlurHover?: number;
  boxShadowSpreadHover?: number;
  boxShadowPositionHover?: string;
  boxShadowPreset?: string | null;
  enableBoxShadow?: boolean;
  enableBoxShadowHover?: boolean;
  boxShadowHorizontalResponsive?: ResponsiveValue;
  boxShadowVerticalResponsive?: ResponsiveValue;
  boxShadowBlurResponsive?: ResponsiveValue;
  boxShadowSpreadResponsive?: ResponsiveValue;
  boxShadowHorizontalHoverResponsive?: ResponsiveValue;
  boxShadowVerticalHoverResponsive?: ResponsiveValue;
  boxShadowBlurHoverResponsive?: ResponsiveValue;
  boxShadowSpreadHoverResponsive?: ResponsiveValue;
  
  // Position
  position?: string;
  positionResponsive?: ResponsiveValue;
  top?: number | null;
  right?: number | null;
  bottom?: number | null;
  left?: number | null;
  positionUnit?: string;
  zIndex?: number | null;
  zIndexResponsive?: ResponsiveValue;
  
  // Attributes & Visibility
  className?: string;
  cssId?: string;
  dataAttributes?: string;
  ariaLabel?: string;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnLandscapeMobile?: boolean;
  hideOnMobile?: boolean;
  
  // Custom CSS
  customCSS?: string;
}


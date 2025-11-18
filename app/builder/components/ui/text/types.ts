import type { ReactNode } from "react";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

export interface TextProps {
  // Content
  text?: string;
  htmlTag?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  
  // General
  textAlign?: "left" | "center" | "right" | "justify";
  textAlignResponsive?: ResponsiveValue;
  
  // Typography
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
  fontWeight?: number | string; // 100-900 or "normal", "bold", etc.
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
  
  // Spacing
  padding?: number;
  margin?: number;
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
  backgroundType?: string | null;
  backgroundGradient?: string;
  backgroundGradientHover?: string;
  backgroundImage?: string;
  // Background Overlay
  enableBackgroundOverlay?: boolean;
  overlayType?: string | null;
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
  overlaySize?: string;
  overlaySizeResponsive?: ResponsiveValue;
  overlayOpacity?: number;
  overlayOpacityResponsive?: ResponsiveValue;
  
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
  boxShadowPosition?: "inset" | "outset";
  boxShadowHorizontalHover?: number;
  boxShadowVerticalHover?: number;
  boxShadowBlurHover?: number;
  boxShadowSpreadHover?: number;
  boxShadowPositionHover?: "inset" | "outset";
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
  
  // Advanced
  className?: string;
  cssId?: string;
  dataAttributes?: string;
  ariaLabel?: string;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnLandscapeMobile?: boolean;
  hideOnMobile?: boolean;
  position?: string;
  positionTop?: number | null;
  positionRight?: number | null;
  positionBottom?: number | null;
  positionLeft?: number | null;
  positionTopUnit?: string;
  positionRightUnit?: string;
  positionBottomUnit?: string;
  positionLeftUnit?: string;
  positionTopResponsive?: ResponsiveValue;
  positionRightResponsive?: ResponsiveValue;
  positionBottomResponsive?: ResponsiveValue;
  positionLeftResponsive?: ResponsiveValue;
  zIndex?: number | null;
  zIndexResponsive?: ResponsiveValue;
}


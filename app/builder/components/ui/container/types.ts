import type { ReactNode } from "react";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

interface LayoutColumn {
  width: number;
}

export interface SelectedLayout {
  cols: LayoutColumn[];
}

export interface ContainerProps {
  children?: ReactNode;
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
  rowGap?: number;
  columnGap?: number;
  rowGapUnit?: string;
  columnGapUnit?: string;
  paddingResponsive?: ResponsiveValue;
  marginResponsive?: ResponsiveValue;
  rowGapResponsive?: ResponsiveValue;
  columnGapResponsive?: ResponsiveValue;
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
  // Border & Shadow
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
  // Typography
  textColor?: string | null;
  linkColor?: string | null;
  linkColorHover?: string | null;
  textColorResponsive?: ResponsiveValue;
  linkColorResponsive?: ResponsiveValue;
  linkColorHoverResponsive?: ResponsiveValue;
  // Attributes & Visibility
  className?: string;
  cssId?: string;
  dataAttributes?: string;
  ariaLabel?: string;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnLandscapeMobile?: boolean;
  hideOnMobile?: boolean;
  // Layout & Sizing
  showLayoutPicker?: boolean;
  layout?: string;
  selectedLayout?: SelectedLayout | null;
  flexBasis?: number | null;
  flexBasisUnit?: string;
  flexBasisResponsive?: ResponsiveValue;
  containerWidth?: string;
  contentWidth?: string;
  contentBoxWidth?: number;
  contentBoxWidthUnit?: string;
  contentBoxWidthResponsive?: ResponsiveValue;
  customWidth?: number;
  customWidthUnit?: string;
  customWidthResponsive?: ResponsiveValue;
  minHeight?: number;
  minHeightUnit?: string;
  enableMinHeight?: boolean;
  minHeightResponsive?: ResponsiveValue;
  equalHeight?: boolean;
  htmlTag?: string;
  overflow?: string;
  // Flexbox Children Controls
  flexDirection?: string;
  flexDirectionResponsive?: ResponsiveValue;
  justifyContent?: string;
  justifyContentResponsive?: ResponsiveValue;
  alignItems?: string;
  alignItemsResponsive?: ResponsiveValue;
  flexWrap?: string;
  flexWrapResponsive?: ResponsiveValue;
  alignContent?: string;
  // Positioning
  position?: string;
  positionTop?: number | null;
  positionRight?: number | null;
  positionBottom?: number | null;
  positionLeft?: number | null;
  positionTopUnit?: string;
  positionRightUnit?: string;
  positionBottomUnit?: string;
  positionLeftUnit?: string;
  zIndex?: number | null;
}

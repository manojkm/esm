import type { ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { resolveResponsiveValue } from "./responsive";

interface BackgroundHoverOptions {
  type?: string | null;
  colorHover?: string | null;
  colorHoverResponsive?: ResponsiveValue;
  gradientHover?: string;
  resolver: ResponsiveResolver;
}

export const buildBackgroundHoverCss = ({ type, colorHover, colorHoverResponsive, gradientHover, resolver }: BackgroundHoverOptions) => {
  if (!type) {
    return "";
  }

  switch (type) {
    case "color": {
      const resolvedColor = resolveResponsiveValue<string>({
        resolver,
        responsive: colorHoverResponsive as ResponsiveMap<string> | undefined,
        fallback: colorHover ?? "",
      });
      return resolvedColor ? `background-color: ${resolvedColor} !important; ` : "";
    }
    case "gradient":
      return gradientHover ? `background: ${gradientHover} !important; ` : "";
    default:
      return "";
  }
};

interface BorderHoverOptions {
  style?: string | null;
  colorHover?: string | null;
  colorHoverResponsive?: ResponsiveValue;
  resolver: ResponsiveResolver;
}

export const buildBorderHoverCss = ({ style, colorHover, colorHoverResponsive, resolver }: BorderHoverOptions) => {
  if (!style || style === "none") {
    return "";
  }

  const resolvedColor = resolveResponsiveValue<string>({
    resolver,
    responsive: colorHoverResponsive as ResponsiveMap<string> | undefined,
    fallback: colorHover ?? "",
  });

  return resolvedColor ? `border-color: ${resolvedColor} !important; ` : "";
};

interface VisibilityOptions {
  hoverClassName: string;
  isEditMode: boolean;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnLandscapeMobile?: boolean;
  hideOnMobile?: boolean;
}

export const buildVisibilityCss = ({ hoverClassName, isEditMode, hideOnDesktop, hideOnTablet, hideOnLandscapeMobile, hideOnMobile }: VisibilityOptions) => {
  if (isEditMode) {
    return "";
  }

  let css = "";

  if (hideOnDesktop) {
    css += `@media (min-width: 1024px) { .${hoverClassName} { display: none !important; } } `;
  }
  if (hideOnTablet) {
    css += `@media (min-width: 768px) and (max-width: 1023px) { .${hoverClassName} { display: none !important; } } `;
  }
  if (hideOnLandscapeMobile) {
    css += `@media (min-width: 480px) and (max-width: 767px) { .${hoverClassName} { display: none !important; } } `;
  }
  if (hideOnMobile) {
    css += `@media (max-width: 479px) { .${hoverClassName} { display: none !important; } } `;
  }

  return css;
};

export const buildHoverRule = (hoverClassName: string, rules: string) => (rules ? `.${hoverClassName}:hover { ${rules} }` : "");

export const mergeCssSegments = (...segments: Array<string | undefined>) => segments.filter(Boolean).join("");


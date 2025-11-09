import type { CSSProperties } from "react";
import type { ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { resolveResponsiveValue } from "./responsive";

interface BackgroundOptions {
  type?: string | null;
  color?: string | null;
  colorResponsive?: ResponsiveValue;
  gradient?: string;
  image?: string;
  resolver: ResponsiveResolver;
}

export const buildBackgroundStyles = ({ type, color, colorResponsive, gradient, image, resolver }: BackgroundOptions): CSSProperties => {
  if (!type) {
    return {};
  }

  switch (type) {
    case "color": {
      const resolvedColor = resolveResponsiveValue<string>({
        resolver,
        responsive: colorResponsive as ResponsiveMap<string>,
        fallback: color ?? "",
      });
      return resolvedColor ? { backgroundColor: resolvedColor } : {};
    }
    case "gradient":
      return gradient
        ? {
            background: gradient,
          }
        : {};
    case "image":
      return image
        ? {
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
        : {};
    default:
      return {};
  }
};


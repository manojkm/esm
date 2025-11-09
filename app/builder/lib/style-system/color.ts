import type { CSSProperties } from "react";
import type { ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { resolveResponsiveValue } from "./responsive";

interface TextColorOptions {
  color?: string | null;
}

export const buildTextColorStyles = ({ color }: TextColorOptions): CSSProperties => {
  if (!color) {
    return {};
  }

  return { color };
};

interface LinkColorOptions {
  baseSelector: string;
  linkColor?: string | null;
  linkColorHover?: string | null;
}

export const buildLinkColorCss = ({ baseSelector, linkColor, linkColorHover }: LinkColorOptions) => {
  let css = "";

  if (linkColor) {
    css += `${baseSelector} a { color: ${linkColor} !important; } `;
  }

  if (linkColorHover) {
    css += `${baseSelector} a:hover { color: ${linkColorHover} !important; } `;
  }

  return css;
};

interface BorderColorOptions {
  resolver: ResponsiveResolver;
  responsive?: ResponsiveValue;
  fallback?: string | null;
}

export const resolveBorderColor = ({ resolver, responsive, fallback }: BorderColorOptions) =>
  resolveResponsiveValue<string>({
    resolver,
    responsive: responsive as ResponsiveMap<string> | undefined,
    fallback: fallback ?? "",
  });


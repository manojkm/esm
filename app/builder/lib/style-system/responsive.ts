import type { ResponsiveMap, ResponsiveResolver } from "./types";

export const resolveResponsiveValue = <T>(params: {
  resolver: ResponsiveResolver;
  responsive?: ResponsiveMap<T>;
  fallback: T;
}): T => {
  const { resolver, responsive, fallback } = params;
  if (!responsive) {
    return fallback;
  }
  return resolver(responsive, fallback);
};

export const resolveResponsiveBoolean = (params: {
  resolver: ResponsiveResolver;
  responsive?: ResponsiveMap<boolean>;
  fallback: boolean;
}): boolean => resolveResponsiveValue(params);


import type { BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";

export type ResponsiveMap<T> = Partial<Record<BreakpointKey, T>>;

export interface ResponsiveDirectional<T = number> {
  top?: ResponsiveMap<T>;
  right?: ResponsiveMap<T>;
  bottom?: ResponsiveMap<T>;
  left?: ResponsiveMap<T>;
}

export interface ResponsiveValue extends ResponsiveMap<number | string>, ResponsiveDirectional<number> {
  unit?: ResponsiveMap<string>;
}

export type ResponsiveResolver = <T>(values: ResponsiveMap<T> | undefined, fallback: T) => T;


import type { ContainerProps } from "../../ui/container/types";

export interface ComponentControlActions<TProps> {
  setProp: (setter: (draft: TProps) => void, throttleRate?: number) => void;
}

export interface ComponentControlProps<TProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
}

export type ContainerControlActions = ComponentControlActions<ContainerProps>;
export type ContainerControlProps = ComponentControlProps<ContainerProps>;

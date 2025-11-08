import type { ContainerProps } from "../../ui/Container";

export interface ContainerControlActions {
  setProp: (setter: (draft: ContainerProps) => void, throttleRate?: number) => void;
}

export interface ContainerControlProps {
  props: ContainerProps;
  actions: ContainerControlActions;
}



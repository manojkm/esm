import { Container, Text } from './ui';
import { ContainerSettings, TextSettings } from './settings';

// Add craft configs
Container.craft = {
  isCanvas: true,
  related: {
    settings: ContainerSettings,
  },
};

// Merge Text craft config with settings
Text.craft = {
  ...Text.craft,
  related: {
    settings: TextSettings,
  },
};

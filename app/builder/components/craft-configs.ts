import { Container, Text, Heading } from './ui';
import { ContainerSettings, TextSettings, HeadingSettings } from './settings';

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

// Merge Heading craft config with settings
Heading.craft = {
  ...Heading.craft,
  related: {
    settings: HeadingSettings,
  },
};

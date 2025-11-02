import { Container, Image, Heading, Video, Icon } from './ui';
import { ContainerSettings, ImageSettings, HeadingSettings, VideoSettings, IconSettings } from './settings';

// Add craft configs
Container.craft = {
  isCanvas: true,
  related: {
    settings: ContainerSettings,
  },
};

Image.craft = {
  related: {
    settings: ImageSettings,
  },
};

Heading.craft = {
  related: {
    settings: HeadingSettings,
  },
};

Video.craft = {
  related: {
    settings: VideoSettings,
  },
};

Icon.craft = {
  related: {
    settings: IconSettings,
  },
};
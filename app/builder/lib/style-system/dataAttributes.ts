export const parseDataAttributes = (attributes?: string) => {
  if (!attributes) {
    return {};
  }

  const attrs: Record<string, string> = {};

  attributes.split("\n").forEach((line) => {
    const match = line.trim().match(/^([^=]+)=["']([^"']*)["']$/);
    if (match) {
      attrs[match[1]] = match[2];
    }
  });

  return attrs;
};


interface RadiusVariable {
  name: string;
  value: string;
  description?: string;
}

interface RadiusCategory {
  name: string;
  radii: RadiusVariable[];
}

export function parseRadiusScheme(cssContent: string) {
  const primitiveRadii: Record<string, RadiusCategory> = {
    sizes: { name: 'Size Variants', radii: [] },
  };

  const semanticRadii: Record<string, RadiusCategory> = {
    components: { name: 'Component Radii', radii: [] },
  };

  const lines = cssContent.split('\n');
  const variableRegex = /^\s*(--.+?):\s*(.+?);(?:\s*\/\*([^*]+?)\*\/)?$/;

  for (const line of lines) {
    const match = line.match(variableRegex);
    if (match) {
      const [_, name, value, description] = match;
      const radiusVar: RadiusVariable = {
        name: name.trim(),
        value: value.trim(),
        description: description?.trim(),
      };

      if (name.startsWith('--radius-')) {
        primitiveRadii.sizes.radii.push(radiusVar);
      } else if (name.startsWith('--radius-')) {
        semanticRadii.components.radii.push(radiusVar);
      }
    }
  }

  return {
    primitiveRadii,
    semanticRadii,
  };
}

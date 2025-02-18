interface ColourVariable {
  name: string;
  value: string;
  rawValue: string; // Make rawValue required
  shade?: number;
  displayName?: string; // Add displayName to interface
  description?: string;
}

interface ColourShadeGroup {
  prefix: string;
  shades: ColourVariable[];
  semantics: Record<string, string>;
}

interface ColourCategory {
  name: string;
  colours: ColourShadeGroup[];
}

export function parseColourScheme(cssContent: string) {
  const colorFamilies = [
    'primary',
    'secondary',
    'tertiary',
    'neutral',
    'attention',
    'success',
    'error',
    'promotion',
  ];

  const primitiveColours: Record<string, ColourCategory> = {};

  colorFamilies.forEach((family) => {
    primitiveColours[family] = {
      name: family.charAt(0).toUpperCase() + family.slice(1),
      colours: [],
    };
  });

  // Normalize the content - Updated to handle multiline definitions
  const normalizedContent = cssContent
    .replace(/@theme\s*{/, '')
    .replace(/}$/, '')
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Join multiline declarations
    .replace(/(\n\s+)(?=from|calc)/g, ' ')
    // Clean up extra whitespace
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.startsWith('--color-'))
    .map((line) => line.replace(/;$/, ''));

  const variableRegex = /^(--color-[^:]+):\s*(.+)$/;

  // Process each color family
  colorFamilies.forEach((family) => {
    // Get global color - Simpler matching
    const globalPattern = `--color-global-${family}:`;
    const globalColor = normalizedContent.find((line) =>
      line.startsWith(globalPattern)
    );

    if (globalColor) {
      const match = globalColor.match(variableRegex);
      if (match) {
        const [_, name, value] = match;
        primitiveColours[family].colours.push({
          prefix: 'global',
          shades: [
            {
              name: name.trim(),
              value: value.trim(),
              rawValue: value.trim(),
              displayName: family,
            },
          ],
          semantics: {},
        });
      }
    }

    // Get scales with fixed pattern
    const scalePattern = new RegExp(`^--color-${family}-(\\d+):`);
    const scales = normalizedContent
      .filter((line) => {
        const match = line.match(scalePattern);
        if (!match) return false;
        const shade = parseInt(match[1], 10);
        return (
          shade === 50 ||
          (shade >= 100 && shade <= 900 && shade % 100 === 0) ||
          shade === 950
        );
      })
      .map((line) => {
        const match = line.match(variableRegex);
        if (!match) return null;
        const [_, name, value] = match;
        const shadeMatch = name.match(/-(\d+)$/);
        if (!shadeMatch) return null;

        return {
          name: name.trim(),
          value: value.trim(),
          rawValue: value.trim(),
          shade: parseInt(shadeMatch[1], 10),
        } satisfies ColourVariable;
      })
      .filter((color): color is ColourVariable => color !== null);

    if (scales.length) {
      primitiveColours[family].colours.push({
        prefix: 'scale',
        shades: scales.sort((a, b) => (a.shade || 0) - (b.shade || 0)),
        semantics: {},
      });
    }
  });

  return primitiveColours;
}

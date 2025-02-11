interface ColourVariable {
  name: string;
  value: string;
  description?: string;
}

interface ColourCategory {
  name: string;
  colours: ColourVariable[];
}

export function parseColourScheme(cssContent: string) {
  const primitiveColours: Record<string, ColourCategory> = {
    primary: { name: 'Primary Colours', colours: [] },
    secondary: { name: 'Secondary Colours', colours: [] },
    tertiary: { name: 'Tertiary Colours', colours: [] },
    neutral: { name: 'Neutral Colours', colours: [] },
    attention: { name: 'Attention Colours', colours: [] },
    success: { name: 'Success Colours', colours: [] },
    error: { name: 'Error Colours', colours: [] },
    promotion: { name: 'Promotion Colours', colours: [] },
    basic: { name: 'Basic Colours', colours: [] },
  };

  const semanticColours: Record<string, ColourCategory> = {
    surface: { name: 'Surface Colours', colours: [] },
    border: { name: 'Border Colours', colours: [] },
    text: { name: 'Text Colours', colours: [] },
    icons: { name: 'Icon Colours', colours: [] },
  };

  // First, normalize the content
  const normalizedContent = cssContent
    // Remove theme wrapper if present
    .replace(/@theme\s*{/, '')
    .replace(/}$/, '')
    // Fix multi-line var() declarations
    .replace(/var\(\s*\n\s*/g, 'var(')
    // Join lines that were split by formatting
    .replace(/;\s*\/\*([^*]+?)\*\/\s*$/gm, '/* $1 */;')
    // Clean up any remaining newlines between variables
    .replace(/([^;])\n\s*(?=--)/g, '$1')
    // Split into actual lines
    .split(/;(?:\s*\/\*[^*]*\*\/)?\s*/)
    .map((line) => line.trim())
    .filter((line) => line && line.startsWith('--'));

  // More precise regex for variable matching
  const variableRegex =
    /^(--[^:]+):\s*([^;/]+?)(?:\s*\/\*\s*([^*]+?)\s*\*\/)?$/;

  for (const line of normalizedContent) {
    const match = line.match(variableRegex);
    if (match) {
      const [_, name, value, description] = match;

      if (!name || !value) continue;

      const colourVar: ColourVariable = {
        name: name.trim(),
        value: value.trim(),
        description: description?.trim(),
      };

      // Categorization logic remains the same
      if (name.startsWith('--primary-')) {
        primitiveColours.primary.colours.push(colourVar);
      } else if (name.startsWith('--secondary-')) {
        primitiveColours.secondary.colours.push(colourVar);
      } else if (name.startsWith('--tertiary-')) {
        primitiveColours.tertiary.colours.push(colourVar);
      } else if (name.startsWith('--neutral-')) {
        primitiveColours.neutral.colours.push(colourVar);
      } else if (name.startsWith('--attention-')) {
        primitiveColours.attention.colours.push(colourVar);
      } else if (name.startsWith('--success-')) {
        primitiveColours.success.colours.push(colourVar);
      } else if (name.startsWith('--error-')) {
        primitiveColours.error.colours.push(colourVar);
      } else if (name === '--black' || name === '--white') {
        primitiveColours.basic.colours.push(colourVar);
      } else if (name === '--promotion') {
        primitiveColours.promotion.colours.push(colourVar);
      } else if (name.startsWith('--text-')) {
        semanticColours.text.colours.push(colourVar);
      } else if (name.startsWith('--surface-')) {
        semanticColours.surface.colours.push(colourVar);
      } else if (name.startsWith('--border-')) {
        semanticColours.border.colours.push(colourVar);
      } else if (name.startsWith('--icons-')) {
        semanticColours.icons.colours.push(colourVar);
      }
    }
  }

  return {
    primitiveColours,
    semanticColours,
  };
}

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
    primary: { name: 'Primary', colours: [] },
    secondary: { name: 'Secondary', colours: [] },
    tertiary: { name: 'Tertiary', colours: [] },
    neutral: { name: 'Neutral', colours: [] },
    status: { name: 'Status', colours: [] },
    textEmphasis: { name: 'Text Emphasis', colours: [] },
    semantic: {
      name: 'Core Semantic',
      colours: [],
    },
    semanticPrimary: {
      name: 'Primary Semantic',
      colours: [],
    },
    semanticSecondary: {
      name: 'Secondary Semantic',
      colours: [],
    },
    semanticTertiary: {
      name: 'Tertiary Semantic',
      colours: [],
    },
    utility: { name: 'Utility', colours: [] },
  };

  // Normalize the content
  const normalizedContent = cssContent
    .replace(/@theme\s*{/, '')
    .replace(/}$/, '')
    .replace(/var\(\s*\n\s*/g, 'var(')
    .replace(/;\s*\/\*([^*]+?)\*\/\s*$/gm, '/* $1 */;')
    .replace(/([^;])\n\s*(?=--)/g, '$1')
    .split(/;(?:\s*\/\*[^*]*\*\/)?\s*/)
    .map((line) => line.trim())
    .filter((line) => line && line.startsWith('--color-'));

  const variableRegex =
    /^(--color-[^:]+):\s*([^;/]+?)(?:\s*\/\*\s*([^*]+?)\s*\*\/)?$/;

  for (const line of normalizedContent) {
    const match = line.match(variableRegex);
    if (!match) continue;

    const [_, name, value, description] = match;
    const colourVar: ColourVariable = {
      name: name.trim(),
      value: value.trim(),
      description: description?.trim(),
    };

    // Updated categorization
    if (name.match(/^--color-primary-\d/)) {
      primitiveColours.primary.colours.push(colourVar);
    } else if (name.match(/^--color-secondary-\d/)) {
      primitiveColours.secondary.colours.push(colourVar);
    } else if (name.match(/^--color-tertiary-\d/)) {
      primitiveColours.tertiary.colours.push(colourVar);
    } else if (name.match(/^--color-neutral-\d/)) {
      primitiveColours.neutral.colours.push(colourVar);
    } else if (name.match(/^--color-(success|error|attention|promotion)/)) {
      primitiveColours.status.colours.push(colourVar);
    } else if (name.match(/^--color-text-/)) {
      primitiveColours.textEmphasis.colours.push(colourVar);
    } else if (name.match(/^--color-(high|medium)-emphasis/)) {
      primitiveColours.textEmphasis.colours.push(colourVar);
    } else if (name.match(/^--color-(black|white)$/)) {
      primitiveColours.semantic.colours.push(colourVar);
    } else if (name.match(/^--color-primary(?!-\d)/)) {
      primitiveColours.semanticPrimary.colours.push(colourVar);
    } else if (name.match(/^--color-secondary(?!-\d)/)) {
      primitiveColours.semanticSecondary.colours.push(colourVar);
    } else if (name.match(/^--color-tertiary(?!-\d)/)) {
      primitiveColours.semanticTertiary.colours.push(colourVar);
    } else if (name.match(/^--color-(inactive|border-|surface-)/)) {
      primitiveColours.utility.colours.push(colourVar);
    }
  }

  return primitiveColours;
}

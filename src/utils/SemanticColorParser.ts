interface SemanticColor {
  name: string;
  value: string;
  cssVariable: string; // Add this to store the full CSS variable name
  category: string;
  layer: string;
  states: {
    hover: { cssVariable: string; value: string };
    focus: { cssVariable: string; value: string };
    active: { cssVariable: string; value: string };
    muted: { cssVariable: string; value: string };
  };
}

interface SemanticGroup {
  name: string;
  background: SemanticColor;
  foreground: SemanticColor;
  border: SemanticColor;
}

export function parseSemanticColors(cssContent: string): SemanticGroup[] {
  const groups: SemanticGroup[] = [];
  const semanticPrefixes = [
    'default',
    'muted',
    'primary',
    'primary-emphasised',
    'primary-subtle',
    'secondary',
    'secondary-emphasised',
    'secondary-subtle',
    'tertiary',
    'tertiary-emphasised',
    'tertiary-subtle',
    'site-header',
    'footer',
    'card',
    'navigation',
    'modal',
    'container',
    'control',
    'attention',
    'success',
    'error',
    'inactive',
  ];

  // Normalize content and extract variables
  const normalizedContent = cssContent
    .replace(/@theme\s*{/, '')
    .replace(/}$/, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.startsWith('--color-'))
    .map((line) => line.replace(/;$/, ''));

  semanticPrefixes.forEach((prefix) => {
    const bgPrefix =
      prefix === 'default' ? 'background' : `${prefix}-background`;
    const fgPrefix =
      prefix === 'default' ? 'foreground' : `${prefix}-foreground`;
    const borderPrefix = prefix === 'default' ? 'border' : `${prefix}-border`;

    const background = extractColorWithStates(
      normalizedContent,
      bgPrefix,
      prefix
    );
    const foreground = extractColorWithStates(
      normalizedContent,
      fgPrefix,
      prefix
    );
    const border = extractColorWithStates(
      normalizedContent,
      borderPrefix,
      prefix
    );

    if (background && foreground && border) {
      groups.push({
        name: prefix.charAt(0).toUpperCase() + prefix.slice(1),
        background,
        foreground,
        border,
      });
    }
  });

  return groups;
}

function extractColorWithStates(
  lines: string[],
  prefix: string,
  category: string
): SemanticColor | null {
  const baseVar = `--color-${prefix}`;
  const base = lines.find((line) => line.startsWith(`${baseVar}:`));

  if (!base) return null;

  const [cssVariable, value] = base.split(':').map((part) => part.trim());
  const layer = prefix.includes('-') ? prefix.split('-')[1] : prefix;

  // Create the base prefix for states based on category
  const statePrefix =
    category === 'default' ? `--color` : `--color-${category}`;

  return {
    name: cssVariable,
    value,
    cssVariable,
    category,
    layer,
    states: {
      hover: extractVariableAndValue(
        lines,
        `${baseVar}-hover`,
        `${statePrefix}-${layer}-hover`
      ),
      focus: extractVariableAndValue(
        lines,
        `${baseVar}-focus`,
        `${statePrefix}-${layer}-focus`
      ),
      active: extractVariableAndValue(
        lines,
        `${baseVar}-active`,
        `${statePrefix}-${layer}-active`
      ),
      muted: extractVariableAndValue(
        lines,
        `${baseVar}-muted`,
        `${statePrefix}-${layer}-muted`
      ),
    },
  };
}

function extractVariableAndValue(
  lines: string[],
  varName: string,
  cssVarName: string
): { cssVariable: string; value: string } {
  const line = lines.find((l) => l.startsWith(`${varName}:`));
  if (!line) return { cssVariable: '', value: '' };

  const [_, value] = line.split(':').map((part) => part.trim());
  return { cssVariable: cssVarName, value };
}

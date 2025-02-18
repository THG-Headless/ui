interface SemanticColor {
  name: string;
  value: string;
  rawValue: string;
  states: {
    hover: string;
    focus: string;
    active: string;
    muted: string;
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
    'header',
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

    const background = extractColorWithStates(normalizedContent, bgPrefix);
    const foreground = extractColorWithStates(normalizedContent, fgPrefix);
    const border = extractColorWithStates(normalizedContent, borderPrefix);

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
  prefix: string
): SemanticColor | null {
  const baseVar = `--color-${prefix}`;
  const base = lines.find((line) => line.startsWith(`${baseVar}:`));

  if (!base) return null;

  const [name, value] = base.split(':').map((part) => part.trim());

  return {
    name,
    value,
    rawValue: value,
    states: {
      hover: extractValue(lines, `${baseVar}-hover`),
      focus: extractValue(lines, `${baseVar}-focus`),
      active: extractValue(lines, `${baseVar}-active`),
      muted: extractValue(lines, `${baseVar}-muted`),
    },
  };
}

function extractValue(lines: string[], varName: string): string {
  const line = lines.find((l) => l.startsWith(`${varName}:`));
  return line ? line.split(':')[1].trim() : '';
}

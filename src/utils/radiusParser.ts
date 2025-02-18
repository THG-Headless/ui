interface RadiusVariable {
  name: string;
  value: string;
}

export function parseRadiusScheme(cssContent: string): RadiusVariable | null {
  const lines = cssContent.split('\n');
  const variableRegex = /^\s*(--.+?):\s*(.+?);/;

  for (const line of lines) {
    const match = line.match(variableRegex);
    if (match && match[1].trim() === '--radius-global') {
      return {
        name: match[1].trim(),
        value: match[2].trim(),
      };
    }
  }
  return null;
}

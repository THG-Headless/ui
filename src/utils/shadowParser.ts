interface ShadowVariable {
  name: string;
  value: string;
}

export function parseShadowScheme(cssContent: string): ShadowVariable | null {
  const lines = cssContent.split('\n');
  let shadowValue = '';

  for (const line of lines) {
    const line_trim = line.trim();
    if (line_trim.startsWith('--shadow-site:')) {
      shadowValue = line_trim
        .substring(line_trim.indexOf(':') + 1)
        .replace(';', '')
        .trim();
    } else if (
      shadowValue &&
      !line_trim.startsWith('@') &&
      !line_trim.startsWith('/*') &&
      line_trim !== '}' &&
      line_trim
    ) {
      shadowValue += ' ' + line_trim.replace(';', '').trim();
    }
  }

  return shadowValue
    ? {
        name: '--shadow-site',
        value: shadowValue,
      }
    : null;
}

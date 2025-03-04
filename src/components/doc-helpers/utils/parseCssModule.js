/**
 * Extract skin classes and definitions from CSS content
 * @param {string} cssContent - Raw CSS content as string
 * @returns {Object} - Object with skin class names as keys and CSS definitions as values
 */
export function extractSkinClasses(cssContent) {
  const skinDefinitions = {};
  const regex = /\.skin[a-zA-Z0-9-]*\s*{[^}]*}/g;

  const matches = cssContent.match(regex) || [];

  matches.forEach((match) => {
    // Extract the skin class name (without the dot)
    const classNameMatch = match.match(/\.(skin[a-zA-Z0-9-]*)\s*{/);
    if (classNameMatch && classNameMatch[1]) {
      const className = classNameMatch[1];
      skinDefinitions[className] = match;
    }
  });

  return skinDefinitions;
}

/**
 * Format CSS definition for better display
 * @param {string} cssText - CSS text to format
 * @returns {string} - Formatted CSS text
 */
export function formatCSSDefinition(cssText) {
  if (!cssText) return '';

  // Remove comments and normalize whitespace
  let formatted = cssText
    .replace(/\/\*.*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Add newlines after braces and semicolons
  formatted = formatted
    .replace(/\{/g, '{\n  ')
    .replace(/;/g, ';\n  ')
    .replace(/}/g, '\n}');

  // Remove extra spaces before closing braces
  formatted = formatted.replace(/\s+\n}/g, '\n}');

  return formatted;
}

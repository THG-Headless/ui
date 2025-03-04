export async function fetchStylesheetText(href: string) {
  const response = await fetch(href);
  return response.text();
}

// Extract the exact text of a rule by matching its selector in raw CSS
// This is a naive approach splitting between the selector and the following '}'.
export function extractRuleText(rawCss: string, selector: string) {
  // Match the selector plus any newlines/spaces until the first closing brace
  const pattern = new RegExp(`${selector}\\s*\\{[\\s\\S]*?\\}`, 'm');
  const match = rawCss.match(pattern);
  return match ? match[0] : null;
}

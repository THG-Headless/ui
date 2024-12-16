interface TypographyVariable {
  name: string;
  value: string;
}

interface TypographyCategory {
  name: string;
  variables: TypographyVariable[];
}

interface TypographyScheme {
  sizes: TypographyCategory;
  mobileSizes: TypographyCategory;
  responsiveSizes: TypographyCategory; // New category
  weights: TypographyCategory;
}

export function parseTypographyScheme(cssContent: string): TypographyScheme {
  const typography: TypographyScheme = {
    sizes: { name: "Desktop Font Sizes", variables: [] },
    mobileSizes: { name: "Mobile Font Sizes", variables: [] },
    responsiveSizes: { name: "Responsive Font Sizes", variables: [] }, // New category
    weights: { name: "Font Weights", variables: [] },
  };

  const lines = cssContent.split("\n");
  const variableRegex = /^\s*(--.+?):\s*(.+?);$/;

  for (const line of lines) {
    const match = line.match(variableRegex);
    if (match) {
      const [_, name, value] = match;
      const variable: TypographyVariable = {
        name: name.trim(),
        value: value.trim(),
      };

      if (
        name.startsWith("--text-size-") ||
        name.startsWith("--line-height-")
      ) {
        if (name.includes("-mobile-")) {
          typography.mobileSizes.variables.push(variable);
        } else if (name.includes("-desktop-")) {
          typography.sizes.variables.push(variable);
        } else {
          typography.responsiveSizes.variables.push(variable); // New category
        }
      } else if (name.startsWith("--font-weight-")) {
        typography.weights.variables.push(variable);
      }
    }
  }

  return typography;
}

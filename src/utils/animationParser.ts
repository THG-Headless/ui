export interface AnimationVariable {
  name: string;
  value: string;
}

export function parseAnimationScheme(cssContent: string): AnimationVariable[] {
  const animationVariables: AnimationVariable[] = [];
  const lines = cssContent.split("\n");
  const variableRegex = /^\s*(--.+?):\s*(.+?);$/;

  for (const line of lines) {
    const match = line.match(variableRegex);
    if (match) {
      const [_, name, value] = match;
      if (name && value && name.startsWith("--animation-speed-")) {
        animationVariables.push({
          name: name.trim(),
          value: value.trim(),
        });
      }
    }
  }

  return animationVariables;
}

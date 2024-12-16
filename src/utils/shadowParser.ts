interface ShadowVariable {
  name: string;
  value: string;
  description?: string;
}

interface ShadowCategory {
  name: string;
  shadows: ShadowVariable[];
}

export function parseShadowScheme(cssContent: string) {
  const shadows: Record<string, ShadowCategory> = {
    primitives: { name: "Primitive Shadows", shadows: [] },
  };

  const lines = cssContent.split("\n");
  let currentShadow: ShadowVariable | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("--shadow-")) {
      if (currentShadow) {
        shadows.primitives.shadows.push(currentShadow);
      }
      const [name, ...valueParts] = line.split(":");
      currentShadow = {
        name: name.trim(),
        value: valueParts.join(":").trim(),
      };
    } else if (currentShadow && !line.startsWith("/*") && line !== "") {
      currentShadow.value += " " + line.replace(";", "").trim();
    } else if (line.startsWith("/*") && currentShadow) {
      currentShadow.description = line
        .replace("/*", "")
        .replace("*/", "")
        .trim();
    }

    if (line.endsWith(";") && currentShadow) {
      shadows.primitives.shadows.push(currentShadow);
      currentShadow = null;
    }
  }

  if (currentShadow) {
    shadows.primitives.shadows.push(currentShadow);
  }

  return shadows;
}

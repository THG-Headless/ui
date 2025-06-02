/**
 * CSS Parser for OKLCH Color Values
 * Extracts and parses OKLCH color definitions from CSS custom properties
 */

export class CSSParser {
  /**
   * Extract all CSS custom properties containing OKLCH
   * @returns {Map} Map of property names to OKLCH expressions
   */
  static extractOklchProperties() {
    const oklchProperties = new Map();
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Get all CSS custom properties from stylesheets
    for (const sheet of document.styleSheets) {
      try {
        this.parseStyleSheet(sheet, oklchProperties);
      } catch (e) {
        // Skip cross-origin stylesheets
        console.debug('Skipping stylesheet due to CORS:', e);
      }
    }
    
    return oklchProperties;
  }

  /**
   * Parse a stylesheet for OKLCH properties
   */
  static parseStyleSheet(sheet, oklchProperties) {
    if (!sheet.cssRules) return;
    
    for (const rule of sheet.cssRules) {
      if (rule.type === CSSRule.STYLE_RULE) {
        this.parseStyleRule(rule, oklchProperties);
      } else if (rule.type === CSSRule.MEDIA_RULE) {
        this.parseStyleSheet(rule, oklchProperties);
      }
    }
  }

  /**
   * Parse a CSS rule for OKLCH properties
   */
  static parseStyleRule(rule, oklchProperties) {
    for (let i = 0; i < rule.style.length; i++) {
      const property = rule.style[i];
      const value = rule.style.getPropertyValue(property);
      
      if (property.startsWith('--') && this.containsOklch(value)) {
        oklchProperties.set(property, value.trim());
      }
    }
  }

  /**
   * Check if a CSS value contains OKLCH
   */
  static containsOklch(value) {
    return value.includes('oklch(') || value.includes('color-mix(in oklch');
  }

  /**
   * Parse OKLCH relative color syntax
   * @param {string} value - CSS value like "oklch(from var(--color-primary) calc(l * 0.8) c h)"
   * @returns {Object|null} Parsed relative color object
   */
  static parseRelativeOklch(value) {
    const relativeMatch = value.match(/oklch\(\s*from\s+(var\([^)]+\)|oklch\([^)]+\))\s+([^)]+)\s*\)/);
    if (!relativeMatch) return null;

    const [, fromValue, transforms] = relativeMatch;
    const transformParts = transforms.trim().split(/\s+/);
    
    if (transformParts.length !== 3) return null;

    return {
      from: fromValue.trim(),
      lightness: transformParts[0],
      chroma: transformParts[1],
      hue: transformParts[2]
    };
  }

  /**
   * Parse simple OKLCH color
   * @param {string} value - CSS value like "oklch(0.7 0.15 250)"
   * @returns {Object|null} Parsed OKLCH object
   */
  static parseSimpleOklch(value) {
    const simpleMatch = value.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/);
    if (!simpleMatch) return null;

    return {
      l: parseFloat(simpleMatch[1]),
      c: parseFloat(simpleMatch[2]),
      h: parseFloat(simpleMatch[3])
    };
  }

  /**
   * Parse color-mix function
   * @param {string} value - CSS value like "color-mix(in oklch, red 50%, blue)"
   * @returns {Object|null} Parsed color-mix object
   */
  static parseColorMix(value) {
    const colorMixMatch = value.match(/color-mix\(\s*in\s+oklch\s*,\s*([^,]+),\s*([^)]+)\s*\)/);
    if (!colorMixMatch) return null;

    const [, color1Str, color2Str] = colorMixMatch;
    
    // Parse color and percentage
    const parseColorPart = (part) => {
      const percentMatch = part.match(/(.+?)\s+(\d+)%/);
      if (percentMatch) {
        return {
          color: percentMatch[1].trim(),
          percentage: parseFloat(percentMatch[2])
        };
      }
      return {
        color: part.trim(),
        percentage: 50 // Default if no percentage specified
      };
    };

    return {
      color1: parseColorPart(color1Str),
      color2: parseColorPart(color2Str)
    };
  }

  /**
   * Resolve CSS custom property value
   * @param {string} varExpression - Expression like "var(--color-primary)"
   * @returns {string|null} Resolved value
   */
  static resolveCSSVariable(varExpression) {
    const varMatch = varExpression.match(/var\(\s*([^,)]+)(?:\s*,\s*([^)]+))?\s*\)/);
    if (!varMatch) return null;

    const [, propertyName, fallback] = varMatch;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName.trim());
    
    return value || fallback || null;
  }

  /**
   * Get base OKLCH values for color calculations
   * @returns {Map} Map of base color names to OKLCH values
   */
  static getBaseColors() {
    const baseColors = new Map();
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Extract base color definitions
    const baseColorProperties = [
      '--color-primary',
      '--color-secondary', 
      '--color-tertiary',
      '--color-neutral',
      '--color-success',
      '--color-attention',
      '--color-error',
      '--color-promotion'
    ];

    for (const prop of baseColorProperties) {
      const value = rootStyles.getPropertyValue(prop);
      if (value && this.containsOklch(value)) {
        const parsed = this.parseSimpleOklch(value);
        if (parsed) {
          baseColors.set(prop, parsed);
        }
      }
    }

    return baseColors;
  }
}
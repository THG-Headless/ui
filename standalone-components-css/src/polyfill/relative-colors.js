/**
 * Relative Color Syntax Handler
 * Processes "oklch(from ...)" expressions for dynamic shade generation
 */

import { ColorConverter } from './color-converter.js';
import { CSSParser } from './css-parser.js';

export class RelativeColors {
  /**
   * Process all relative OKLCH colors and generate RGB fallbacks
   * @param {Map} oklchProperties - Map of CSS properties to OKLCH values
   * @returns {Map} Map of property names to RGB values
   */
  static processRelativeColors(oklchProperties) {
    const processedColors = new Map();
    const baseColors = CSSParser.getBaseColors();
    
    for (const [property, value] of oklchProperties) {
      const processed = this.processProperty(property, value, baseColors, oklchProperties);
      if (processed) {
        processedColors.set(property, processed);
      }
    }
    
    return processedColors;
  }

  /**
   * Process a single CSS property with OKLCH value
   */
  static processProperty(property, value, baseColors, allProperties) {
    // Handle relative color syntax
    const relativeColor = CSSParser.parseRelativeOklch(value);
    if (relativeColor) {
      return this.processRelativeColor(relativeColor, baseColors, allProperties);
    }

    // Handle simple OKLCH color
    const simpleColor = CSSParser.parseSimpleOklch(value);
    if (simpleColor) {
      return ColorConverter.oklchToRgb(simpleColor.l, simpleColor.c, simpleColor.h);
    }

    // Handle color-mix
    const colorMix = CSSParser.parseColorMix(value);
    if (colorMix) {
      return this.processColorMix(colorMix, baseColors, allProperties);
    }

    return null;
  }

  /**
   * Process relative color syntax like "oklch(from var(--color-primary) calc(l * 0.8) c h)"
   */
  static processRelativeColor(relativeColor, baseColors, allProperties) {
    // Resolve the base color
    const baseOklch = this.resolveBaseColor(relativeColor.from, baseColors, allProperties);
    if (!baseOklch) {
      return null;
    }

    // Apply transformations
    const transformed = ColorConverter.applyRelativeTransform(
      baseOklch.l,
      baseOklch.c,
      baseOklch.h,
      relativeColor.lightness,
      relativeColor.chroma,
      relativeColor.hue
    );

    // Convert to RGB
    return ColorConverter.oklchToRgb(transformed.l, transformed.c, transformed.h);
  }

  /**
   * Resolve base color from various sources
   */
  static resolveBaseColor(fromValue, baseColors, allProperties) {
    // Handle var() references
    if (fromValue.startsWith('var(')) {
      const varName = fromValue.match(/var\(\s*([^,)]+)/)?.[1];
      if (!varName) return null;

      // Check if it's a base color
      if (baseColors.has(varName)) {
        return baseColors.get(varName);
      }

      // Check if it's another computed property
      if (allProperties.has(varName)) {
        const value = allProperties.get(varName);
        const simpleColor = CSSParser.parseSimpleOklch(value);
        if (simpleColor) return simpleColor;
      }

      // Try to resolve from computed styles
      const resolvedValue = CSSParser.resolveCSSVariable(fromValue);
      if (resolvedValue) {
        const parsed = CSSParser.parseSimpleOklch(resolvedValue);
        if (parsed) return parsed;
      }
    }

    // Handle direct OKLCH values
    if (fromValue.startsWith('oklch(')) {
      return CSSParser.parseSimpleOklch(fromValue);
    }

    return null;
  }

  /**
   * Process color-mix function (simplified implementation)
   */
  static processColorMix(colorMix, baseColors, allProperties) {
    // This is a simplified implementation of color-mix
    // In a full implementation, you'd need proper color space mixing
    
    const color1 = this.resolveColorValue(colorMix.color1.color, baseColors, allProperties);
    const color2 = this.resolveColorValue(colorMix.color2.color, baseColors, allProperties);
    
    if (!color1 || !color2) {
      console.warn('Could not resolve colors for color-mix');
      return null;
    }

    // Simple RGB mixing based on percentages
    const percent1 = colorMix.color1.percentage / 100;
    const percent2 = colorMix.color2.percentage / 100;
    const totalPercent = percent1 + percent2;
    
    const normalizedPercent1 = percent1 / totalPercent;
    const normalizedPercent2 = percent2 / totalPercent;

    return {
      r: Math.round(color1.r * normalizedPercent1 + color2.r * normalizedPercent2),
      g: Math.round(color1.g * normalizedPercent1 + color2.g * normalizedPercent2),
      b: Math.round(color1.b * normalizedPercent1 + color2.b * normalizedPercent2)
    };
  }

  /**
   * Resolve a color value to RGB
   */
  static resolveColorValue(colorValue, baseColors, allProperties) {
    // Handle CSS color keywords
    if (colorValue === 'red') return { r: 255, g: 0, b: 0 };
    if (colorValue === 'blue') return { r: 0, g: 0, b: 255 };
    if (colorValue === 'white') return { r: 255, g: 255, b: 255 };
    if (colorValue === 'black') return { r: 0, g: 0, b: 0 };
    
    // Handle var() references
    if (colorValue.startsWith('var(')) {
      const resolvedValue = CSSParser.resolveCSSVariable(colorValue);
      if (resolvedValue) {
        const parsed = CSSParser.parseSimpleOklch(resolvedValue);
        if (parsed) {
          return ColorConverter.oklchToRgb(parsed.l, parsed.c, parsed.h);
        }
      }
    }

    // Handle direct OKLCH values
    if (colorValue.startsWith('oklch(')) {
      const parsed = CSSParser.parseSimpleOklch(colorValue);
      if (parsed) {
        return ColorConverter.oklchToRgb(parsed.l, parsed.c, parsed.h);
      }
    }

    return null;
  }

  /**
   * Generate shade variants for a base color
   * @param {Object} baseOklch - Base OKLCH color {l, c, h}
   * @param {string} colorName - Color name (e.g., 'primary')
   * @returns {Map} Map of shade names to RGB values
   */
  static generateShadeVariants(baseOklch, colorName) {
    const shades = new Map();
    
    // Define shade transformations (matching your CSS patterns)
    const shadeDefinitions = {
      '50': { l: 'calc(1 - (1 - l) * 0.6)', c: 'calc(c * 0.8)', h: 'h', iterations: 4 },
      '100': { l: 'calc(1 - (1 - l) * 0.6)', c: 'calc(c * 0.8)', h: 'h', iterations: 3 },
      '200': { l: 'calc(1 - (1 - l) * 0.6)', c: 'calc(c * 0.8)', h: 'h', iterations: 2 },
      '300': { l: 'calc(1 - (1 - l) * 0.6)', c: 'calc(c * 0.8)', h: 'h', iterations: 1 },
      '400': { l: 'calc(1 - (1 - l) * 0.6)', c: 'calc(c * 0.8)', h: 'h', iterations: 0 },
      '500': { l: 'l', c: 'c', h: 'h' }, // Base color
      '600': { l: 'calc(l * 0.8)', c: 'calc(c * 1.1)', h: 'h', iterations: 0 },
      '700': { l: 'calc(l * 0.8)', c: 'calc(c * 1.1)', h: 'h', iterations: 1 },
      '800': { l: 'calc(l * 0.8)', c: 'calc(c * 1.1)', h: 'h', iterations: 2 },
      '900': { l: 'calc(l * 0.8)', c: 'calc(c * 1.1)', h: 'h', iterations: 3 },
      '950': { l: 'calc(l * 0.8)', c: 'calc(c * 1.1)', h: 'h', iterations: 4 }
    };

    for (const [shade, definition] of Object.entries(shadeDefinitions)) {
      let currentColor = { ...baseOklch };
      
      // Apply transformation iterations (for chained transformations)
      for (let i = 0; i <= (definition.iterations || 0); i++) {
        currentColor = ColorConverter.applyRelativeTransform(
          currentColor.l,
          currentColor.c,
          currentColor.h,
          definition.l,
          definition.c,
          definition.h
        );
      }
      
      const rgb = ColorConverter.oklchToRgb(currentColor.l, currentColor.c, currentColor.h);
      shades.set(`--color-${colorName}-${shade}`, rgb);
    }

    return shades;
  }
}
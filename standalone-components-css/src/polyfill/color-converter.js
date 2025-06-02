/**
 * OKLCH to RGB Color Conversion
 * Handles conversion between OKLCH color space and RGB for browser compatibility
 */

export class ColorConverter {
  /**
   * Convert OKLCH to RGB
   * @param {number} l - Lightness (0-1)
   * @param {number} c - Chroma (0-0.4 typically)
   * @param {number} h - Hue (0-360 degrees)
   * @returns {Object} RGB values {r, g, b} (0-255)
   */
  static oklchToRgb(l, c, h) {
    // Convert OKLCH to OKLab
    const { L, a, b } = this.oklchToOklab(l, c, h);
    
    // Convert OKLab to Linear RGB
    const { r: rLinear, g: gLinear, b: bLinear } = this.oklabToLinearRgb(L, a, b);
    
    // Convert Linear RGB to sRGB
    return this.linearRgbToSrgb(rLinear, gLinear, bLinear);
  }

  /**
   * Convert OKLCH to OKLab color space
   */
  static oklchToOklab(l, c, h) {
    const hRad = (h * Math.PI) / 180;
    return {
      L: l,
      a: c * Math.cos(hRad),
      b: c * Math.sin(hRad)
    };
  }

  /**
   * Convert OKLab to Linear RGB
   */
  static oklabToLinearRgb(L, a, b) {
    // OKLab to Linear RGB transformation matrix
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    return {
      r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    };
  }

  /**
   * Convert Linear RGB to sRGB (0-255)
   */
  static linearRgbToSrgb(r, g, b) {
    const toSrgb = (c) => {
      const absC = Math.abs(c);
      if (absC > 0.0031308) {
        return Math.sign(c) * (1.055 * Math.pow(absC, 1.0 / 2.4) - 0.055);
      }
      return 12.92 * c;
    };

    return {
      r: Math.max(0, Math.min(255, Math.round(toSrgb(r) * 255))),
      g: Math.max(0, Math.min(255, Math.round(toSrgb(g) * 255))),
      b: Math.max(0, Math.min(255, Math.round(toSrgb(b) * 255)))
    };
  }

  /**
   * Parse OKLCH string and convert to RGB
   * @param {string} oklchStr - OKLCH color string like "oklch(0.7 0.15 250)"
   * @returns {string} RGB color string like "rgb(123, 45, 67)"
   */
  static parseOklchToRgb(oklchStr) {
    const match = oklchStr.match(/oklch\(\s*([^)]+)\s*\)/);
    if (!match) return null;

    const values = match[1].split(/\s+/).map(v => parseFloat(v.trim()));
    if (values.length !== 3) return null;

    const [l, c, h] = values;
    const { r, g, b } = this.oklchToRgb(l, c, h);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Apply relative color transformation
   * @param {number} baseL - Base lightness
   * @param {number} baseC - Base chroma  
   * @param {number} baseH - Base hue
   * @param {string} lFormula - Lightness formula like "calc(1 - (1 - l) * 0.6)"
   * @param {string} cFormula - Chroma formula like "calc(c * 0.8)"
   * @param {string} hFormula - Hue formula like "h"
   * @returns {Object} Transformed OKLCH values
   */
  static applyRelativeTransform(baseL, baseC, baseH, lFormula, cFormula, hFormula) {
    // Simple formula evaluation - replace l, c, h with actual values
    const evaluateFormula = (formula, l, c, h) => {
      if (formula === 'l') return l;
      if (formula === 'c') return c;
      if (formula === 'h') return h;
      
      // Handle calc() expressions
      if (formula.includes('calc(')) {
        let expr = formula.replace('calc(', '').replace(')', '');
        expr = expr.replace(/\bl\b/g, l);
        expr = expr.replace(/\bc\b/g, c);
        expr = expr.replace(/\bh\b/g, h);
        
        try {
          // Basic math evaluation (secure for our controlled input)
          return Function(`"use strict"; return (${expr})`)();
        } catch (e) {
          return formula === 'l' ? l : formula === 'c' ? c : h;
        }
      }
      
      return parseFloat(formula) || 0;
    };

    return {
      l: evaluateFormula(lFormula, baseL, baseC, baseH),
      c: evaluateFormula(cFormula, baseL, baseC, baseH),
      h: evaluateFormula(hFormula, baseL, baseC, baseH)
    };
  }
}
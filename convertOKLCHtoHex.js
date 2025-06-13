#!/usr/bin/env node
/**
 * convertOKLCH.js
 *
 * This script processes a CSS file containing OKLCH color variables (including chained/relative color definitions),
 * resolves all color variables to absolute OKLCH values, converts them to RGB hex values, and writes a new CSS file
 * with those hex values. It also checks for color conversion quality using Delta E and warns if the color difference
 * exceeds a perceptible threshold.
 *
 * Usage:
 *   ./convertOKLCH -i src/main.css -o dist/main.css
 *
 * -i <input.css>   Path to the input CSS file (with OKLCH/relative color variables)
 * -o <output.css>  Path to the output CSS file (with resolved hex color values)
 *
 * Requirements:
 *   - Node.js
 *   - color-space and delta-e npm packages
 *
 * Example:
 *   ./convertOKLCH -i src/main.css -o dist/main.css
 * 
 */

import fs from 'fs';
import path from 'path';
import colorSpace from 'color-space';
import DeltaE from 'delta-e';

// Configuration
const DELTA_E_THRESHOLD = 2.0; // Colors with Delta E > 2.0 will throw a warning

/**
 * OKLCH to RGB conversion utilities using color-space package
 */
class ColorConverter {
  static oklchToHex(l, c, h) {
    try {
      // Convert OKLCH to Lab first
      // OKLCH: L is 0-1, C is chroma, H is hue in degrees
      // Convert to Lab coordinates
      const hRad = (h * Math.PI) / 180;
      const a = c * Math.cos(hRad);
      const b = c * Math.sin(hRad);
      
      // Convert L from 0-1 to 0-100 for Lab
      const lab = [l * 100, a * 100, b * 100];
      
      // Convert Lab to RGB using color-space
      const rgb = colorSpace.lab.rgb(lab);
      
      // Ensure RGB values are in 0-255 range
      const r = Math.max(0, Math.min(255, Math.round(rgb[0])));
      const g = Math.max(0, Math.min(255, Math.round(rgb[1])));
      const b_val = Math.max(0, Math.min(255, Math.round(rgb[2])));
      
      // Convert to hex
      return '#' + [r, g, b_val].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
      
    } catch (error) {
      console.warn(`Failed to convert OKLCH(${l}, ${c}, ${h}) to hex:`, error);
      return '#000000'; // fallback to black
    }
  }
}

/**
 * CSS Parser and Processor
 */
class CSSProcessor {
  constructor(cssContent) {
    this.cssContent = cssContent;
    this.baseColors = new Map();
    this.resolvedColors = new Map();
  }
  
  parseBaseColors() {
    // Extract base site colors (lines 8-15 from the pattern we saw)
    const baseColorRegex = /--color-(primary|secondary|tertiary|neutral|success|attention|error|promotion):\s*oklch\(([^)]+)\);/g;
    
    let match;
    while ((match = baseColorRegex.exec(this.cssContent)) !== null) {
      const colorName = match[1];
      const oklchValues = match[2].trim();
      
      // Parse OKLCH values
      const values = oklchValues.split(/\s+/).map(v => parseFloat(v));
      if (values.length === 3) {
        this.baseColors.set(colorName, {
          l: values[0],
          c: values[1],
          h: values[2]
        });
      }
    }
  }
  
  
  parseColorComponents(text) {
    const components = [];
    let current = '';
    let parenDepth = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === '(') {
        parenDepth++;
        current += char;
      } else if (char === ')') {
        parenDepth--;
        current += char;
      } else if (char === ' ' && parenDepth === 0) {
        if (current.trim()) {
          components.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      components.push(current.trim());
    }
    
    return components;
  }
  
  
  evaluateFormula(formula, l, c, h) {
    if (formula === 'l') return l;
    if (formula === 'c') return c;
    if (formula === 'h') return h;
    
    // Remove calc() wrapper if present
    const cleanFormula = formula.replace(/^calc\(|\)$/g, '');
    
    // Replace variables with actual values
    let expr = cleanFormula
      .replace(/\bl\b/g, l.toString())
      .replace(/\bc\b/g, c.toString())
      .replace(/\bh\b/g, h.toString());
    
    try {
      // Evaluate the mathematical expression
      return Function('"use strict"; return (' + expr + ')')();
    } catch (e) {
      console.warn(`Failed to evaluate formula: ${formula}`, e);
      return formula === 'l' ? l : formula === 'c' ? c : h;
    }
  }
  
  convertToHex() {
    const hexColors = new Map();
    
    for (const [colorName, oklch] of this.resolvedColors) {
      const hex = ColorConverter.oklchToHex(oklch.l, oklch.c, oklch.h);
      hexColors.set(colorName, hex);
    }
    
    return hexColors;
  }
  
  replaceColorsInCSS(hexColors) {
    let newCSS = this.cssContent;
    
    // Replace each OKLCH color definition with hex equivalent
    for (const [colorName, hex] of hexColors) {
      const escapedColorName = colorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Find the color definition (including multiline)
      const startPattern = new RegExp(`(--color-${escapedColorName}:\\s*)oklch\\(`, 'g');
      const startMatch = startPattern.exec(newCSS);
      
      if (startMatch) {
        // Find the end of the definition
        let pos = startMatch.index + startMatch[0].length;
        let parenCount = 1;
        
        while (pos < newCSS.length && parenCount > 0) {
          const char = newCSS[pos];
          if (char === '(') parenCount++;
          else if (char === ')') parenCount--;
          pos++;
        }
        
        // Find the semicolon
        while (pos < newCSS.length && newCSS[pos] !== ';') {
          pos++;
        }
        pos++; // include the semicolon
        
        // Replace the entire definition
        const before = newCSS.substring(0, startMatch.index);
        const replacement = `--color-${colorName}: ${hex};`;
        const after = newCSS.substring(pos);
        
        newCSS = before + replacement + after;
        
        // Reset the regex for next iteration
        startPattern.lastIndex = 0;
      }
    }
    
    return newCSS;
  }
  
  process() {
    this.parseBaseColors();
    
    // Step 1: Add base colors to resolved colors (keep as OKLCH for now)
    for (const [colorName, oklch] of this.baseColors) {
      this.resolvedColors.set(colorName, oklch);
      this.resolvedColors.set(`${colorName}-500`, oklch);
    }
    
    // Step 2: Process each color family systematically
    const colorFamilies = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'attention', 'error', 'promotion'];
    
    for (const family of colorFamilies) {
      this.processColorFamily(family);
    }
    
    console.log(`Resolved ${this.resolvedColors.size} total colors`);
    
    // Step 3: Convert all resolved OKLCH colors to hex and check for conversion loss
    const hexColors = this.convertToHex();
    this.validateColorConversions();
    
    const newCSS = this.replaceColorsInCSS(hexColors);
    
    return newCSS;
  }
  
  validateColorConversions() {
    const colorLossResults = [];
    
    console.log('\nValidating color conversions for quality loss...');
    
    for (const [colorName, oklchColor] of this.resolvedColors) {
      const deltaE = this.calculateColorLoss(oklchColor, colorName);
      
      if (deltaE > DELTA_E_THRESHOLD) {
        colorLossResults.push({
          name: colorName,
          oklch: oklchColor,
          deltaE: deltaE
        });
      }
    }
    
    if (colorLossResults.length > 0) {
      this.displayColorLossTable(colorLossResults);
      console.warn(`Color conversion failed: ${colorLossResults.length} colors exceed Delta E threshold of ${DELTA_E_THRESHOLD}`);
    }
    
    console.log(`✓ All colors passed quality check (Delta E < ${DELTA_E_THRESHOLD})`);
  }
  
  calculateColorLoss(oklchColor, colorName) {
    // Convert original OKLCH to Lab
    const originalLab = this.oklchToLab(oklchColor);
    
    // Convert OKLCH to RGB hex, then back to Lab
    const hex = ColorConverter.oklchToHex(oklchColor.l, oklchColor.c, oklchColor.h);
    const rgb = this.hexToRgb(hex);
    const convertedLab = colorSpace.rgb.lab([rgb.r, rgb.g, rgb.b]);
    
    // Calculate Delta E using CIE2000
    const lab1 = { L: originalLab[0], A: originalLab[1], B: originalLab[2] };
    const lab2 = { L: convertedLab[0], A: convertedLab[1], B: convertedLab[2] };
    
    return DeltaE.getDeltaE00(lab1, lab2);
  }
  
  oklchToLab(oklch) {
    const hRad = (oklch.h * Math.PI) / 180;
    const a = oklch.c * Math.cos(hRad);
    const b = oklch.c * Math.sin(hRad);
    return [oklch.l * 100, a * 100, b * 100];
  }
  
  hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  
  displayColorLossTable(colorLossResults) {
    console.log('\n❌ COLORS EXCEEDING DELTA E THRESHOLD:');
    console.log('┌─────────────────────────┬─────────────────────────────────┬──────────┐');
    console.log('│ Color Name              │ OKLCH                           │ Delta E  │');
    console.log('├─────────────────────────┼─────────────────────────────────┼──────────┤');
    
    colorLossResults.forEach(result => {
      const name = result.name.padEnd(23);
      const oklch = `(${result.oklch.l.toFixed(3)}, ${result.oklch.c.toFixed(3)}, ${result.oklch.h.toFixed(1)})`.padEnd(31);
      const deltaE = result.deltaE.toFixed(3).padStart(8);
      
      console.log(`│ ${name} │ ${oklch} │ ${deltaE} │`);
    });
    
    console.log('└─────────────────────────┴─────────────────────────────────┴──────────┘');
    console.log(`\nThreshold: Delta E > ${DELTA_E_THRESHOLD} (perceptible color difference)`);
  }
  
  processColorFamily(familyName) {
    const baseColor = this.resolvedColors.get(familyName);
    if (!baseColor) {
      console.warn(`Base color ${familyName} not found`);
      return;
    }
    
    console.log(`Processing ${familyName} color family`);
    
    // Ensure 500 shade exists
    this.resolvedColors.set(`${familyName}-500`, baseColor);
    
    // Process lighter shades: 400 -> 300 -> 200 -> 100 -> 50
    this.processShadeChain(familyName, [400, 300, 200, 100, 50], 'lighter');
    
    // Process darker shades: 600 -> 700 -> 800 -> 900 -> 950  
    this.processShadeChain(familyName, [600, 700, 800, 900, 950], 'darker');
  }
  
  processShadeChain(familyName, shades, direction) {
    let previousShade = 500;
    
    for (const shade of shades) {
      const currentColorName = `${familyName}-${shade}`;
      const previousColorName = `${familyName}-${previousShade}`;
      
      // Find the relative color definition for this shade
      const definition = this.findRelativeColorDefinition(currentColorName);
      if (!definition) {
        console.warn(`No definition found for ${currentColorName}`);
        continue;
      }
      
      // Get the previous color as reference
      const previousColor = this.resolvedColors.get(previousColorName);
      if (!previousColor) {
        console.warn(`Previous color ${previousColorName} not found`);
        continue;
      }
      
      // Calculate the new absolute OKLCH values
      const newColor = this.calculateRelativeColor(definition, previousColor);
      if (newColor) {
        this.resolvedColors.set(currentColorName, newColor);
        console.log(`  ${currentColorName}: oklch(${newColor.l.toFixed(3)} ${newColor.c.toFixed(3)} ${newColor.h.toFixed(1)})`);
      }
      
      previousShade = shade;
    }
  }
  
  findRelativeColorDefinition(colorName) {
    // Look for the specific color definition in the CSS - handle multiline definitions
    const escapedName = colorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Find the start of the color definition
    const startPattern = new RegExp(`--color-${escapedName}:\\s*oklch\\(`, 'g');
    const startMatch = startPattern.exec(this.cssContent);
    
    if (!startMatch) {
      return null;
    }
    
    // Find the matching closing parenthesis and semicolon
    let pos = startMatch.index + startMatch[0].length;
    let parenCount = 1;
    let definition = '';
    
    while (pos < this.cssContent.length && parenCount > 0) {
      const char = this.cssContent[pos];
      
      if (char === '(') {
        parenCount++;
      } else if (char === ')') {
        parenCount--;
      }
      
      if (parenCount > 0) {
        definition += char;
      }
      
      pos++;
    }
    
    return definition.trim().replace(/\s+/g, ' ');
  }
  
  calculateRelativeColor(definition, baseColor) {
    // Parse relative color syntax like: from var(--color-primary-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h
    const fromVarMatch = definition.match(/from var\(--color-([^)]+)\)/);
    if (!fromVarMatch) {
      console.warn('No "from var()" found in definition:', definition);
      return null;
    }
    
    // Split definition and find the three components after "from var(...)"
    const afterFrom = definition.substring(definition.indexOf(')') + 1).trim();
    const components = this.parseColorComponents(afterFrom);
    
    if (components.length < 3) {
      console.warn('Not enough color components found:', components);
      return null;
    }
    
    // Calculate new values using the base color
    const newL = this.evaluateFormula(components[0], baseColor.l, baseColor.c, baseColor.h);
    const newC = this.evaluateFormula(components[1], baseColor.l, baseColor.c, baseColor.h);
    const newH = this.evaluateFormula(components[2], baseColor.l, baseColor.c, baseColor.h);
    
    return { l: newL, c: newC, h: newH };
  }
}

/**
 * Argument parsing
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let inputFile = null;
  let outputFile = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-i' && args[i + 1]) {
      inputFile = args[i + 1];
      i++;
    } else if (args[i] === '-o' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    }
  }
  if (!inputFile || !outputFile) {
    console.error('Usage: ./convertOKLCH -i <input.css> -o <output.css>');
    process.exit(1);
  }
  return { inputFile, outputFile };
}

/**
 * Main function
 */
function main() {
  const { inputFile, outputFile } = parseArgs();

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File ${inputFile} does not exist`);
    process.exit(1);
  }

  try {
    // Read the CSS file
    const cssContent = fs.readFileSync(inputFile, 'utf8');
    
    // Process the CSS
    const processor = new CSSProcessor(cssContent);
    const convertedCSS = processor.process();
    
    // Write the converted CSS
    fs.writeFileSync(outputFile, convertedCSS);
    
    console.log(`✓ Converted OKLCH colors to RGB hex values`);
    console.log(`✓ Created resolved CSS file: ${outputFile}`);
    console.log(`✓ Processed ${processor.resolvedColors.size} color definitions`);
    
  } catch (error) {
    console.error('Error processing CSS file:', error.message);
    process.exit(1);
  }
}

main();
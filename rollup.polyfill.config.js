/**
 * Rollup configuration for OKLCH polyfill
 * Builds minified polyfill for CDN distribution
 */

import { readFileSync } from 'fs';
import path from 'path';
import terser from '@rollup/plugin-terser';

// Read all polyfill source files
const polyfillDir = './standalone-components-css/src/polyfill';

const colorConverter = readFileSync(path.join(polyfillDir, 'color-converter.js'), 'utf8');
const cssParser = readFileSync(path.join(polyfillDir, 'css-parser.js'), 'utf8');
const relativeColors = readFileSync(path.join(polyfillDir, 'relative-colors.js'), 'utf8');
const polyfill = readFileSync(path.join(polyfillDir, 'oklch-polyfill.js'), 'utf8');

// Combine all modules into a single bundle
const bundledSource = `
/**
 * Altitude OKLCH Polyfill v1.1.0
 * Automatically provides OKLCH fallbacks for older browsers
 * https://components.thgaltitude.com/
 */

(function() {
  'use strict';

  // Feature detection
  function needsPolyfill() {
    if (typeof CSS === 'undefined' || !CSS.supports) return true;
    
    try {
      return !CSS.supports('color', 'oklch(0.7 0.15 250)') || 
             !CSS.supports('color', 'oklch(from red l c h)');
    } catch (e) {
      return true;
    }
  }

  // Only load if needed
  if (!needsPolyfill()) {
    return;
  }

  ${colorConverter.replace(/export\s+/g, '').replace(/import[^;]+;/g, '')}

  ${cssParser.replace(/export\s+/g, '').replace(/import[^;]+;/g, '')}

  ${relativeColors.replace(/export\s+/g, '').replace(/import[^;]+;/g, '')}

  ${polyfill.replace(/export\s+default[^;]+;/g, '').replace(/import[^;]+;/g, '')}

})();
`.trim();

// Create a virtual input plugin
const virtualInput = {
  name: 'virtual-input',
  resolveId(id) {
    if (id === 'polyfill-bundle') return id;
    return null;
  },
  load(id) {
    if (id === 'polyfill-bundle') return bundledSource;
    return null;
  }
};

export default {
  input: 'polyfill-bundle',
  output: {
    file: 'public/oklch-polyfill.min.js',
    format: 'iife',
    compact: true,
    sourcemap: false
  },
  plugins: [
    virtualInput,
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.debug', 'console.log'],
        passes: 2
      },
      mangle: {
        properties: false
      },
      format: {
        comments: false
      }
    })
  ]
};
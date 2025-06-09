#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { bundle } from 'lightningcss';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create dist directory
mkdirSync(join(__dirname, 'dist'), { recursive: true });

// Bundle and transform main.css with LightningCSS
console.log('Bundling and transforming CSS with LightningCSS...');

const result = bundle({
  filename: join(__dirname, 'src/main.css'),
  minify: true,
  targets: {
    // Force OKLCH transformation by targeting older browsers
    chrome: 80 << 16,
    firefox: 80 << 16, 
    safari: 13 << 16,
    edge: 80 << 16
  },
  drafts: {
    // Enable CSS Color Level 4 and 5 features
    customMedia: true
  }
});

// Write transformed CSS
writeFileSync(join(__dirname, 'dist/main.css'), result.code);

// Copy component CSS files and skins
console.log('Copying component files...');
cpSync(join(__dirname, 'src/components'), join(__dirname, 'dist/components'), { recursive: true });
cpSync(join(__dirname, 'src/skins.css'), join(__dirname, 'dist/skins.css'));

console.log('Build completed successfully!');
console.log(`Transformed CSS: ${result.code.length} bytes`);
if (result.warnings && result.warnings.length > 0) {
  console.log('Warnings:', result.warnings);
}
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Altitude Components repository, a design system and component library consisting of two main parts:

1. **Design System & CSS Package** (`standalone-components-css/`): Browser-native UI components built as a CSS package for multi-tenanted, performant sites with maximum native browser functionality
2. **Component Registry** (`registry/`): A shadcn-compatible component catalogue with React components that can be installed via shadcn or the altitude CLI

The project uses Astro with Starlight for documentation and includes comprehensive examples in HTML (for pure CSS components) and React (for the registry).

## Development Commands

### Core Development
- `npm run dev` - Start Astro development server for documentation site
- `npm run build` - Build polyfill, CSS package, and documentation site
- `npm run preview` - Preview the built site

### Build Commands
- `npm run build:polyfill` - Build OKLCH polyfill using rollup
- `npm run build:css` - Build the CSS package from `standalone-components-css/src/` to `standalone-components-css/dist/`
- `npm run build:all` - Build everything (polyfill + CSS + Astro)
- `npm run publish:css` - Build and publish the CSS package to npm

### Component Registry
- `npm run registry:generate` - Generate registry files from component source
- `npm run registry:generate:defaults` - Generate registry with default values applied
- `npm run registry:build` - Build the shadcn-compatible registry
- `npm run registry:validate` - Validate registry schema

### Storybook
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run storybook:build` - Build Storybook for production
- `npm run storybook:test` - Run Storybook tests

### Utility Commands
- `npm run clean` - Remove all build artifacts
- `npm run clean:build` - Clean and rebuild everything

## Architecture

### CSS Components (`standalone-components-css/`)
- Pure CSS components designed for maximum browser compatibility
- Source files in `src/components/` organized by component type
- Simple build process copies files from `src/` to `dist/`
- Main entry point is `main.css` which imports all component styles

### React Registry (`registry/`)
- Organized in shadcn-style hierarchy: `ui/`, `component/`, `block/`
- **UI components**: Basic building blocks (buttons, inputs, alerts)
- **Component**: Composed components (forms, field wrappers)
- **Block**: Complete feature blocks (review forms, review displays)
- Registry metadata stored in `registry.json` with component descriptions, dependencies, and file mappings

### Documentation (`src/`)
- Astro + Starlight for documentation site
- Component examples in `src/components/` as HTML files
- MDX documentation in `src/content/docs/`
- Storybook stories in `src/stories/` for interactive examples

### Development Workflow

**Adding/Modifying CSS Components:**
1. Create/edit HTML file in `src/components/[category]/`
2. Edit corresponding CSS in `standalone-components-css/src/components/`
3. Run `npm run build:css` to build the package

**Adding Registry Components:**
1. Create component in appropriate `registry/react/[type]/` directory
2. Document in `src/content/docs/registry/react/[type]/`
3. Update `registry.json` following the schema in `schemas/registryItem.json`
4. Run `npm run registry:generate` to update published registry

### Script Usage Notes

- `publish:css` - **DO NOT RUN MANUALLY** - This is used by GitHub workflow when package version changes
- Use `build:css` for local development and testing
- Use `clean:build` for fresh builds when troubleshooting

### Hot Reloading
The Astro config includes special handling for CSS hot reloading from the `standalone-components-css` directory, triggering full page reloads when CSS files change.

### Registry Schema
Components must follow the schema defined in `schemas/registryItem.json`. Each component requires:
- Name, type (ui/component/block), description, title
- Dependencies (external packages)
- Registry dependencies (other components from this registry)
- File mappings with source paths and target paths
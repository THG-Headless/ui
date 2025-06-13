# Altitude Components

## Overview

This repository consists of 2 parts:

1. The Design System and CSS component package
   - Source code and documentation for the npm package that provides CSS classes built to create multi tenanted, highly performant sites that operate with maximum native browser functionality
2. The Component Registry
   - A catalogue of components that can be installed either via shadcn or the altitude cli (functionality coming soon)

## Design System & UI

Browser Native UI Components.

### Adding/modifying components:

1. Add a new component HTML file under components/
2. Edit the css under standalone-components-css/
3. run `npm run build:css`

## Creating storybook stories

1. Create a new file under `src/stories`

```sh
npm run storybook
```

## Registry

1. Create your component under the appropraite route in /registry
2. Document your component under src/docs/registry
3. Update the registry.json file to include your new component, following the registry item schema (see schemas/registryItem.json)
4. Run npm run build:registry to update the published registry

## Publishing to npm

Make sure you have copied over the .npmrc file from 1Password to the root directory.

`npm publish` will publish a package to npm tagged with the version number in package.json

### Publishing alpha versions

### Bumping an alpha version and releasing it

```sh
cd  standalone-components-css/
```

```sh
npm version prerelease --preid=alpha
```

Publish an alpha version of astro-integration:

```sh
npm publish --tag alpha 
```

verify the published version and tag:

```sh
npm dist-tag 
```

run the following command in the destination repo: 

```sh
npm i @thg-altitude/standalone-components-css@<version>
```

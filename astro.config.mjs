import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [starlight({
    title: 'Altitude Standalone Components',
    sidebar: [
      {
        label: 'Components',
        autogenerate: { directory: 'components' }
      },
    ],
  }), tailwind()],
});
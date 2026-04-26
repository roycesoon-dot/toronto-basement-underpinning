import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://torontobasementunderpinning.ca',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
});

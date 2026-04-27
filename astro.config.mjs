import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const EXCLUDED_PAGES = ['/draft/', '/thank-you/', '/404/'];

export default defineConfig({
  site: 'https://torontobasementunderpinning.ca',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      filter: (page) => !EXCLUDED_PAGES.some((p) => page.includes(p)),
      serialize(item) {
        const url = item.url;
        // Homepage
        if (url === 'https://torontobasementunderpinning.ca/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // Service hub pages
        if (
          url.includes('/interior-waterproofing/') ||
          url.includes('/basement-finishing/') ||
          url.includes('/sump-pumps/') ||
          url.includes('/concrete-foundation-repair/') ||
          url.includes('/drawings-permits/') ||
          url.includes('/plumbing-drain-services/')
        ) {
          return { ...item, priority: 0.9, changefreq: 'monthly' };
        }
        // Service area pages
        if (url.includes('/service-areas/') && url.split('/').length > 5) {
          return { ...item, priority: 0.85, changefreq: 'monthly' };
        }
        // Guide / support pages
        if (url.includes('/guide/')) {
          return { ...item, priority: 0.7, changefreq: 'monthly' };
        }
        // Everything else (about, contact, tools, index pages)
        return { ...item, priority: 0.5, changefreq: 'monthly' };
      },
    }),
  ],
});

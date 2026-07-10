import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kylechan.tw',
  output: 'static',
  integrations: [sitemap()],
});

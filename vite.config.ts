import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function socialMetaPlugin(): Plugin {
  return {
    name: 'worklife-social-meta',
    transformIndexHtml(html) {
      const appUrl = (process.env.APP_URL || '').replace(/\/+$/, '');
      const bannerUrl = appUrl ? `${appUrl}/assets/og-banner.png` : '/assets/og-banner.png';
      const pageUrl = appUrl ? `${appUrl}/` : '/';

      return html
        .replace(/__OG_IMAGE_URL__/g, bannerUrl)
        .replace(/__CANONICAL_URL__/g, pageUrl);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), socialMetaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

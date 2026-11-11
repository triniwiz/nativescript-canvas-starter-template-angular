import { defineConfig, mergeConfig } from 'vite';
import { angularConfig } from '@nativescript/vite/angular';
import { protect, restore } from './postcss-masonkit.mjs';
import { dynamicImportsToEsm } from './canvas-workarounds.mjs';

export default defineConfig(({ mode }) =>
  mergeConfig(angularConfig({ mode }), {
    plugins: [dynamicImportsToEsm()],
    optimizeDeps: {
      // MasonKit must load as a single instance over the HMR server. If Vite
      // pre-bundles a subpath (e.g. `/angular`), that copy is routed to the
      // vendor bundle, where MasonKit is deliberately absent, and its exports
      // come back undefined ("installMasonKit is not a function").
      exclude: [
        '@triniwiz/nativescript-masonkit',
        '@triniwiz/nativescript-masonkit/angular',
        '@triniwiz/nativescript-masonkit/web',
        '@triniwiz/nativescript-masonkit/elements',
      ],
    },
    css: {
      postcss: {
        // Lets Tailwind layout utilities (flex, grid, gap, max-w, ...) reach
        // MasonKit views instead of being stripped for core layouts.
        plugins: [protect(), restore()],
      },
    },
  }),
);

import { Routes } from '@angular/router';
import { HomePage } from './home.page';

// Each demo page is its own chunk, so three.js and PixiJS only load when you
// open their pages.
export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'canvas2d',
    loadComponent: () => import('../demos/canvas2d/canvas2d.page').then((m) => m.Canvas2DPage),
  },
  {
    path: 'webgl',
    loadComponent: () => import('../demos/webgl/webgl.page').then((m) => m.WebGLPage),
  },
  {
    path: 'webgpu',
    loadComponent: () => import('../demos/webgpu/webgpu.page').then((m) => m.WebGPUPage),
  },
  {
    path: 'three',
    loadComponent: () => import('../demos/three/three.page').then((m) => m.ThreePage),
  },
  {
    path: 'pixi',
    loadComponent: () => import('../demos/pixi/pixi.page').then((m) => m.PixiPage),
  },
  {
    path: 'svg',
    loadComponent: () => import('../demos/svg/svg.page').then((m) => m.SvgPage),
  },
  {
    path: 'offscreen',
    loadComponent: () => import('../demos/offscreen/offscreen.page').then((m) => m.OffscreenPage),
  },
  {
    path: 'mix',
    loadComponent: () => import('../demos/mix/mix.page').then((m) => m.MixPage),
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('../demos/playground/playground.page').then((m) => m.PlaygroundPage),
  },
];

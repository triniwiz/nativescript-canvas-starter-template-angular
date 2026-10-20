import { Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Device, Page, Screen } from '@nativescript/core';
import { CanvasView } from '../components/canvas-view';
import { flowField } from '../demos/canvas2d/flow-field';
import { angularLogo, icons } from '../demos/svg/art';

@Component({
  selector: 'app-home-page',
  imports: [CanvasView],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <Scroll>
      <main class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8">
        <!-- Hero: MasonKit content layered over a live canvas -->
        <app-canvas-view [demo]="heroDemo" [height]="400" class="w-full rounded-3xl">
          <div class="absolute right-6 top-6">
            <Svg [src]="logo" class="size-[120]"></Svg>
          </div>
          <section class="absolute inset-0 flex flex-col justify-end gap-4 p-8">
            <span
              class="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"
            >
              NativeScript × Canvas × MasonKit
            </span>
            <h1 class="text-4xl font-bold text-white">Draw anything, natively.</h1>
            <p class="text-base text-white/80">
              Canvas 2D, WebGL, WebGPU and SVG as native views, with three.js and
              PixiJS on top, laid out with Tailwind on iOS, Android and Windows.
            </p>
            <div class="flex flex-row flex-wrap gap-3 pt-2">
              <button
                class="btn bg-white text-indigo-600 active:bg-indigo-50"
                (tap)="open('mix')"
              >
                Open the dashboard →
              </button>
              <button
                class="btn bg-white/15 text-white active:bg-white/30"
                (tap)="open('canvas2d')"
              >
                Start with 2D
              </button>
            </div>
          </section>
        </app-canvas-view>

        <!-- Stats: each card is at least 160 wide, so they wrap on phones -->
        <div class="flex flex-row flex-wrap gap-4">
          @for (stat of stats; track stat.label) {
            <div class="card flex flex-1 basis-40 flex-col gap-1">
              <span class="text-sm text-slate-500 dark:text-slate-400">
                {{ stat.label }}
              </span>
              <span class="text-xl font-bold text-slate-900 dark:text-white">
                {{ stat.value }}
              </span>
            </div>
          }
        </div>

        <!-- Demos: as many 260-wide columns as fit -->
        <section class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <span class="eyebrow">Demos</span>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              Pick a renderer
            </h2>
          </div>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(260,1fr))] gap-4">
            @for (demo of demos; track demo.title) {
              <article
                class="card flex flex-col gap-3 active:bg-slate-50 dark:active:bg-slate-800"
                (tap)="open(demo.path)"
              >
                <div class="flex flex-row items-center gap-3">
                  <Svg [src]="demo.icon" class="size-12"></Svg>
                  <h3 class="flex-1 text-lg font-semibold text-slate-900 dark:text-white">
                    {{ demo.title }}
                  </h3>
                  <span class="text-lg text-slate-400">→</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  {{ demo.body }}
                </p>
                <div class="flex flex-row flex-wrap gap-2">
                  @for (tag of demo.tags; track tag) {
                    <span
                      class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                    >
                      {{ tag }}
                    </span>
                  }
                </div>
              </article>
            }
          </div>
        </section>

        <footer class="flex flex-col items-center py-2">
          <span class="text-xs text-slate-400 dark:text-slate-500">
            {{ platform }} · {{ screen }}
          </span>
        </footer>
      </main>
    </Scroll>
  `,
})
export class HomePage {
  private router = inject(RouterExtensions);

  protected readonly platform = Device.os;
  protected readonly screen = `${Math.round(Screen.mainScreen.widthDIPs)} × ${Math.round(
    Screen.mainScreen.heightDIPs,
  )} dp`;

  // The hero's background is a live Canvas 2D sketch.
  protected readonly heroDemo = flowField({ density: 0.6 });
  protected readonly logo = angularLogo(120);

  protected readonly stats = [
    { label: 'Running on', value: this.platform },
    { label: 'Contexts', value: '2D · WebGL · WebGPU' },
    { label: 'Rendered by', value: 'Skia + wgpu' },
  ];

  // `path` is the route in src/app/app.routes.ts.
  protected readonly demos = [
    {
      title: 'Canvas 2D',
      body: 'A flow field, an analog clock and a streaming chart, all plain ctx.* calls.',
      tags: ['Paths', 'Gradients', 'Text'],
      icon: icons.canvas2d,
      path: 'canvas2d',
    },
    {
      title: 'WebGL',
      body: 'Hand-written GLSL fragment shaders on a full-screen triangle.',
      tags: ['GLSL', 'Uniforms'],
      icon: icons.webgl,
      path: 'webgl',
    },
    {
      title: 'WebGPU',
      body: 'Thousands of boids steered by a WGSL compute shader every frame.',
      tags: ['Compute', 'WGSL', 'Instancing'],
      icon: icons.webgpu,
      path: 'webgpu',
    },
    {
      title: 'three.js',
      body: 'PBR materials, a PMREM environment and an instanced galaxy.',
      tags: ['3D', 'PBR'],
      icon: icons.three,
      path: 'three',
    },
    {
      title: 'PixiJS',
      body: 'A bunnymark of generated sprites on WebGL or WebGPU.',
      tags: ['Sprites', 'v8'],
      icon: icons.pixi,
      path: 'pixi',
    },
    {
      title: 'SVG',
      body: 'Native SVG with SMIL animation and markup driven by Angular signals.',
      tags: ['SMIL', 'Skia'],
      icon: icons.svg,
      path: 'svg',
    },
    {
      title: 'Offscreen & Workers',
      body: 'One scene drawn on the main thread and by a Worker that owns the canvas.',
      tags: ['OffscreenCanvas', 'Worker'],
      icon: icons.offscreen,
      path: 'offscreen',
    },
    {
      title: 'Mix & match',
      body: 'A dashboard where WebGL, 2D, SVG and three.js share one layout.',
      tags: ['MasonKit', 'Tailwind'],
      icon: icons.mix,
      path: 'mix',
    },
    {
      title: 'Layout playground',
      body: 'Flexbox, CSS Grid and wrapping with MasonKit and Tailwind.',
      tags: ['Flexbox', 'Grid'],
      icon: icons.layout,
      path: 'playground',
    },
  ];

  constructor() {
    inject(Page).actionBarHidden = true;
  }

  protected open(path: string) {
    this.router.navigate(['/' + path]);
  }
}

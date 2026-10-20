import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { DemoPage } from '../../components/demo-page';
import { CanvasView } from '../../components/canvas-view';
import { shaderGallery } from '../webgl/shaders';
import { liveChart, type ChartSeries } from '../canvas2d/live-chart';
import { threeGalaxy } from '../three/galaxy';
import { gauge, icons } from '../svg/art';

@Component({
  selector: 'app-mix-page',
  imports: [DemoPage, CanvasView],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      eyebrow="Mix & match"
      title="Dashboard"
      description="Canvases are ordinary views, so they drop into MasonKit layouts next to text, SVG and each other. Here a WebGL shader, three 2D sparklines, an SVG gauge and a three.js scene share one Tailwind grid."
    >
      <app-canvas-view [demo]="hero" [height]="220" class="w-full rounded-3xl">
        <div class="absolute inset-0 flex flex-col justify-end gap-2 p-6">
          <span
            class="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"
          >
            WebGL background · MasonKit foreground
          </span>
          <h2 class="text-3xl font-bold text-white">Render pipeline health</h2>
          <p class="text-sm text-white/80">All systems nominal across 2D, WebGL, WebGPU and SVG.</p>
        </div>
      </app-canvas-view>

      <div class="flex flex-row flex-wrap gap-4">
        @for (kpi of kpis; track kpi.key) {
          <div class="card flex flex-1 basis-48 flex-col gap-3">
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ kpi.label }}</span>
            <div class="flex flex-row items-end gap-1">
              <span class="text-3xl font-bold text-slate-900 dark:text-white">
                {{ reading(kpi.key, kpi.factor) }}
              </span>
              <span class="pb-1 text-sm text-slate-500 dark:text-slate-400">{{ kpi.unit }}</span>
            </div>
            <app-canvas-view [demo]="kpi.demo" [height]="64" class="w-full rounded-xl" />
          </div>
        }
      </div>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(280,1fr))] gap-4">
        <section class="card flex flex-col items-center gap-3">
          <span class="self-start eyebrow">SVG</span>
          <div class="size-[200] rounded-3xl bg-slate-950 p-3">
            <Svg [src]="budget()" class="size-[176]"></Svg>
          </div>
        </section>

        <section class="card flex flex-col gap-3">
          <span class="eyebrow">three.js</span>
          <app-canvas-view [demo]="preview" [height]="220" class="w-full rounded-2xl" />
          <p class="text-xs text-slate-500 dark:text-slate-400">Drag to orbit the preview.</p>
        </section>

        <section class="card flex flex-col gap-3">
          <span class="eyebrow">Activity</span>
          @for (item of activity; track item.title) {
            <div class="flex flex-row items-center gap-3">
              <Svg [src]="item.icon" class="size-12"></Svg>
              <div class="flex flex-1 flex-col">
                <span class="text-sm font-semibold text-slate-900 dark:text-white">{{
                  item.title
                }}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ item.body }}</span>
              </div>
              <span class="text-xs text-slate-400">{{ item.time }}</span>
            </div>
          }
        </section>
      </div>
    </app-demo-page>
  `,
})
export class MixPage {
  protected readonly hero = shaderGallery({ shader: 'aurora', timeScale: 0.5 });
  protected readonly preview = threeGalaxy({ cubes: 300, compact: true });

  // Each KPI card gets its own sparkline canvas; the numbers beside it are
  // MasonKit text fed from the same samples.
  private readonly latest = signal<Record<string, ChartSeries[]>>({});
  protected readonly kpis = [
    { key: 'fps', label: 'Frame time', unit: 'ms', factor: 0.25 },
    { key: 'gpu', label: 'GPU load', unit: '%', factor: 1 },
    { key: 'mem', label: 'Texture memory', unit: 'MB', factor: 4.2 },
  ].map((kpi) => ({
    ...kpi,
    demo: liveChart({
      compact: true,
      onSample: (series) => this.latest.update((latest) => ({ ...latest, [kpi.key]: series })),
    }),
  }));

  protected reading(key: string, factor: number) {
    const value = this.latest()[key]?.[0]?.value;
    return value === undefined ? '—' : (value * factor).toFixed(factor < 1 ? 1 : 0);
  }

  protected readonly budget = computed(() =>
    gauge(this.latest()['gpu']?.[0]?.value ?? 0, 'GPU load'),
  );

  protected readonly activity = [
    { icon: icons.webgpu, title: 'Compute pass', body: 'boids · 2,048 invocations', time: 'now' },
    { icon: icons.three, title: 'Scene graph', body: 'InstancedMesh · 300 cubes', time: '2s' },
    { icon: icons.canvas2d, title: 'Canvas 2D', body: '3 sparklines redrawn', time: '4s' },
    { icon: icons.svg, title: 'SVG', body: 'gauge re-rendered from state', time: '5s' },
  ];
}

import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { formatCount } from '../../format';
import { DemoPage } from '../../components/demo-page';
import { CanvasView } from '../../components/canvas-view';
import { Segmented } from '../../components/segmented';
import { pixiCritters, type PixiBackend, type PixiCritters, type PixiStats } from './critters';

@Component({
  selector: 'app-pixi-page',
  imports: [DemoPage, CanvasView, Segmented],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      [fill]="620"
      eyebrow="PixiJS"
      title="Sprite party"
      description="PixiJS v8 through @nativescript/canvas-pixi: textures generated from vector Graphics, a parallax starfield and a bunnymark of bouncing sprites. Tap the canvas for a burst."
    >
      <section class="card flex flex-1 flex-col gap-4">
        <!-- Keyed on the backend: switching mounts a new canvas. -->
        @for (key of [backend()]; track key) {
          <app-canvas-view
            [demo]="demo()"
            class="min-h-[240] w-full flex-1 rounded-2xl"
            (started)="critters = $event"
          >
            <div class="absolute left-3 top-3 flex flex-row flex-wrap gap-2">
              <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {{ stats().renderer || '…' }}
              </span>
              <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {{ formatCount(stats().sprites) }} sprites
              </span>
              <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {{ stats().fps }} fps
              </span>
            </div>
          </app-canvas-view>
        }
        <div class="flex flex-row flex-wrap items-center justify-between gap-3">
          <app-segmented [options]="backends" [(value)]="backend" />
          <div class="flex flex-row flex-wrap gap-2">
            <button
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white active:bg-indigo-600"
              (tap)="critters?.add(100)"
            >
              +100
            </button>
            <button
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white active:bg-indigo-600"
              (tap)="critters?.add(1000)"
            >
              +1000
            </button>
            <button
              class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              (tap)="critters?.clear()"
            >
              Clear
            </button>
          </div>
        </div>
      </section>
    </app-demo-page>
  `,
})
export class PixiPage {
  protected readonly formatCount = formatCount;

  // PixiJS picks its renderer at init, so switching mounts a fresh canvas.
  protected readonly backends: { label: string; value: PixiBackend }[] = [
    { label: 'WebGL', value: 'webgl' },
    { label: 'WebGPU', value: 'webgpu' },
  ];
  protected readonly backend = signal<PixiBackend>('webgl');
  protected critters?: PixiCritters;
  protected readonly stats = signal<PixiStats>({ sprites: 0, fps: 0, renderer: '' });

  protected readonly demo = computed(() =>
    pixiCritters({ backend: this.backend(), onStats: (value) => this.stats.set(value) }),
  );
}

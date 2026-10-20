import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { DemoPage } from '../../components/demo-page';
import { CanvasView } from '../../components/canvas-view';
import { Segmented } from '../../components/segmented';
import { flowField, type FlowField, type FlowPalette } from './flow-field';
import { clock } from './clock';
import { liveChart, type ChartSeries } from './live-chart';

@Component({
  selector: 'app-canvas2d-page',
  imports: [DemoPage, CanvasView, Segmented],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      eyebrow="Canvas 2D"
      title="Paths, gradients & text"
      description="The web's CanvasRenderingContext2D, drawn natively with Skia. Every frame below is plain ctx.* calls."
    >
      <section class="card flex flex-col gap-4">
        <div class="flex flex-row flex-wrap items-center justify-between gap-3">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Flow field</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Thousands of particle trails, additive blending. Drag to stir.
            </p>
          </div>
          <button
            class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            (tap)="field?.clear()"
          >
            Clear
          </button>
        </div>
        <app-canvas-view
          [demo]="flowDemo"
          [height]="380"
          class="w-full rounded-2xl"
          (started)="field = $event"
        >
          <span
            class="absolute left-3 top-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white"
          >
            globalCompositeOperation = 'lighter'
          </span>
        </app-canvas-view>
        <app-segmented
          [options]="palettes"
          [value]="palette()"
          (valueChange)="setPalette($event)"
        />
      </section>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(300,1fr))] gap-6">
        <section class="card flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Clock</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              save/restore, rotate, arcs, radial gradients, shadows and fillText.
            </p>
          </div>
          <app-canvas-view [demo]="clockDemo" [height]="320" class="w-full rounded-2xl" />
        </section>

        <section class="card flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Live chart</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Streaming curves drawn on canvas; the legend is MasonKit, fed by the same data.
            </p>
          </div>
          <app-canvas-view [demo]="chartDemo" [height]="240" class="w-full rounded-2xl" />
          <div class="flex flex-row flex-wrap gap-3">
            @for (s of series(); track s.name) {
              <div
                class="flex flex-1 basis-24 flex-row items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800"
              >
                <div class="size-3 rounded-full" [style.backgroundColor]="s.color"></div>
                <span class="flex-1 text-sm text-slate-600 dark:text-slate-300">{{ s.name }}</span>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{
                  Math.round(s.value)
                }}</span>
              </div>
            }
          </div>
        </section>
      </div>
    </app-demo-page>
  `,
})
export class Canvas2DPage {
  protected readonly Math = Math;

  protected readonly palettes: { label: string; value: FlowPalette }[] = [
    { label: 'Aurora', value: 'aurora' },
    { label: 'Ember', value: 'ember' },
    { label: 'Ocean', value: 'ocean' },
  ];
  protected readonly palette = signal<FlowPalette>('aurora');
  protected field?: FlowField;

  protected readonly series = signal<ChartSeries[]>([]);

  protected readonly flowDemo = flowField({ palette: this.palette() });
  protected readonly clockDemo = clock();
  protected readonly chartDemo = liveChart({ onSample: (latest) => this.series.set(latest) });

  protected setPalette(value: FlowPalette) {
    this.palette.set(value);
    this.field?.setPalette(value);
  }
}

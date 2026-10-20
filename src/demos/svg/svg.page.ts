import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { DemoPage } from '../../components/demo-page';
import { gallery, gauge } from './art';

@Component({
  selector: 'app-svg-page',
  imports: [DemoPage],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      eyebrow="SVG"
      title="Vector, animated"
      description="The Svg view from @nativescript/canvas-svg renders SVG natively with Skia, SMIL animation included. Each tile below is inline markup passed to src."
    >
      <div class="grid grid-cols-[repeat(auto-fill,minmax(160,1fr))] gap-4">
        @for (item of gallery; track item.title) {
          <article class="card flex flex-col gap-3">
            <div class="flex h-[140] w-full items-center justify-center rounded-2xl bg-slate-950">
              <Svg [src]="item.src" class="size-[120]"></Svg>
            </div>
            <div class="flex flex-col gap-1">
              <h3 class="text-base font-semibold text-slate-900 dark:text-white">{{ item.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.body }}</p>
            </div>
          </article>
        }
      </div>

      <section class="card flex flex-row flex-wrap items-center gap-6">
        <div class="size-[200] rounded-3xl bg-slate-950 p-3">
          <Svg [src]="gaugeSrc()" class="size-[176]"></Svg>
        </div>
        <div class="flex flex-1 basis-60 flex-col gap-3">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Driven by a signal</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            The gauge's markup is a computed string; change the value and the view redraws.
          </p>
          <div class="flex flex-row flex-wrap gap-2">
            <button
              class="size-10 rounded-full bg-slate-100 text-lg font-bold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              (tap)="nudge(-10)"
            >
              −
            </button>
            <button
              class="size-10 rounded-full bg-indigo-500 text-lg font-bold text-white active:bg-indigo-600"
              (tap)="nudge(10)"
            >
              +
            </button>
            <button
              class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              (tap)="randomize()"
            >
              Random
            </button>
          </div>
        </div>
      </section>
    </app-demo-page>
  `,
})
export class SvgPage {
  protected readonly gallery = gallery;

  protected readonly value = signal(64);
  protected readonly gaugeSrc = computed(() => gauge(this.value(), 'GPU budget'));

  protected nudge(delta: number) {
    this.value.update((value) => Math.max(0, Math.min(100, value + delta)));
  }

  protected randomize() {
    this.value.set(Math.round(Math.random() * 100));
  }
}

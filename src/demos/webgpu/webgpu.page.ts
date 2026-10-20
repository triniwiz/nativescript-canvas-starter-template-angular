import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { formatCount } from '../../format';
import { DemoPage } from '../../components/demo-page';
import { CanvasView } from '../../components/canvas-view';
import { Segmented } from '../../components/segmented';
import { boids, type BoidPreset, type Boids, type GPUInfo } from './boids';

@Component({
  selector: 'app-webgpu-page',
  imports: [DemoPage, CanvasView, Segmented],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      [fill]="760"
      eyebrow="WebGPU"
      title="Compute boids"
      description="Every frame a WGSL compute shader steers each boid from its neighbours, then an instanced render pass draws the flock. Touch the canvas to attract them."
    >
      <section class="card flex flex-1 flex-col gap-4">
        <!-- Keyed on the count: a new count mounts a new canvas. -->
        @for (key of [count()]; track key) {
          <app-canvas-view
            [demo]="demo()"
            class="min-h-[240] w-full flex-1 rounded-2xl"
            (started)="onStarted($event)"
          >
            <div class="absolute left-3 top-3 flex flex-row gap-2">
              <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {{ formatCount(count()) }} boids
              </span>
              <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                O(n²) per frame on the GPU
              </span>
            </div>
          </app-canvas-view>
        }
        <div class="flex flex-row flex-wrap items-center justify-between gap-3">
          <app-segmented [options]="presets" [value]="preset()" (valueChange)="setPreset($event)" />
          <div class="flex flex-row flex-wrap items-center gap-2">
            <app-segmented [options]="counts" [(value)]="count" />
            <button
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white active:bg-indigo-600"
              (tap)="flock?.reset()"
            >
              Scatter
            </button>
          </div>
        </div>
      </section>

      <section class="card flex flex-col gap-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Adapter</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(200,1fr))] gap-3">
          @for (item of details(); track item.label) {
            <div class="flex flex-col gap-1 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <span class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                {{ item.label }}
              </span>
              <span class="text-sm font-medium text-slate-900 dark:text-white">{{ item.value }}</span>
            </div>
          }
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Powered by wgpu, which picks the native graphics API: Metal on iOS, Vulkan on Android (API
          27+), Direct3D or Vulkan on Windows.
        </p>
      </section>
    </app-demo-page>
  `,
})
export class WebGPUPage {
  protected readonly formatCount = formatCount;

  protected readonly presets: { label: string; value: BoidPreset }[] = [
    { label: 'Flock', value: 'flock' },
    { label: 'Swarm', value: 'swarm' },
    { label: 'Drift', value: 'drift' },
  ];
  protected readonly preset = signal<BoidPreset>('flock');

  // The particle buffers are sized up front, so a new count mounts a new canvas.
  protected readonly counts = [
    { label: '1K', value: 1024 },
    { label: '2K', value: 2048 },
    { label: '4K', value: 4096 },
  ];
  protected readonly count = signal(__ANDROID__ ? 1024 : 2048);

  protected flock?: Boids;

  private readonly info = signal<GPUInfo | undefined>(undefined);
  protected readonly details = computed(() => {
    const info = this.info();
    return info
      ? [
          { label: 'Vendor', value: info.vendor },
          { label: 'Architecture', value: info.architecture },
          { label: 'Adapter', value: info.description || '—' },
          { label: 'Canvas format', value: info.format },
        ]
      : [];
  });

  protected readonly demo = computed(() =>
    boids({ count: this.count(), onInfo: (value) => this.info.set(value) }),
  );

  protected onStarted(instance: Boids) {
    this.flock = instance;
    instance.setPreset(this.preset());
  }

  protected setPreset(value: BoidPreset) {
    this.preset.set(value);
    this.flock?.setPreset(value);
  }
}

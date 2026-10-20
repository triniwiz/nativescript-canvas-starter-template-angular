import {
  Component,
  DestroyRef,
  NO_ERRORS_SCHEMA,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { EventData } from '@nativescript/core';
import type { Canvas } from '@nativescript/canvas';
import { runInWorker, type TransferMode } from '../canvas/worker-host';

/**
 * CanvasView, drawn by a Worker: `worker` creates one whose entry file calls
 * `serveDemo` (see src/demos/offscreen). Sizing and projected content work as
 * in CanvasView. The Worker ends when this component is destroyed.
 */
@Component({
  selector: 'app-worker-canvas-view',
  schemas: [NO_ERRORS_SCHEMA],
  host: {
    class: 'relative overflow-hidden',
    '[style.height]': 'height()',
  },
  template: `
    <div class="absolute inset-0">
      <Canvas [style.width]="'100%'" [style.height]="'100%'" (loaded)="onLoaded($event)"></Canvas>
    </div>
    <ng-content />
    @if (error()) {
      <div
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 p-6"
      >
        <span class="text-sm font-semibold text-rose-300">The Worker couldn't draw</span>
        <p class="text-center text-xs text-slate-400">{{ error() }}</p>
      </div>
    }
  `,
})
export class WorkerCanvasView {
  readonly worker = input.required<() => Worker>();
  readonly height = input<number>();
  readonly started = output<TransferMode>();

  protected readonly error = signal<string | null>(null);
  private stop: (() => void) | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.stop?.();
      this.stop = null;
    });
  }

  private showError(reason: any) {
    this.error.set(String(reason?.message ?? reason));
  }

  protected onLoaded(args: EventData) {
    if (this.stop) {
      return;
    }
    // `new Worker` throws if the runtime can't load the entry file. Left
    // uncaught, that escapes into the page's navigation and leaves the Frame
    // unable to go back.
    let worker: Worker;
    try {
      worker = this.worker()();
    } catch (reason) {
      console.error('[canvas worker]', reason);
      this.showError(reason);
      return;
    }
    this.error.set(null);
    this.stop = runInWorker(
      args.object as Canvas,
      worker,
      (mode) => this.started.emit(mode),
      (reason) => this.showError(reason),
    );
  }
}

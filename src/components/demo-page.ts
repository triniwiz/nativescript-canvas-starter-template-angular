import {
  Component,
  DestroyRef,
  NO_ERRORS_SCHEMA,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';

/**
 * The frame every demo page shares: a back button, a title and a
 * description, with the page's own content projected below.
 *
 * `fill` (dp): the page is as tall as the window, but at least `fill`, so
 * content with `flex-1` takes the height left over and the page scrolls once
 * the window is shorter than that. It is a definite height rather than a
 * minimum because nested `flex-1` and percentage heights need one.
 *
 * Its selector ends in `-page`, so like the routed pages it stays a
 * transparent page root (see `installMasonKit` in src/main.ts).
 */
@Component({
  selector: 'app-demo-page',
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <Scroll>
      <main
        class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8"
        [style.height]="height()"
      >
        <header class="flex flex-row items-center gap-4">
          <button
            class="rounded-2xl bg-white px-4 py-2 text-base font-semibold text-indigo-600 active:bg-indigo-50 dark:bg-slate-900 dark:text-indigo-300"
            (tap)="back()"
          >
            ← Back
          </button>
          <div class="flex flex-1 flex-col">
            <span class="eyebrow">{{ eyebrow() }}</span>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
              {{ title() }}
            </h1>
          </div>
        </header>
        <p class="text-base text-slate-600 dark:text-slate-400">
          {{ description() }}
        </p>
        <ng-content />
      </main>
    </Scroll>
  `,
})
export class DemoPage {
  private router = inject(RouterExtensions);

  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly fill = input<number>();

  private readonly pageHeight = signal(0);
  protected readonly height = computed(() => {
    const fill = this.fill();
    return fill ? Math.max(this.pageHeight(), fill) : undefined;
  });

  constructor() {
    const page = inject(Page);
    page.actionBarHidden = true;

    const onLayout = () => this.pageHeight.set(page.getActualSize().height);
    page.on('layoutChanged', onLayout);
    inject(DestroyRef).onDestroy(() => page.off('layoutChanged', onLayout));
  }

  protected back() {
    this.router.back();
  }
}

import { Component, NO_ERRORS_SCHEMA, input, model } from '@angular/core';

/** A row of buttons picking one of `options`. Bind it with `[(value)]`. */
@Component({
  selector: 'app-segmented',
  schemas: [NO_ERRORS_SCHEMA],
  host: { class: 'flex flex-row flex-wrap gap-2' },
  template: `
    @for (option of options(); track option.value) {
      <button
        class="rounded-xl px-4 py-2 text-sm font-semibold"
        [class]="
          value() === option.value
            ? 'bg-indigo-500 text-white'
            : 'bg-slate-100 text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
        "
        (tap)="value.set(option.value)"
      >
        {{ option.label }}
      </button>
    }
  `,
})
export class Segmented<V extends string | number> {
  readonly options = input.required<readonly { label: string; value: V }[]>();
  readonly value = model.required<V>();
}

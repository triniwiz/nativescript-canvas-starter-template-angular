# NativeScript Canvas Starter (Angular)

A NativeScript Angular starter for Windows, iOS and Android that draws with
[`@nativescript/canvas`](https://github.com/NativeScript/canvas): Canvas 2D,
WebGL, WebGPU and SVG, with three.js and PixiJS on top. Layout uses
[MasonKit](https://github.com/triniwiz/nativescript-mason), and styling uses
Tailwind CSS v4.

## Prerequisites

> NativeScript for Windows is in alpha. Expect rough edges.

To run on Windows you need the following. `npx ns doctor windows` checks them.

| Requirement | Notes |
| --- | --- |
| Windows 10 1809 (build 17763) or later | The app targets `net10.0-windows10.0.26100.0`, with a minimum of `10.0.17763.0`. |
| [Node.js](https://nodejs.org) LTS | Provides `npm` and `npx`. |
| [.NET 10 SDK](https://dotnet.microsoft.com/download) | The build runs `dotnet build`. Check it with `dotnet --version`. |
| Developer Mode | Settings → Privacy & security → For developers. Windows needs it to install and launch the unsigned debug build. |

For iOS and Android, follow the [NativeScript environment setup](https://docs.nativescript.org/setup/).

You don't need to install the NativeScript CLI globally. It's a dev dependency, and the npm scripts run it.

## Getting started

```bash
git clone https://github.com/triniwiz/nativescript-canvas-starter-template-angular my-app
cd my-app
npm install
npm run windows   # or: npm run ios / npm run android
```

`npm run windows` builds the app, installs and launches it, then syncs your
changes into it as you save. `npm run clean` removes the build output.

Use npm. `package.json` relies on npm `overrides`.

## Demos

The home screen links to one page per renderer. Each page has its own folder in
`src/demos/`, holding the page (`*.page.ts`) and its drawing code (the other
`*.ts` files):

| Page | Folder | What it shows |
| --- | --- | --- |
| Canvas 2D | `canvas2d/` | Flow-field particles, an analog clock and a live chart |
| WebGL | `webgl/` | GLSL fragment shaders |
| WebGPU | `webgpu/` | A WGSL compute shader simulating boids |
| three.js | `three/` | PBR materials and an instanced galaxy |
| PixiJS | `pixi/` | Sprites on WebGL or WebGPU |
| SVG | `svg/` | Animated SVG, and SVG generated from a signal |
| Offscreen & Workers | `offscreen/` | `OffscreenCanvas` sprites, and a canvas drawn by a Worker next to one drawn on the main thread |
| Mix & match | `mix/` | All of the above in one Tailwind grid |
| Layout playground | `playground/` | Flexbox and Grid with MasonKit |

## Project layout

| Path | What it's for |
| --- | --- |
| `src/main.ts` | App entry. Loads the browser polyfills, turns on `View.preflight`, calls `installMasonKit()`, registers `<Canvas>` and `<Svg>`, and bootstraps Angular (zoneless). |
| `src/polyfills.ts` | NativeScript and Angular polyfills, loaded before `main.ts`. |
| `src/app/app.routes.ts` | One route per demo page, each loaded on demand. |
| `src/app/home.page.ts` | The home screen. |
| `src/demos/<renderer>/` | One folder per demo page (see [Demos](#demos)). The drawing code doesn't depend on Angular, so you can copy it into any app. |
| `src/canvas/runner.ts` | Runs a demo on a canvas: sizing, the `requestAnimationFrame` loop and pointer input. |
| `src/canvas/worker-host.ts`, `src/canvas/worker-demo.ts` | Run a demo in a Worker: `runInWorker` hands a canvas over with `transferControlToOffscreen()`, and `serveDemo` draws into it on the Worker's side. |
| `src/components/canvas-view.ts` | `<Canvas>` wrapped as `<app-canvas-view>`. Projected content is layered over the canvas. |
| `src/components/` | Also `<app-demo-page>`, `<app-segmented>` and `<app-worker-canvas-view>`, which the demo pages share. |
| `src/app.css` | Tailwind, plus the `dark:`, `ios:`, `android:`, `windows:`, `phone:` and `tablet:` variants. |
| `postcss-masonkit.mjs` | Keeps the Tailwind layout utilities (`flex`, `grid`, `gap-*`, `max-w-*`, `absolute`, ...) that NativeScript's Tailwind plugin would otherwise remove. |

## Tips

- **Sizing a canvas:** give `<Canvas>` its size with a style binding, not
  classes. `<app-canvas-view>` does this for you: bind `[height]` for a fixed
  height, or leave it out and size its box with classes such as `flex-1`. The
  single-canvas demos use `<app-demo-page [fill]="…">`, so the canvas takes
  the window height left over and the page only scrolls in short windows. As
  on the web, `canvas.width` and `canvas.height` set the backing store;
  `runDemo` sets them for you.
- **A fresh canvas:** a canvas keeps the first context it hands out, so to
  switch from WebGL to WebGPU you need a new one. The PixiJS and WebGPU pages
  key their `<app-canvas-view>` with `@for (key of [value()]; track key)`,
  which creates a new one whenever the value changes.
- **Workers:** create one with `new Worker(new URL('./x.worker.ts', import.meta.url))`
  so the bundler builds it, and import `@nativescript/canvas/worker` first in
  its entry file. Where the runtime supports transfers (Windows), the
  OffscreenCanvas moves with `postMessage(…, [offscreen])`; on Android and iOS
  it is sent with `OffscreenCanvas._toHandle()` and received with
  `OffscreenCanvas._fromHandle()`. `runInWorker` picks the right one.
- **Opaque 2D canvases** (`getContext('2d', { alpha: false })`) are faster
  when you paint the whole frame anyway.
- **Typings:** on Windows `getContext()` returns a union, so cast the result,
  for example `canvas.getContext('2d') as CanvasRenderingContext2D`.
- **Elements:** you can write `<div>`, `<section>`, `<h1>`, `<p>`, `<span>`,
  `<button>` and so on. Add `NO_ERRORS_SCHEMA` to each component's `schemas`.
  In Angular templates `<Button>`, `<img>` and `<Span>` resolve to MasonKit's
  versions; pass `{ web: false }` or `{ mason: false }` to `installMasonKit()`
  to keep core's.
- **Closing tags:** Angular only lets you self-close custom elements, so
  write `<Canvas></Canvas>`, `<Svg></Svg>` and `<div></div>` in full.
  `<app-canvas-view />` is fine.
- **Component hosts:** your components' own elements are real layout boxes,
  so `<app-canvas-view class="w-full rounded-2xl">` styles the box the canvas
  fills. Routed pages, and `<app-demo-page>` that they wrap themselves in, are
  page roots and must stay transparent: their selectors end in `-page`, which
  `installMasonKit()` in `src/main.ts` keeps as passthrough. Name new pages
  the same way, or they may render blank.
- **Change detection** is zoneless. Keep component state in `signal()`s; a
  signal set from a demo callback (`onStats`, `onSample`) updates the page.
- **DOM event types are off** (`strictDomEventTypes: false` in
  `tsconfig.json`): NativeScript elements aren't DOM elements, so `$event` on
  `(loaded)` or `(tap)` isn't a DOM `Event`.
- **Responsive layouts:** there are no `sm:` or `md:` breakpoints. Use layouts
  that fit the space they're given, like
  `grid-cols-[repeat(auto-fill,minmax(240,1fr))]` or `flex-wrap` with
  `basis-*`.
- **Units:** unitless values are dp, and `px` means physical pixels.
- **Avoid** `tracking-*`, `leading-*` and `bg-linear-*`. For gradients, write
  a `@utility` instead, like `bg-hero` in `src/app.css`.
- **Keep** `@import 'tailwindcss/theme'` and `@import 'tailwindcss/utilities'`
  in `src/app.css`, not `@import 'tailwindcss'`. Tailwind's preflight would
  hide every view.

## Known issues

- `Number.prototype.toLocaleString()` throws on Windows, so the demos format
  numbers with `formatCount` from `src/format.ts`.
- On the iOS Simulator, three.js can take 15 seconds or more to compile its
  shaders (the Simulator lacks `KHR_parallel_shader_compile`), and the UI is
  frozen meanwhile, since NativeScript runs JavaScript on the main thread.

## Troubleshooting

- **Something's missing from your setup:** `npx ns doctor windows` lists what it can't find and how to fix it.
- **The app builds but won't launch** ("deployment failed"): turn on Developer Mode.
- **A stale or broken build:** run `npm run clean`, then `npm run windows` again.
- **A page renders blank:** its component's selector doesn't end in `-page`
  (see Component hosts above).

## Temporary workarounds

These can be removed once the fixes are released:

- `@nativescript/core` and `@nativescript/vite` are installed through pkg.pr.new from
  [NativeScript/NativeScript#11468](https://github.com/NativeScript/NativeScript/pull/11468),
  which is the `feat/windows` branch plus percentage sizes inside MasonKit layouts.
- `overrides` pins the `@nativescript/canvas*` packages to `3.0.0-beta.5`.
  They depend on each other with `"*"`, which doesn't match prereleases.
- `canvas-workarounds.mjs` makes the canvas package's `./platform` import
  resolve to `platform.js` rather than the `platform/` folder
  ([#11464](https://github.com/NativeScript/NativeScript/pull/11464)).
  Its `threeAddons()` keeps three.js addons out of Vite's pre-bundling,
  because HMR requests them at the wrong URL
  ([#11466](https://github.com/NativeScript/NativeScript/pull/11466)). During
  HMR it also points PixiJS's dynamic imports at its ES modules instead of its
  CommonJS files, which would load a second copy of PixiJS.
- `masonkit-hmr.mjs` stops MasonKit from loading twice during HMR.
- `postcss-selector-commas.mjs` makes classes with a comma, like
  `grid-cols-[repeat(auto-fill,minmax(240,1fr))]`, match
  ([#11463](https://github.com/NativeScript/NativeScript/pull/11463)).

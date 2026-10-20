// Browser globals (window, document, Image, fetch, ...) that three.js, PixiJS
// and the SVG DOM expect. Import it before anything that uses them.
import '@nativescript/canvas-polyfill';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  bootstrapApplication,
  provideNativeScriptRouter,
  registerElement,
  runNativeScriptAngularApp,
} from '@nativescript/angular';
import { View } from '@triniwiz/nativescript-masonkit';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/angular';
import { Canvas } from '@nativescript/canvas';
import { Svg } from '@nativescript/canvas-svg';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Start every MasonKit element from Tailwind's preflight baseline
// (border-box, no UA margins/padding). Must run before any view is created.
View.preflight = true;

// Registers MasonKit's elements (<view>, <text>, <scroll>, <button>, ...) and
// the HTML-shaped ones (<div>, <section>, <h1>, <p>, <span>, ...), and makes
// component hosts real layout boxes. Must run before bootstrap. Routed screens
// (and DemoPage, which they wrap themselves in) are page roots, so they stay
// transparent: their selectors all end in `-page`.
installMasonKit({
  componentHosts: { passthrough: [/-page$/] },
});

// <Canvas> (2D, WebGL, WebGL2, WebGPU) and <Svg> are regular NativeScript
// views, so they sit in MasonKit layouts and take Tailwind classes like any
// other element.
registerElement('Canvas', () => Canvas);
registerElement('Svg', () => Svg);

runNativeScriptAngularApp({
  appModuleBootstrap: () =>
    bootstrapApplication(AppComponent, {
      providers: [provideZonelessChangeDetection(), provideNativeScriptRouter(routes)],
    }),
});

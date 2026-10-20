import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { formatCount } from '../../format';
import { DemoPage } from '../../components/demo-page';
import { CanvasView } from '../../components/canvas-view';
import { Segmented } from '../../components/segmented';
import { threeGalaxy, type GalaxyMaterial, type ThreeGalaxy, type ThreeStats } from './galaxy';

@Component({
  selector: 'app-three-page',
  imports: [DemoPage, CanvasView, Segmented],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      [fill]="760"
      eyebrow="three.js"
      title="Galaxy"
      description="Unmodified three.js on @nativescript/canvas-three: a physically based torus knot lit by a PMREM room environment and orbiting point lights, circled by an InstancedMesh galaxy. Drag to orbit."
    >
      <section class="card flex flex-1 flex-col gap-4">
        <app-canvas-view
          [demo]="demo"
          class="min-h-[240] w-full flex-1 rounded-2xl"
          (started)="galaxy = $event"
        >
          <div class="absolute right-3 top-3 flex flex-col items-end gap-2">
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {{ stats().fps }} fps
            </span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {{ stats().drawCalls }} draw calls
            </span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {{ formatCount(stats().triangles) }} triangles
            </span>
          </div>
        </app-canvas-view>
        <app-segmented
          [options]="materials"
          [value]="material()"
          (valueChange)="setMaterial($event)"
        />
      </section>

      <section class="card flex flex-col gap-3">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Hand three.js the canvas</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          The native canvas stands in for an HTMLCanvasElement, so the usual setup works as is.
        </p>
        <code
          class="rounded-2xl bg-slate-100 p-4 text-sm text-indigo-600 dark:bg-slate-800 dark:text-indigo-300"
        >
          {{ snippet }}
        </code>
      </section>
    </app-demo-page>
  `,
})
export class ThreePage {
  protected readonly formatCount = formatCount;

  protected readonly materials: { label: string; value: GalaxyMaterial }[] = [
    { label: 'Iridescent', value: 'glass' },
    { label: 'Chrome', value: 'chrome' },
    { label: 'Normals', value: 'normals' },
    { label: 'Wireframe', value: 'wireframe' },
  ];
  protected readonly material = signal<GalaxyMaterial>('glass');
  protected galaxy?: ThreeGalaxy;

  protected readonly stats = signal<ThreeStats>({ fps: 0, drawCalls: 0, triangles: 0 });

  protected readonly demo = threeGalaxy({
    cubes: __ANDROID__ ? 600 : 1200,
    onStats: (value) => this.stats.set(value),
  });

  protected readonly snippet = `const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Screen.mainScreen.scale);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);`;

  protected setMaterial(value: GalaxyMaterial) {
    this.material.set(value);
    this.galaxy?.setMaterial(value);
  }
}

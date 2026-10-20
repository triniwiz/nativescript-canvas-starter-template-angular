import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { DemoPage } from '../../components/demo-page';
import { CanvasView } from '../../components/canvas-view';
import { Segmented } from '../../components/segmented';
import { shaderGallery, type GLInfo, type ShaderGallery, type ShaderName } from './shaders';

@Component({
  selector: 'app-webgl-page',
  imports: [DemoPage, CanvasView, Segmented],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <app-demo-page
      [fill]="760"
      eyebrow="WebGL"
      title="Fragment shaders"
      description="Raw WebGL 1: one full-screen triangle, a GLSL fragment shader, and time, resolution and pointer uniforms. Drag across the canvas to move the effect."
    >
      <section class="card flex flex-1 flex-col gap-4">
        <app-canvas-view
          [demo]="demo"
          class="min-h-[240] w-full flex-1 rounded-2xl"
          (started)="gallery = $event"
        >
          <div class="absolute bottom-3 left-3 flex flex-row gap-2">
            <span class="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
              getContext('webgl')
            </span>
            <span class="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
              {{ shader() }}.frag
            </span>
          </div>
        </app-canvas-view>
        <app-segmented [options]="options" [value]="shader()" (valueChange)="setShader($event)" />
      </section>

      <section class="card flex flex-col gap-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">This context</h2>
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
      </section>
    </app-demo-page>
  `,
})
export class WebGLPage {
  protected readonly options: { label: string; value: ShaderName }[] = [
    { label: 'Plasma', value: 'plasma' },
    { label: 'Aurora', value: 'aurora' },
    { label: 'Metaballs', value: 'metaballs' },
    { label: 'Tunnel', value: 'tunnel' },
  ];
  protected readonly shader = signal<ShaderName>('plasma');
  protected gallery?: ShaderGallery;

  private readonly info = signal<GLInfo | undefined>(undefined);
  protected readonly details = computed(() => {
    const info = this.info();
    return info
      ? [
          { label: 'Version', value: info.version },
          { label: 'Renderer', value: info.renderer },
          { label: 'Vendor', value: info.vendor },
          { label: 'GLSL', value: info.shadingLanguage },
          { label: 'Max texture', value: `${info.maxTextureSize}px` },
        ]
      : [];
  });

  protected readonly demo = shaderGallery({
    shader: this.shader(),
    onInfo: (value) => this.info.set(value),
  });

  protected setShader(name: ShaderName) {
    this.shader.set(name);
    this.gallery?.setShader(name);
  }
}

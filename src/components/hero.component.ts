

import { Component, output, signal, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="relative w-full pt-28 pb-12 md:min-h-[65vh] flex flex-col items-center overflow-hidden justify-center bg-white dark:bg-[#09090b] transition-colors duration-300">
      <!-- Animated Background Mesh -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1E90FF10_0%,_transparent_70%)] dark:bg-[radial-gradient(circle_at_center,_#1E90FF20_0%,_transparent_70%)] z-0 pointer-events-none"></div>
      
      <!-- Grid Overlay -->
      <div class="absolute inset-0 opacity-40 dark:opacity-20 z-0 pointer-events-none transition-opacity" 
           style="background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px); background-size: 40px 40px;">
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
          <span class="w-2 h-2 rounded-full bg-green-500 dark:bg-[#9FE870] animate-pulse"></span>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">{{ ts.t('hero.badge') }}</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight animate-fade-in-up text-gray-900 dark:text-white" style="animation-delay: 0.1s">
          {{ ts.t('hero.title.pre') }} <span class="text-[#1E90FF]">{{ ts.t('hero.title.highlight') }}</span>.
          <br />
          <span class="text-gray-900 dark:text-white">{{ ts.t('hero.title.post') }}</span>
        </h1>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style="animation-delay: 0.2s">
          {{ ts.t('hero.desc') }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
          <button (click)="start.emit()" 
                  class="group relative px-8 py-4 bg-[#1E90FF] text-white font-bold rounded-xl overflow-hidden transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span class="relative flex items-center gap-2">
              {{ ts.t('hero.cta.start') }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button (click)="scrollDetails.emit()" 
                  class="px-8 py-4 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all backdrop-blur-sm">
            {{ ts.t('hero.cta.details') }}
          </button>
        </div>
      </div>

      <!-- Sound Experience Widget - Corner Position -->
      <div class="relative mt-4 lg:absolute lg:mt-0 lg:bottom-8 lg:right-8 z-20 animate-fade-in-up w-auto" style="animation-delay: 0.4s">
         <div class="flex flex-col items-center lg:items-end gap-2">
           <div class="text-[10px] font-mono text-gray-500 tracking-widest uppercase hidden lg:block">{{ ts.t('hero.sound.ice') }}</div>
           <div class="flex items-center gap-2 p-1 rounded-full bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-2xl">
              <button (click)="playSound('ice')" 
                      [class.sound-ice-active]="soundMode() === 'ice'"
                      class="w-10 h-10 rounded-full flex items-center justify-center border border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                @if(soundMode() === 'ice') {
                   <div class="flex gap-0.5 items-end h-3">
                    <div class="w-0.5 bg-red-500 animate-[sound-wave_0.5s_infinite]"></div>
                    <div class="w-0.5 bg-red-500 animate-[sound-wave_0.3s_infinite]"></div>
                    <div class="w-0.5 bg-red-500 animate-[sound-wave_0.6s_infinite]"></div>
                  </div>
                } @else {
                  <span class="font-bold text-xs">ICE</span>
                }
              </button>
              
              <div class="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
              
              <button (click)="playSound('ev')" 
                      [class.sound-ev-active]="soundMode() === 'ev'"
                      class="w-10 h-10 rounded-full flex items-center justify-center border border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                @if(soundMode() === 'ev') {
                   <div class="w-full h-full flex items-center justify-center">
                     <div class="w-4 h-0.5 bg-[#1E90FF] shadow-[0_0_8px_#1E90FF]"></div>
                   </div>
                } @else {
                   <span class="font-bold text-xs">EV</span>
                }
              </button>
           </div>
         </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      --grid-color: #e5e7eb;
    }
    :host-context(.dark) {
      --grid-color: #333;
    }
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes sound-wave {
      0%, 100% { height: 20%; }
      50% { height: 100%; }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out forwards;
      opacity: 0; /* Start hidden */
    }
    /* FIX: Replaced invalid dark mode bindings with CSS classes for proper styling in light and dark themes. */
    .sound-ice-active {
      background-color: #fee2e2; /* from bg-red-100 */
      border-color: #f87171; /* from border-red-400 */
    }
    :host-context(.dark) .sound-ice-active {
      background-color: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: white;
    }
    .sound-ev-active {
      background-color: #dbeafe; /* from bg-blue-100 */
      border-color: #60a5fa; /* from border-blue-400 */
    }
    :host-context(.dark) .sound-ev-active {
      background-color: rgba(30, 144, 255, 0.2);
      border-color: rgba(30, 144, 255, 0.5);
      color: white;
    }
  `]
})
export class HeroComponent {
  start = output<void>();
  scrollDetails = output<void>();
  
  soundMode = signal<'ice' | 'ev' | null>(null);
  ts = inject(TranslationService);

  playSound(mode: 'ice' | 'ev') {
    this.soundMode.set(mode);
    setTimeout(() => this.soundMode.set(null), 2500);
  }
}
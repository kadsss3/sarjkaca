
import { Component, output, inject } from '@angular/core';
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
           style="background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px); background-size: 40px 40px;"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        <!-- Floating Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-8 animate-fade-in-up">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E90FF] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#1E90FF]"></span>
          </span>
          <span class="text-xs font-bold text-[#1E90FF] uppercase tracking-wider">{{ ts.t('hero.badge') }}</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up delay-100">
          {{ ts.t('hero.title.pre') }} <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#1E90FF] to-[#9FE870]">{{ ts.t('hero.title.highlight') }}</span>.
        </h1>

        <p class="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed animate-fade-in-up delay-200">
          {{ ts.t('hero.desc') }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <button (click)="start.emit()" class="group relative px-8 py-4 bg-[#1E90FF] text-white font-bold rounded-full overflow-hidden shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50">
             <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
             <span class="relative flex items-center gap-2">
               {{ ts.t('hero.cta.start') }}
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
             </span>
          </button>
          
          <button (click)="scrollDetails.emit()" class="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
             {{ ts.t('hero.cta.details') }}
          </button>
        </div>
      </div>
      
      <!-- Audio Visualizer Fake -->
      <div class="absolute bottom-0 w-full h-24 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
         <div class="w-2 bg-[#1E90FF] animate-bounce" style="height: 40%; animation-duration: 1s"></div>
         <div class="w-2 bg-[#1E90FF] animate-bounce" style="height: 70%; animation-duration: 1.2s"></div>
         <div class="w-2 bg-[#1E90FF] animate-bounce" style="height: 50%; animation-duration: 0.8s"></div>
         <div class="w-2 bg-[#9FE870] animate-bounce" style="height: 80%; animation-duration: 1.5s"></div>
         <div class="w-2 bg-[#9FE870] animate-bounce" style="height: 30%; animation-duration: 0.9s"></div>
      </div>

    </section>
  `,
  styles: [`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
    .group-hover\\:animate-shimmer:hover {
      animation: shimmer 1.5s infinite;
    }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HeroComponent {
  ts = inject(TranslationService);
  start = output<void>();
  scrollDetails = output<void>();
}

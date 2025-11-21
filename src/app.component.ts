

import { Component, ElementRef, viewChild, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeroComponent } from './components/hero.component';
import { SimulatorComponent } from './components/simulator.component';
import { ChargeCalculatorComponent } from './components/charge-calculator.component';
import { ImpactComponent } from './components/impact.component';
import { TestimonialsComponent } from './components/testimonials.component';
import { FooterComponent } from './components/footer.component';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    SimulatorComponent,
    ChargeCalculatorComponent,
    ImpactComponent,
    TestimonialsComponent,
    FooterComponent
  ],
  template: `
    <main class="min-h-screen bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">
      
      <!-- Navbar (Overlay) -->
      <nav class="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-lg transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div class="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
            Şarj<span class="text-[#1E90FF]">Kaça</span>
          </div>
          <div class="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <button (click)="scrollTo(simulator)" class="hover:text-[#1E90FF] dark:hover:text-white transition-colors">{{ ts.t('nav.simulator') }}</button>
            <button (click)="scrollTo(charge)" class="hover:text-[#1E90FF] dark:hover:text-white transition-colors">{{ ts.t('nav.charge') }}</button>
            <button (click)="scrollTo(impact)" class="hover:text-[#1E90FF] dark:hover:text-white transition-colors">{{ ts.t('nav.impact') }}</button>
            <button (click)="scrollTo(testimonials)" class="hover:text-[#1E90FF] dark:hover:text-white transition-colors">{{ ts.t('nav.reviews') }}</button>
          </div>
          
          <div class="flex items-center gap-4">
             <!-- Language Switcher -->
             <div class="flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                <button (click)="ts.setLang('TR')" [class.bg-white]="ts.currentLang() === 'TR'" [class.dark:bg-white_20]="ts.currentLang() === 'TR'" class="px-2 py-1 text-xs font-bold rounded transition-all text-gray-700 dark:text-white">TR</button>
                <button (click)="ts.setLang('EN')" [class.bg-white]="ts.currentLang() === 'EN'" [class.dark:bg-white_20]="ts.currentLang() === 'EN'" class="px-2 py-1 text-xs font-bold rounded transition-all text-gray-700 dark:text-white">EN</button>
                <button (click)="ts.setLang('DE')" [class.bg-white]="ts.currentLang() === 'DE'" [class.dark:bg-white_20]="ts.currentLang() === 'DE'" class="px-2 py-1 text-xs font-bold rounded transition-all text-gray-700 dark:text-white">DE</button>
             </div>

             <!-- Theme Toggle -->
             <button (click)="toggleTheme()" class="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
               @if(isDark()) {
                  <!-- Sun Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
               } @else {
                  <!-- Moon Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
               }
             </button>

            <button (click)="scrollTo(simulator)" class="hidden sm:block bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors shadow-lg">
              {{ ts.t('nav.start') }}
            </button>
          </div>
        </div>
      </nav>

      <app-hero 
        (start)="scrollTo(simulator)" 
        (scrollDetails)="scrollTo(impact)">
      </app-hero>

      <!-- Simulator (Main Feature) -->
      <div #simulator>
        <app-simulator [isDark]="isDark()"></app-simulator>
      </div>
      
      <!-- Charge Calculator -->
      <div #charge>
        <app-charge-calculator></app-charge-calculator>
      </div>

      <!-- Impact (Context) -->
      <div #impact>
        <app-impact></app-impact>
      </div>

      <!-- Social Proof -->
      <div #testimonials>
        <app-testimonials></app-testimonials>
      </div>
      
      <app-footer></app-footer>

    </main>
  `,
  styles: [`
    .dark\\:bg-white_20 { background-color: rgba(255, 255, 255, 0.2); }
  `]
})
export class AppComponent {
  isDark = signal(false);
  platformId = inject(PLATFORM_ID);
  ts = inject(TranslationService);

  constructor() {
    // Handle body class
    effect(() => {
       if (isPlatformBrowser(this.platformId)) {
         const root = document.documentElement;
         if (this.isDark()) {
           root.classList.add('dark');
         } else {
           root.classList.remove('dark');
         }
       }
    });
  }

  toggleTheme() {
    this.isDark.update(v => !v);
  }

  // REFACTOR: Simplified scroll logic to directly use the element passed from the template.
  scrollTo(element: HTMLElement) {
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-impact',
  standalone: true,
  template: `
    <section class="py-24 bg-white dark:bg-[#0f1012] relative overflow-hidden transition-colors duration-300">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50 to-transparent dark:from-[#9FE870]/5 dark:to-transparent pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          
          <div class="w-full lg:w-1/2">
            <div class="inline-block px-3 py-1 border border-green-500/30 dark:border-[#9FE870]/30 rounded-full text-green-600 dark:text-[#9FE870] text-xs font-bold uppercase mb-4">
              Küresel Etki
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Rahat Bir <span class="text-green-500 dark:text-[#9FE870]">Nefes Alın</span>.
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Elektrikli araçlara geçmek sadece cüzdanınızla ilgili değil, paylaştığımız havayla ilgilidir.
              Ortalama bir elektrikli araç, mevcut enerji karışımıyla bile ömrü boyunca CO₂ emisyonlarını %66 oranında azaltır.
            </p>

            <div class="grid grid-cols-2 gap-4">
               <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border-l-2 border-green-500 dark:border-[#9FE870] shadow-sm dark:shadow-none">
                 <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">0g</div>
                 <div class="text-sm text-gray-500 dark:text-gray-400">Egzoz Emisyonu</div>
               </div>
               <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border-l-2 border-[#1E90FF] shadow-sm dark:shadow-none">
                 <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">90%</div>
                 <div class="text-sm text-gray-500 dark:text-gray-400">Geri Dönüştürülebilir</div>
               </div>
            </div>
          </div>

          <!-- Visualization Mockup -->
          <div class="w-full lg:w-1/2">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img src="https://picsum.photos/seed/forest/600/400" class="w-full h-auto opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity duration-500" alt="Nature">
              
              <!-- Overlay UI -->
              <div class="absolute inset-0 flex items-center justify-center">
                 <div class="text-center p-8 glass-panel rounded-full w-64 h-64 flex flex-col items-center justify-center animate-pulse border border-green-500/30 dark:border-[#9FE870]/30">
                    <span class="text-5xl font-bold text-green-600 dark:text-[#9FE870]">2.5T</span>
                    <span class="text-sm text-gray-800 dark:text-white mt-2 uppercase tracking-widest">Kurtarılan CO₂ / Yıl</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">Sürücü Başına</span>
                 </div>
              </div>

              <!-- Floating Cards -->
              <div class="absolute bottom-6 left-6 bg-white/90 dark:bg-black/80 backdrop-blur-md p-4 rounded-lg border border-gray-200 dark:border-white/10 shadow-lg">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span class="text-xs text-gray-700 dark:text-gray-300">Benzinli: 148g CO₂/km</span>
                </div>
                <div class="flex items-center gap-3 mt-2">
                  <div class="w-3 h-3 bg-green-500 dark:bg-[#9FE870] rounded-full"></div>
                  <span class="text-xs text-black dark:text-white font-bold">Elektrikli: 0g CO₂/km</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class ImpactComponent {}

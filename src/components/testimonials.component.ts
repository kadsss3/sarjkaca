
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <section class="py-24 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#09090b] overflow-hidden flex flex-col items-center transition-colors duration-300">
      <div class="max-w-7xl w-full px-6 flex flex-col items-center text-center">
        
        <div class="inline-block px-3 py-1 border border-[#1E90FF]/30 rounded-full text-[#1E90FF] text-xs font-bold uppercase mb-4">Topluluk</div>
        <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Dönüşüm <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#1E90FF] to-[#9FE870]">Sesleri</span></h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mb-16">Sadece rakamlar değil, insanların hayatındaki sessiz devrim.</p>
      
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          <!-- Audio Card 1 -->
          <div class="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-[#1E90FF]/40 transition-all shadow-lg dark:shadow-none group text-left flex flex-col">
             <div class="flex items-center gap-4 mb-6">
               <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">S</div>
               <div>
                 <div class="text-gray-900 dark:text-white font-bold">Selin Yılmaz</div>
                 <div class="text-xs text-gray-500">Togg T10X Sahibi</div>
               </div>
             </div>

             <!-- Audio Wave Visual -->
             <div class="bg-gray-100 dark:bg-black/40 rounded-xl p-4 mb-4 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                <button class="w-8 h-8 rounded-full bg-[#1E90FF] flex items-center justify-center text-white hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <div class="flex-1 flex items-center gap-0.5 h-8 opacity-60 overflow-hidden">
                   <div class="w-1 bg-[#1E90FF] h-3 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-5 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-8 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-4 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-6 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-2 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-5 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-3 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-7 rounded-full"></div>
                   <div class="w-1 bg-[#1E90FF] h-4 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-3 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-3 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-3 rounded-full"></div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">0:14</span>
             </div>

             <p class="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">
               "Simülatördeki bakım maliyeti grafiğini görünce şaka sandım ama servise gidince anladım. Sadece silecek suyu koyup çıktık. İnanılmaz."
             </p>
          </div>

          <!-- Audio Card 2 -->
          <div class="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-[#9FE870]/40 transition-all shadow-lg dark:shadow-none group text-left flex flex-col">
             <div class="flex items-center gap-4 mb-6">
               <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/20">M</div>
               <div>
                 <div class="text-gray-900 dark:text-white font-bold">Mert Demir</div>
                 <div class="text-xs text-gray-500">Tesla Model Y</div>
               </div>
             </div>

             <!-- Audio Wave Visual -->
             <div class="bg-gray-100 dark:bg-black/40 rounded-xl p-4 mb-4 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                <button class="w-8 h-8 rounded-full bg-[#9FE870] flex items-center justify-center text-black hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <div class="flex-1 flex items-center gap-0.5 h-8 opacity-60 overflow-hidden">
                   <div class="w-1 bg-[#9FE870] h-2 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-4 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-6 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-8 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-5 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-3 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-7 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-4 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-6 rounded-full"></div>
                   <div class="w-1 bg-[#9FE870] h-2 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-2 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-2 rounded-full"></div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">0:28</span>
             </div>

             <p class="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">
               "Eskiden motor sesi güç demek sanırdım. Şimdi sessizliğin konfor olduğunu anlıyorum. Hesap makinesi ile çıkan sonuç birebir tuttu."
             </p>
          </div>

          <!-- Audio Card 3 -->
          <div class="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-orange-500/40 transition-all shadow-lg dark:shadow-none group text-left flex flex-col">
             <div class="flex items-center gap-4 mb-6">
               <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-900/20">K</div>
               <div>
                 <div class="text-gray-900 dark:text-white font-bold">Kemal A.</div>
                 <div class="text-xs text-gray-500">Eski Petrolhead</div>
               </div>
             </div>

             <!-- Audio Wave Visual -->
             <div class="bg-gray-100 dark:bg-black/40 rounded-xl p-4 mb-4 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                <button class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <div class="flex-1 flex items-center gap-0.5 h-8 opacity-60 overflow-hidden">
                   <div class="w-1 bg-orange-500 h-4 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-2 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-6 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-3 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-7 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-5 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-8 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-4 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-6 rounded-full"></div>
                   <div class="w-1 bg-orange-500 h-3 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-3 rounded-full"></div>
                   <div class="w-1 bg-gray-400 dark:bg-gray-700 h-3 rounded-full"></div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">0:42</span>
             </div>

             <p class="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">
               "Kış modu özelliği beni ikna etti. Gerçekçi verilerle yüzleşince duygusal karar vermeyi bıraktım. Cüzdanım için en iyisi buymuş."
             </p>
          </div>

        </div>
      </div>
    </section>
  `
})
export class TestimonialsComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <section class="py-24 bg-black relative border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Hızın Evrimi</h2>
          <p class="text-gray-400">İlk kıvılcımdan elektrik devrimine.</p>
        </div>

        <div class="relative">
          <!-- Vertical Line -->
          <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1E90FF] via-[#9FE870] to-transparent md:-translate-x-1/2"></div>

          <!-- Item 1 -->
          <div class="relative mb-12 md:mb-24">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="md:w-5/12 mb-4 md:mb-0 order-2 md:order-1 text-left md:text-right pr-0 md:pr-8">
                <div class="p-6 rounded-2xl glass-panel border-l-4 border-[#1E90FF]">
                  <h3 class="text-xl font-bold text-white mb-2">1885</h3>
                  <h4 class="text-lg font-semibold text-[#1E90FF] mb-2">İlk İçten Yanmalı Motor</h4>
                  <p class="text-sm text-gray-400">Benz Patent-Motorwagen, içten yanmalı motora sahip ilk seri üretim otomobil oldu.</p>
                </div>
              </div>
              <div class="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#1E90FF] border-4 border-black md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_#1E90FF]">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div class="md:w-5/12 order-3 md:order-3"></div>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="relative mb-12 md:mb-24">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="md:w-5/12 order-3 md:order-1"></div>
              <div class="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-black md:-translate-x-1/2 flex items-center justify-center z-10">
                 <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <div class="md:w-5/12 mb-4 md:mb-0 order-2 md:order-3 text-left pl-12 md:pl-8">
                 <div class="p-6 rounded-2xl glass-panel border-r-4 border-white">
                  <h3 class="text-xl font-bold text-white mb-2">1997</h3>
                  <h4 class="text-lg font-semibold text-gray-300 mb-2">Hibrit Çağı</h4>
                  <p class="text-sm text-gray-400">Toyota Prius piyasaya sürüldü ve elektrifikasyonun verimliliği artırabileceğini kanıtladı.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="relative">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="md:w-5/12 mb-4 md:mb-0 order-2 md:order-1 text-left md:text-right pr-0 md:pr-8">
                 <div class="p-6 rounded-2xl glass-panel border-l-4 border-[#9FE870]">
                  <h3 class="text-xl font-bold text-white mb-2">2035</h3>
                  <h4 class="text-lg font-semibold text-[#9FE870] mb-2">Sıfır Emisyon Hedefi</h4>
                  <p class="text-sm text-gray-400">AB ve büyük pazarlar yeni benzinli ve dizel araç satışlarını sonlandırmayı hedefliyor.</p>
                </div>
              </div>
              <div class="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#9FE870] border-4 border-black md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_#9FE870]">
                 <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div class="md:w-5/12 order-3 md:order-3"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class TimelineComponent {}
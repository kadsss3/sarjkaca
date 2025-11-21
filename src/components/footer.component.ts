
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/10 pt-16 pb-8 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div class="col-span-1 md:col-span-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Şarj Kaça</h3>
            <p class="text-sm text-gray-500">Veriye dayalı içgörülerle sürdürülebilir bir geleceğe yolculuğunuzu güçlendiriyoruz.</p>
          </div>

          <div>
            <h4 class="text-gray-900 dark:text-white font-semibold mb-4">Platform</h4>
            <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" class="hover:text-[#1E90FF]">Simülatör</a></li>
              <li><a href="#" class="hover:text-[#1E90FF]">Metodoloji (WLTP)</a></li>
              <li><a href="#" class="hover:text-[#1E90FF]">Araç Veritabanı</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-gray-900 dark:text-white font-semibold mb-4">Kaynaklar</h4>
            <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" class="hover:text-[#1E90FF]">Şarj Haritası</a></li>
              <li><a href="#" class="hover:text-[#1E90FF]">Vergi Teşvikleri</a></li>
              <li><a href="#" class="hover:text-[#1E90FF]">Batarya Teknolojisi</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-gray-900 dark:text-white font-semibold mb-4">İletişim</h4>
            <div class="flex space-x-4">
              <a href="#" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-[#1E90FF] dark:hover:bg-[#1E90FF] transition-colors text-gray-600 dark:text-white hover:text-white">
                <span class="text-xs">in</span>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-[#1E90FF] dark:hover:bg-[#1E90FF] transition-colors text-gray-600 dark:text-white hover:text-white">
                <span class="text-xs">X</span>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-[#1E90FF] dark:hover:bg-[#1E90FF] transition-colors text-gray-600 dark:text-white hover:text-white">
                <span class="text-xs">yt</span>
              </a>
            </div>
          </div>

        </div>
        
        <div class="border-t border-gray-200 dark:border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p class="text-xs text-gray-500 dark:text-gray-600">&copy; 2025 Şarj Kaça Platform. Tüm hakları saklıdır.</p>
          <div class="flex gap-4 text-xs text-gray-500 dark:text-gray-600 mt-4 md:mt-0">
            <a href="#">Gizlilik</a>
            <a href="#">Şartlar</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}

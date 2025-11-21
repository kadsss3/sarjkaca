



import { Component, signal, computed, inject, effect, ElementRef, viewChild, ViewEncapsulation, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Vehicle, SimulationResult, ChargingMode } from '../services/data.service';
import { TranslationService } from '../services/translation.service';

declare const d3: any;

@Component({
  selector: 'app-simulator',
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <section id="simulator" class="relative z-30 w-full pt-8 pb-24 px-4 md:px-8 flex flex-col items-center no-print bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">
      
      <div class="max-w-5xl w-full flex flex-col items-center">
        
        <!-- Connector Line -->
        <div class="h-12 w-px bg-gradient-to-b from-gray-300 via-gray-400 to-gray-200 dark:from-white/10 dark:via-white/20 dark:to-white/5 mb-8"></div>

        <!-- Header & Mode Toggle -->
        <div class="mb-12 text-center w-full">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{{ ts.t('sim.title') }} <span class="text-[#1E90FF]">{{ ts.t('sim.subtitle') }}</span></h2>
            
            <!-- Tab Switcher -->
            <div class="inline-flex p-1 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm">
            <button (click)="setTripMode(false)" 
                    [class.bg-gray-100]="!isTripMode()" [class.dark:bg-white]="!isTripMode()" 
                    [class.text-black]="!isTripMode()" 
                    [class.text-gray-500]="isTripMode()" [class.dark:text-gray-400]="isTripMode()"
                    class="px-8 py-2.5 rounded-full text-sm font-bold transition-all">
                {{ ts.t('sim.tab.annual') }}
            </button>
            <button (click)="setTripMode(true)"
                    [class.bg-gray-100]="isTripMode()" [class.dark:bg-white]="isTripMode()" 
                    [class.text-black]="isTripMode()" 
                    [class.text-gray-500]="!isTripMode()" [class.dark:text-gray-400]="!isTripMode()"
                    class="px-8 py-2.5 rounded-full text-sm font-bold transition-all">
                {{ ts.t('sim.tab.trip') }}
            </button>
            </div>
        </div>

        <!-- Vehicle Selection Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-12">
          
          <!-- EV Selection -->
          <div class="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 hover:border-[#1E90FF] dark:hover:border-[#1E90FF]/50 transition-all shadow-xl shadow-gray-100 dark:shadow-none group relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-[#1E90FF]"></div>
            
            <div class="flex flex-col gap-3 mb-6">
               <div class="flex justify-between items-center">
                  <span class="text-[#1E90FF] font-bold text-sm uppercase tracking-wider">{{ ts.t('sim.ev') }}</span>
                  <div class="flex gap-2">
                    <button (click)="openCustomCarModal('EV')" class="text-xs bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white px-2 py-1 rounded transition-colors">+ {{ ts.t('sim.add') }}</button>
                    <div class="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">{{ evs().length }} Model</div>
                  </div>
               </div>
               <!-- Search Input -->
               <input type="text" [placeholder]="ts.t('sim.search')" 
                      [ngModel]="evSearchText()" (ngModelChange)="evSearchText.set($event)"
                      class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-[#1E90FF] outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-600">
               
               <!-- Select -->
               <select [ngModel]="selectedEvId()" (ngModelChange)="selectEv($event)" 
                      class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-[#1E90FF] outline-none cursor-pointer">
                @for (v of evs(); track v.id) {
                  <option [value]="v.id">{{ v.brand }} {{ v.name }}</option>
                }
                @if (evs().length === 0) {
                  <option disabled>Sonuç bulunamadı</option>
                }
              </select>
            </div>

            @if (currentEv(); as ev) {
              <div class="flex flex-col gap-4">
                <div class="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-black">
                  <img [src]="ev.image" class="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity" alt="EV Car">
                  
                  <div class="absolute bottom-2 right-2 flex items-center gap-2">
                      <!-- Battery Capacity Badge -->
                      <div class="bg-white/90 dark:bg-black/70 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-lg p-1.5 flex gap-2 items-center shadow-sm" title="Batarya Kapasitesi">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 dark:text-[#9FE870]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          <span class="text-xs text-gray-900 dark:text-white font-bold">{{ ev.batteryCapacity }} kWh</span>
                      </div>
                      <!-- Range Badge -->
                      <div class="bg-white/90 dark:bg-black/70 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-lg p-1.5 flex gap-2 items-center shadow-sm" title="WLTP Menzil">
                         <span class="text-xs text-gray-900 dark:text-white font-bold">{{ ev.rangeWltp }} km</span>
                         <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#1E90FF]" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 text-sm pt-2">
                  <div class="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-transparent">
                    <span class="text-gray-500 text-xs">Tüketim</span>
                    <span class="text-green-600 dark:text-[#9FE870] font-mono font-bold">{{ ev.energyConsumption }} kWh/100km</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- ICE Selection -->
          <div class="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 hover:border-gray-400 dark:hover:border-white/50 transition-all shadow-xl shadow-gray-100 dark:shadow-none group relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
            
            <div class="flex flex-col gap-3 mb-6">
               <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">{{ ts.t('sim.ice') }}</span>
                  <div class="flex gap-2">
                     <button (click)="openCustomCarModal('ICE')" class="text-xs bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white px-2 py-1 rounded transition-colors">+ {{ ts.t('sim.add') }}</button>
                     <div class="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">{{ ices().length }} Model</div>
                  </div>
               </div>
               
               <!-- Search Input -->
               <input type="text" [placeholder]="ts.t('sim.search')" 
                      [ngModel]="iceSearchText()" (ngModelChange)="iceSearchText.set($event)"
                      class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-500 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-600">

               <!-- Select -->
               <select [ngModel]="selectedIceId()" (ngModelChange)="selectIce($event)" 
                      class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-500 outline-none cursor-pointer">
                @for (v of ices(); track v.id) {
                  <option [value]="v.id">{{ v.brand }} {{ v.name }}</option>
                }
                @if (ices().length === 0) {
                  <option disabled>Sonuç bulunamadı</option>
                }
              </select>
            </div>

            @if (currentIce(); as ice) {
              <div class="flex flex-col gap-4">
                <div class="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-black">
                   <img [src]="ice.image" class="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity grayscale" alt="ICE Car">
                   
                   <!-- Fuel Type Badge (Toggleable) -->
                   <button (click)="toggleFuelType($event)" class="absolute top-2 right-2 px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] font-bold text-white border border-white/10 uppercase hover:bg-black/70 hover:scale-105 transition-all cursor-pointer z-10 flex items-center gap-1">
                      {{ activeFuelType() === 'Diesel' ? 'Dizel' : 'Benzin' }}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   </button>
                </div>

                <div class="grid grid-cols-1 gap-4 text-sm pt-2">
                  <div class="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-transparent">
                    <span class="text-gray-500 text-xs">Yakıt</span>
                    <span class="text-yellow-600 dark:text-yellow-500 font-mono font-bold">{{ ice.fuelEconomy }} L/100km</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Friendly Inputs Section (New Independent Layout) -->
        <div class="w-full bg-white dark:bg-[#121214] p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/5 mb-12 shadow-2xl shadow-gray-200/50 dark:shadow-none">
           <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-black dark:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ ts.t('sim.settings') }}</h3>
           </div>

           <!-- 1. Charging Profile - Independent Section -->
           <div class="mb-10">
              <label class="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3 block pl-1">{{ ts.t('sim.strat') }}</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-100 dark:bg-black/40 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <button (click)="chargingMode.set('AC_ONLY')" 
                          class="relative py-3 px-4 rounded-xl text-sm font-bold transition-all overflow-hidden group"
                          [class.bg-green-400]="chargingMode() === 'AC_ONLY'"
                          [class.dark:bg-[#9FE870]]="chargingMode() === 'AC_ONLY'" 
                          [class.text-black]="chargingMode() === 'AC_ONLY'"
                          [class.text-gray-500]="chargingMode() !== 'AC_ONLY'"
                          [class.dark:text-gray-400]="chargingMode() !== 'AC_ONLY'"
                          [class.hover:bg-white_5]="chargingMode() !== 'AC_ONLY'">
                      <div class="relative z-10 flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                         EVDE (AC)
                      </div>
                  </button>
                  
                  <button (click)="chargingMode.set('HYBRID')" 
                          class="relative py-3 px-4 rounded-xl text-sm font-bold transition-all overflow-hidden group"
                          [class.bg-white]="chargingMode() === 'HYBRID'"
                          [class.text-black]="chargingMode() === 'HYBRID'"
                          [class.text-gray-500]="chargingMode() !== 'HYBRID'"
                          [class.dark:text-gray-400]="chargingMode() !== 'HYBRID'"
                          [class.hover:bg-white_5]="chargingMode() !== 'HYBRID'">
                      <div class="relative z-10 flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                         KARIŞIK
                      </div>
                  </button>
                  
                  <button (click)="chargingMode.set('DC_ONLY')" 
                          class="relative py-3 px-4 rounded-xl text-sm font-bold transition-all overflow-hidden group"
                          [class.bg-[#1E90FF]]="chargingMode() === 'DC_ONLY'"
                          [class.text-white]="chargingMode() === 'DC_ONLY'"
                          [class.text-gray-500]="chargingMode() !== 'DC_ONLY'"
                          [class.dark:text-gray-400]="chargingMode() !== 'DC_ONLY'"
                          [class.hover:bg-white_5]="chargingMode() !== 'DC_ONLY'">
                      <div class="relative z-10 flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         İSTASYON (DC)
                      </div>
                  </button>
              </div>
           </div>

           <!-- 2. Main Inputs Grid -->
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <!-- Distance -->
              <div class="bg-gray-50 dark:bg-black/30 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-all">
                 <div class="flex justify-between items-center mb-3">
                    <span class="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {{ isTripMode() ? ts.t('sim.dist.trip') : ts.t('sim.dist.annual') }}
                    </span>
                 </div>
                 <div class="flex items-end gap-2 mb-2">
                   @if (isTripMode()) {
                      <!-- FIX: Ensure value is a number for the signal -->
                      <input type="number" [ngModel]="tripKm()" (ngModelChange)="tripKm.set(+$event)" class="w-full bg-transparent text-2xl font-bold text-gray-900 dark:text-white outline-none border-b border-gray-300 dark:border-white/20 focus:border-gray-500 dark:focus:border-white/50 pb-1">
                   } @else {
                      <!-- FIX: Ensure value is a number for the signal -->
                      <input type="number" [ngModel]="annualKm()" (ngModelChange)="annualKm.set(+$event)" class="w-full bg-transparent text-2xl font-bold text-gray-900 dark:text-white outline-none border-b border-gray-300 dark:border-white/20 focus:border-gray-500 dark:focus:border-white/50 pb-1">
                   }
                   <span class="text-xs text-gray-500 mb-2">km</span>
                 </div>
              </div>

              <!-- Fuel Price (Combined Card with Toggle) -->
              <div class="bg-gray-50 dark:bg-black/30 rounded-xl p-4 border border-gray-200 dark:border-white/10 transition-all animate-fade-in"
                   [class.hover:border-gray-400]="activeFuelType() === 'Diesel'"
                   [class.hover:border-yellow-500_30]="activeFuelType() === 'Gasoline'">
                 
                 <div class="flex justify-between items-center mb-3">
                    <span class="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {{ ts.t('sim.price.fuel') }}
                    </span>
                    
                    <button (click)="toggleFuelType($event)" 
                            class="text-[10px] px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1 cursor-pointer select-none transition-colors border border-transparent hover:border-black/10 dark:hover:border-white/10"
                            [class.bg-gray-200]="activeFuelType() === 'Diesel'"
                            [class.dark:bg-white_10]="activeFuelType() === 'Diesel'"
                            [class.text-gray-600]="activeFuelType() === 'Diesel'"
                            [class.dark:text-gray-400]="activeFuelType() === 'Diesel'"
                            [class.bg-yellow-100]="activeFuelType() === 'Gasoline'"
                            [class.dark:bg-yellow-900_30]="activeFuelType() === 'Gasoline'"
                            [class.text-yellow-700]="activeFuelType() === 'Gasoline'"
                            [class.dark:text-yellow-500]="activeFuelType() === 'Gasoline'">
                        {{ activeFuelType() === 'Diesel' ? 'Dizel' : 'Benzin' }}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                 </div>

                 <div class="flex items-end gap-2 mb-2">
                    @if (activeFuelType() === 'Diesel') {
                        <!-- FIX: Ensure value is a number for the signal -->
                        <input type="number" [ngModel]="dieselPrice()" (ngModelChange)="dieselPrice.set(+$event)" step="0.1" class="w-full bg-transparent text-2xl font-bold text-gray-600 dark:text-gray-300 outline-none border-b border-gray-300 dark:border-white/20 focus:border-gray-500 pb-1">
                    } @else {
                        <!-- FIX: Ensure value is a number for the signal -->
                        <input type="number" [ngModel]="gasolinePrice()" (ngModelChange)="gasolinePrice.set(+$event)" step="0.1" class="w-full bg-transparent text-2xl font-bold text-yellow-600 dark:text-yellow-400 outline-none border-b border-gray-300 dark:border-white/20 focus:border-yellow-500 pb-1">
                    }
                    <span class="text-xs text-gray-500 mb-2">TL/Lt</span>
                 </div>
              </div>

              <!-- AC Price (Conditional) -->
              @if(chargingMode() === 'AC_ONLY' || chargingMode() === 'HYBRID') {
                 <div class="bg-gray-50 dark:bg-black/30 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-green-500/30 transition-all animate-fade-in">
                   <div class="flex justify-between items-center mb-3">
                      <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ ts.t('sim.price.elec') }}</span>
                   </div>
                   <div class="flex items-end gap-2 mb-2">
                      <!-- FIX: Ensure value is a number for the signal -->
                      <input type="number" [ngModel]="elecPrice()" (ngModelChange)="elecPrice.set(+$event)" step="0.1" class="w-full bg-transparent text-2xl font-bold text-green-600 dark:text-[#9FE870] outline-none border-b border-gray-300 dark:border-white/20 focus:border-green-500 dark:focus:border-[#9FE870] pb-1">
                      <span class="text-xs text-gray-500 mb-2">TL/kWh</span>
                   </div>
                </div>
              }

              <!-- DC Price (Conditional) -->
              @if(chargingMode() === 'DC_ONLY' || chargingMode() === 'HYBRID') {
                 <div class="bg-gray-50 dark:bg-black/30 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-blue-500/30 transition-all animate-fade-in">
                   <div class="flex justify-between items-center mb-3">
                      <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ ts.t('sim.price.public') }}</span>
                   </div>
                   <div class="flex items-end gap-2 mb-2">
                      <!-- FIX: Ensure value is a number for the signal -->
                      <input type="number" [ngModel]="publicPrice()" (ngModelChange)="publicPrice.set(+$event)" step="0.1" class="w-full bg-transparent text-2xl font-bold text-[#1E90FF] outline-none border-b border-gray-300 dark:border-white/20 focus:border-[#1E90FF] pb-1">
                      <span class="text-xs text-gray-500 mb-2">TL/kWh</span>
                   </div>
                </div>
              }
           </div>

           <!-- Hybrid Mix Slider (Conditional Full Width) -->
           @if(chargingMode() === 'HYBRID') {
              <div class="mb-8 bg-gray-100 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/5 animate-fade-in select-none">
                 <div class="flex justify-between items-center mb-4">
                   <span class="text-sm font-bold text-gray-600 dark:text-gray-400">{{ ts.t('sim.mix') }}</span>
                   <div class="flex items-center gap-4 text-xs font-bold">
                      <span class="text-green-600 dark:text-[#9FE870]">AC (Ev) %{{ 100 - hybridMixPercent() }}</span>
                      <span class="text-[#1E90FF]">DC (İstasyon) %{{ hybridMixPercent() }}</span>
                   </div>
                 </div>
                 
                 <!-- Slider Container -->
                 <div class="relative h-10 flex items-center w-full">
                    
                    <!-- Track (Background + Fill) -->
                    <div class="absolute left-0 right-0 h-3 bg-green-400 dark:bg-[#9FE870] rounded-full overflow-hidden pointer-events-none">
                       <!-- Blue Fill (DC) -->
                       <div class="absolute top-0 left-0 h-full bg-[#1E90FF] transition-all duration-75" [style.width.%]="hybridMixPercent()"></div>
                    </div>
                    
                    <!-- Invisible Input (The Interaction Layer) -->
                    <!-- FIX: Ensure value is a number for the signal -->
                    <input type="range" min="0" max="100" step="5" 
                           [ngModel]="hybridMixPercent()" (ngModelChange)="hybridMixPercent.set(+$event)" 
                           class="absolute w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0">
                    
                    <!-- Visible Handle (The Visual Thumb) -->
                    <div class="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-[#1E90FF] z-10 pointer-events-none transition-all duration-75 flex items-center justify-center"
                         [style.left.%]="hybridMixPercent()"
                         style="transform: translate(-50%, -50%);">
                         <div class="w-2 h-2 bg-[#1E90FF] rounded-full"></div>
                    </div>

                 </div>

                 <div class="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                    <span>Daha Çok Ev</span>
                    <span>Daha Çok İstasyon</span>
                 </div>
              </div>
           }

           <!-- 3. Conditions & Advanced (Bottom Row) -->
           <div class="pt-6 border-t border-gray-200 dark:border-white/5 flex flex-wrap gap-4 justify-between items-center">
              
              <div class="flex gap-3">
                 <!-- Winter Toggle Button -->
                 <button (click)="isWinter.set(!isWinter())" 
                         [class.bg-blue-100]="isWinter()" [class.dark:bg-blue-500_20]="isWinter()" 
                         [class.border-blue-500]="isWinter()"
                         class="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span class="text-lg">❄️</span> {{ ts.t('sim.winter') }}
                    @if(isWinter()) { <span class="w-2 h-2 bg-blue-500 rounded-full"></span> }
                 </button>

                 <!-- Solar Toggle Button -->
                 <button (click)="hasSolar.set(!hasSolar())" 
                         [class.bg-green-100]="hasSolar()" [class.dark:bg-green-500_20]="hasSolar()" 
                         [class.border-green-500]="hasSolar()"
                         class="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span class="text-lg">☀️</span> {{ ts.t('sim.solar') }}
                    @if(hasSolar()) { <span class="w-2 h-2 bg-green-500 dark:bg-[#9FE870] rounded-full"></span> }
                 </button>
              </div>

              <button (click)="toggleInflation()" class="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                 {{ ts.t('sim.inflation') }}
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" [class.rotate-180]="showInflation()" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
           </div>
           
           @if(showInflation()) {
                <div class="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                   <div class="bg-gray-100 dark:bg-black/40 p-3 rounded-lg border border-gray-200 dark:border-white/5">
                      <div class="flex justify-between items-center mb-2">
                         <span class="text-xs text-yellow-600 dark:text-yellow-500">Yakıt Yıllık Zam %</span>
                         <!-- FIX: Ensure value is a number for the signal -->
                         <input type="number" [ngModel]="fuelInflation()" (ngModelChange)="fuelInflation.set(+$event)" class="w-16 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded text-right text-gray-900 dark:text-white text-xs py-1">
                      </div>
                      <!-- FIX: Ensure value is a number for the signal -->
                      <input type="range" min="0" max="100" step="5" [ngModel]="fuelInflation()" (ngModelChange)="fuelInflation.set(+$event)" class="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500">
                   </div>
                   <div class="bg-gray-100 dark:bg-black/40 p-3 rounded-lg border border-gray-200 dark:border-white/5">
                      <div class="flex justify-between items-center mb-2">
                         <span class="text-xs text-green-600 dark:text-[#9FE870]">Elektrik Yıllık Zam %</span>
                         <!-- FIX: Ensure value is a number for the signal -->
                         <input type="number" [ngModel]="elecInflation()" (ngModelChange)="elecInflation.set(+$event)" class="w-16 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded text-right text-gray-900 dark:text-white text-xs py-1">
                      </div>
                      <!-- FIX: Ensure value is a number for the signal -->
                      <input type="range" min="0" max="100" step="5" [ngModel]="elecInflation()" (ngModelChange)="elecInflation.set(+$event)" class="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 dark:accent-[#9FE870]">
                   </div>
                </div>
           }

           <div class="mt-8 flex justify-center">
              <button (click)="runSimulation()" class="group relative w-full md:w-auto px-16 py-4 bg-[#09090b] dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg shadow-gray-300 dark:shadow-white/10">
                <span class="flex items-center justify-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 00-1-1H3zm6 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                   {{ ts.t('sim.calc') }}
                </span>
              </button>
           </div>
        </div>

        <!-- Results Section -->
        @if (simulationRun()) {
          <div class="w-full animate-fade-in">
            
            <!-- TRIP MODE RESULT + VISUAL MAP (#5) -->
            @if (isTripMode()) {
               <div class="glass-panel p-8 rounded-3xl border border-blue-200 dark:border-[#1E90FF]/30 mb-12 relative overflow-hidden">
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 relative z-10 text-center">Rota Analizi: {{ tripKm() }} km</h3>
                  
                  <!-- SVG Map Visualization -->
                  <div class="relative w-full h-24 mb-8 max-w-2xl mx-auto">
                     <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-700 -translate-y-1/2"></div>
                     
                     <!-- ICE Path -->
                     <div class="absolute top-8 left-0 w-full flex items-center justify-between px-4">
                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">A</span>
                        <div class="flex-1 relative h-2 mx-2">
                          @if(result().stopsIce > 0) {
                            <div class="absolute left-1/2 top-1/2 w-3 h-3 bg-red-500 rounded-full -translate-y-1/2 -translate-x-1/2" title="Yakıt Molası"></div>
                          }
                        </div>
                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">B</span>
                     </div>

                     <!-- EV Path -->
                     <div class="absolute top-12 left-0 w-full flex items-center justify-between px-4">
                        <div class="flex-1 relative h-2 mx-8">
                           <div class="absolute top-0 left-0 h-full bg-[#1E90FF]/50 rounded-full" style="width: 100%"></div>
                           @if(result().stopsEv > 0) {
                              <div class="absolute left-1/2 top-1/2 w-4 h-4 bg-green-500 dark:bg-[#9FE870] rounded-full -translate-y-1/2 -translate-x-1/2 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(159,232,112,0.5)]" title="Şarj Molası">
                                <svg class="w-2 h-2 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                              </div>
                           }
                        </div>
                     </div>
                     
                     <div class="absolute -bottom-2 w-full text-center text-xs text-gray-500">
                        EV: {{ result().stopsEv }} Mola | ICE: {{ result().stopsIce }} Mola
                     </div>
                  </div>

                  <div class="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 relative z-10">
                     <div class="text-center p-6 rounded-2xl bg-blue-50 dark:bg-black/40 border border-blue-100 dark:border-[#1E90FF]/20 min-w-[200px]">
                        <div class="text-4xl font-bold text-[#1E90FF] mb-2">{{ result().tripCostEv | number:'1.0-0' }} ₺</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Elektrikli</div>
                     </div>

                     <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center font-serif italic text-gray-500 dark:text-gray-400 text-lg">vs</div>

                     <div class="text-center p-6 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 min-w-[200px]">
                        <div class="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-2">{{ result().tripCostIce | number:'1.0-0' }} ₺</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">{{ activeFuelType() === 'Diesel' ? 'Dizel' : 'Benzinli' }}</div>
                     </div>
                  </div>

                  <div class="mt-8 text-center">
                    <span class="inline-block px-6 py-3 bg-green-100 dark:bg-[#9FE870]/10 border border-green-300 dark:border-[#9FE870]/30 rounded-full text-green-700 dark:text-[#9FE870] font-bold">Cebinizde kalan: {{ (result().tripCostIce - result().tripCostEv) | number:'1.0-0' }} ₺</span>
                  </div>
               </div>
            } 

            <!-- ANNUAL MODE RESULT -->
            @else {
              <!-- Solar ROI Widget (#2) -->
              @if(hasSolar()) {
                <div class="w-full mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-transparent dark:from-[#9FE870]/20 dark:to-transparent border border-green-200 dark:border-[#9FE870]/30 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-green-500 dark:bg-[#9FE870] flex items-center justify-center text-white dark:text-black text-2xl">☀️</div>
                    <div>
                      <h4 class="text-gray-900 dark:text-white font-bold text-lg">{{ ts.t('res.solar') }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Aracınızın tüm yıllık enerjisini karşılamak için ihtiyacınız olan:</p>
                    </div>
                  </div>
                  <div class="text-right">
                     <div class="text-3xl font-bold text-green-600 dark:text-[#9FE870]">{{ result().solarPanelCount }} Adet</div>
                     <div class="text-xs text-gray-500 dark:text-gray-400">450W Panel</div>
                  </div>
                </div>
              }

              <!-- Key Metrics Cards -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 w-full">
                <div class="p-6 rounded-2xl bg-blue-50 dark:bg-[#1E90FF]/10 border border-blue-100 dark:border-[#1E90FF]/20">
                   <div class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">{{ ts.t('res.save.year') }}</div>
                   <div class="text-3xl font-bold text-[#1E90FF]">{{ result().savings1Year | number:'1.0-0' }} ₺</div>
                   <div class="text-xs text-[#1E90FF]/70 mt-2">Cebinizde kalan</div>
                </div>
                
                <div class="p-6 rounded-2xl bg-green-50 dark:bg-[#9FE870]/10 border border-green-100 dark:border-[#9FE870]/20">
                   <div class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">{{ ts.t('res.save.month') }}</div>
                   <div class="text-3xl font-bold text-green-600 dark:text-[#9FE870]">
                      {{ result().monthlySavings | number:'1.0-0' }} ₺
                   </div>
                   <div class="text-xs text-green-600/70 dark:text-[#9FE870]/70 mt-2">Ortalama</div>
                </div>

                <div class="p-6 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                   <div class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">{{ ts.t('res.co2') }}</div>
                   <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ result().co2SavedTons | number:'1.1-1' }} Ton</div>
                   <div class="text-xs text-gray-500 mt-2">~{{ (result().co2SavedTons * 50) | number:'1.0-0' }} ağaç</div>
                </div>
                
                <button class="p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-200 dark:border-purple-500/20 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform text-left w-full" (click)="shareResult()">
                   <div class="text-2xl mb-2">🔗</div>
                   <div class="font-bold text-purple-900 dark:text-purple-200">Senaryoyu Paylaş</div>
                </button>
              </div>
              
              <!-- New Feature: Savings Equivalent (Purchase Power) -->
               <div class="w-full mb-12">
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ ts.t('res.power.title') }}</h4>
                 <div class="grid grid-cols-3 gap-4">
                    <div class="bg-white dark:bg-[#121214] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                       <span class="text-2xl mb-2">☕</span>
                       <span class="text-xl font-bold text-[#1E90FF]">{{ result().purchasingPower.coffees | number }}</span>
                       <span class="text-xs text-gray-500">Adet Kahve</span>
                    </div>
                    <div class="bg-white dark:bg-[#121214] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                       <span class="text-2xl mb-2">📱</span>
                       <span class="text-xl font-bold text-[#1E90FF]">{{ result().purchasingPower.phones | number:'1.1-1' }}</span>
                       <span class="text-xs text-gray-500">Son Model Telefon</span>
                    </div>
                    <div class="bg-white dark:bg-[#121214] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                       <span class="text-2xl mb-2">🏖️</span>
                       <span class="text-xl font-bold text-[#1E90FF]">{{ result().purchasingPower.vacations | number:'1.1-1' }}</span>
                       <span class="text-xs text-gray-500">Aile Tatili</span>
                    </div>
                 </div>
              </div>

              <div class="flex flex-col gap-8 w-full">
                   
                   <!-- D3 Chart -->
                   <div class="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none">
                      <div class="flex justify-between items-center mb-6">
                        <div>
                           <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ ts.t('res.chart.title') }}</h4>
                           <p class="text-xs text-gray-500">Sadece Yakıt/Enerji ve Bakım (Araba Fiyatı Yoktur)</p>
                        </div>
                      </div>
                      <div #chartContainer class="w-full h-[350px]"></div>
                   </div>

                   <!-- Drag Race Visualizer (#3) -->
                   <div class="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none">
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ ts.t('res.drag.title') }}</h4>
                      
                      <div class="space-y-6">
                         <!-- EV Bar -->
                         <div>
                            <div class="flex justify-between text-sm mb-2">
                               <span class="text-gray-900 dark:text-white font-bold">{{ currentEv().brand }} {{ currentEv().name }}</span>
                               <span class="text-[#1E90FF] font-mono">{{ currentEv().acceleration }} sn</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 relative overflow-hidden">
                               <div class="absolute top-0 left-0 h-full bg-[#1E90FF]" [style.width.%]="(3 / currentEv().acceleration) * 100"></div>
                            </div>
                         </div>
                         <!-- ICE Bar -->
                         <div>
                            <div class="flex justify-between text-sm mb-2">
                               <span class="text-gray-500 dark:text-gray-400">{{ currentIce().brand }} {{ currentIce().name }}</span>
                               <span class="text-gray-500 dark:text-gray-400 font-mono">{{ currentIce().acceleration }} sn</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 relative overflow-hidden">
                               <div class="absolute top-0 left-0 h-full bg-gray-400 dark:bg-gray-500" [style.width.%]="(3 / currentIce().acceleration) * 100"></div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <!-- Boss Mode Report (#6) -->
                   <button (click)="printReport()" class="w-full py-3 border border-gray-300 dark:border-white/20 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      {{ ts.t('res.report') }}
                   </button>

              </div>
            }
          </div>
        }
        
        <!-- Custom Vehicle Modal (#7) -->
        @if(showCustomModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm">
             <div class="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Özel {{ customModalType() === 'EV' ? ts.t('sim.ev') : ts.t('sim.ice') }} Ekle</h3>
                <div class="space-y-4">
                   <input #brandIn type="text" placeholder="Marka" class="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white placeholder-gray-500">
                   <input #modelIn type="text" placeholder="Model" class="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white placeholder-gray-500">
                   
                   @if(customModalType() === 'EV') {
                      <input #consIn type="number" placeholder="Tüketim (kWh/100km)" class="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white placeholder-gray-500">
                      <input #rangeIn type="number" placeholder="Menzil (km)" class="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white placeholder-gray-500">
                   } @else {
                      <div class="flex gap-4 mb-2">
                         <label class="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input type="radio" name="fuelType" value="Gasoline" [checked]="customIceFuelType() === 'Gasoline'" (change)="customIceFuelType.set('Gasoline')" class="accent-yellow-500">
                            Benzin
                         </label>
                         <label class="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input type="radio" name="fuelType" value="Diesel" [checked]="customIceFuelType() === 'Diesel'" (change)="customIceFuelType.set('Diesel')" class="accent-gray-500">
                            Dizel (Motorin)
                         </label>
                      </div>
                      <input #consIn type="number" placeholder="Yakıt Tüketimi (L/100km)" class="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white placeholder-gray-500">
                   }
                </div>
                <div class="flex gap-4 mt-6">
                   <button (click)="showCustomModal.set(false)" class="flex-1 py-2 rounded border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5">İptal</button>
                   <button (click)="saveCustomVehicle(brandIn.value, modelIn.value, consIn.value, rangeIn?.value)" 
                           class="flex-1 py-2 rounded bg-[#1E90FF] text-white font-bold hover:bg-[#187bde]">{{ ts.t('sim.add') }}</button>
                </div>
             </div>
          </div>
        }

        <!-- Toast Notification -->
        <div class="fixed bottom-8 right-8 bg-[#1E90FF] text-white px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 z-50 flex items-center gap-4 no-print"
             [class.translate-y-32]="!showToast()" [class.translate-y-0]="showToast()">
           <div class="text-2xl">🔗</div>
           <div>
             <div class="font-bold">Link Kopyalandı</div>
             <div class="text-xs text-blue-100">Senaryoyu arkadaşına gönder!</div>
           </div>
        </div>

      </div>
      
      <!-- Printable Report Header (Visible only in Print) -->
      <div class="hidden print-only fixed top-0 left-0 w-full p-8">
         <h1 class="text-3xl font-bold text-black">Şarj Kaça - Maliyet Raporu</h1>
         <p class="text-gray-600 mt-2">Detaylı karşılaştırma analizi.</p>
      </div>

    </section>
  `
  ,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    .hover\\:bg-white_5:hover {
      background-color: rgba(255,255,255,0.05);
    }
    .bg-blue-500_20 { background-color: rgba(59, 130, 246, 0.2); }
    .bg-green-500_20 { background-color: rgba(159, 232, 112, 0.2); }
  `]
})
export class SimulatorComponent implements OnInit {
  private dataService = inject(DataService);
  ts = inject(TranslationService);
  isDark = input<boolean>(true);

  // Signals for Data
  vehicles = signal<Vehicle[]>(this.dataService.getVehicles());
  
  // Search Signals
  evSearchText = signal('');
  iceSearchText = signal('');

  // Filtered Lists
  evs = computed(() => {
    const q = this.evSearchText().toLowerCase();
    return this.vehicles().filter(v => v.type === 'EV' && (
      v.brand.toLowerCase().includes(q) || 
      v.name.toLowerCase().includes(q)
    ));
  });

  ices = computed(() => {
    const q = this.iceSearchText().toLowerCase();
    return this.vehicles().filter(v => v.type === 'ICE' && (
      v.brand.toLowerCase().includes(q) || 
      v.name.toLowerCase().includes(q)
    ));
  });

  // Signals for Selection
  selectedEvId = signal<string>('ev-1');
  selectedIceId = signal<string>('ice-1');
  
  currentEv = computed(() => {
    const ev = this.vehicles().find(v => v.id === this.selectedEvId());
    return ev || this.evs()[0] || this.vehicles().find(v => v.type === 'EV')!;
  });

  currentIce = computed(() => {
    const ice = this.vehicles().find(v => v.id === this.selectedIceId());
    return ice || this.ices()[0] || this.vehicles().find(v => v.type === 'ICE')!;
  });

  // --- INPUTS (Turkish Market Defaults 2025) ---
  isTripMode = signal(false);
  annualKm = signal(15000);
  tripKm = signal(450); 
  
  gasolinePrice = signal(44.5); 
  dieselPrice = signal(45.0);
  
  // Dynamic Fuel Type State (Can override car's default)
  activeFuelType = signal<'Gasoline' | 'Diesel'>('Gasoline');
  
  elecPrice = signal(2.60); 
  publicPrice = signal(12.50); 
  isWinter = signal(false);
  hasSolar = signal(false);
  
  // New Mode Signals
  chargingMode = signal<ChargingMode>('HYBRID');
  hybridMixPercent = signal(50);

  // New Feature Inputs
  showInflation = signal(false);
  fuelInflation = signal(25); // % Annual Increase (Default)
  elecInflation = signal(20); // % Annual Increase (Default)

  // Simulation State
  simulationRun = signal(false);
  result = signal<SimulationResult>({
    evAnnualCost: 0, iceAnnualCost: 0, savings1Year: 0, savings3Year: 0, savings5Year: 0,
    monthlySavings: 0, tcoEv1: 0, tcoEv3: 0, tcoEv5: 0, tcoIce1: 0, tcoIce3: 0, tcoIce5: 0, co2SavedTons: 0,
    maintenanceEvAnnual: 0, maintenanceIceAnnual: 0, tripCostEv: 0, tripCostIce: 0, effectiveRange: 0,
    stopsEv: 0, stopsIce: 0,
    batteryHealth5Year: 100,
    purchasingPower: { coffees: 0, phones: 0, vacations: 0 }
  });

  showToast = signal(false);
  chartContainer = viewChild<ElementRef>('chartContainer');
  
  // Custom Vehicle State
  showCustomModal = signal(false);
  customModalType = signal<'EV' | 'ICE'>('EV');
  customIceFuelType = signal<'Gasoline' | 'Diesel'>('Gasoline');

  constructor() {
    effect(() => {
      const res = this.result();
      const hasRun = this.simulationRun();
      const tripMode = this.isTripMode();
      const theme = this.isDark(); // Track theme changes
      
      if (hasRun && !tripMode) {
        setTimeout(() => {
          const container = this.chartContainer();
          if (container) {
             this.drawChart(res);
          }
        }, 50);
      }
    });

    effect(() => {
      this.dataService.selectedEvIdFromSimulator.set(this.selectedEvId());
    });
  }

  ngOnInit() {
    // Deep Linking (#10): Parse URL params
    const params = new URLSearchParams(window.location.search);
    if (params.has('ev')) this.selectedEvId.set(params.get('ev')!);
    if (params.has('ice')) this.selectedIceId.set(params.get('ice')!);
    if (params.has('km')) this.annualKm.set(Number(params.get('km')));
    
    // Initialize fuel type based on current selection
    const ice = this.currentIce();
    if (ice.fuelType) this.activeFuelType.set(ice.fuelType);
    
    // If params exist, run auto
    if (params.has('ev')) {
       this.runSimulation();
    }
  }
  
  toggleInflation() {
    this.showInflation.update(v => !v);
  }
  
  toggleFuelType(event?: Event) {
    event?.stopPropagation();
    this.activeFuelType.update(t => t === 'Gasoline' ? 'Diesel' : 'Gasoline');
    this.simulationRun.set(false);
  }

  selectEv(id: string) { this.selectedEvId.set(id); this.simulationRun.set(false); }
  
  selectIce(id: string) { 
    this.selectedIceId.set(id); 
    this.simulationRun.set(false); 
    
    // Sync fuel type from car default, but allow override later
    const ice = this.vehicles().find(v => v.id === id);
    if (ice && ice.fuelType) {
        this.activeFuelType.set(ice.fuelType);
    }
  }
  
  setTripMode(val: boolean) { this.isTripMode.set(val); this.simulationRun.set(false); }

  shareResult() {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('ev', this.selectedEvId());
    url.searchParams.set('ice', this.selectedIceId());
    url.searchParams.set('km', this.annualKm().toString());
    window.history.replaceState({}, '', url);
    
    navigator.clipboard.writeText(url.toString());
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
  
  printReport() {
     window.print();
  }

  openCustomCarModal(type: 'EV' | 'ICE') {
     this.customModalType.set(type);
     this.customIceFuelType.set('Gasoline'); // reset default
     this.showCustomModal.set(true);
  }
  
  saveCustomVehicle(brand: string, name: string, consIn: string, rangeIn?: string) {
     const type = this.customModalType();
     const newId = `custom-${Date.now()}`;
     
     const vehicle: Vehicle = {
        id: newId,
        brand: brand || 'Özel',
        name: name || 'Model',
        type: type,
        price: 0, // Removed from calculation and UI
        powerHp: 100,
        acceleration: 8.0,
        image: 'https://picsum.photos/seed/custom/400/250',
        warrantyYears: 2,
        // Specifics
        ...(type === 'EV' ? {
           energyConsumption: Number(consIn) || 16,
           rangeWltp: Number(rangeIn) || 400
        } : {
           fuelEconomy: Number(consIn) || 7,
           tankCapacity: 50,
           fuelType: this.customIceFuelType()
        })
     };
     
     // Fix for variable name in closure if needed, but using function args:
     if (type === 'EV') {
        vehicle.energyConsumption = Number(consIn) || 16;
        this.selectedEvId.set(newId);
     } else {
        this.selectedIceId.set(newId);
        if (vehicle.fuelType) {
           this.activeFuelType.set(vehicle.fuelType);
        }
     }

     this.dataService.addCustomVehicle(vehicle);
     this.vehicles.set(this.dataService.getVehicles()); // trigger signal update
     this.showCustomModal.set(false);
  }

  runSimulation() {
    // Determine effective fuel price based on active fuel type (toggleable)
    const activeFuelPrice = this.activeFuelType() === 'Diesel' ? this.dieselPrice() : this.gasolinePrice();

    const input = {
      annualKm: this.annualKm(),
      electricityPrice: this.elecPrice(),
      fuelPrice: activeFuelPrice, // Use active price
      chargingMode: this.chargingMode(),
      publicChargingPrice: this.publicPrice(),
      hybridMixPercent: this.hybridMixPercent(),
      isWinter: this.isWinter(),
      hasSolar: this.hasSolar(),
      isTripMode: this.isTripMode(),
      tripDistance: this.tripKm(),
      inflationFuel: this.fuelInflation(),
      inflationElec: this.elecInflation()
    };
    const calculations = this.dataService.calculateComparison(this.currentEv(), this.currentIce(), input);
    this.result.set(calculations);
    this.simulationRun.set(true);
  }

  drawChart(data: SimulationResult) {
    const d3Lib = (typeof d3 !== 'undefined' ? d3 : (window as any).d3);
    if (!d3Lib) return;

    const element = this.chartContainer()?.nativeElement;
    if (!element) return;

    d3Lib.select(element).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    const axisColor = this.isDark() ? '#9ca3af' : '#4b5563';
    const gridColor = this.isDark() ? '#333' : '#e5e7eb';

    if (width <= 0) return;

    const svg = d3Lib.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3Lib.scaleLinear().domain([0, 5]).range([0, width]);
    // Max cost based on cumulative OpEx (starting at 0)
    const maxCost = Math.max(data.tcoIce5, data.tcoEv5) * 1.1;
    const y = d3Lib.scaleLinear().domain([0, maxCost]).range([height, 0]);

    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.5)
      .attr('color', gridColor)
      .call(d3Lib.axisLeft(y).tickSize(-width).tickFormat(''));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3Lib.axisBottom(x).ticks(5).tickFormat(d3.format('d')))
      .attr('color', axisColor)
      .style('font-size', '12px');

    svg.append('g')
      .call(d3Lib.axisLeft(y).ticks(5).tickFormat((d: any) => (d / 1000).toFixed(0) + 'k ₺'))
      .attr('color', axisColor)
      .style('font-size', '11px');

    // OpEx starts at 0 for both
    const evLineData = [
      { x: 0, y: 0 },
      { x: 1, y: data.tcoEv1 },
      { x: 3, y: data.tcoEv3 },
      { x: 5, y: data.tcoEv5 }
    ];

    const iceLineData = [
      { x: 0, y: 0 },
      { x: 1, y: data.tcoIce1 },
      { x: 3, y: data.tcoIce3 },
      { x: 5, y: data.tcoIce5 }
    ];

    const line = d3Lib.line()
      .x((d: any) => x(d.x))
      .y((d: any) => y(d.y))
      .curve(d3Lib.curveMonotoneX);

    svg.append('path')
      .datum(evLineData)
      .attr('fill', 'none')
      .attr('stroke', '#1E90FF')
      .attr('stroke-width', 3)
      .attr('d', line);

    svg.append('path')
      .datum(iceLineData)
      .attr('fill', 'none')
      .attr('stroke', axisColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line);

    const addDots = (dataset: any[], color: string, id: string) => {
       svg.selectAll(`.dot-${id}`)
        .data(dataset)
        .enter()
        .append('circle')
        .attr('class', `dot-${id}`)
        .attr('cx', (d: any) => x(d.x))
        .attr('cy', (d: any) => y(d.y))
        .attr('r', 5)
        .attr('fill', color)
        .attr('stroke', this.isDark() ? '#000' : '#fff')
        .attr('stroke-width', 2);
    };

    addDots(evLineData, '#1E90FF', 'ev');
    addDots(iceLineData, axisColor, 'ice');

    const addLabels = (dataset: any[], id: string, color: string) => {
      svg.selectAll(`.label-${id}`)
        .data(dataset.filter((d: any) => d.x > 0)) // Don't label the 0,0 point
        .enter()
        .append('text')
        .attr('class', `label-${id}`)
        .attr('x', (d: any) => x(d.x))
        .attr('y', (d: any) => y(d.y) - 10) // Position above the dot
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .attr('fill', color)
        .text((d: any) => (d.y / 1000).toFixed(0) + 'k ₺');
    };

    addLabels(evLineData, 'ev', '#1E90FF');
    addLabels(iceLineData, 'ice', axisColor);

    const legend = svg.append('g').attr('transform', `translate(20, 0)`);
    legend.append('circle').attr('cx',0).attr('cy',0).attr('r', 5).style('fill', '#1E90FF');
    legend.append('text').attr('x', 15).attr('y', 4).text(`Elektrikli (${this.currentEv().brand})`).style('font-size', '12px').attr('fill', '#1E90FF');
    legend.append('circle').attr('cx',0).attr('cy', 20).attr('r', 5).style('fill', axisColor);
    // Dynamic legend text based on active fuel type
    legend.append('text').attr('x', 15).attr('y', 24).text(`${this.activeFuelType() === 'Diesel' ? 'Dizel' : 'Benzinli'} (${this.currentIce().brand})`).style('font-size', '12px').attr('fill', axisColor);
  }
}
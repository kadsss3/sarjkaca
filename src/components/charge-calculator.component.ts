import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Vehicle } from '../services/data.service';

@Component({
  selector: 'app-charge-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-24 bg-gray-100 dark:bg-[#0c0c0e] transition-colors duration-300 border-t border-gray-200 dark:border-white/5 relative overflow-hidden">
      
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-5xl mx-auto px-6 relative z-10">
        
        <div class="text-center mb-12">
          <div class="inline-block px-3 py-1 border border-blue-500/30 rounded-full text-[#1E90FF] text-xs font-bold uppercase mb-4">
            Pratik Araç
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Şarj <span class="text-[#1E90FF]">Süresi</span> Hesaplayıcı
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Bataryanızın ne kadar sürede dolacağını ve menzil kazanacağınızı hesaplayın.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Controls Column -->
          <div class="lg:col-span-7 bg-white dark:bg-[#121214] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
            
            <!-- Vehicle Selector -->
            <div class="mb-8">
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Araç Seçimi (Otomatik Doldur)</label>
              <select [ngModel]="selectedVehicleId()" (ngModelChange)="onVehicleSelect($event)" class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:border-[#1E90FF] outline-none transition-colors cursor-pointer">
                @for(ev of evs(); track ev.id) {
                  <option [value]="ev.id">{{ ev.brand }} {{ ev.name }}</option>
                }
              </select>
            </div>
            
            <!-- Battery Capacity & Consumption -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Batarya Kapasitesi</label>
                <div class="relative">
                  <input type="number" [ngModel]="batterySize()" (ngModelChange)="setBatterySize($event)" class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:border-[#1E90FF] outline-none transition-colors">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">kWh</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Ortalama Tüketim</label>
                <div class="relative">
                  <input type="number" [ngModel]="consumption()" (ngModelChange)="setConsumption($event)" class="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:border-[#1E90FF] outline-none transition-colors">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">kWh/100km</span>
                </div>
              </div>
            </div>

            <!-- Charging Power Presets -->
            <div class="mb-8">
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Şarj İstasyonu Gücü</label>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                <button (click)="setChargingPower(3.7); showCustomPowerInput.set(false)" [class.ring-2]="chargingPower() === 3.7 && !showCustomPowerInput()" class="py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all ring-[#1E90FF]">
                  <div class="text-sm font-bold text-gray-900 dark:text-white">3.7 kW</div>
                  <div class="text-[10px] text-gray-500">Priz</div>
                </button>
                <button (click)="setChargingPower(11); showCustomPowerInput.set(false)" [class.ring-2]="chargingPower() === 11 && !showCustomPowerInput()" class="py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all ring-[#1E90FF]">
                  <div class="text-sm font-bold text-gray-900 dark:text-white">11 kW</div>
                  <div class="text-[10px] text-gray-500">AC Wallbox</div>
                </button>
                <button (click)="setChargingPower(60); showCustomPowerInput.set(false)" [class.ring-2]="chargingPower() === 60 && !showCustomPowerInput()" class="py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all ring-[#1E90FF]">
                  <div class="text-sm font-bold text-gray-900 dark:text-white">60 kW</div>
                  <div class="text-[10px] text-gray-500">DC Hızlı</div>
                </button>
                <button (click)="setChargingPower(180); showCustomPowerInput.set(false)" [class.ring-2]="chargingPower() === 180 && !showCustomPowerInput()" class="py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all ring-[#1E90FF]">
                  <div class="text-sm font-bold text-gray-900 dark:text-white">180 kW</div>
                  <div class="text-[10px] text-gray-500">HPC Ultra</div>
                </button>
                 <button (click)="showCustomPowerInput.set(true)" [class.ring-2]="showCustomPowerInput()" class="py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all ring-[#1E90FF]">
                  <div class="text-sm font-bold text-gray-900 dark:text-white">Özel</div>
                  <div class="text-[10px] text-gray-500">Değer</div>
                </button>
              </div>
              
              @if(showCustomPowerInput()) {
                <div class="relative animate-fade-in">
                  <input type="range" min="2" max="350" step="1" [ngModel]="chargingPower()" (ngModelChange)="setChargingPower($event)" class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]">
                  <div class="flex justify-between mt-2 text-xs text-gray-500">
                     <span>Özel Değer:</span>
                     <span class="font-bold text-[#1E90FF]">{{ chargingPower() }} kW</span>
                  </div>
                </div>
              }
            </div>

            <!-- Percentage Sliders -->
            <div class="space-y-8">
              
              <!-- Start SoC -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">Mevcut Şarj (%)</label>
                  <span class="text-sm font-bold text-green-500 dark:text-[#9FE870]">%{{ startSoc() }}</span>
                </div>
                <input type="range" min="0" max="100" [ngModel]="startSoc()" (ngModelChange)="updateStartSoc($event)" class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 dark:accent-[#9FE870]">
              </div>

              <!-- Target SoC -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">Hedef Şarj (%)</label>
                  <span class="text-sm font-bold text-red-500 dark:text-red-400">%{{ targetSoc() }}</span>
                </div>
                <input type="range" min="0" max="100" [ngModel]="targetSoc()" (ngModelChange)="updateTargetSoc($event)" class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500">
              </div>

            </div>
          </div>

          <!-- Result Column -->
          <div class="lg:col-span-5 flex flex-col gap-6">
             
             <!-- Time Result Card -->
             <div class="bg-[#1E90FF] text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20 relative overflow-hidden">
                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <h3 class="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Tahmini Süre</h3>
                <div class="flex items-baseline gap-2 mb-6">
                  <span class="text-6xl font-bold">{{ result().hours }}</span>
                  <span class="text-xl text-blue-100 font-medium">sa</span>
                  <span class="text-6xl font-bold ml-2">{{ result().minutes }}</span>
                  <span class="text-xl text-blue-100 font-medium">dk</span>
                </div>
                
                <div class="w-full bg-black/20 h-1.5 rounded-full mb-4">
                   <div class="h-full bg-white/90 rounded-full animate-pulse" style="width: 60%"></div>
                </div>
                
                <p class="text-sm text-blue-100">
                   %{{ startSoc() }} → %{{ targetSoc() }} arası dolum için.<br>
                   <span class="opacity-70 text-xs">*80% sonrası şarj hızı düşebilir.</span>
                </p>
             </div>

             <!-- Range Gained Card -->
             <div class="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none flex flex-col items-center justify-center text-center">
                <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-[#9FE870]/20 flex items-center justify-center mb-3 text-green-600 dark:text-[#9FE870]">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                </div>
                <h4 class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Kazanılan Menzil</h4>
                <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ result().rangeGained | number:'1.0-0' }} km</div>
             </div>

             <!-- Visual Battery -->
             <div class="bg-gray-100 dark:bg-black/40 p-6 rounded-3xl border border-gray-200 dark:border-white/5 flex justify-center items-center h-full min-h-[200px]">
                <!-- Battery Body -->
                <div class="relative w-32 h-48 border-4 border-gray-400 dark:border-gray-600 rounded-2xl p-1.5 flex flex-col justify-end bg-gray-200 dark:bg-black/50">
                   <!-- Battery Top Nipple -->
                   <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-400 dark:bg-gray-600 rounded-t-md"></div>
                   
                   <!-- Container to clip corners -->
                   <div class="w-full h-full rounded-lg overflow-hidden flex flex-col-reverse">
                       <!-- Existing Charge (Green) -->
                       <div class="w-full bg-gradient-to-t from-green-500 to-[#9FE870] animated-fill relative transition-all duration-500"
                            [style.height.%]="startSoc()">
                            @if (startSoc() > 15) {
                               <div class="absolute inset-0 flex items-center justify-center text-black font-bold text-xl">
                                 %{{ startSoc() }}
                               </div>
                            }
                       </div>

                       <!-- Added Charge (Red) -->
                       <div class="w-full bg-gradient-to-t from-red-500 to-red-600 dark:from-red-600 dark:to-red-800 relative transition-all duration-500"
                            [style.height.%]="targetSoc() - startSoc()">
                            @if(targetSoc() - startSoc() > 15) {
                              <div class="absolute inset-0 flex flex-col items-center justify-center text-white font-bold shadow-black drop-shadow-md text-center">
                                <span class="text-xl leading-none">+{{ (batterySize() * (targetSoc() - startSoc()) / 100) | number:'1.0-0' }}</span>
                                <span class="text-[10px] opacity-80">kWh</span>
                              </div>
                            }
                       </div>
                   </div>
                </div>
             </div>

          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animated-fill {
      transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .animated-fill::before,
    .animated-fill::after {
      content: '';
      position: absolute;
      width: 250%;
      height: 250%;
      top: -170%;
      left: 50%;
      border-radius: 45%;
      background: rgba(255, 255, 255, 0.15);
      animation: wave 10s infinite linear;
    }

    .animated-fill::after {
      border-radius: 40%;
      background: rgba(255, 255, 255, 0.2);
      animation: wave 15s infinite linear;
      animation-direction: reverse;
    }

    @keyframes wave {
      from {
        transform: translateX(-50%) rotate(0deg);
      }
      to {
        transform: translateX(-50%) rotate(360deg);
      }
    }
  `]
})
export class ChargeCalculatorComponent implements OnInit {
  private dataService = inject(DataService);

  evs = signal<Vehicle[]>([]);
  selectedVehicleId = signal<string>('');
  
  batterySize = signal(75); // kWh
  consumption = signal(16.5); // kWh/100km
  chargingPower = signal(60); // kW
  
  startSoc = signal(20);
  targetSoc = signal(80);

  showCustomPowerInput = signal(false);

  constructor() {
    effect(() => {
      const vehicleId = this.selectedVehicleId();
      if (!vehicleId) return;

      const selectedVehicle = this.evs().find(v => v.id === vehicleId);
      if (selectedVehicle) {
        this.batterySize.set(selectedVehicle.batteryCapacity ?? 75);
        this.consumption.set(selectedVehicle.energyConsumption ?? 16.5);
      }
    });
  }

  ngOnInit() {
    this.evs.set(this.dataService.getVehicles().filter(v => v.type === 'EV'));
    const initialEvId = this.dataService.selectedEvIdFromSimulator();
    if (this.evs().some(v => v.id === initialEvId)) {
      this.selectedVehicleId.set(initialEvId);
    } else if (this.evs().length > 0) {
      this.selectedVehicleId.set(this.evs()[0].id);
    }
  }

  result = computed(() => {
    const cap = this.batterySize();
    const power = this.chargingPower();
    const start = this.startSoc();
    const target = this.targetSoc();
    const cons = this.consumption();

    if (target <= start || power <= 0) {
      return { hours: 0, minutes: 0, rangeGained: 0 };
    }

    const percentDiff = (target - start) / 100;
    const energyNeeded = cap * percentDiff; // kWh needed
    
    // Time = Energy / Power
    const totalHours = energyNeeded / power;
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    // Range gained
    const rangeGained = (energyNeeded / cons) * 100;

    return {
      hours,
      minutes,
      rangeGained
    };
  });
  
  onVehicleSelect(vehicleId: string) {
    this.selectedVehicleId.set(vehicleId);
  }

  setBatterySize(value: string | number) {
    this.batterySize.set(Number(value));
  }

  setConsumption(value: string | number) {
    this.consumption.set(Number(value));
  }

  setChargingPower(value: string | number) {
    this.chargingPower.set(Number(value));
  }

  updateStartSoc(val: string | number) {
    const numericVal = Number(val);
    this.startSoc.set(numericVal);
    if (this.targetSoc() <= numericVal) {
       this.targetSoc.set(Math.min(100, numericVal + 10));
    }
  }

  updateTargetSoc(val: string | number) {
    const numericVal = Number(val);
    this.targetSoc.set(numericVal);
    if (this.startSoc() >= numericVal) {
       this.startSoc.set(Math.max(0, numericVal - 10));
    }
  }
}
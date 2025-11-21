

import { Injectable, signal } from '@angular/core';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: 'EV' | 'ICE';
  fuelType?: 'Gasoline' | 'Diesel'; // Added for ICE distinction
  price: number; // Kept for display metadata only, not used in calc
  powerHp: number;
  image: string;
  acceleration: number; // 0-100 km/h in seconds
  
  // EV Specifics
  rangeWltp?: number; // km
  batteryCapacity?: number; // kWh
  chargingPowerAc?: number; // kW
  chargingPowerDc?: number; // kW
  energyConsumption?: number; // kWh/100km
  
  // ICE Specifics
  fuelEconomy?: number; // L/100km
  co2Emissions?: number; // g/km
  tankCapacity?: number; // L
  warrantyYears: number;
}

export type ChargingMode = 'AC_ONLY' | 'HYBRID' | 'DC_ONLY';

export interface SimulationInput {
  annualKm: number;
  electricityPrice: number; // per kWh (Home)
  fuelPrice: number; // per Liter (Context dependent: Gasoline or Diesel)
  // Updated Features
  chargingMode: ChargingMode;
  publicChargingPrice: number; // per kWh
  hybridMixPercent: number; // Used only in HYBRID mode
  
  isWinter: boolean;
  hasSolar: boolean;
  isTripMode: boolean;
  tripDistance: number;
  // Inflation Logic
  inflationFuel: number; // % increase per year
  inflationElec: number; // % increase per year
}

export interface SimulationResult {
  evAnnualCost: number;
  iceAnnualCost: number;
  savings1Year: number;
  savings3Year: number;
  savings5Year: number;
  monthlySavings: number; // New metric replacing break-even
  tcoEv1: number;
  tcoEv3: number;
  tcoEv5: number;
  tcoIce1: number;
  tcoIce3: number;
  tcoIce5: number;
  co2SavedTons: number;
  // New Metrics
  maintenanceEvAnnual: number;
  maintenanceIceAnnual: number;
  tripCostEv: number;
  tripCostIce: number;
  effectiveRange: number;
  // Suggestions
  solarPanelCount?: number;
  stopsEv: number;
  stopsIce: number;
  // Feature Additions
  batteryHealth5Year: number; // percentage (0-100)
  purchasingPower: {
    coffees: number; // Approx 120 TL
    phones: number; // Approx 65,000 TL
    vacations: number; // Approx 35,000 TL
  };
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  selectedEvIdFromSimulator = signal<string>('ev-1');

  // Curated Data (Turkish Market Approx. Prices 2025)
  private vehicles: Vehicle[] = [
    // EVs
    {
      id: 'ev-1',
      brand: 'Tesla',
      name: 'Model 3 LR',
      type: 'EV',
      price: 2750000, 
      powerHp: 490,
      acceleration: 4.4,
      rangeWltp: 629,
      batteryCapacity: 75,
      energyConsumption: 14.8,
      chargingPowerAc: 11,
      chargingPowerDc: 250,
      warrantyYears: 4,
      image: 'https://picsum.photos/seed/tesla/400/250'
    },
    {
      id: 'ev-2',
      brand: 'Togg',
      name: 'T10X V2',
      type: 'EV',
      price: 1950000, 
      powerHp: 218,
      acceleration: 7.8,
      rangeWltp: 523,
      batteryCapacity: 88.5,
      energyConsumption: 16.9,
      chargingPowerAc: 11,
      chargingPowerDc: 180,
      warrantyYears: 3,
      image: 'https://picsum.photos/seed/togg/400/250'
    },
    {
      id: 'ev-3',
      brand: 'Hyundai',
      name: 'IONIQ 5',
      type: 'EV',
      price: 2900000, 
      powerHp: 325,
      acceleration: 5.1,
      rangeWltp: 481,
      batteryCapacity: 77.4,
      energyConsumption: 16.8,
      chargingPowerAc: 11,
      chargingPowerDc: 350,
      warrantyYears: 5,
      image: 'https://picsum.photos/seed/ioniq/400/250'
    },
    // ICEs
    {
      id: 'ice-1',
      brand: 'BMW',
      name: '320i Sedan',
      type: 'ICE',
      fuelType: 'Gasoline',
      price: 3500000, 
      powerHp: 170,
      acceleration: 7.4,
      fuelEconomy: 7.3, 
      co2Emissions: 165,
      tankCapacity: 59,
      warrantyYears: 3,
      image: 'https://picsum.photos/seed/bmw3/400/250'
    },
    {
      id: 'ice-2',
      brand: 'Renault',
      name: 'Clio 1.0 TCe',
      type: 'ICE',
      fuelType: 'Gasoline',
      price: 1150000, 
      powerHp: 90,
      acceleration: 12.2,
      fuelEconomy: 5.8,
      co2Emissions: 118,
      tankCapacity: 42,
      warrantyYears: 2,
      image: 'https://picsum.photos/seed/clio/400/250'
    },
    {
      id: 'ice-3',
      brand: 'VW',
      name: 'Golf 1.5 eTSI',
      type: 'ICE',
      fuelType: 'Gasoline',
      price: 1950000, 
      powerHp: 150,
      acceleration: 8.5,
      fuelEconomy: 6.2,
      co2Emissions: 130,
      tankCapacity: 50,
      warrantyYears: 2,
      image: 'https://picsum.photos/seed/golf/400/250'
    },
    {
      id: 'ice-4',
      brand: 'Fiat',
      name: 'Egea Cross 1.6',
      type: 'ICE',
      fuelType: 'Diesel',
      price: 1450000, 
      powerHp: 130,
      acceleration: 10.2,
      fuelEconomy: 5.0,
      co2Emissions: 132,
      tankCapacity: 50,
      warrantyYears: 5,
      image: 'https://picsum.photos/seed/egea/400/250'
    }
  ];

  getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  addCustomVehicle(v: Vehicle) {
    this.vehicles.push(v);
  }

  calculateComparison(ev: Vehicle, ice: Vehicle, inputs: SimulationInput): SimulationResult {
    
    // --- Weather Impact Logic ---
    const efficiencyFactor = inputs.isWinter ? 1.22 : 1.0;
    const rangeFactor = inputs.isWinter ? 0.78 : 1.0; 
    
    const adjustedEvConsumption = (ev.energyConsumption || 16) * efficiencyFactor;
    const effectiveRange = (ev.rangeWltp || 400) * rangeFactor;

    // --- Solar Logic ---
    let solarPanelCount = 0;
    let effectiveHomeRate = inputs.electricityPrice;

    if (inputs.hasSolar) {
      effectiveHomeRate = 0; // Assume completely free if user says "has solar"
      const annualKwh = (inputs.annualKm / 100) * adjustedEvConsumption;
      const dailyKwh = annualKwh / 365;
      const kwSystem = dailyKwh / 4; 
      solarPanelCount = Math.ceil(kwSystem / 0.45);
    }
    
    // --- Charging Mode Logic ---
    let publicShare = 0;
    switch (inputs.chargingMode) {
        case 'AC_ONLY': publicShare = 0; break;
        case 'DC_ONLY': publicShare = 1; break;
        case 'HYBRID': publicShare = inputs.hybridMixPercent / 100; break;
    }
    const homeShare = 1 - publicShare;
    
    // --- Base Costs Per 100km (Year 0) ---
    const weightedElecPrice = (effectiveHomeRate * homeShare) + (inputs.publicChargingPrice * publicShare);
    const evCostPer100 = adjustedEvConsumption * weightedElecPrice;
    const iceCostPer100 = (ice.fuelEconomy || 7) * inputs.fuelPrice;

    // --- Maintenance Logic (TL/km) ---
    const iceMaintenancePerKm = 2.5; 
    const evMaintenancePerKm = 1.0;

    // --- Annual Mode Calculations (Year 1 Base) ---
    const evAnnualFuel = (inputs.annualKm / 100) * evCostPer100;
    const iceAnnualFuel = (inputs.annualKm / 100) * iceCostPer100;

    const evAnnualMaint = inputs.annualKm * evMaintenancePerKm;
    const iceAnnualMaint = inputs.annualKm * iceMaintenancePerKm;

    const evTotalAnnualYear1 = evAnnualFuel + evAnnualMaint;
    const iceTotalAnnualYear1 = iceAnnualFuel + iceAnnualMaint;

    // --- Inflation Loop for Operational Costs (OpEx Only) ---
    // Note: Starting at 0 because we ignored Car Price
    let cumEvCost = 0; 
    let cumIceCost = 0;

    const tcoEvSeries = [0];
    const tcoIceSeries = [0];

    let currentFuelPrice = inputs.fuelPrice;
    let currentElecPrice = inputs.electricityPrice; // base home
    let currentPubPrice = inputs.publicChargingPrice;

    for (let year = 1; year <= 5; year++) {
        // Apply inflation to unit prices
        if (year > 1) {
            currentFuelPrice *= (1 + (inputs.inflationFuel / 100));
            currentElecPrice *= (1 + (inputs.inflationElec / 100));
            currentPubPrice *= (1 + (inputs.inflationElec / 100)); 
        }

        // Recalculate annual costs with new prices
        const yearWeightedElec = (inputs.hasSolar ? 0 : currentElecPrice * homeShare) + (currentPubPrice * publicShare);
        const yearEvFuel = (inputs.annualKm / 100) * (adjustedEvConsumption * yearWeightedElec);
        const yearIceFuel = (inputs.annualKm / 100) * ((ice.fuelEconomy || 7) * currentFuelPrice);
        
        // Maintenance inflation
        const yearMaintFactor = Math.pow(1.15, year - 1); 
        const yearEvMaint = evAnnualMaint * yearMaintFactor;
        const yearIceMaint = iceAnnualMaint * yearMaintFactor;

        const yearEvTotal = yearEvFuel + yearEvMaint;
        const yearIceTotal = yearIceFuel + yearIceMaint;

        cumEvCost += yearEvTotal;
        cumIceCost += yearIceTotal;

        tcoEvSeries.push(cumEvCost);
        tcoIceSeries.push(cumIceCost);
    }

    const tcoEv1 = tcoEvSeries[1];
    const tcoEv3 = tcoEvSeries[3];
    const tcoEv5 = tcoEvSeries[5];
    const tcoIce1 = tcoIceSeries[1];
    const tcoIce3 = tcoIceSeries[3];
    const tcoIce5 = tcoIceSeries[5];

    // --- CO2 Impact ---
    const iceTotalCo2Kg = (inputs.annualKm * (ice.co2Emissions || 130)) / 1000;
    const gridEmissionFactor = inputs.hasSolar ? 0.05 : 0.45;
    const evTotalCo2Kg = ((inputs.annualKm / 100) * adjustedEvConsumption) * gridEmissionFactor;
    const co2SavedTons = (iceTotalCo2Kg - evTotalCo2Kg) / 1000;

    // --- Trip Mode ---
    const tripKm = inputs.tripDistance || 0;
    const tripCostEv = (tripKm / 100) * evCostPer100;
    const tripCostIce = (tripKm / 100) * iceCostPer100;
    const stopsEv = Math.max(0, Math.ceil((tripKm / effectiveRange) - 1));
    const stopsIce = Math.max(0, Math.ceil((tripKm / ((ice.tankCapacity || 50) / (ice.fuelEconomy || 7) * 100)) - 1));

    // --- Battery Health ---
    const years = 5;
    const totalKm = inputs.annualKm * years;
    const calendarDegradation = 1.5 * years; // 7.5%
    const cycleDegradation = (totalKm / (ev.rangeWltp || 400)) * 0.015; 
    const dcKm = totalKm * publicShare;
    const fastChargeDegradation = (dcKm / 1000) * 0.15; 
    const totalDegradation = calendarDegradation + cycleDegradation + fastChargeDegradation;
    const batteryHealth5Year = Math.max(70, 100 - totalDegradation);

    // --- Savings Calculation (OpEx Only) ---
    const totalSavings5Year = cumIceCost - cumEvCost;
    const monthlySavings = (iceTotalAnnualYear1 - evTotalAnnualYear1) / 12;
    
    const purchasingPower = {
        coffees: Math.floor(totalSavings5Year / 120),
        phones: Math.floor(totalSavings5Year / 75000),
        vacations: Math.floor(totalSavings5Year / 40000)
    };

    return {
      evAnnualCost: evTotalAnnualYear1,
      iceAnnualCost: iceTotalAnnualYear1,
      savings1Year: (iceTotalAnnualYear1 - evTotalAnnualYear1),
      savings3Year: tcoIce3 - tcoEv3,
      savings5Year: totalSavings5Year,
      monthlySavings: Math.max(0, monthlySavings),
      tcoEv1, tcoEv3, tcoEv5,
      tcoIce1, tcoIce3, tcoIce5,
      co2SavedTons: Math.max(0, co2SavedTons),
      maintenanceEvAnnual: evAnnualMaint,
      maintenanceIceAnnual: iceAnnualMaint,
      tripCostEv,
      tripCostIce,
      effectiveRange,
      solarPanelCount,
      stopsEv,
      stopsIce,
      batteryHealth5Year,
      purchasingPower
    };
  }
}
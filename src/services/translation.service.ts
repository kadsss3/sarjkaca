
import { Injectable, signal } from '@angular/core';

export type Lang = 'TR' | 'EN' | 'DE';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Lang>('TR');

  private dict: Record<string, Record<Lang, string>> = {
    // Navbar
    'nav.simulator': { TR: 'Simülatör', EN: 'Simulator', DE: 'Simulator' },
    'nav.charge': { TR: 'Şarj Süresi', EN: 'Charging', DE: 'Ladezeit' },
    'nav.impact': { TR: 'Etki', EN: 'Impact', DE: 'Einfluss' },
    'nav.reviews': { TR: 'Yorumlar', EN: 'Reviews', DE: 'Bewertungen' },
    'nav.start': { TR: 'Şimdi Başla', EN: 'Start Now', DE: 'Starten' },

    // Hero
    'hero.badge': { TR: 'Mobilitenin Geleceği', EN: 'The Future of Mobility', DE: 'Die Zukunft der Mobilität' },
    'hero.title.pre': { TR: 'Gelecek', EN: 'The Future is', DE: 'Die Zukunft ist' },
    'hero.title.highlight': { TR: 'Elektrikli', EN: 'Electric', DE: 'Elektrisch' },
    'hero.title.post': { TR: 'Peki ya Siz?', EN: 'What about you?', DE: 'Und Sie?' },
    'hero.desc': { 
      TR: 'Elektrikli ve İçten Yanmalı araçlar arasındaki gerçek farkları keşfedin. Saniyeler içinde maliyet, performans ve çevresel etkiyi analiz edin.', 
      EN: 'Discover the real differences between Electric and ICE vehicles. Analyze cost, performance, and environmental impact in seconds.',
      DE: 'Entdecken Sie die wahren Unterschiede zwischen Elektro- und Verbrennerfahrzeugen. Analysieren Sie Kosten, Leistung und Umweltbelastung in Sekunden.'
    },
    'hero.cta.start': { TR: 'Karşılaştırmaya Başla', EN: 'Start Comparison', DE: 'Vergleich Starten' },
    'hero.cta.details': { TR: 'Detayları Gör', EN: 'View Details', DE: 'Details' },
    'hero.sound.ice': { TR: 'MOTOR SESİ', EN: 'ENGINE SOUND', DE: 'MOTORSOUND' },
    
    // Simulator
    'sim.title': { TR: 'Karşılaştırma', EN: 'Comparison', DE: 'Vergleich' },
    'sim.subtitle': { TR: 'Simülatörü', EN: 'Simulator', DE: 'Simulator' },
    'sim.tab.annual': { TR: 'Yıllık Özet', EN: 'Annual Summary', DE: 'Jahresübersicht' },
    'sim.tab.trip': { TR: 'Rota Planlayıcı', EN: 'Trip Planner', DE: 'Routenplaner' },
    'sim.ev': { TR: 'Elektrikli', EN: 'Electric', DE: 'Elektrisch' },
    'sim.ice': { TR: 'İçten Yanmalı', EN: 'Internal Combustion', DE: 'Verbrennung' },
    'sim.add': { TR: 'Ekle', EN: 'Add', DE: 'Hinzufügen' },
    'sim.search': { TR: 'Model Ara...', EN: 'Search Model...', DE: 'Modell suchen...' },
    'sim.settings': { TR: 'Simülatör Ayarları', EN: 'Simulator Settings', DE: 'Einstellungen' },
    'sim.strat': { TR: 'Şarj Stratejisi', EN: 'Charging Strategy', DE: 'Ladestrategie' },
    'sim.dist.annual': { TR: 'Yıllık Mesafe', EN: 'Annual Distance', DE: 'Jahresdistanz' },
    'sim.dist.trip': { TR: 'Rota Mesafe', EN: 'Trip Distance', DE: 'Streckendistanz' },
    'sim.price.fuel': { TR: 'Yakıt Fiyatı', EN: 'Fuel Price', DE: 'Kraftstoffpreis' },
    'sim.price.elec': { TR: 'Ev Elektriği', EN: 'Home Electricity', DE: 'Hausstrom' },
    'sim.price.public': { TR: 'İstasyon', EN: 'Public Station', DE: 'Ladestation' },
    'sim.mix': { TR: 'Şarj Karışımı', EN: 'Charging Mix', DE: 'Lademix' },
    'sim.winter': { TR: 'Kış Modu', EN: 'Winter Mode', DE: 'Wintermodus' },
    'sim.solar': { TR: 'Güneş Paneli', EN: 'Solar Panel', DE: 'Solaranlage' },
    'sim.inflation': { TR: 'Enflasyon Tahmini', EN: 'Inflation Estimate', DE: 'Inflationsschätzung' },
    'sim.calc': { TR: 'HESAPLA', EN: 'CALCULATE', DE: 'BERECHNEN' },
    
    // Results
    'res.solar': { TR: 'Güneş Enerjisi Yatırımı', EN: 'Solar Investment', DE: 'Solarinvestition' },
    'res.save.year': { TR: 'Yıllık Tasarruf', EN: 'Annual Savings', DE: 'Jahresersparnis' },
    'res.save.month': { TR: 'Aylık Tasarruf', EN: 'Monthly Savings', DE: 'Monatl. Ersparnis' },
    'res.co2': { TR: 'CO₂ Azaltımı', EN: 'CO₂ Reduction', DE: 'CO₂-Reduktion' },
    'res.power.title': { TR: '5 Yıllık Yakıt Tasarrufu ile Neler Alınır?', EN: 'What can you buy with 5 years of savings?', DE: 'Was können Sie mit 5 Jahren Ersparnis kaufen?' },
    'res.chart.title': { TR: '5 Yıllık İşletme Maliyeti', EN: '5-Year Operating Cost', DE: '5-Jahres-Betriebskosten' },
    'res.drag.title': { TR: '0-100 km/h Performans', EN: '0-100 km/h Performance', DE: '0-100 km/h Leistung' },
    'res.report': { TR: 'Rapor İndir', EN: 'Download Report', DE: 'Bericht herunterladen' }
  };

  t(key: string): string {
    const lang = this.currentLang();
    const entry = this.dict[key];
    return entry ? (entry[lang] || entry['TR']) : key;
  }
  
  setLang(lang: Lang) {
    this.currentLang.set(lang);
  }
}

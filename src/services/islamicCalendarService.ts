// src/services/islamicCalendarService.ts - VERSION COMPLÈTEMENT CORRIGÉE ET AMÉLIORÉE
import { IslamicCharge, IslamicHoliday } from '../types/IslamicCharge';

export class IslamicCalendarService {
  private static readonly HOLIDAYS: IslamicHoliday[] = [
    {
      id: 'ramadan',
      name: 'Ramadan',
      arabicName: 'رمضان',
      description: 'Mois de jeûne et spiritualité',
      hijriMonth: 9,
      hijriDay: 1,
      type: 'obligatory',
      defaultAmount: 0,
      isRecurring: true
    },
    {
      id: 'eid_al_fitr',
      name: 'Aïd al-Fitr',
      arabicName: 'عيد الفطر',
      description: 'Fête de rupture du jeûne',
      hijriMonth: 10,
      hijriDay: 1,
      type: 'obligatory',
      defaultAmount: 100,
      isRecurring: true
    },
    {
      id: 'eid_al_adha',
      name: 'Aïd al-Adha',
      arabicName: 'عيد الأضحى',
      description: 'Fête du sacrifice',
      hijriMonth: 12,
      hijriDay: 10,
      type: 'obligatory',
      defaultAmount: 500,
      isRecurring: true
    },
    {
      id: 'ashura',
      name: 'Achoura',
      arabicName: 'عاشوراء',
      description: 'Jeûne du 10 Muharram',
      hijriMonth: 1,
      hijriDay: 10,
      type: 'recommended',
      defaultAmount: 50,
      isRecurring: true
    },
    {
      id: 'mawlid',
      name: 'Mawlid an-Nabawi',
      arabicName: 'المولد النبوي',
      description: 'Naissance du Prophète',
      hijriMonth: 3,
      hijriDay: 12,
      type: 'recommended',
      defaultAmount: 100,
      isRecurring: true
    }
  ];

  // ✅ CORRECTION : Dates fixes étendues pour les années 2024-2030
  static getGregorianDate(hijriMonth: number, hijriDay: number, year: number): Date {
    // Table de correspondance Hijri → Grégorien pour les années 2024-2030
    const dateMapping: { [key: string]: { [key: number]: string } } = {
      // Muharram 10 (Achoura)
      '1-10': {
        2024: '2024-07-16',
        2025: '2025-07-06',
        2026: '2026-06-25',
        2027: '2027-06-15',
        2028: '2028-06-03',
        2029: '2029-05-23',
        2030: '2030-05-13'
      },
      // Ramadan 1
      '9-1': {
        2024: '2024-03-11',
        2025: '2025-03-01',
        2026: '2026-02-18',
        2027: '2027-02-08',
        2028: '2028-01-28',
        2029: '2029-01-16',
        2030: '2030-01-06'
      },
      // Aïd al-Fitr (Chawwal 1)
      '10-1': {
        2024: '2024-04-10',
        2025: '2025-03-30',
        2026: '2026-03-20',
        2027: '2027-03-09',
        2028: '2028-02-26',
        2029: '2029-02-14',
        2030: '2030-02-04'
      },
      // Aïd al-Adha (Dhou al-hijja 10)
      '12-10': {
        2024: '2024-06-16',
        2025: '2025-06-06',
        2026: '2026-05-27',
        2027: '2027-05-16',
        2028: '2028-05-04',
        2029: '2029-04-24',
        2030: '2030-04-13'
      },
      // Mawlid (Rabi' al-awwal 12)
      '3-12': {
        2024: '2024-09-15',
        2025: '2025-09-05',
        2026: '2026-08-25',
        2027: '2027-08-15',
        2028: '2028-08-03',
        2029: '2029-07-24',
        2030: '2030-07-13'
      }
    };

    const key = `${hijriMonth}-${hijriDay}`;
    
    if (dateMapping[key] && dateMapping[key][year]) {
      const date = new Date(dateMapping[key][year]);
      console.log(`📅 ${year}: Hijri ${hijriMonth}-${hijriDay} → Grégorien: ${date.toLocaleDateString('fr-FR')}`);
      return date;
    }

    // Fallback: date approximative basée sur l'année (méthode de calcul approximative)
    const fallbackDate = this.calculateApproximateDate(hijriMonth, hijriDay, year);
    console.log(`⚠️ Date approximative ${year}: ${hijriMonth}-${hijriDay} → ${fallbackDate.toLocaleDateString('fr-FR')}`);
    return fallbackDate;
  }

  // ✅ NOUVELLE MÉTHODE : Calcul de date approximative
  private static calculateApproximateDate(hijriMonth: number, hijriDay: number, year: number): Date {
    // Conversion approximative Hijri → Grégorien
    // 1 année Hijri = 354.367 jours, 1 année Grégorien = 365.2425 jours
    const hijriEpoch = 227015; // Jours depuis l'époque julienne pour 1 Muharram 1 AH
    const daysPerHijriYear = 354.367;
    const daysPerHijriMonth = 29.53;
    
    const totalHijriDays = (year - 1) * daysPerHijriYear + 
                          (hijriMonth - 1) * daysPerHijriMonth + 
                          hijriDay - 1;
    
    const totalDaysSinceEpoch = hijriEpoch + totalHijriDays;
    const julianDay = totalDaysSinceEpoch + 2440587.5;
    const gregorianDate = new Date((julianDay - 2440587.5) * 86400000);
    
    return gregorianDate;
  }

  // ✅ CORRECTION AMÉLIORÉE : Générer les charges pour l'année spécifique
  static getChargesForYear(year: number): IslamicCharge[] {
    const charges: IslamicCharge[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`🔄 Génération des charges islamiques pour ${year}...`);

    this.HOLIDAYS.forEach(holiday => {
      const calculatedDate = this.getGregorianDate(holiday.hijriMonth, holiday.hijriDay, year);
      
      // ✅ CORRECTION : Inclure les dates passées pour l'année en cours
      // Mais exclure les dates trop anciennes (plus d'un an)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (calculatedDate < oneYearAgo) {
        console.log(`⏭️ Date trop ancienne ignorée (${year}): ${holiday.name} - ${calculatedDate.toLocaleDateString('fr-FR')}`);
        return;
      }
      
      // Créer un IslamicCharge COMPLET avec tous les champs
      const islamicCharge: IslamicCharge = {
        // Propriétés de IslamicHoliday
        id: `${holiday.id}_${year}_${Date.now()}`,
        name: holiday.name,
        arabicName: holiday.arabicName,
        description: holiday.description,
        hijriMonth: holiday.hijriMonth,
        hijriDay: holiday.hijriDay,
        type: holiday.type,
        defaultAmount: holiday.defaultAmount,
        isRecurring: holiday.isRecurring,
        // Propriétés spécifiques à IslamicCharge
        year: year,
        calculatedDate: calculatedDate,
        amount: holiday.defaultAmount || 0,
        isPaid: false,
        paidDate: undefined,
        accountId: undefined,
        autoDeduct: false
      };
      
      charges.push(islamicCharge);
      console.log(`✅ Charge ${year}: ${holiday.name} - ${calculatedDate.toLocaleDateString('fr-FR')} - ${holiday.defaultAmount} MAD`);
    });

    // Trier par date
    charges.sort((a, b) => a.calculatedDate.getTime() - b.calculatedDate.getTime());
    
    console.log(`📅 ${charges.length} charges islamiques générées pour ${year}`);
    
    return charges;
  }

  // ✅ NOUVELLE MÉTHODE : Générer les charges pour l'année courante et suivante
  static getChargesForCurrentAndNextYear(): IslamicCharge[] {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    const currentYearCharges = this.getChargesForYear(currentYear);
    const nextYearCharges = this.getChargesForYear(nextYear);
    
    const allCharges = [...currentYearCharges, ...nextYearCharges];
    
    // Trier toutes les charges par date
    allCharges.sort((a, b) => a.calculatedDate.getTime() - b.calculatedDate.getTime());
    
    console.log(`📅 Total ${allCharges.length} charges générées pour ${currentYear} et ${nextYear}`);
    
    return allCharges;
  }

  // ✅ MÉTHODE AMÉLIORÉE : Générer les charges pour les X prochaines années
  static getChargesForNextYears(yearsCount: number = 3): IslamicCharge[] {
    const currentYear = new Date().getFullYear();
    const allCharges: IslamicCharge[] = [];

    for (let i = 0; i < yearsCount; i++) {
      const year = currentYear + i;
      const yearCharges = this.getChargesForYear(year);
      allCharges.push(...yearCharges);
    }

    // Trier toutes les charges par date
    allCharges.sort((a, b) => a.calculatedDate.getTime() - b.calculatedDate.getTime());
    
    console.log(`📅 Total ${allCharges.length} charges générées pour les ${yearsCount} prochaines années`);
    
    return allCharges;
  }

  // ✅ MÉTHODE : Obtenir toutes les fêtes disponibles
  static getAllHolidays(): IslamicHoliday[] {
    return [...this.HOLIDAYS];
  }

  // ✅ MÉTHODE : Obtenir un jour férié par ID
  static getHolidayById(id: string): IslamicHoliday | undefined {
    return this.HOLIDAYS.find(holiday => holiday.id === id);
  }

  // ✅ MÉTHODE AMÉLIORÉE : Créer une charge islamique pour une année spécifique
  static createIslamicChargeFromHoliday(holiday: IslamicHoliday, year: number, customAmount?: number): IslamicCharge {
    const calculatedDate = this.getGregorianDate(holiday.hijriMonth, holiday.hijriDay, year);
    
    return {
      ...holiday,
      id: `${holiday.id}_${year}_${Date.now()}`,
      year: year,
      calculatedDate: calculatedDate,
      amount: customAmount || holiday.defaultAmount || 0,
      isPaid: false,
      paidDate: undefined,
      accountId: undefined,
      autoDeduct: false
    };
  }

  // ✅ MÉTHODE AMÉLIORÉE : Obtenir les prochaines charges (dans les X jours)
  static getUpcomingCharges(days: number = 365): IslamicCharge[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    // Générer pour les 2 prochaines années pour couvrir la période
    const allCharges = this.getChargesForCurrentAndNextYear();

    const upcomingCharges = allCharges.filter(charge => 
      charge.calculatedDate >= today && charge.calculatedDate <= futureDate
    );

    console.log(`🔮 ${upcomingCharges.length} charges à venir dans les ${days} jours`);
    
    return upcomingCharges;
  }

  // ✅ NOUVELLE MÉTHODE : Obtenir les charges passées non payées
  static getOverdueCharges(): IslamicCharge[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allCharges = this.getChargesForCurrentAndNextYear();
    
    const overdueCharges = allCharges.filter(charge => 
      charge.calculatedDate < today && !charge.isPaid
    );

    console.log(`⏰ ${overdueCharges.length} charges en retard de paiement`);
    
    return overdueCharges;
  }

  // ✅ NOUVELLE MÉTHODE : Obtenir les charges du mois courant
  static getChargesForCurrentMonth(): IslamicCharge[] {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const allCharges = this.getChargesForCurrentAndNextYear();
    
    const currentMonthCharges = allCharges.filter(charge => {
      const chargeDate = charge.calculatedDate;
      return chargeDate.getMonth() === currentMonth && 
             chargeDate.getFullYear() === currentYear;
    });

    console.log(`📆 ${currentMonthCharges.length} charges ce mois-ci`);
    
    return currentMonthCharges;
  }

  // ✅ MÉTHODE : Obtenir le nom du mois hijri
  static getHijriMonthName(month: number): string {
    const months = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban',
      'Ramadan', 'Shawwal', 'Dhu al-Qidah', 'Dhu al-Hijjah'
    ];
    return months[month - 1] || 'Mois inconnu';
  }

  // ✅ NOUVELLE MÉTHODE : Obtenir le nom du mois hijri en arabe
  static getHijriMonthNameArabic(month: number): string {
    const months = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    return months[month - 1] || 'شهر غير معروف';
  }

  // ✅ NOUVELLE MÉTHODE : Vérifier si une date est une fête islamique
  static isIslamicHoliday(date: Date): { isHoliday: boolean; holiday?: IslamicHoliday } {
    const dateString = date.toISOString().split('T')[0];
    
    for (const holiday of this.HOLIDAYS) {
      // Vérifier pour les 2 prochaines années
      for (let year = date.getFullYear(); year <= date.getFullYear() + 1; year++) {
        const holidayDate = this.getGregorianDate(holiday.hijriMonth, holiday.hijriDay, year);
        const holidayDateString = holidayDate.toISOString().split('T')[0];
        
        if (dateString === holidayDateString) {
          return { isHoliday: true, holiday };
        }
      }
    }
    
    return { isHoliday: false };
  }

  // ✅ NOUVELLE MÉTHODE : Ajouter une fête personnalisée
  static addCustomHoliday(holiday: Omit<IslamicHoliday, 'id'>): IslamicHoliday {
    const newHoliday: IslamicHoliday = {
      ...holiday,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.HOLIDAYS.push(newHoliday);
    console.log(`✅ Fête personnalisée ajoutée: ${newHoliday.name}`);
    
    return newHoliday;
  }

  // ✅ NOUVELLE MÉTHODE : Supprimer une fête personnalisée
  static removeCustomHoliday(id: string): boolean {
    const index = this.HOLIDAYS.findIndex(h => h.id === id && h.type === 'custom');
    if (index !== -1) {
      const removed = this.HOLIDAYS.splice(index, 1);
      console.log(`🗑️ Fête personnalisée supprimée: ${removed[0]?.name}`);
      return true;
    }
    return false;
  }

  // ✅ NOUVELLE MÉTHODE : Mettre à jour le montant par défaut d'une fête
  static updateHolidayAmount(holidayId: string, newAmount: number): boolean {
    const holiday = this.HOLIDAYS.find(h => h.id === holidayId);
    if (holiday) {
      const oldAmount = holiday.defaultAmount;
      holiday.defaultAmount = newAmount;
      console.log(`💰 Montant mis à jour pour ${holiday.name}: ${oldAmount} → ${newAmount}`);
      return true;
    }
    return false;
  }

  // ✅ NOUVELLE MÉTHODE : Exporter les données des fêtes
  static exportHolidays(): string {
    return JSON.stringify(this.HOLIDAYS, null, 2);
  }

  // ✅ NOUVELLE MÉTHODE : Importer les données des fêtes
  static importHolidays(data: string): boolean {
    try {
      const importedHolidays = JSON.parse(data);
      if (Array.isArray(importedHolidays)) {
        // Garder les fêtes système et ajouter les personnalisées
        const systemHolidays = this.HOLIDAYS.filter(h => h.type !== 'custom');
        const customHolidays = importedHolidays.filter((h: any) => h.type === 'custom');
        
        this.HOLIDAYS.length = 0;
        this.HOLIDAYS.push(...systemHolidays, ...customHolidays);
        
        console.log(`✅ ${customHolidays.length} fêtes personnalisées importées`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur import fêtes:', error);
      return false;
    }
  }

  // ✅ NOUVELLE MÉTHODE : Obtenir les statistiques des charges
  static getChargesStats(charges: IslamicCharge[]): {
    total: number;
    obligatory: number;
    recommended: number;
    paid: number;
    unpaid: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
  } {
    const obligatoryCharges = charges.filter(c => c.type === 'obligatory');
    const recommendedCharges = charges.filter(c => c.type === 'recommended');
    const paidCharges = charges.filter(c => c.isPaid);
    const unpaidCharges = charges.filter(c => !c.isPaid);

    return {
      total: charges.length,
      obligatory: obligatoryCharges.length,
      recommended: recommendedCharges.length,
      paid: paidCharges.length,
      unpaid: unpaidCharges.length,
      totalAmount: charges.reduce((sum, charge) => sum + charge.amount, 0),
      paidAmount: paidCharges.reduce((sum, charge) => sum + charge.amount, 0),
      unpaidAmount: unpaidCharges.reduce((sum, charge) => sum + charge.amount, 0),
    };
  }
}

export default IslamicCalendarService;
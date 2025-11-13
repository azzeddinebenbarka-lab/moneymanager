// src/services/islamicCalendarService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { IslamicHoliday, IslamicCharge } from '../types/IslamicCharge';

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

  // Conversion Hijri → Grégorien (simplifié)
  static hijriToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
    const gregorianDate = new Date();
    gregorianDate.setFullYear(hijriYear + 579);
    gregorianDate.setMonth(hijriMonth - 1);
    gregorianDate.setDate(hijriDay);
    return gregorianDate;
  }

  // Obtenir les charges pour une année donnée - CORRIGÉE
  static getChargesForYear(year: number): IslamicCharge[] {
    const charges: IslamicCharge[] = [];
    const currentHijriYear = this.getCurrentHijriYear();

    this.HOLIDAYS.forEach(holiday => {
      const calculatedDate = this.hijriToGregorian(currentHijriYear, holiday.hijriMonth, holiday.hijriDay);
      
      // Créer un IslamicCharge COMPLET avec toutes les propriétés
      const islamicCharge: IslamicCharge = {
        // Propriétés de IslamicHoliday
        id: holiday.id,
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
        isPaid: false
      };
      
      charges.push(islamicCharge);
    });

    return charges;
  }

  // Obtenir l'année hijri actuelle
  static getCurrentHijriYear(): number {
    const gregorianYear = new Date().getFullYear();
    return gregorianYear - 579;
  }

  static getAllHolidays(): IslamicHoliday[] {
    return this.HOLIDAYS;
  }

  // Obtenir un jour férié par ID
  static getHolidayById(id: string): IslamicHoliday | undefined {
    return this.HOLIDAYS.find(holiday => holiday.id === id);
  }

  // Créer une charge islamique à partir d'un jour férié
  static createIslamicChargeFromHoliday(holiday: IslamicHoliday, year: number): IslamicCharge {
    const currentHijriYear = this.getCurrentHijriYear();
    const calculatedDate = this.hijriToGregorian(currentHijriYear, holiday.hijriMonth, holiday.hijriDay);
    
    return {
      ...holiday,
      year: year,
      calculatedDate: calculatedDate,
      amount: holiday.defaultAmount || 0,
      isPaid: false
    };
  }
}

export default IslamicCalendarService;
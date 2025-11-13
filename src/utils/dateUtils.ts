// src/utils/dateUtils.ts - VERSION CORRIGÉE AVEC SUPPORT HIJRI
import { IslamicHoliday } from '../types/IslamicCharge';

// Conversion simplifiée Hijri → Grégorien
export const hijriToGregorian = (hijriYear: number, hijriMonth: number, hijriDay: number): Date => {
  // Conversion approximative (à améliorer avec une librairie spécialisée)
  const gregorianYear = hijriYear + 579; // Approximation
  const gregorianDate = new Date(gregorianYear, hijriMonth - 1, hijriDay);
  return gregorianDate;
};

// Obtenir l'année hijri actuelle
export const getCurrentHijriYear = (): number => {
  const gregorianYear = new Date().getFullYear();
  return gregorianYear - 579; // Approximation
};

// Calculer la date grégorienne pour un jour férié islamique
export const calculateIslamicHolidayDate = (holiday: IslamicHoliday, year?: number): Date => {
  const hijriYear = year || getCurrentHijriYear();
  return hijriToGregorian(hijriYear, holiday.hijriMonth, holiday.hijriDay);
};

// Formater une date pour l'affichage
export const formatDate = (date: Date, locale: string = 'fr-FR'): string => {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Formater une date avec l'heure
export const formatDateTime = (date: Date, locale: string = 'fr-FR'): string => {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Obtenir le nombre de jours entre deux dates
export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Vérifier si une date est aujourd'hui
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Vérifier si une date est dans le futur
export const isFutureDate = (date: Date): boolean => {
  return date.getTime() > new Date().getTime();
};

// Vérifier si une date est dans le passé
export const isPastDate = (date: Date): boolean => {
  return date.getTime() < new Date().getTime();
};

// Ajouter des jours à une date
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Ajouter des mois à une date
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Ajouter des années à une date
export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// Obtenir le premier jour du mois
export const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Obtenir le dernier jour du mois
export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Formater pour SQLite (ISO string)
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Parser depuis SQLite
export const fromISODateString = (isoString: string): Date => {
  return new Date(isoString);
};

export default {
  hijriToGregorian,
  getCurrentHijriYear,
  calculateIslamicHolidayDate,
  formatDate,
  formatDateTime,
  getDaysBetween,
  isToday,
  isFutureDate,
  isPastDate,
  addDays,
  addMonths,
  addYears,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  toISODateString,
  fromISODateString
};
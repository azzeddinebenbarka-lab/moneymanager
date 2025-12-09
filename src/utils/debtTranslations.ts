import { Translations } from '../i18n/translations';
import { Debt, DebtCategory, DebtType } from '../types/Debt';

/**
 * Get the translated label for a debt type
 */
export const getDebtTypeLabel = (type: DebtType, t: Translations): string => {
  const typeMap: Record<DebtType, keyof Translations> = {
    personal: 'debtTypePersonal',
    consumer_credit: 'debtTypeConsumerCredit',
    revolving_credit: 'debtTypeRevolvingCredit',
    car_loan: 'debtTypeCarLoan',
    mortgage: 'debtTypeMortgage',
    student_loan: 'debtTypeStudentLoan',
    overdraft: 'debtTypeOverdraft',
    tax_debt: 'debtTypeTaxDebt',
    social_debt: 'debtTypeSocialDebt',
    supplier_debt: 'debtTypeSupplierDebt',
    family_debt: 'debtTypeFamilyDebt',
    microcredit: 'debtTypeMicrocredit',
    professional_debt: 'debtTypeProfessionalDebt',
    peer_to_peer: 'debtTypePeerToPeer',
    judicial_debt: 'debtTypeJudicialDebt',
    other: 'debtTypeOther',
  };

  const key = typeMap[type];
  return t[key] || type;
};

/**
 * Get the translated label for a debt category
 */
export const getDebtCategoryLabel = (category: DebtCategory, t: Translations): string => {
  const categoryMap: Record<DebtCategory, keyof Translations> = {
    housing: 'debtCategoryHousing',
    transport: 'debtCategoryTransport',
    education: 'debtCategoryEducation',
    consumption: 'debtCategoryConsumption',
    emergency: 'debtCategoryEmergency',
    professional: 'debtCategoryProfessional',
    family: 'debtCategoryFamily',
    administrative: 'debtCategoryAdministrative',
  };

  const key = categoryMap[category];
  return t[key] || category;
};

/**
 * Get the translated label for a debt status
 */
export const getDebtStatusLabel = (status: Debt['status'], t: Translations): string => {
  const statusMap: Record<Debt['status'], keyof Translations> = {
    active: 'debtStatusActive',
    overdue: 'debtStatusOverdue',
    paid: 'debtStatusPaid',
    future: 'debtStatusFuture',
  };

  const key = statusMap[status];
  return t[key] || status;
};

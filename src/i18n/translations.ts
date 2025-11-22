// src/i18n/translations.ts
export interface Translations {
  // Navigation
  dashboard: string;
  transactions: string;
  accounts: string;
  budgets: string;
  categories: string;
  savings: string;
  debts: string;
  reports: string;
  settings: string;
  profile: string;
  
  // Actions communes
  add: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  confirm: string;
  search: string;
  filter: string;
  export: string;
  import: string;
  refresh: string;
  
  // Dashboard
  totalBalance: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  recentTransactions: string;
  viewAll: string;
  
  // Transactions
  newTransaction: string;
  income: string;
  expense: string;
  transfer: string;
  amount: string;
  description: string;
  date: string;
  category: string;
  account: string;
  
  // Comptes
  myAccounts: string;
  addAccount: string;
  accountName: string;
  balance: string;
  
  // Budgets
  myBudgets: string;
  createBudget: string;
  spent: string;
  remaining: string;
  
  // Catégories
  myCategories: string;
  addCategory: string;
  parentCategory: string;
  subCategory: string;
  
  // Épargne
  savingsGoals: string;
  goalName: string;
  targetAmount: string;
  currentAmount: string;
  progress: string;
  
  // Dettes
  myDebts: string;
  debtName: string;
  totalDebt: string;
  remainingDebt: string;
  monthlyPayment: string;
  
  // Paramètres
  generalSettings: string;
  language: string;
  theme: string;
  currency: string;
  security: string;
  backup: string;
  
  // Messages
  success: string;
  error: string;
  loading: string;
  noData: string;
  confirmDelete: string;
  
  // Calendrier
  calendar: string;
  expenseCalendar: string;
  monthView: string;
  annualCharges: string;
}

export const translations: Record<'fr' | 'en' | 'ar', Translations> = {
  fr: {
    // Navigation
    dashboard: 'Tableau de Bord',
    transactions: 'Transactions',
    accounts: 'Comptes',
    budgets: 'Budgets',
    categories: 'Catégories',
    savings: 'Épargne',
    debts: 'Dettes',
    reports: 'Rapports',
    settings: 'Paramètres',
    profile: 'Profil',
    
    // Actions communes
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    refresh: 'Actualiser',
    
    // Dashboard
    totalBalance: 'Solde Total',
    monthlyIncome: 'Revenus du Mois',
    monthlyExpenses: 'Dépenses du Mois',
    recentTransactions: 'Transactions Récentes',
    viewAll: 'Voir Tout',
    
    // Transactions
    newTransaction: 'Nouvelle Transaction',
    income: 'Revenu',
    expense: 'Dépense',
    transfer: 'Transfert',
    amount: 'Montant',
    description: 'Description',
    date: 'Date',
    category: 'Catégorie',
    account: 'Compte',
    
    // Comptes
    myAccounts: 'Mes Comptes',
    addAccount: 'Ajouter un Compte',
    accountName: 'Nom du Compte',
    balance: 'Solde',
    
    // Budgets
    myBudgets: 'Mes Budgets',
    createBudget: 'Créer un Budget',
    spent: 'Dépensé',
    remaining: 'Restant',
    
    // Catégories
    myCategories: 'Mes Catégories',
    addCategory: 'Ajouter une Catégorie',
    parentCategory: 'Catégorie Parente',
    subCategory: 'Sous-catégorie',
    
    // Épargne
    savingsGoals: 'Objectifs d\'Épargne',
    goalName: 'Nom de l\'Objectif',
    targetAmount: 'Montant Cible',
    currentAmount: 'Montant Actuel',
    progress: 'Progression',
    
    // Dettes
    myDebts: 'Mes Dettes',
    debtName: 'Nom de la Dette',
    totalDebt: 'Dette Totale',
    remainingDebt: 'Reste à Payer',
    monthlyPayment: 'Paiement Mensuel',
    
    // Paramètres
    generalSettings: 'Paramètres Généraux',
    language: 'Langue',
    theme: 'Thème',
    currency: 'Devise',
    security: 'Sécurité',
    backup: 'Sauvegarde',
    
    // Messages
    success: 'Succès',
    error: 'Erreur',
    loading: 'Chargement...',
    noData: 'Aucune donnée',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ?',
    
    // Calendrier
    calendar: 'Calendrier',
    expenseCalendar: 'Calendrier des Dépenses',
    monthView: 'Vue par Mois',
    annualCharges: 'Charges Annuelles',
  },
  
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    accounts: 'Accounts',
    budgets: 'Budgets',
    categories: 'Categories',
    savings: 'Savings',
    debts: 'Debts',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'Profile',
    
    // Common actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    
    // Dashboard
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    
    // Transactions
    newTransaction: 'New Transaction',
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
    amount: 'Amount',
    description: 'Description',
    date: 'Date',
    category: 'Category',
    account: 'Account',
    
    // Accounts
    myAccounts: 'My Accounts',
    addAccount: 'Add Account',
    accountName: 'Account Name',
    balance: 'Balance',
    
    // Budgets
    myBudgets: 'My Budgets',
    createBudget: 'Create Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    
    // Categories
    myCategories: 'My Categories',
    addCategory: 'Add Category',
    parentCategory: 'Parent Category',
    subCategory: 'Sub-category',
    
    // Savings
    savingsGoals: 'Savings Goals',
    goalName: 'Goal Name',
    targetAmount: 'Target Amount',
    currentAmount: 'Current Amount',
    progress: 'Progress',
    
    // Debts
    myDebts: 'My Debts',
    debtName: 'Debt Name',
    totalDebt: 'Total Debt',
    remainingDebt: 'Remaining Debt',
    monthlyPayment: 'Monthly Payment',
    
    // Settings
    generalSettings: 'General Settings',
    language: 'Language',
    theme: 'Theme',
    currency: 'Currency',
    security: 'Security',
    backup: 'Backup',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    noData: 'No data',
    confirmDelete: 'Are you sure you want to delete?',
    
    // Calendar
    calendar: 'Calendar',
    expenseCalendar: 'Expense Calendar',
    monthView: 'Month View',
    annualCharges: 'Annual Charges',
  },
  
  ar: {
    // التنقل
    dashboard: 'لوحة التحكم',
    transactions: 'المعاملات',
    accounts: 'الحسابات',
    budgets: 'الميزانيات',
    categories: 'الفئات',
    savings: 'المدخرات',
    debts: 'الديون',
    reports: 'التقارير',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    
    // إجراءات شائعة
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    import: 'استيراد',
    refresh: 'تحديث',
    
    // لوحة التحكم
    totalBalance: 'الرصيد الإجمالي',
    monthlyIncome: 'الدخل الشهري',
    monthlyExpenses: 'المصروفات الشهرية',
    recentTransactions: 'المعاملات الأخيرة',
    viewAll: 'عرض الكل',
    
    // المعاملات
    newTransaction: 'معاملة جديدة',
    income: 'دخل',
    expense: 'مصروف',
    transfer: 'تحويل',
    amount: 'المبلغ',
    description: 'الوصف',
    date: 'التاريخ',
    category: 'الفئة',
    account: 'الحساب',
    
    // الحسابات
    myAccounts: 'حساباتي',
    addAccount: 'إضافة حساب',
    accountName: 'اسم الحساب',
    balance: 'الرصيد',
    
    // الميزانيات
    myBudgets: 'ميزانياتي',
    createBudget: 'إنشاء ميزانية',
    spent: 'المنفق',
    remaining: 'المتبقي',
    
    // الفئات
    myCategories: 'فئاتي',
    addCategory: 'إضافة فئة',
    parentCategory: 'الفئة الرئيسية',
    subCategory: 'الفئة الفرعية',
    
    // المدخرات
    savingsGoals: 'أهداف الادخار',
    goalName: 'اسم الهدف',
    targetAmount: 'المبلغ المستهدف',
    currentAmount: 'المبلغ الحالي',
    progress: 'التقدم',
    
    // الديون
    myDebts: 'ديوني',
    debtName: 'اسم الدين',
    totalDebt: 'إجمالي الدين',
    remainingDebt: 'المتبقي للسداد',
    monthlyPayment: 'الدفعة الشهرية',
    
    // الإعدادات
    generalSettings: 'الإعدادات العامة',
    language: 'اللغة',
    theme: 'المظهر',
    currency: 'العملة',
    security: 'الأمان',
    backup: 'النسخ الاحتياطي',
    
    // الرسائل
    success: 'نجح',
    error: 'خطأ',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    
    // التقويم
    calendar: 'التقويم',
    expenseCalendar: 'تقويم المصروفات',
    monthView: 'عرض شهري',
    annualCharges: 'الرسوم السنوية',
  },
};

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
  saving: string;
  modifying: string;
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
  newRecurringTransaction: string;
  deleteTransaction: string;
  income: string;
  expense: string;
  transfer: string;
  amount: string;
  description: string;
  date: string;
  category: string;
  account: string;
  all: string;
  incomes: string;
  expenses: string;
  
  // Comptes
  myAccounts: string;
  addAccount: string;
  accountName: string;
  balance: string;
  cash: string;
  bank: string;
  card: string;
  
  // Budgets
  myBudgets: string;
  createBudget: string;
  spent: string;
  remaining: string;
  
  // Catégories
  myCategories: string;
  addCategory: string;
  editCategory: string;
  deleteCategory: string;
  newCategory: string;
  newMainCategory: string;
  parentCategory: string;
  subCategory: string;
  
  // Épargne
  savingsGoals: string;
  newSavingsGoal: string;
  editSavingsGoal: string;
  deleteSavingsGoal: string;
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
  calendarExpenses: string;
  
  // Dashboard supplémentaire
  noDataThisMonth: string;
  netWorth: string;
  recentActivity: string;
  quickActions: string;
  transaction: string;
  budget: string;
  annualCharge: string;
  addTransaction: string;
  addBudget: string;
  addAnnualCharge: string;
  addSavings: string;
  addDebt: string;
  alerts: string;
  currencies: string;
  islamicCharges: string;
  categoryAnalysis: string;
  // New screens
  insights: string;
  insightOfTheDay: string;
  habitAnalysis: string;
  suggestions: string;
  financialScore: string;
  searchPlaceholder: string;
  recentSearches: string;
  startTypingToSearch: string;
  recurringTransactions: string;
  monthlyTotal: string;
  monthlySubscriptions: string;
  addSubscription: string;
  nextCharge: string;
  
  // Traductions supplémentaires
  welcome: string;
  financialHealth: string;
  score: string;
  assets: string;
  liabilities: string;
  revenue: string;
  debt: string;
  deficit: string;
  
  // Boutons et actions supplémentaires
  back: string;
  next: string;
  done: string;
  close: string;
  select: string;
  selectAll: string;
  reset: string;
  apply: string;
  details: string;
  
  // Titres d'écrans
  allTransactions: string;
  myBudget: string;
  myGoals: string;
  notification: string;
  
  // Messages et états
  emptyState: string;
  noTransactions: string;
  noBudgets: string;
  noCategories: string;
  noGoals: string;
  noDebts: string;
  
  // Formulaires
  name: string;
  type: string;
  color: string;
  icon: string;
  notes: string;
  dueDate: string;
  startDate: string;
  endDate: string;
  
  // Statistiques
  total: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  custom: string;
  
  // Temps
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
  
  // Statuts
  active: string;
  inactive: string;
  completed: string;
  pending: string;
  paid: string;
  unpaid: string;
  
  // Mois
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  
  // Formulaires et champs supplémentaires
  selectAccount: string;
  selectCategory: string;
  enterAmount: string;
  enterDescription: string;
  selectDate: string;
  recurring: string;
  frequency: string;
  endDateOptional: string;
  editTransaction: string;
  general: string;
  notifications: string;
  about: string;
  version: string;
  help: string;
  terms: string;
  password: string;
  biometric: string;
  pinCode: string;
  pushNotifications: string;
  backupAndRestore: string;
  user: string;

  // Authentification
  login: string;
  register: string;
  logout: string;
  email: string;
  confirmPassword: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  createAccount: string;
  signIn: string;
  signUp: string;
  fullName: string;
  country: string;
  selectCountry: string;
  searchCountry: string;
  noCountryFound: string;
  
  // Messages d'authentification
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordsNotMatch: string;
  nameRequired: string;
  countryRequired: string;
  loginSuccess: string;
  registerSuccess: string;
  loginError: string;
  registerError: string;
  
  // Onboarding
  welcomeTitle: string;
  welcomeDescription: string;
  trackExpensesTitle: string;
  trackExpensesDescription: string;
  budgetSavingsTitle: string;
  budgetSavingsDescription: string;
  statisticsTitle: string;
  statisticsDescription: string;
  getStarted: string;
  skip: string;
  
  // Messages communs
  memberSince: string;
  areYouSure: string;
  logoutConfirm: string;
  deleteConfirm: string;
  cannotPerformAction: string;
  actionSuccess: string;
  actionFailed: string;
  creating: string;
  adding: string;
  deleting: string;
  create: string;
  
  // Status de santé financière
  excellent: string;
  good: string;
  fair: string;
  poor: string;
  critical: string;
  unknown: string;
  average: string;
  needsImprovement: string;
  financialHealthExcellent: string;
  financialHealthGood: string;
  financialHealthAverage: string;
  
  // Sections Dashboard
  seeMore: string;
  seeAll: string;
  dashboardUpdated: string;
  upcomingAnnualCharges: string;
  financialOverview: string;
  
  // Catégories spéciales
  debtPayment: string;
  savingsRefund: string;
  
  // Page Transactions
  noTransaction: string;
  noTransactionFound: string;
  loadingTransactions: string;
  transactionPlural: string;
  
  // Page Budgets
  manageLimits: string;
  usage: string;
  activeBudgets: string;
  inactiveBudgets: string;
  loadingBudgets: string;
  retry: string;
  createFirstBudget: string;
  
  // Page Catégories
  subcategory: string;
  loadingCategories: string;
  searchCategory: string;
  expensesPlural: string;
  mainCategory: string;
  preview: string;
  resetCategories: string;
  resetCategoriesConfirm: string;
  resetCategoriesButton: string;
  resetCategoriesSuccess: string;
  resetCategoriesError: string;
  categoriesInstalled: string;
  
  // Charges Annuelles
  allCharges: string;
  upcoming: string;
  addCharge: string;
  annualBudget: string;
  totalCharges: string;
  paidCharges: string;
  remainingCharges: string;
  noCharge: string;
  addFirstCharge: string;
  noPendingCharges: string;
  noPaidCharges: string;
  noUpcomingCharges: string;
  allChargesList: string;
  pendingChargesList: string;
  paidChargesList: string;
  upcomingChargesList: string;
  autoDeduct: string;
  autoDeductEnabled: string;
  autoDeductDisabled: string;
  autoDeductError: string;
  deleteCharge: string;
  deleteChargeConfirm: string;
  deleteChargeError: string;
  annual: string;
  chargesHint: string;
  
  // Épargne et Objectifs
  goals: string;
  totalSaved: string;
  noSavingsGoal: string;
  createFirstGoal: string;
  createGoal: string;
  target: string;
  currentSavings: string;
  linkedSavingsAccount: string;
  addContribution: string;
  markCompleted: string;
  goalMarkedCompleted: string;
  goalDeletedSuccess: string;
  goalDeletedWithRefund: string;
  contributionAdded: string;
  loadingSavingsGoals: string;
  fetchingGoals: string;
  processingAction: string;
  goalDetails: string;
  contributionHistory: string;
  addAction: string;
  modifyAction: string;
  deleteSavingsGoalConfirm: string;
  goalNotFound: string;
  cannotLoadGoal: string;
  cannotAddContribution: string;
  cannotDeleteGoal: string;
  deleteConfirmMessage: string;
  contribution: string;
  
  // Détails objectifs - labels supplémentaires
  on: string;
  saved: string;
  expectedDate: string;
  timeRemaining: string;
  year: string;
  month: string;
  lessThanMonth: string;
  monthlyProgress: string;
  congratulations: string;
  goalAchievedOn: string;
  noContribution: string;
  addFirstContribution: string;
  addedOn: string;
  totalContributed: string;
  numberOfContributions: string;
  averagePerContribution: string;
  vacation: string;
  emergency: string;
  house: string;
  car: string;
  education: string;
  retirement: string;
  other: string;
  
  // Modal ajout contribution
  sourceAccount: string;
  selectSourceAccount: string;
  selectSavingsAccount: string;
  enterValidAmount: string;
  insufficientBalance: string;
  balanceOf: string;
  is: string;
  cannotTransfer: string;
  warning: string;
  contributionExceedsGoal: string;
  continueQuestion: string;
  destinationSavingsAccount: string;
  noAccountWithBalance: string;
  noSavingsAccount: string;
  customAmount: string;
  amountToTransfer: string;
  from: string;
  to: string;
  newTotal: string;
  goalWillBeReached: string;
  canceling: string;
  transferring: string;
  
  // Page Dettes
  totalDebts: string;
  activeDebts: string;
  debtsInProgress: string;
  allDebts: string;
  actives: string;
  overdue: string;
  futures: string;
  paidDebts: string;
  noDebtFound: string;
  debtActive: string;
  debtOverdue: string;
  debtPaid: string;
  debtFuture: string;
  paidAmount: string;
  
  // Alertes et formulaires dettes
  debtModifiedSuccess: string;
  cannotModifyDebt: string;
  modifyDebt: string;
  debtType: string;
  debtStartDate: string;
  cannotLoadDebtData: string;
  deleteDebt: string;
  deleteDebtConfirm: string;
  cannotDeleteDebt: string;
  debtDetails: string;
  deletionIrreversible: string;
  paymentSuccess: string;
  cannotMakePayment: string;
  fillAllFields: string;
  selectPaymentAccount: string;
  initialAmountPositive: string;
  currentAmountPositive: string;
  monthlyPaymentPositive: string;
  currentCannotExceedInitial: string;
  invalidAmount: string;
  amountCannotExceedBalance: string;
  debtAlreadyPaid: string;
  remainingBalance: string;
  nextPayment: string;
  actions: string;
  pay: string;
  modify: string;
  information: string;
  automaticPayment: string;
  creditorName: string;
  enabled: string;
  disabled: string;
  paymentAccount: string;
  unknownAccount: string;
  paymentDay: string;
  dayOfEachMonth: string;
  paymentHistory: string;
  noPaymentRecorded: string;
  principal: string;
  interest: string;
  dangerZone: string;
  makePayment: string;
  amountToPay: string;
  remainingBalanceLabel: string;
  noAccountSufficientBalance: string;
  available: string;
  paying: string;
  newDebt: string;
  debtAddedSuccess: string;
  cannotAddDebt: string;
  monthlyPaymentCannotExceedInitial: string;
  reimbursed: string;
  nonePaid: string;
  baseInformation: string;
  typeAndCategory: string;
  financialDetails: string;
  paymentOptions: string;
  interestRate: string;
  selectAccountForAutoPay: string;
  dayOfMonthForPayment: string;
  automaticPaymentOnDay: string;
  automaticPaymentStart: string;
  nextMonthRecommended: string;
  firstDebitOn: string;
  asapPayment: string;
  ifDueDatePassedImmediate: string;
  noAccountAvailable: string;
  createAccountFirst: string;
  dueDateFirstPayment: string;
  firstPaymentNextMonth: string;
  firstPaymentAsap: string;
  
  // Types de dettes
  debtTypePersonal: string;
  debtTypeConsumerCredit: string;
  debtTypeRevolvingCredit: string;
  debtTypeCarLoan: string;
  debtTypeMortgage: string;
  debtTypeStudentLoan: string;
  debtTypeOverdraft: string;
  debtTypeTaxDebt: string;
  debtTypeSocialDebt: string;
  debtTypeSupplierDebt: string;
  debtTypeFamilyDebt: string;
  debtTypeMicrocredit: string;
  debtTypeProfessionalDebt: string;
  debtTypePeerToPeer: string;
  debtTypeJudicialDebt: string;
  debtTypeOther: string;
  
  // Catégories de dettes
  debtCategoryHousing: string;
  debtCategoryTransport: string;
  debtCategoryEducation: string;
  debtCategoryConsumption: string;
  debtCategoryEmergency: string;
  debtCategoryProfessional: string;
  debtCategoryFamily: string;
  debtCategoryAdministrative: string;
  
  // Statuts de dettes
  debtStatusActive: string;
  debtStatusOverdue: string;
  debtStatusPaid: string;
  debtStatusFuture: string;
  
  // Vue par mois
  period: string;
  advancedFilters: string;
  transactionType: string;
  revenues: string;
  yesterday: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  selectYear: string;
  summary: string;
  annualFinancialPerformance: string;
  annualBalance: string;
  savingsRate: string;
  noDataFor: string;
  transactionsWillAppearHere: string;
  startTracking: string;
  monthlyAnalysis: string;
  monthByMonthDetails: string;
  months: string;
  loadingData: string;
  analyzingMonthlyTransactions: string;
  monthsOverview: string;
  currentMonth: string;
  positive: string;
  negative: string;
  balanced: string;
  ofIncome: string;
  noIncome: string;
  transactionSingular: string;
  monthBalance: string;
  filterTransactions: string;
  detailedExpenses: string;
  noTransactionsThisMonth: string;
  addFirstTransaction: string;
  monthDetail: string;
  only: string;
  noTransactionFor: string;
  incomeTransactionFor: string;
  expenseTransactionFor: string;
  
  // Rapports
  min: string;
  max: string;
  resetFilters: string;
  recommendations: string;
  visualizations: string;
  expensesByCategory: string;
  expensesDistribution: string;
  expensesEvolution: string;
  loadingReports: string;
  noFinancialData: string;
  addTransactionsToSeeReports: string;
  noCategoryData: string;
  noMonthlyData: string;
  monthlyTrends: string;
  monthlySummary: string;
  annualSummary: string;
  categoryAnalysisTitle: string;
  topCategories: string;
  incomeVsExpenses: string;
  evolutionChart: string;
  distribution: string;
  threeMonths: string;
  sixMonths: string;
  monthlyEvolution: string;
  noDataAvailable: string;
  monthlyComparison: string;
  trendsAndForecasts: string;
  monthlyAverage: string;
  basedOnLast: string;
  lastMonths: string;
  forecastJanuary: string;
  vsPrevious: string;
  trendUp: string;
  trendDown: string;
  recommendation: string;
  expensesIncreasing: string;
  expensesDecreasing: string;
  
  // Notifications
  allNotifications: string;
  unread: string;
  unreadNotifications: string;
  noNotifications: string;
  markAllAsRead: string;
  agoMin: string;
  agoHours: string;
  days: string;
  allNotificationsRead: string;
  noNotificationsYet: string;
  
  // Paramètres
  preferences: string;
  securitySettings: string;
  support: string;
  personalInfo: string;
  currencyLanguageTheme: string;
  notificationManagement: string;
  passwordBiometrics: string;
  backupRestore: string;
  versionHelp: string;
  notConnected: string;
  userRole: string;
  
  // Profil
  activeAccounts: string;
  modifyEmail: string;
  changePassword: string;
  backupExport: string;
  logoutAction: string;
  
  // Modals
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  currentPasswordRequired: string;
  newPasswordRequired: string;
  atLeast6Chars: string;
  confirmationRequired: string;
  passwordsDoNotMatch: string;
  passwordChangedSuccess: string;
  cannotChangePassword: string;
  repeatPassword: string;
  currentEmail: string;
  newEmail: string;
  confirmWithPassword: string;
  invalidEmailFormat: string;
  sameAsCurrentEmail: string;
  emailChangedSuccess: string;
  cannotChangeEmail: string;
  
  // Backup
  autoBackupTitle: string;
  dailyAutoBackup: string;
  lastBackup: string;
  never: string;
  createBackup: string;
  completeBackupAllData: string;
  exportJSON: string;
  structuredFormatReimport: string;
  exportCSV: string;
  exportTransactionsCSV: string;
  importData: string;
  replaceCurrentData: string;
  importSuccess: string;
  protectFinancialData: string;
  autoBackupEnabledMessage: string;
  createBackupQuestion: string;
  createAction: string;
  backupCreated: string;
  exportJSONQuestion: string;
  includesData: string;
  exportAction: string;
  exportCSVQuestion: string;
  importDataQuestion: string;
  importCompleted: string;
  
  // GeneralSettings
  mainCurrency: string;
  appearance: string;
  light: string;
  dark: string;
  maintenance: string;
  cleanDuplicates: string;
  cleanDuplicatesQuestion: string;
  cleanDuplicatesDesc: string;
  cleaning: string;
  finished: string;
  duplicatesDeleted: string;
  cannotCleanDuplicates: string;
  
  // NotificationSettings
  notificationPreferences: string;
  transactionsNotif: string;
  budgetAlerts: string;
  debtReminders: string;
  savingsGoalsNotif: string;
  reportsNotif: string;
  soundEnabled: string;
  vibrationEnabled: string;
  badgeEnabled: string;
  testNotification: string;
  testNotificationTitle: string;
  testNotificationBody: string;
  testSuccess: string;
  notificationSent: string;
  clearAllNotifications: string;
  clearNotificationsQuestion: string;
  allNotificationsCleared: string;
  scheduleDailyReminder: string;
  dailyReminderScheduled: string;
  dailyReminderMessage: string;
  viewScheduled: string;
  scheduledNotifications: string;
  notificationSettings: string;
  activityNotifications: string;
  displayOptions: string;
  noScheduledNotifications: string;
  enableNotifications: string;
  receiveNotifications: string;
  playSound: string;
  vibrateForNotifications: string;
  showBadgeIcon: string;
  transactionChanges: string;
  budgetExceeded: string;
  upcomingPayments: string;
  progressAchieved: string;
  monthlyStats: string;
  notificationsDisabled: string;
  enableInSettings: string;
  loadingSettings: string;
  pushNotifWork: string;
  locallyStored: string;
  
  // SecuritySettings
  biometricAuth: string;
  enableBiometric: string;
  protectWithBiometric: string;
  notAvailableDevice: string;
  autoLock: string;
  autoLockDesc: string;
  lockDelay: string;
  immediate: string;
  oneMinute: string;
  fiveMinutes: string;
  fifteenMinutes: string;
  thirtyMinutes: string;
  oneHour: string;
  securityEnabled: string;
  biometricEnabledMessage: string;
  cannotEnableSecurity: string;
  cannotModifyAutoLock: string;
  cannotModifyDelay: string;
  lockDelayQuestion: string;
  afterImmediate: string;
  afterOneMinute: string;
  afterXMinutes: string;
  afterOneHour: string;
  
  // AboutScreen
  helpSupport: string;
  getHelp: string;
  termsOfService: string;
  readTerms: string;
  privacyPolicy: string;
  dataProtection: string;
  comingSoon: string;
  appInfo: string;
  manageFinancesSmartly: string;
  madeWithLove: string;
  
  // Noms des catégories - Revenus
  cat_salary: string;
  cat_secondary_income: string;
  cat_net_salary: string;
  cat_bonus: string;
  cat_freelance: string;
  cat_commerce: string;
  cat_commissions: string;
  
  // Noms des catégories - Logement
  cat_housing: string;
  cat_rent: string;
  cat_electricity: string;
  cat_water: string;
  cat_internet: string;
  cat_syndic: string;
  
  // Noms des catégories - Nourriture
  cat_food: string;
  cat_groceries: string;
  cat_vegetables: string;
  cat_meat: string;
  cat_cleaning_products: string;
  
  // Noms des catégories - Transport
  cat_transport: string;
  cat_fuel: string;
  cat_maintenance: string;
  cat_insurance: string;
  cat_wash: string;
  cat_parking: string;
  
  // Noms des catégories - Santé
  cat_health: string;
  cat_pharmacy: string;
  cat_consultation: string;
  cat_health_insurance: string;
  
  // Noms des catégories - Enfant
  cat_child: string;
  cat_child_food: string;
  cat_hygiene: string;
  cat_school: string;
  cat_leisure: string;
  
  // Noms des catégories - Abonnements
  cat_subscriptions: string;
  cat_phone: string;
  cat_apps: string;
  cat_streaming: string;
  
  // Noms des catégories - Personnel
  cat_personal: string;
  cat_clothes: string;
  cat_haircut: string;
  cat_perfume: string;
  cat_outings: string;
  
  // Noms des catégories - Maison
  cat_house: string;
  cat_kitchen: string;
  cat_decoration: string;
  cat_tools: string;
  
  // Noms des catégories - Divers
  cat_misc: string;
  cat_gifts: string;
  cat_family_help: string;
  cat_unexpected: string;
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
    saving: 'Enregistrement...',
    modifying: 'Modification...',
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
    newRecurringTransaction: 'Nouvelle Transaction Récurrente',
    deleteTransaction: 'Supprimer la transaction',
    income: 'Revenu',
    expense: 'Dépense',
    transfer: 'Transfert',
    amount: 'Montant',
    description: 'Description',
    date: 'Date',
    category: 'Catégorie',
    account: 'Compte',
    all: 'Toutes',
    incomes: 'Revenus',
    expenses: 'Dépenses',
    
    // Comptes
    myAccounts: 'Mes Comptes',
    addAccount: 'Ajouter un Compte',
    accountName: 'Nom du Compte',
    balance: 'Solde',
    cash: 'Espèces',
    bank: 'Banque',
    card: 'Carte',
    
    // Budgets
    myBudgets: 'Mes Budgets',
    createBudget: 'Créer un Budget',
    spent: 'Dépensé',
    remaining: 'Restant',
    
    // Catégories
    myCategories: 'Mes Catégories',
    addCategory: 'Ajouter une Catégorie',
    editCategory: 'Modifier la catégorie',
    deleteCategory: 'Supprimer la catégorie',
    newCategory: 'Nouvelle catégorie',
    newMainCategory: 'Nouvelle catégorie principale',
    parentCategory: 'Catégorie Parente',
    subCategory: 'Sous-catégorie',
    
    // Épargne
    savingsGoals: 'Objectifs d\'Épargne',
    newSavingsGoal: 'Nouvel objectif d\'épargne',
    editSavingsGoal: 'Modifier l\'objectif',
    deleteSavingsGoal: 'Supprimer l\'objectif',
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
    calendarExpenses: 'Calendrier Dépenses',
    
    // Dashboard supplémentaire
    noDataThisMonth: 'Aucune donnée ce mois',
    netWorth: 'Patrimoine Net',
    recentActivity: 'Activité Récente',
    quickActions: 'Actions Rapides',
    transaction: 'Transaction',
    budget: 'Budget',
    annualCharge: 'Charge Annuelle',
    addTransaction: 'Ajouter Transaction',
    addBudget: 'Ajouter Budget',
    addAnnualCharge: 'Ajouter Charge',
    addSavings: 'Ajouter Épargne',
    addDebt: 'Ajouter Dette',
    alerts: 'Alertes',
    currencies: 'Devises',
    islamicCharges: 'Charges Islamiques',
    categoryAnalysis: 'Analyse par Catégorie',
    // Nouveaux écrans
    insights: 'Conseils & Insights',
    insightOfTheDay: 'Conseil du jour',
    habitAnalysis: 'Analyse de vos habitudes',
    suggestions: 'Suggestions d\'économies',
    financialScore: 'Votre score financier',
    searchPlaceholder: 'Rechercher une transaction, catégorie...',
    recentSearches: 'Recherches récentes',
    startTypingToSearch: 'Commencez à taper pour rechercher',
    recurringTransactions: 'Transactions Récurrentes',
    monthlyTotal: 'Total mensuel',
    monthlySubscriptions: 'Abonnements mensuels',
    addSubscription: '+ Ajouter un abonnement',
    nextCharge: 'Prochain prélèvement :',
    
    // Traductions supplémentaires
    welcome: 'Bienvenue',
    financialHealth: 'Santé Financière',
    score: 'Score',
    assets: 'Actifs',
    liabilities: 'Passifs',
    revenue: 'Revenus',
    debt: 'Dette',
    deficit: 'Déficit',
    
    // Boutons et actions supplémentaires
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé',
    close: 'Fermer',
    select: 'Sélectionner',
    selectAll: 'Tout sélectionner',
    reset: 'Réinitialiser',
    apply: 'Appliquer',
    details: 'Détails',
    
    // Titres d'écrans
    allTransactions: 'Toutes les Transactions',
    myBudget: 'Mon Budget',
    myGoals: 'Mes Objectifs',
    notification: 'Notifications',
    
    // Messages et états
    emptyState: 'Aucun élément',
    noTransactions: 'Aucune transaction',
    noBudgets: 'Aucun budget',
    noCategories: 'Aucune catégorie',
    noGoals: 'Aucun objectif',
    noDebts: 'Aucune dette',
    
    // Formulaires
    name: 'Nom',
    type: 'Type',
    color: 'Couleur',
    icon: 'Icône',
    notes: 'Notes',
    dueDate: 'Date d\'échéance',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    
    // Statistiques
    total: 'Total',
    today: 'Aujourd\'hui',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    thisYear: 'Cette année',
    custom: 'Personnalisé',
    
    // Temps
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    
    // Statuts
    active: 'Actif',
    inactive: 'Inactif',
    completed: 'Complété',
    pending: 'En attente',
    paid: 'Payé',
    unpaid: 'Non payé',
    
    // Mois
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre',
    
    // Formulaires et champs supplémentaires
    selectAccount: 'Sélectionner un compte',
    selectCategory: 'Sélectionner une catégorie',
    enterAmount: 'Entrer le montant',
    enterDescription: 'Entrer une description',
    selectDate: 'Sélectionner une date',
    recurring: 'Récurrent',
    frequency: 'Fréquence',
    endDateOptional: 'Date de fin (optionnelle)',
    editTransaction: 'Modifier la transaction',
    general: 'Général',
    notifications: 'Notifications',
    about: 'À propos',
    version: 'Version',
    help: 'Aide',
    terms: 'Conditions',
    password: 'Mot de passe',
    biometric: 'Biométrie',
    pinCode: 'Code PIN',
    pushNotifications: 'Notifications push',
    backupAndRestore: 'Sauvegarde et restauration',
    user: 'Utilisateur',

    // Authentification
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    email: 'Email',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    createAccount: 'Créer un compte',
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    fullName: 'Nom complet',
    country: 'Pays',
    selectCountry: 'Sélectionner votre pays',
    searchCountry: 'Rechercher un pays...',
    noCountryFound: 'Aucun pays trouvé',
    
    // Messages d'authentification
    emailRequired: 'L\'email est requis',
    emailInvalid: 'Format d\'email invalide',
    passwordRequired: 'Le mot de passe est requis',
    passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordsNotMatch: 'Les mots de passe ne correspondent pas',
    nameRequired: 'Le nom est requis',
    countryRequired: 'Le pays est requis',
    loginSuccess: 'Connexion réussie',
    registerSuccess: 'Inscription réussie',
    loginError: 'Erreur de connexion',
    registerError: 'Erreur lors de l\'inscription',
    
    // Onboarding
    welcomeTitle: 'Bienvenue',
    welcomeDescription: 'Gérez vos finances en toute simplicité',
    trackExpensesTitle: 'Suivi des dépenses',
    trackExpensesDescription: 'Gardez un œil sur toutes vos transactions',
    budgetSavingsTitle: 'Budgets & économies',
    budgetSavingsDescription: 'Atteignez vos objectifs financiers',
    statisticsTitle: 'Statistiques & vision claire',
    statisticsDescription: 'Analysez vos habitudes financières',
    getStarted: 'Commencer',
    skip: 'Passer',
    
    // Messages communs
    memberSince: 'Membre depuis',
    areYouSure: 'Êtes-vous sûr ?',
    logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
    cannotPerformAction: 'Impossible d\'effectuer cette action',
    actionSuccess: 'Action réussie',
    actionFailed: 'Action échouée',
    creating: 'Création...',
    adding: 'Ajout...',
    deleting: 'Suppression...',
    create: 'Créer',
    
    // Status de santé financière
    excellent: 'Excellent',
    good: 'Bon',
    fair: 'Correct',
    poor: 'Faible',
    critical: 'Critique',
    unknown: 'Inconnu',
    average: 'Moyen',
    needsImprovement: 'À améliorer',
    financialHealthExcellent: 'Votre santé financière est excellente !',
    financialHealthGood: 'Vous êtes sur la bonne voie.',
    financialHealthAverage: 'Quelques ajustements pourraient aider.',
    
    // Sections Dashboard
    seeMore: 'Voir plus',
    seeAll: 'Voir tout',
    dashboardUpdated: '✓ Dashboard mis à jour',
    upcomingAnnualCharges: 'Prochaines Charges Annuelles',
    financialOverview: 'Aperçu Financier',
    
    // Catégories spéciales
    debtPayment: 'Paiement de Dette',
    savingsRefund: 'Remboursement Épargne',
    
    // Page Transactions
    noTransaction: 'Aucune transaction',
    noTransactionFound: 'Aucune transaction trouvée pour',
    loadingTransactions: 'Chargement des transactions...',
    transactionPlural: 'transaction(s)',
    
    // Page Budgets
    manageLimits: 'Gérez vos limites de dépenses',
    usage: 'Utilisation',
    activeBudgets: 'Budgets Actifs',
    inactiveBudgets: 'Budgets Inactifs',
    loadingBudgets: 'Chargement des budgets...',
    retry: 'Réessayer',
    createFirstBudget: 'Créez votre premier budget pour suivre vos dépenses',
    
    // Page Catégories
    subcategory: 'Sous-catégorie',
    loadingCategories: 'Chargement des catégories...',
    searchCategory: 'Rechercher une catégorie...',
    expensesPlural: 'Dépenses',
    mainCategory: 'Catégorie principale',
    preview: 'Aperçu',
    resetCategories: 'Réinitialiser les catégories',
    resetCategoriesConfirm: 'Êtes-vous sûr de vouloir réinitialiser toutes les catégories ? Cette action supprimera DÉFINITIVEMENT toutes les anciennes catégories et installera les 50 nouvelles catégories.',
    resetCategoriesButton: 'Réinitialiser avec toutes les catégories',
    resetCategoriesSuccess: 'Les 50 nouvelles catégories ont été installées avec succès !',
    resetCategoriesError: 'Impossible de réinitialiser les catégories.',
    categoriesInstalled: 'Catégories installées',
    
    // Charges Annuelles
    allCharges: 'Toutes',
    upcoming: 'À venir',
    addCharge: 'Ajouter',
    annualBudget: 'Budget Annuel',
    totalCharges: 'Total charges',
    paidCharges: 'Payées',
    remainingCharges: 'Restantes',
    noCharge: 'Aucune charge',
    addFirstCharge: 'Ajoutez votre première charge annuelle',
    noPendingCharges: 'Aucune charge en attente',
    noPaidCharges: 'Aucune charge payées',
    noUpcomingCharges: 'Aucune charge à venir',
    allChargesList: 'Toutes les charges',
    pendingChargesList: 'Charges en attente',
    paidChargesList: 'Charges payées',
    upcomingChargesList: 'Charges à venir',
    autoDeduct: 'Prélèvement automatique',
    autoDeductEnabled: 'Prélèvement automatique activé',
    autoDeductDisabled: 'Prélèvement automatique désactivé',
    autoDeductError: 'Impossible de modifier le prélèvement automatique',
    deleteCharge: 'Supprimer la charge',
    deleteChargeConfirm: 'Êtes-vous sûr de vouloir supprimer',
    deleteChargeError: 'Impossible de supprimer la charge',
    annual: 'Annuel',
    chargesHint: '💡 Astuce : Les charges avec 📅 sont récurrentes, ⚡ indique un prélèvement automatique actif',
    
    // Épargne et Objectifs
    goals: 'Objectifs',
    totalSaved: 'Total épargné',
    noSavingsGoal: 'Aucun objectif d\'épargne',
    createFirstGoal: 'Créez votre premier objectif pour commencer à épargner.',
    createGoal: 'Créer un objectif',
    target: 'Objectif',
    currentSavings: 'Épargne actuelle',
    linkedSavingsAccount: 'Compte épargne lié',
    addContribution: 'Ajouter une contribution',
    markCompleted: 'Marquer comme terminé',
    goalMarkedCompleted: 'Objectif marqué comme terminé !',
    goalDeletedSuccess: 'Objectif supprimé avec succès',
    goalDeletedWithRefund: 'remboursés !',
    contributionAdded: 'ajoutée avec succès !',
    loadingSavingsGoals: 'Chargement des objectifs...',
    fetchingGoals: 'Récupération de vos objectifs...',
    processingAction: 'Traitement en cours...',
    goalDetails: 'Détails de l\'objectif',
    contributionHistory: 'Historique des contributions',
    addAction: 'Ajouter',
    modifyAction: 'Modifier',
    deleteSavingsGoalConfirm: 'Êtes-vous sûr de vouloir supprimer',
    goalNotFound: 'Objectif non trouvé',
    cannotLoadGoal: 'Impossible de charger les données de l\'objectif',
    cannotAddContribution: 'Impossible d\'ajouter la contribution',
    cannotDeleteGoal: 'Impossible de supprimer l\'objectif',
    deleteConfirmMessage: 'Cette action est irréversible.',
    contribution: 'Contribution de',
    
    // Détails objectifs - labels supplémentaires
    on: 'sur',
    saved: 'épargnés',
    expectedDate: 'Date prévue',
    timeRemaining: 'Temps restant',
    year: 'an',
    month: 'mois',
    lessThanMonth: 'Moins d\'un mois',
    monthlyProgress: 'Progression mensuelle',
    congratulations: 'Félicitations',
    goalAchievedOn: 'Vous avez atteint votre objectif le',
    noContribution: 'Aucune contribution pour le moment',
    addFirstContribution: 'Commencez par ajouter votre première contribution',
    addedOn: 'Ajoutée le',
    totalContributed: 'Total contribué',
    numberOfContributions: 'Nombre de contributions',
    averagePerContribution: 'Moyenne par contribution',
    vacation: 'Vacances',
    emergency: 'Fonds d\'urgence',
    house: 'Maison',
    car: 'Voiture',
    education: 'Éducation',
    retirement: 'Retraite',
    other: 'Autre',
    
    // Modal ajout contribution
    sourceAccount: 'Compte source',
    selectSourceAccount: 'Veuillez sélectionner un compte source pour la contribution',
    selectSavingsAccount: 'Veuillez sélectionner un compte d\'\u00e9pargne de destination',
    enterValidAmount: 'Veuillez saisir un montant valide',
    insufficientBalance: 'Solde insuffisant',
    balanceOf: 'Le solde de',
    is: 'est de',
    cannotTransfer: 'Vous ne pouvez pas transférer',
    warning: 'Attention',
    contributionExceedsGoal: 'Cette contribution dépassera votre objectif de',
    continueQuestion: 'Souhaitez-vous continuer ?',
    destinationSavingsAccount: 'Compte d\'\u00e9pargne de destination',
    noAccountWithBalance: 'Aucun compte avec un solde positif disponible.',
    noSavingsAccount: 'Aucun compte d\'\u00e9pargne disponible.',
    customAmount: 'Montant personnalisé',
    amountToTransfer: 'Montant à transférer',
    from: 'De',
    to: 'Vers',
    newTotal: 'Nouveau total',
    goalWillBeReached: 'Cette contribution atteindra votre objectif',
    canceling: 'Annulation...',
    transferring: 'Transfert...',
    
    // Page Dettes
    totalDebts: 'Total des dettes',
    activeDebts: 'dettes actives',
    debtsInProgress: 'Dettes en cours',
    allDebts: 'Toutes',
    actives: 'Actives',
    overdue: 'En retard',
    futures: 'Futures',
    paidDebts: 'Payées',
    noDebtFound: 'Aucune dette',
    debtActive: 'Active',
    debtOverdue: 'En retard',
    debtPaid: 'Payée',
    debtFuture: 'Future',
    paidAmount: 'Payé',
    
    // Alertes et formulaires dettes
    debtModifiedSuccess: 'Dette modifiée avec succès',
    cannotModifyDebt: 'Impossible de modifier la dette',
    modifyDebt: 'Modifier la Dette',
    debtType: 'Type de dette',
    debtStartDate: 'Date à laquelle la dette a commencé',
    cannotLoadDebtData: 'Impossible de charger les données de la dette',
    deleteDebt: 'Supprimer la dette',
    deleteDebtConfirm: 'Êtes-vous sûr de vouloir supprimer la dette',
    cannotDeleteDebt: 'Impossible de supprimer la dette',
    debtDetails: 'Détails de la Dette',
    deletionIrreversible: 'Cette action est irréversible',
    paymentSuccess: 'Paiement effectué avec succès',
    cannotMakePayment: 'Impossible d\'effectuer le paiement',
    fillAllFields: 'Veuillez remplir tous les champs obligatoires',
    selectPaymentAccount: 'Veuillez sélectionner un compte de paiement pour le paiement automatique',
    initialAmountPositive: 'Le montant initial doit être un nombre positif',
    currentAmountPositive: 'Le montant actuel doit être un nombre positif',
    monthlyPaymentPositive: 'Le paiement mensuel doit être un nombre positif',
    currentCannotExceedInitial: 'Le montant actuel ne peut pas être supérieur au montant initial',
    invalidAmount: 'Montant invalide',
    amountCannotExceedBalance: 'Le montant ne peut pas dépasser le solde restant',
    debtAlreadyPaid: 'Cette dette est déjà réglée',
    remainingBalance: 'Reste à payer',
    nextPayment: 'Prochain paiement',
    actions: 'Actions',
    pay: 'Payer',
    modify: 'Modifier',
    information: 'Informations',
    automaticPayment: 'Paiement automatique',
    creditorName: 'Nom du créancier',
    enabled: 'Activé',
    disabled: 'Désactivé',
    paymentAccount: 'Compte de paiement',
    unknownAccount: 'Compte inconnu',
    paymentDay: 'Jour de paiement',
    dayOfEachMonth: 'de chaque mois',
    paymentHistory: 'Historique des Paiements',
    noPaymentRecorded: 'Aucun paiement enregistré',
    principal: 'Principal',
    interest: 'Intérêts',
    dangerZone: 'Zone de danger',
    makePayment: 'Effectuer un paiement',
    amountToPay: 'Montant à payer',
    remainingBalanceLabel: 'Solde restant',
    noAccountSufficientBalance: 'Aucun compte avec un solde suffisant',
    available: 'disponible',
    paying: 'Paiement...',
    newDebt: 'Nouvelle Dette',
    debtAddedSuccess: 'Dette ajoutée avec succès',
    cannotAddDebt: 'Impossible d\'ajouter la dette',
    monthlyPaymentCannotExceedInitial: 'Le paiement mensuel ne peut pas être supérieur au montant initial',
    reimbursed: 'remboursé',
    nonePaid: 'Aucun (payé)',
    baseInformation: 'Informations de base',
    typeAndCategory: 'Type et catégorie',
    financialDetails: 'Détails financiers',
    paymentOptions: 'Options de paiement',
    interestRate: 'Taux d\'intérêt',
    selectAccountForAutoPay: 'Sélectionnez le compte qui paiera automatiquement',
    dayOfMonthForPayment: 'Jour du mois pour le paiement',
    automaticPaymentOnDay: 'Le paiement sera effectué automatiquement le',
    automaticPaymentStart: 'Début des paiements automatiques',
    nextMonthRecommended: 'Mois prochain (recommandé)',
    firstDebitOn: 'Premier prélèvement',
    asapPayment: 'Dès que possible',
    ifDueDatePassedImmediate: 'Si la date d\'échéance est dépassée, prélèvement immédiat',
    noAccountAvailable: 'Aucun compte disponible. Créez d\'abord un compte.',
    createAccountFirst: 'Créez d\'abord un compte',
    dueDateFirstPayment: 'Date d\'\u00e9chéance (première échéance)',
    firstPaymentNextMonth: 'Premier paiement le mois prochain',
    firstPaymentAsap: 'Premier paiement dès que possible',
    
    // Types de dettes
    debtTypePersonal: 'Dette personnelle',
    debtTypeConsumerCredit: 'Crédit à la consommation',
    debtTypeRevolvingCredit: 'Crédit renouvelable',
    debtTypeCarLoan: 'Prêt automobile',
    debtTypeMortgage: 'Prêt immobilier',
    debtTypeStudentLoan: 'Prêt étudiant',
    debtTypeOverdraft: 'Découvert bancaire',
    debtTypeTaxDebt: 'Dette fiscale',
    debtTypeSocialDebt: 'Dette sociale (CNSS)',
    debtTypeSupplierDebt: 'Dette fournisseur',
    debtTypeFamilyDebt: 'Dette familiale',
    debtTypeMicrocredit: 'Microcrédit',
    debtTypeProfessionalDebt: 'Dette professionnelle',
    debtTypePeerToPeer: 'Prêt entre particuliers',
    debtTypeJudicialDebt: 'Dettes judiciaires',
    debtTypeOther: 'Autre',
    
    // Catégories de dettes
    debtCategoryHousing: 'Dettes de logement',
    debtCategoryTransport: 'Dettes de transport',
    debtCategoryEducation: 'Dettes d\'études / formation',
    debtCategoryConsumption: 'Dettes de consommation',
    debtCategoryEmergency: 'Dettes d\'urgence / imprévus',
    debtCategoryProfessional: 'Dettes professionnelles',
    debtCategoryFamily: 'Dettes familiales',
    debtCategoryAdministrative: 'Dettes administratives',
    
    // Statuts de dettes
    debtStatusActive: 'Actif',
    debtStatusOverdue: 'En retard',
    debtStatusPaid: 'Payé',
    debtStatusFuture: 'Future',
    
    // Vue par mois
    period: 'Période',
    advancedFilters: 'Filtres avancés',
    transactionType: 'Type de transaction',
    revenues: 'Revenus',
    yesterday: 'Hier',
    minutesAgo: 'Il y a',
    hoursAgo: 'Il y a',
    daysAgo: 'jours',
    selectYear: 'Sélectionnez l\'année',
    summary: 'Résumé',
    annualFinancialPerformance: 'Performance financière annuelle',
    annualBalance: 'Solde Annuel',
    savingsRate: 'Taux d\'épargne',
    noDataFor: 'Aucune donnée pour',
    transactionsWillAppearHere: 'Les transactions de {year} apparaîtront ici dès que vous ajouterez des données.',
    startTracking: 'Commencer à tracker',
    monthlyAnalysis: 'Analyse Mensuelle',
    monthByMonthDetails: 'Détails mois par mois',
    months: 'mois',
    loadingData: 'Chargement des données...',
    analyzingMonthlyTransactions: 'Analyse des transactions mensuelles',
    monthsOverview: 'Vue par Mois',
    currentMonth: 'Mois en cours',
    positive: 'positif',
    negative: 'négatif',
    balanced: 'équilibré',
    ofIncome: 'des revenus',
    noIncome: 'Aucun revenu',
    transactionSingular: 'transaction',
    monthBalance: 'Solde du Mois',
    filterTransactions: 'Filtrer les transactions',
    detailedExpenses: 'Dépenses détaillées',
    noTransactionsThisMonth: 'Aucune transaction ce mois-ci',
    addFirstTransaction: 'Ajoutez votre première transaction pour commencer',
    monthDetail: 'Détail du Mois',
    only: 'seulement',
    noTransactionFor: 'Aucune transaction pour',
    incomeTransactionFor: 'Aucune transaction de revenu pour',
    expenseTransactionFor: 'Aucune transaction de dépense pour',
    
    // Rapports
    min: 'Min',
    max: 'Max',
    resetFilters: 'Réinitialiser les filtres',
    recommendations: 'Recommandations',
    visualizations: 'Visualisations',
    expensesByCategory: 'Dépenses par Catégorie',
    expensesDistribution: 'Répartition des Dépenses',
    expensesEvolution: 'Évolution des Dépenses',
    loadingReports: 'Chargement des rapports...',
    noFinancialData: 'Aucune donnée financière',
    addTransactionsToSeeReports: 'Ajoutez des transactions pour voir vos rapports',
    noCategoryData: 'Aucune donnée de catégorie',
    noMonthlyData: 'Aucune donnée mensuelle',
    monthlyTrends: 'Tendances Mensuelles',
    monthlySummary: 'Résumé mensuel',
    annualSummary: 'Résumé annuel',
    categoryAnalysisTitle: 'Analyse par catégorie',
    topCategories: 'Top Catégories',
    incomeVsExpenses: 'Revenus vs Dépenses',
    evolutionChart: 'Évolution',
    distribution: 'Répartition',
    threeMonths: '3 mois',
    sixMonths: '6 mois',
    monthlyEvolution: 'Évolution mensuelle',
    noDataAvailable: 'Aucune donnée disponible',
    monthlyComparison: 'Comparaison mensuelle',
    trendsAndForecasts: 'Tendances & Prévisions',
    monthlyAverage: 'Moyenne mensuelle',
    basedOnLast: 'Basé sur les',
    lastMonths: 'derniers mois',
    forecastJanuary: 'Prévision janvier',
    vsPrevious: 'vs',
    trendUp: 'Tendance à la hausse',
    trendDown: 'Tendance à la baisse',
    recommendation: 'Recommandation',
    expensesIncreasing: 'Vos dépenses augmentent légèrement. Pensez à revoir votre budget pour maintenir votre équilibre financier.',
    expensesDecreasing: 'Bonne nouvelle ! Vos dépenses sont en baisse. Continuez sur cette lancée pour améliorer votre épargne.',
    
    // Notifications
    allNotifications: 'Toutes',
    unread: 'Non lues',
    unreadNotifications: 'Non lues',
    noNotifications: 'Aucune notification',
    markAllAsRead: 'Tout marquer comme lu',
    agoMin: 'Il y a',
    agoHours: 'Il y a',
    days: 'jours',
    allNotificationsRead: 'Toutes vos notifications sont lues',
    noNotificationsYet: "Vous n'avez pas encore de notifications",
    
    // Paramètres
    preferences: 'Préférences',
    securitySettings: 'Sécurité',
    support: 'Support',
    personalInfo: 'Informations personnelles',
    currencyLanguageTheme: 'Devise, langue, thème',
    notificationManagement: 'Gestion des notifications push',
    passwordBiometrics: 'Mot de passe, biométrie, code PIN',
    backupRestore: 'Sauvegarde et restauration',
    versionHelp: 'Version, aide, conditions',
    notConnected: 'Non connecté',
    userRole: 'Utilisateur',
    
    // Profil
    activeAccounts: 'Comptes actifs',
    modifyEmail: "Modifier l'email",
    changePassword: 'Changer le mot de passe',
    backupExport: 'Sauvegarde & Export',
    logoutAction: 'Se déconnecter',
    
    // Modals
    currentPasswordLabel: 'Mot de passe actuel',
    newPasswordLabel: 'Nouveau mot de passe',
    confirmPasswordLabel: 'Confirmer le nouveau mot de passe',
    currentPasswordRequired: 'Mot de passe actuel requis',
    newPasswordRequired: 'Nouveau mot de passe requis',
    atLeast6Chars: 'Au moins 6 caractères',
    confirmationRequired: 'Confirmation requise',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    passwordChangedSuccess: 'Mot de passe changé avec succès',
    cannotChangePassword: 'Impossible de changer le mot de passe',
    repeatPassword: 'Répéter le mot de passe',
    currentEmail: 'Email actuel',
    newEmail: 'Nouvel email',
    confirmWithPassword: 'Confirmer avec votre mot de passe',
    invalidEmailFormat: "Format d'email invalide",
    sameAsCurrentEmail: "Le nouvel email est identique à l'actuel",
    emailChangedSuccess: 'Email modifié avec succès',
    cannotChangeEmail: "Impossible de modifier l'email",
    
    // Backup
    autoBackupTitle: 'Sauvegarde auto',
    dailyAutoBackup: 'Sauvegarde quotidienne automatique',
    lastBackup: 'Dernière sauvegarde',
    never: 'Jamais',
    createBackup: 'Créer une sauvegarde',
    completeBackupAllData: 'Sauvegarde complète de toutes vos données',
    exportJSON: 'Exporter en JSON',
    structuredFormatReimport: 'Format structuré pour réimport complet',
    exportCSV: 'Exporter en CSV',
    exportTransactionsCSV: 'Exporter les transactions en CSV',
    importData: 'Importer des données',
    replaceCurrentData: 'Cette fonctionnalité remplacera vos données actuelles. Créez une sauvegarde avant de continuer.',
    importSuccess: 'Import réussi',
    protectFinancialData: 'Protégez vos données financières',
    autoBackupEnabledMessage: 'Vos données seront sauvegardées automatiquement chaque jour.',
    createBackupQuestion: 'Voulez-vous créer une sauvegarde complète de vos données ?',
    createAction: 'Créer',
    backupCreated: 'La sauvegarde a été créée avec succès.',
    exportJSONQuestion: 'Exporter toutes les données au format JSON ?\n\nInclut : comptes, transactions, catégories, budgets, dettes, objectifs d\'épargne, charges annuelles et transactions récurrentes.',
    includesData: 'Inclut : comptes, transactions, catégories, budgets, dettes, objectifs d\'épargne, charges annuelles et transactions récurrentes.',
    exportAction: 'Exporter',
    exportCSVQuestion: 'Exporter les transactions au format CSV ?',
    importDataQuestion: 'Cette fonctionnalité remplacera vos données actuelles. Créez une sauvegarde avant de continuer.',
    importCompleted: 'Import terminé',
    
    // GeneralSettings
    mainCurrency: 'Devise principale',
    appearance: 'Apparence',
    light: 'Clair',
    dark: 'Sombre',
    maintenance: 'Maintenance',
    cleanDuplicates: 'Nettoyer les doublons',
    cleanDuplicatesQuestion: 'Supprimer les transactions récurrentes en double ? Cette action est irréversible.',
    cleanDuplicatesDesc: 'Supprimer les transactions récurrentes en double',
    cleaning: 'Nettoyage...',
    finished: 'Terminé',
    duplicatesDeleted: 'transaction(s) en double supprimée(s)',
    cannotCleanDuplicates: 'Impossible de nettoyer les doublons',
    
    // NotificationSettings
    notificationPreferences: 'Préférences de notification',
    transactionsNotif: 'Transactions',
    budgetAlerts: 'Alertes de budget',
    debtReminders: 'Rappels de dettes',
    savingsGoalsNotif: "Objectifs d'épargne",
    reportsNotif: 'Rapports',
    soundEnabled: 'Son',
    vibrationEnabled: 'Vibration',
    badgeEnabled: 'Badge',
    testNotification: 'Tester',
    testNotificationTitle: '🔔 Notification de test',
    testNotificationBody: 'Les notifications fonctionnent correctement !',
    testSuccess: 'Test réussi !',
    notificationSent: 'Une notification a été envoyée',
    clearAllNotifications: 'Effacer tout',
    clearNotificationsQuestion: 'Voulez-vous effacer toutes les notifications programmées ?',
    allNotificationsCleared: 'Toutes les notifications ont été effacées',
    scheduleDailyReminder: 'Rappel quotidien',
    dailyReminderScheduled: 'Rappel programmé',
    dailyReminderMessage: 'Vous recevrez un rappel quotidien à 18h00',
    viewScheduled: 'Voir programmées',
    scheduledNotifications: 'Notifications programmées',
    notificationSettings: 'Paramètres de notification',
    activityNotifications: 'Notifications d\'activité',
    displayOptions: 'Options d\'affichage',
    noScheduledNotifications: 'Aucune notification programmée',
    enableNotifications: 'Activer les notifications',
    receiveNotifications: 'Recevoir des notifications sur votre appareil',
    playSound: 'Jouer un son pour les notifications',
    vibrateForNotifications: 'Vibrer pour les notifications',
    showBadgeIcon: 'Afficher le nombre sur l\'icône de l\'app',
    transactionChanges: 'Ajout, modification, suppression',
    budgetExceeded: 'Budget dépassé, avertissements',
    upcomingPayments: 'Échéances proches, paiements',
    progressAchieved: 'Progrès, objectifs atteints',
    monthlyStats: 'Rapports mensuels, statistiques',
    notificationsDisabled: 'Notifications désactivées',
    enableInSettings: 'Veuillez activer les notifications dans les paramètres de votre appareil',
    loadingSettings: 'Chargement des paramètres...',
    pushNotifWork: 'Les notifications push ne fonctionnent que sur un appareil physique.',
    locallyStored: 'Les notifications sont envoyées localement et ne nécessitent pas de connexion internet.',
    
    // SecuritySettings
    biometricAuth: 'Authentification biométrique',
    enableBiometric: 'Activer la biométrie',
    protectWithBiometric: 'Protégez vos données avec votre empreinte',
    notAvailableDevice: 'Non disponible sur cet appareil',
    autoLock: 'Verrouillage auto',
    autoLockDesc: 'Verrouille l\'app après inactivité',
    lockDelay: 'Délai de verrouillage',
    immediate: 'Immédiat',
    oneMinute: '1 minute',
    fiveMinutes: '5 minutes',
    fifteenMinutes: '15 minutes',
    thirtyMinutes: '30 minutes',
    oneHour: '1 heure',
    securityEnabled: 'Sécurité activée',
    biometricEnabledMessage: 'L\'authentification biométrique est maintenant activée. L\'application sera verrouillée à chaque démarrage.',
    cannotEnableSecurity: 'Impossible d\'activer la sécurité',
    cannotModifyAutoLock: 'Impossible de modifier le verrouillage automatique',
    cannotModifyDelay: 'Impossible de modifier le délai',
    lockDelayQuestion: 'Délai de verrouillage',
    afterImmediate: 'sortie immédiate',
    afterOneMinute: '1 minute',
    afterXMinutes: 'minutes',
    afterOneHour: '1 heure',
    
    // AboutScreen
    helpSupport: 'Aide & Support',
    getHelp: 'Obtenez de l\'aide',
    termsOfService: 'Conditions d\'utilisation',
    readTerms: 'Lire les conditions',
    privacyPolicy: 'Politique de confidentialité',
    dataProtection: 'Protection des données',
    comingSoon: 'Cette fonctionnalité sera bientôt disponible',
    appInfo: 'Informations',
    manageFinancesSmartly: 'Gérez vos finances intelligemment',
    madeWithLove: 'Fait avec ❤️ pour vous',
    
    // Noms des catégories - Revenus
    cat_salary: '💼 Salaire',
    cat_secondary_income: '📈 Revenus secondaires',
    cat_net_salary: 'Salaire net',
    cat_bonus: 'Primes / heures sup',
    cat_freelance: 'Freelance',
    cat_commerce: 'Commerce / ventes',
    cat_commissions: 'Commissions',
    
    // Noms des catégories - Logement
    cat_housing: '🏠 Logement & Charges',
    cat_rent: 'Loyer / Crédit maison',
    cat_electricity: 'Électricité',
    cat_water: 'Eau',
    cat_internet: 'Wifi / Internet',
    cat_syndic: 'Syndic',
    
    // Noms des catégories - Nourriture
    cat_food: '🛒 Nourriture & Courses (T9edya)',
    cat_groceries: 'Épicerie',
    cat_vegetables: 'Légumes / fruits',
    cat_meat: 'Viande / poisson',
    cat_cleaning_products: 'Produits ménagers',
    
    // Noms des catégories - Transport
    cat_transport: '🚗 Transport & Voiture',
    cat_fuel: 'Carburant',
    cat_maintenance: 'Entretien',
    cat_insurance: 'Assurance',
    cat_wash: 'Lavage',
    cat_parking: 'Parking',
    
    // Noms des catégories - Santé
    cat_health: '💊 Santé',
    cat_pharmacy: 'Pharmacie',
    cat_consultation: 'Analyse / consultation',
    cat_health_insurance: 'Assurance maladie',
    
    // Noms des catégories - Enfant
    cat_child: '👶 Enfant',
    cat_child_food: 'Nourriture',
    cat_hygiene: 'Hygiène',
    cat_school: 'École / crèche',
    cat_leisure: 'Loisirs',
    
    // Noms des catégories - Abonnements
    cat_subscriptions: '📱 Abonnements',
    cat_phone: 'Téléphone',
    cat_apps: 'Applications',
    cat_streaming: 'Streaming',
    
    // Noms des catégories - Personnel
    cat_personal: '👤 Dépenses personnelles',
    cat_clothes: 'Vêtements',
    cat_haircut: 'Coiffure',
    cat_perfume: 'Parfums',
    cat_outings: 'Sorties',
    
    // Noms des catégories - Maison
    cat_house: '🏡 Maison',
    cat_kitchen: 'Cuisine / accessoires',
    cat_decoration: 'Décoration',
    cat_tools: 'Outils / bricolage',
    
    // Noms des catégories - Divers
    cat_misc: '🎁 Divers & imprévus',
    cat_gifts: 'Cadeaux',
    cat_family_help: 'Aides familiales',
    cat_unexpected: 'Imprévus',
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
    saving: 'Saving...',
    modifying: 'Modifying...',
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
    newRecurringTransaction: 'New Recurring Transaction',
    deleteTransaction: 'Delete transaction',
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
    amount: 'Amount',
    description: 'Description',
    date: 'Date',
    category: 'Category',
    account: 'Account',
    all: 'All',
    incomes: 'Incomes',
    expenses: 'Expenses',
    
    // Accounts
    myAccounts: 'My Accounts',
    addAccount: 'Add Account',
    accountName: 'Account Name',
    balance: 'Balance',
    cash: 'Cash',
    bank: 'Bank',
    card: 'Card',
    
    // Budgets
    myBudgets: 'My Budgets',
    createBudget: 'Create Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    
    // Categories
    myCategories: 'My Categories',
    addCategory: 'Add Category',
    editCategory: 'Edit category',
    deleteCategory: 'Delete category',
    newCategory: 'New category',
    newMainCategory: 'New main category',
    parentCategory: 'Parent Category',
    subCategory: 'Sub-category',
    
    // Savings
    savingsGoals: 'Savings Goals',
    newSavingsGoal: 'New savings goal',
    editSavingsGoal: 'Edit goal',
    deleteSavingsGoal: 'Delete goal',
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
    calendarExpenses: 'Expense Calendar',
    
    // Additional Dashboard
    noDataThisMonth: 'No data this month',
    netWorth: 'Net Worth',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    transaction: 'Transaction',
    budget: 'Budget',
    annualCharge: 'Annual Charge',
    addTransaction: 'Add Transaction',
    addBudget: 'Add Budget',
    addAnnualCharge: 'Add Charge',
    addSavings: 'Add Savings',
    addDebt: 'Add Debt',
    alerts: 'Alerts',
    currencies: 'Currencies',
    islamicCharges: 'Islamic Charges',
    categoryAnalysis: 'Category Analysis',
    // New screens
    insights: 'Insights & Tips',
    insightOfTheDay: 'Tip of the day',
    habitAnalysis: 'Analysis of your habits',
    suggestions: 'Savings suggestions',
    financialScore: 'Your financial score',
    searchPlaceholder: 'Search a transaction, category...',
    recentSearches: 'Recent searches',
    startTypingToSearch: 'Start typing to search',
    recurringTransactions: 'Recurring Transactions',
    monthlyTotal: 'Monthly total',
    monthlySubscriptions: 'Monthly subscriptions',
    addSubscription: '+ Add a subscription',
    nextCharge: 'Next charge:',
    
    // Additional translations
    welcome: 'Welcome',
    financialHealth: 'Financial Health',
    score: 'Score',
    assets: 'Assets',
    liabilities: 'Liabilities',
    revenue: 'Revenue',
    debt: 'Debt',
    deficit: 'Deficit',
    
    // Additional buttons and actions
    back: 'Back',
    next: 'Next',
    done: 'Done',
    close: 'Close',
    select: 'Select',
    selectAll: 'Select All',
    reset: 'Reset',
    apply: 'Apply',
    details: 'Details',
    
    // Screen titles
    allTransactions: 'All Transactions',
    myBudget: 'My Budget',
    myGoals: 'My Goals',
    notification: 'Notifications',
    
    // Messages and states
    emptyState: 'No items',
    noTransactions: 'No transactions',
    noBudgets: 'No budgets',
    noCategories: 'No categories',
    noGoals: 'No goals',
    noDebts: 'No debts',
    
    // Forms
    name: 'Name',
    type: 'Type',
    color: 'Color',
    icon: 'Icon',
    notes: 'Notes',
    dueDate: 'Due Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    
    // Statistics
    total: 'Total',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    custom: 'Custom',
    
    // Time periods
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    completed: 'Completed',
    pending: 'Pending',
    paid: 'Paid',
    unpaid: 'Unpaid',
    
    // Months
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    
    // Additional form fields
    selectAccount: 'Select an account',
    selectCategory: 'Select a category',
    enterAmount: 'Enter amount',
    enterDescription: 'Enter description',
    selectDate: 'Select date',
    recurring: 'Recurring',
    frequency: 'Frequency',
    endDateOptional: 'End date (optional)',
    editTransaction: 'Edit transaction',
    general: 'General',
    notifications: 'Notifications',
    about: 'About',
    version: 'Version',
    help: 'Help',
    terms: 'Terms',
    password: 'Password',
    biometric: 'Biometric',
    pinCode: 'PIN Code',
    pushNotifications: 'Push notifications',
    backupAndRestore: 'Backup and restore',
    user: 'User',

    // Authentication
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    fullName: 'Full Name',
    country: 'Country',
    selectCountry: 'Select your country',
    searchCountry: 'Search for a country...',
    noCountryFound: 'No country found',
    
    // Authentication messages
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email format',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordsNotMatch: 'Passwords do not match',
    nameRequired: 'Name is required',
    countryRequired: 'Country is required',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    loginError: 'Login error',
    registerError: 'Registration error',
    
    // Onboarding
    welcomeTitle: 'Welcome',
    welcomeDescription: 'Manage your finances with ease',
    trackExpensesTitle: 'Track Expenses',
    trackExpensesDescription: 'Keep track of all your transactions',
    budgetSavingsTitle: 'Budgets & Savings',
    budgetSavingsDescription: 'Reach your financial goals',
    statisticsTitle: 'Statistics & Clear Vision',
    statisticsDescription: 'Analyze your financial habits',
    getStarted: 'Get Started',
    skip: 'Skip',
    
    // Common messages
    memberSince: 'Member since',
    areYouSure: 'Are you sure?',
    logoutConfirm: 'Are you sure you want to log out?',
    deleteConfirm: 'Are you sure you want to delete',
    cannotPerformAction: 'Cannot perform this action',
    actionSuccess: 'Action successful',
    actionFailed: 'Action failed',
    creating: 'Creating...',
    adding: 'Adding...',
    deleting: 'Deleting...',
    create: 'Create',
    
    // Financial health status
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    critical: 'Critical',
    unknown: 'Unknown',
    average: 'Average',
    needsImprovement: 'Needs Work',
    financialHealthExcellent: 'Your financial health is excellent!',
    financialHealthGood: 'You are on the right track.',
    financialHealthAverage: 'Some adjustments could help.',
    
    // Dashboard sections
    seeMore: 'See More',
    seeAll: 'See All',
    dashboardUpdated: '✓ Dashboard updated',
    upcomingAnnualCharges: 'Upcoming Annual Charges',
    financialOverview: 'Financial Overview',
    
    // Special categories
    debtPayment: 'Debt Payment',
    savingsRefund: 'Savings Refund',
    
    // Transactions page
    noTransaction: 'No transactions',
    noTransactionFound: 'No transaction found for',
    loadingTransactions: 'Loading transactions...',
    transactionPlural: 'transaction(s)',
    
    // Budgets page
    manageLimits: 'Manage your spending limits',
    usage: 'Usage',
    activeBudgets: 'Active Budgets',
    inactiveBudgets: 'Inactive Budgets',
    loadingBudgets: 'Loading budgets...',
    retry: 'Retry',
    createFirstBudget: 'Create your first budget to track expenses',
    
    // Categories page
    subcategory: 'Subcategory',
    loadingCategories: 'Loading categories...',
    searchCategory: 'Search category...',
    expensesPlural: 'Expenses',
    mainCategory: 'Main category',
    preview: 'Preview',
    resetCategories: 'Reset categories',
    resetCategoriesConfirm: 'Are you sure you want to reset all categories? This will PERMANENTLY delete all old categories and install the 50 new categories.',
    resetCategoriesButton: 'Reset with all categories',
    resetCategoriesSuccess: 'The 50 new categories have been successfully installed!',
    resetCategoriesError: 'Unable to reset categories.',
    categoriesInstalled: 'Categories installed',
    
    // Annual Charges
    allCharges: 'All',
    upcoming: 'Upcoming',
    addCharge: 'Add',
    annualBudget: 'Annual Budget',
    totalCharges: 'Total charges',
    paidCharges: 'Paid',
    remainingCharges: 'Remaining',
    noCharge: 'No charges',
    addFirstCharge: 'Add your first annual charge',
    noPendingCharges: 'No pending charges',
    noPaidCharges: 'No paid charges',
    noUpcomingCharges: 'No upcoming charges',
    allChargesList: 'All charges',
    pendingChargesList: 'Pending charges',
    paidChargesList: 'Paid charges',
    upcomingChargesList: 'Upcoming charges',
    autoDeduct: 'Auto deduct',
    autoDeductEnabled: 'Auto deduct enabled',
    autoDeductDisabled: 'Auto deduct disabled',
    autoDeductError: 'Unable to modify auto deduct',
    deleteCharge: 'Delete charge',
    deleteChargeConfirm: 'Are you sure you want to delete',
    deleteChargeError: 'Unable to delete charge',
    annual: 'Annual',
    chargesHint: '💡 Tip: Charges with 📅 are recurring, ⚡ indicates active auto deduct',
    
    // Savings and Goals
    goals: 'Goals',
    totalSaved: 'Total saved',
    noSavingsGoal: 'No savings goal',
    createFirstGoal: 'Create your first goal to start saving.',
    createGoal: 'Create goal',
    target: 'Target',
    currentSavings: 'Current savings',
    linkedSavingsAccount: 'Linked savings account',
    addContribution: 'Add contribution',
    markCompleted: 'Mark as completed',
    goalMarkedCompleted: 'Goal marked as completed!',
    goalDeletedSuccess: 'Goal deleted successfully',
    goalDeletedWithRefund: 'refunded!',
    contributionAdded: 'added successfully!',
    loadingSavingsGoals: 'Loading goals...',
    fetchingGoals: 'Fetching your goals...',
    processingAction: 'Processing...',
    goalDetails: 'Goal details',
    contributionHistory: 'Contribution history',
    addAction: 'Add',
    modifyAction: 'Edit',
    cannotLoadGoal: 'Unable to load goal data',
    cannotAddContribution: 'Unable to add contribution',
    cannotDeleteGoal: 'Unable to delete goal',
    deleteSavingsGoalConfirm: 'Are you sure you want to delete',
    goalNotFound: 'Goal not found',
    deleteConfirmMessage: 'This action is irreversible.',
    contribution: 'Contribution of',
    
    // Goal details - additional labels
    on: 'of',
    saved: 'saved',
    expectedDate: 'Expected date',
    timeRemaining: 'Time remaining',
    year: 'year',
    month: 'month',
    lessThanMonth: 'Less than a month',
    monthlyProgress: 'Monthly progress',
    congratulations: 'Congratulations',
    goalAchievedOn: 'You reached your goal on',
    noContribution: 'No contributions yet',
    addFirstContribution: 'Start by adding your first contribution',
    addedOn: 'Added on',
    totalContributed: 'Total contributed',
    numberOfContributions: 'Number of contributions',
    averagePerContribution: 'Average per contribution',
    vacation: 'Vacation',
    emergency: 'Emergency fund',
    house: 'House',
    car: 'Car',
    education: 'Education',
    retirement: 'Retirement',
    other: 'Other',
    
    // Add contribution modal
    sourceAccount: 'Source account',
    selectSourceAccount: 'Please select a source account for the contribution',
    selectSavingsAccount: 'Please select a destination savings account',
    enterValidAmount: 'Please enter a valid amount',
    insufficientBalance: 'Insufficient balance',
    balanceOf: 'The balance of',
    is: 'is',
    cannotTransfer: 'You cannot transfer',
    warning: 'Warning',
    contributionExceedsGoal: 'This contribution will exceed your goal of',
    continueQuestion: 'Do you want to continue?',
    destinationSavingsAccount: 'Destination savings account',
    noAccountWithBalance: 'No account with positive balance available.',
    noSavingsAccount: 'No savings account available.',
    customAmount: 'Custom amount',
    amountToTransfer: 'Amount to transfer',
    from: 'From',
    to: 'To',
    newTotal: 'New total',
    goalWillBeReached: 'This contribution will reach your goal',
    canceling: 'Canceling...',
    transferring: 'Transferring...',
    
    // Debts page
    totalDebts: 'Total debts',
    activeDebts: 'active debts',
    debtsInProgress: 'Debts in progress',
    allDebts: 'All',
    actives: 'Active',
    overdue: 'Overdue',
    futures: 'Future',
    paidDebts: 'Paid',
    noDebtFound: 'No debt',
    debtActive: 'Active',
    debtOverdue: 'Overdue',
    debtPaid: 'Paid',
    debtFuture: 'Future',
    paidAmount: 'Paid',
    
    // Debt alerts and forms
    debtModifiedSuccess: 'Debt modified successfully',
    cannotModifyDebt: 'Cannot modify debt',
    modifyDebt: 'Modify Debt',
    debtType: 'Debt type',
    debtStartDate: 'Date when the debt started',
    cannotLoadDebtData: 'Cannot load debt data',
    deleteDebt: 'Delete debt',
    deleteDebtConfirm: 'Are you sure you want to delete the debt',
    cannotDeleteDebt: 'Cannot delete debt',
    debtDetails: 'Debt Details',
    deletionIrreversible: 'This action is irreversible',
    paymentSuccess: 'Payment made successfully',
    cannotMakePayment: 'Cannot make payment',
    fillAllFields: 'Please fill in all required fields',
    selectPaymentAccount: 'Please select a payment account for automatic payment',
    initialAmountPositive: 'Initial amount must be a positive number',
    currentAmountPositive: 'Current amount must be a positive number',
    monthlyPaymentPositive: 'Monthly payment must be a positive number',
    currentCannotExceedInitial: 'Current amount cannot exceed initial amount',
    invalidAmount: 'Invalid amount',
    amountCannotExceedBalance: 'Amount cannot exceed remaining balance',
    debtAlreadyPaid: 'This debt is already settled',
    remainingBalance: 'Remaining balance',
    nextPayment: 'Next payment',
    actions: 'Actions',
    pay: 'Pay',
    modify: 'Modify',
    information: 'Information',
    automaticPayment: 'Automatic payment',
    creditorName: 'Creditor name',
    enabled: 'Enabled',
    disabled: 'Disabled',
    paymentAccount: 'Payment account',
    unknownAccount: 'Unknown account',
    paymentDay: 'Payment day',
    dayOfEachMonth: 'of each month',
    paymentHistory: 'Payment History',
    noPaymentRecorded: 'No payment recorded',
    principal: 'Principal',
    interest: 'Interest',
    dangerZone: 'Danger zone',
    makePayment: 'Make a payment',
    amountToPay: 'Amount to pay',
    remainingBalanceLabel: 'Remaining balance',
    noAccountSufficientBalance: 'No account with sufficient balance',
    available: 'available',
    paying: 'Paying...',
    newDebt: 'New Debt',
    debtAddedSuccess: 'Debt added successfully',
    cannotAddDebt: 'Cannot add debt',
    monthlyPaymentCannotExceedInitial: 'Monthly payment cannot exceed initial amount',
    reimbursed: 'reimbursed',
    nonePaid: 'None (paid)',
    baseInformation: 'Basic information',
    typeAndCategory: 'Type and category',
    financialDetails: 'Financial details',
    paymentOptions: 'Payment options',
    interestRate: 'Interest rate',
    selectAccountForAutoPay: 'Select the account that will pay automatically',
    dayOfMonthForPayment: 'Day of the month for payment',
    automaticPaymentOnDay: 'Payment will be made automatically on',
    automaticPaymentStart: 'Automatic payment start',
    nextMonthRecommended: 'Next month (recommended)',
    firstDebitOn: 'First debit on',
    asapPayment: 'As soon as possible',
    ifDueDatePassedImmediate: 'If due date is passed, immediate debit',
    noAccountAvailable: 'No account available. Create an account first.',
    createAccountFirst: 'Create an account first',
    dueDateFirstPayment: 'Due date (first payment)',
    firstPaymentNextMonth: 'First payment next month',
    firstPaymentAsap: 'First payment as soon as possible',
    
    // Debt types
    debtTypePersonal: 'Personal debt',
    debtTypeConsumerCredit: 'Consumer credit',
    debtTypeRevolvingCredit: 'Revolving credit',
    debtTypeCarLoan: 'Car loan',
    debtTypeMortgage: 'Mortgage',
    debtTypeStudentLoan: 'Student loan',
    debtTypeOverdraft: 'Bank overdraft',
    debtTypeTaxDebt: 'Tax debt',
    debtTypeSocialDebt: 'Social debt (Social Security)',
    debtTypeSupplierDebt: 'Supplier debt',
    debtTypeFamilyDebt: 'Family debt',
    debtTypeMicrocredit: 'Microcredit',
    debtTypeProfessionalDebt: 'Professional debt',
    debtTypePeerToPeer: 'Peer-to-peer loan',
    debtTypeJudicialDebt: 'Judicial debts',
    debtTypeOther: 'Other',
    
    // Debt categories
    debtCategoryHousing: 'Housing debts',
    debtCategoryTransport: 'Transport debts',
    debtCategoryEducation: 'Education / training debts',
    debtCategoryConsumption: 'Consumer debts',
    debtCategoryEmergency: 'Emergency / unexpected debts',
    debtCategoryProfessional: 'Professional debts',
    debtCategoryFamily: 'Family debts',
    debtCategoryAdministrative: 'Administrative debts',
    
    // Debt statuses
    debtStatusActive: 'Active',
    debtStatusOverdue: 'Overdue',
    debtStatusPaid: 'Paid',
    debtStatusFuture: 'Future',
    
    // Month view
    period: 'Period',
    advancedFilters: 'Advanced filters',
    transactionType: 'Transaction type',
    revenues: 'Income',
    yesterday: 'Yesterday',
    minutesAgo: 'ago',
    hoursAgo: 'ago',
    daysAgo: 'days',
    selectYear: 'Select year',
    summary: 'Summary',
    annualFinancialPerformance: 'Annual financial performance',
    annualBalance: 'Annual Balance',
    savingsRate: 'Savings rate',
    noDataFor: 'No data for',
    transactionsWillAppearHere: 'Transactions from {year} will appear here as soon as you add data.',
    startTracking: 'Start tracking',
    monthlyAnalysis: 'Monthly Analysis',
    monthByMonthDetails: 'Month-by-month details',
    months: 'months',
    loadingData: 'Loading data...',
    analyzingMonthlyTransactions: 'Analyzing monthly transactions',
    monthsOverview: 'Months Overview',
    currentMonth: 'Current month',
    positive: 'positive',
    negative: 'negative',
    balanced: 'balanced',
    ofIncome: 'of income',
    noIncome: 'No income',
    transactionSingular: 'transaction',
    monthBalance: 'Month Balance',
    filterTransactions: 'Filter transactions',
    detailedExpenses: 'Detailed expenses',
    noTransactionsThisMonth: 'No transactions this month',
    addFirstTransaction: 'Add your first transaction to get started',
    monthDetail: 'Month Detail',
    only: 'only',
    noTransactionFor: 'No transactions for',
    incomeTransactionFor: 'No income transactions for',
    expenseTransactionFor: 'No expense transactions for',
    
    // Reports
    min: 'Min',
    max: 'Max',
    resetFilters: 'Reset filters',
    recommendations: 'Recommendations',
    visualizations: 'Visualizations',
    expensesByCategory: 'Expenses by Category',
    expensesDistribution: 'Expenses Distribution',
    expensesEvolution: 'Expenses Evolution',
    loadingReports: 'Loading reports...',
    noFinancialData: 'No financial data',
    addTransactionsToSeeReports: 'Add transactions to see your reports',
    noCategoryData: 'No category data',
    noMonthlyData: 'No monthly data',
    monthlyTrends: 'Monthly Trends',
    monthlySummary: 'Monthly summary',
    annualSummary: 'Annual summary',
    categoryAnalysisTitle: 'Category analysis',
    topCategories: 'Top Categories',
    incomeVsExpenses: 'Income vs Expenses',
    evolutionChart: 'Evolution',
    distribution: 'Distribution',
    threeMonths: '3 months',
    sixMonths: '6 months',
    monthlyEvolution: 'Monthly evolution',
    noDataAvailable: 'No data available',
    monthlyComparison: 'Monthly comparison',
    trendsAndForecasts: 'Trends & Forecasts',
    monthlyAverage: 'Monthly average',
    basedOnLast: 'Based on the last',
    lastMonths: 'months',
    forecastJanuary: 'January forecast',
    vsPrevious: 'vs',
    trendUp: 'Upward trend',
    trendDown: 'Downward trend',
    recommendation: 'Recommendation',
    expensesIncreasing: 'Your expenses are increasing slightly. Consider reviewing your budget to maintain your financial balance.',
    expensesDecreasing: 'Good news! Your expenses are decreasing. Keep it up to improve your savings.',
    
    // Notifications
    allNotifications: 'All',
    unread: 'Unread',
    unreadNotifications: 'Unread',
    noNotifications: 'No notifications',
    markAllAsRead: 'Mark all as read',
    agoMin: 'ago',
    agoHours: 'ago',
    days: 'days',
    allNotificationsRead: 'All your notifications are read',
    noNotificationsYet: "You don't have any notifications yet",
    
    // Settings
    preferences: 'Preferences',
    securitySettings: 'Security',
    support: 'Support',
    personalInfo: 'Personal information',
    currencyLanguageTheme: 'Currency, language, theme',
    notificationManagement: 'Push notification management',
    passwordBiometrics: 'Password, biometrics, PIN',
    backupRestore: 'Backup and restore',
    versionHelp: 'Version, help, terms',
    notConnected: 'Not connected',
    userRole: 'User',
    
    // Profile
    activeAccounts: 'Active accounts',
    modifyEmail: 'Modify email',
    changePassword: 'Change password',
    backupExport: 'Backup & Export',
    logoutAction: 'Logout',
    
    // Modals
    currentPasswordLabel: 'Current password',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm new password',
    currentPasswordRequired: 'Current password required',
    newPasswordRequired: 'New password required',
    atLeast6Chars: 'At least 6 characters',
    confirmationRequired: 'Confirmation required',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordChangedSuccess: 'Password changed successfully',
    cannotChangePassword: 'Cannot change password',
    repeatPassword: 'Repeat password',
    currentEmail: 'Current email',
    newEmail: 'New email',
    confirmWithPassword: 'Confirm with your password',
    invalidEmailFormat: 'Invalid email format',
    sameAsCurrentEmail: 'New email is the same as current',
    emailChangedSuccess: 'Email changed successfully',
    cannotChangeEmail: 'Cannot change email',
    
    // Backup
    autoBackupTitle: 'Auto backup',
    dailyAutoBackup: 'Daily automatic backup',
    lastBackup: 'Last backup',
    never: 'Never',
    createBackup: 'Create backup',
    completeBackupAllData: 'Complete backup of all your data',
    exportJSON: 'Export as JSON',
    structuredFormatReimport: 'Structured format for complete reimport',
    exportCSV: 'Export as CSV',
    exportTransactionsCSV: 'Export transactions as CSV',
    importData: 'Import data',
    replaceCurrentData: 'This will replace your current data. Create a backup before continuing.',
    importSuccess: 'Import successful',
    protectFinancialData: 'Protect your financial data',
    autoBackupEnabledMessage: 'Your data will be automatically backed up daily.',
    createBackupQuestion: 'Do you want to create a complete backup of your data?',
    createAction: 'Create',
    backupCreated: 'Backup created successfully.',
    exportJSONQuestion: 'Export all data as JSON?\n\nIncludes: accounts, transactions, categories, budgets, debts, savings goals, annual charges and recurring transactions.',
    includesData: 'Includes: accounts, transactions, categories, budgets, debts, savings goals, annual charges and recurring transactions.',
    exportAction: 'Export',
    exportCSVQuestion: 'Export transactions as CSV?',
    importDataQuestion: 'This will replace your current data. Create a backup before continuing.',
    importCompleted: 'Import completed',
    
    // GeneralSettings
    mainCurrency: 'Main currency',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    maintenance: 'Maintenance',
    cleanDuplicates: 'Clean duplicates',
    cleanDuplicatesQuestion: 'Delete duplicate recurring transactions? This action is irreversible.',
    cleanDuplicatesDesc: 'Delete duplicate recurring transactions',
    cleaning: 'Cleaning...',
    finished: 'Finished',
    duplicatesDeleted: 'duplicate transaction(s) deleted',
    cannotCleanDuplicates: 'Cannot clean duplicates',
    
    // NotificationSettings
    notificationPreferences: 'Notification preferences',
    transactionsNotif: 'Transactions',
    budgetAlerts: 'Budget alerts',
    debtReminders: 'Debt reminders',
    savingsGoalsNotif: 'Savings goals',
    reportsNotif: 'Reports',
    soundEnabled: 'Sound',
    vibrationEnabled: 'Vibration',
    badgeEnabled: 'Badge',
    testNotification: 'Test',
    testNotificationTitle: '🔔 Test notification',
    testNotificationBody: 'Notifications are working properly!',
    testSuccess: 'Test successful!',
    notificationSent: 'A notification has been sent',
    clearAllNotifications: 'Clear all',
    clearNotificationsQuestion: 'Do you want to clear all scheduled notifications?',
    allNotificationsCleared: 'All notifications have been cleared',
    scheduleDailyReminder: 'Daily reminder',
    dailyReminderScheduled: 'Reminder scheduled',
    dailyReminderMessage: 'You will receive a daily reminder at 6:00 PM',
    viewScheduled: 'View scheduled',
    scheduledNotifications: 'Scheduled notifications',
    notificationSettings: 'Notification settings',
    activityNotifications: 'Activity notifications',
    displayOptions: 'Display options',
    noScheduledNotifications: 'No scheduled notifications',
    enableNotifications: 'Enable notifications',
    receiveNotifications: 'Receive notifications on your device',
    playSound: 'Play sound for notifications',
    vibrateForNotifications: 'Vibrate for notifications',
    showBadgeIcon: 'Show count on app icon',
    transactionChanges: 'Add, edit, delete',
    budgetExceeded: 'Budget exceeded, warnings',
    upcomingPayments: 'Upcoming due dates, payments',
    progressAchieved: 'Progress, goals achieved',
    monthlyStats: 'Monthly reports, statistics',
    notificationsDisabled: 'Notifications disabled',
    enableInSettings: 'Please enable notifications in your device settings',
    loadingSettings: 'Loading settings...',
    pushNotifWork: 'Push notifications only work on a physical device.',
    locallyStored: 'Notifications are sent locally and do not require internet connection.',
    
    // SecuritySettings
    biometricAuth: 'Biometric authentication',
    enableBiometric: 'Enable biometrics',
    protectWithBiometric: 'Protect your data with your fingerprint',
    notAvailableDevice: 'Not available on this device',
    autoLock: 'Auto lock',
    autoLockDesc: 'Lock app after inactivity',
    lockDelay: 'Lock delay',
    immediate: 'Immediate',
    oneMinute: '1 minute',
    fiveMinutes: '5 minutes',
    fifteenMinutes: '15 minutes',
    thirtyMinutes: '30 minutes',
    oneHour: '1 hour',
    securityEnabled: 'Security enabled',
    biometricEnabledMessage: 'Biometric authentication is now enabled. The app will be locked on every startup.',
    cannotEnableSecurity: 'Cannot enable security',
    cannotModifyAutoLock: 'Cannot modify auto lock',
    cannotModifyDelay: 'Cannot modify delay',
    lockDelayQuestion: 'Lock delay',
    afterImmediate: 'immediate exit',
    afterOneMinute: '1 minute',
    afterXMinutes: 'minutes',
    afterOneHour: '1 hour',
    
    // AboutScreen
    helpSupport: 'Help & Support',
    getHelp: 'Get help',
    termsOfService: 'Terms of Service',
    readTerms: 'Read terms',
    privacyPolicy: 'Privacy Policy',
    dataProtection: 'Data protection',
    comingSoon: 'This feature will be available soon',
    appInfo: 'Information',
    manageFinancesSmartly: 'Manage your finances smartly',
    madeWithLove: 'Made with ❤️ for you',
    
    // Category names - Income
    cat_salary: '💼 Salary',
    cat_secondary_income: '📈 Secondary income',
    cat_net_salary: 'Net salary',
    cat_bonus: 'Bonus / overtime',
    cat_freelance: 'Freelance',
    cat_commerce: 'Commerce / sales',
    cat_commissions: 'Commissions',
    
    // Category names - Housing
    cat_housing: '🏠 Housing & Bills',
    cat_rent: 'Rent / Mortgage',
    cat_electricity: 'Electricity',
    cat_water: 'Water',
    cat_internet: 'Wifi / Internet',
    cat_syndic: 'Building fees',
    
    // Category names - Food
    cat_food: '🛒 Food & Groceries',
    cat_groceries: 'Groceries',
    cat_vegetables: 'Vegetables / fruits',
    cat_meat: 'Meat / fish',
    cat_cleaning_products: 'Cleaning products',
    
    // Category names - Transport
    cat_transport: '🚗 Transport & Car',
    cat_fuel: 'Fuel',
    cat_maintenance: 'Maintenance',
    cat_insurance: 'Insurance',
    cat_wash: 'Car wash',
    cat_parking: 'Parking',
    
    // Category names - Health
    cat_health: '💊 Health',
    cat_pharmacy: 'Pharmacy',
    cat_consultation: 'Consultation / tests',
    cat_health_insurance: 'Health insurance',
    
    // Category names - Child
    cat_child: '👶 Child',
    cat_child_food: 'Food',
    cat_hygiene: 'Hygiene',
    cat_school: 'School / daycare',
    cat_leisure: 'Leisure',
    
    // Category names - Subscriptions
    cat_subscriptions: '📱 Subscriptions',
    cat_phone: 'Phone',
    cat_apps: 'Applications',
    cat_streaming: 'Streaming',
    
    // Category names - Personal
    cat_personal: '👤 Personal expenses',
    cat_clothes: 'Clothes',
    cat_haircut: 'Haircut',
    cat_perfume: 'Perfume',
    cat_outings: 'Outings',
    
    // Category names - House
    cat_house: '🏡 House',
    cat_kitchen: 'Kitchen / accessories',
    cat_decoration: 'Decoration',
    cat_tools: 'Tools / DIY',
    
    // Category names - Misc
    cat_misc: '🎁 Misc & unexpected',
    cat_gifts: 'Gifts',
    cat_family_help: 'Family help',
    cat_unexpected: 'Unexpected',
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
    
    // الإجراءات الشائعة
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    saving: 'جاري الحفظ...',
    modifying: 'جاري التعديل...',
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
    newRecurringTransaction: 'معاملة متكررة جديدة',
    deleteTransaction: 'حذف المعاملة',
    income: 'دخل',
    expense: 'مصروف',
    transfer: 'تحويل',
    amount: 'المبلغ',
    description: 'الوصف',
    date: 'التاريخ',
    category: 'الفئة',
    account: 'الحساب',
    all: 'الكل',
    incomes: 'الإيرادات',
    expenses: 'المصروفات',
    
    // الحسابات
    myAccounts: 'حساباتي',
    addAccount: 'إضافة حساب',
    accountName: 'اسم الحساب',
    balance: 'الرصيد',
    cash: 'نقدي',
    bank: 'بنك',
    card: 'بطاقة',
    
    // الميزانيات
    myBudgets: 'ميزانياتي',
    createBudget: 'إنشاء ميزانية',
    spent: 'المنفق',
    remaining: 'المتبقي',
    
    // الفئات
    myCategories: 'فئاتي',
    addCategory: 'إضافة فئة',
    editCategory: 'تعديل الفئة',
    deleteCategory: 'حذف الفئة',
    newCategory: 'فئة جديدة',
    newMainCategory: 'فئة رئيسية جديدة',
    parentCategory: 'الفئة الرئيسية',
    subCategory: 'الفئة الفرعية',
    
    // المدخرات
    savingsGoals: 'أهداف الادخار',
    newSavingsGoal: 'هدف ادخار جديد',
    editSavingsGoal: 'تعديل الهدف',
    deleteSavingsGoal: 'حذف الهدف',
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
    calendarExpenses: 'تقويم النفقات',
    
    // لوحة التحكم إضافي
    noDataThisMonth: 'لا توجد بيانات هذا الشهر',
    netWorth: 'صافي الثروة',
    recentActivity: 'النشاط الأخير',
    quickActions: 'إجراءات سريعة',
    transaction: 'معاملة',
    budget: 'ميزانية',
    annualCharge: 'رسوم سنوية',
    addTransaction: 'إضافة معاملة',
    addBudget: 'إضافة ميزانية',
    addAnnualCharge: 'إضافة رسوم',
    addSavings: 'إضافة مدخرات',
    addDebt: 'إضافة دين',
    alerts: 'التنبيهات',
    currencies: 'العملات',
    islamicCharges: 'الرسوم الإسلامية',
    categoryAnalysis: 'تحليل الفئات',
      // شاشات جديدة
      insights: 'نصائح و إحصاءات',
      insightOfTheDay: 'نصيحة اليوم',
      habitAnalysis: 'تحليل عاداتك',
      suggestions: 'اقتراحات التوفير',
      financialScore: 'درجتك المالية',
      searchPlaceholder: 'ابحث عن معاملة، فئة...',
      recentSearches: 'عمليات البحث الأخيرة',
      startTypingToSearch: 'ابدأ الكتابة للبحث',
      recurringTransactions: 'المعاملات المتكررة',
      monthlyTotal: 'إجمالي الشهري',
      monthlySubscriptions: 'اشتراكات شهرية',
      addSubscription: '+ إضافة اشتراك',
      nextCharge: 'الخصم التالي :',
    
    // ترجمات إضافية
    welcome: 'مرحباً',
    financialHealth: 'الصحة المالية',
    score: 'النقاط',
    assets: 'الأصول',
    liabilities: 'الخصوم',
    revenue: 'الإيرادات',
    debt: 'الديون',
    deficit: 'عجز',
    
    // أزرار وإجراءات إضافية
    back: 'رجوع',
    next: 'التالي',
    done: 'تم',
    close: 'إغلاق',
    select: 'اختيار',
    selectAll: 'تحديد الكل',
    reset: 'إعادة تعيين',
    apply: 'تطبيق',
    details: 'التفاصيل',
    
    // عناوين الشاشات
    allTransactions: 'جميع المعاملات',
    myBudget: 'ميزانيتي',
    myGoals: 'أهدافي',
    notification: 'الإشعارات',
    
    // رسائل وحالات
    emptyState: 'لا توجد عناصر',
    noTransactions: 'لا توجد معاملات',
    noBudgets: 'لا توجد ميزانيات',
    noCategories: 'لا توجد فئات',
    noGoals: 'لا توجد أهداف',
    noDebts: 'لا توجد ديون',
    
    // النماذج
    name: 'الاسم',
    type: 'النوع',
    color: 'اللون',
    icon: 'الأيقونة',
    notes: 'ملاحظات',
    dueDate: 'تاريخ الاستحقاق',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    
    // الإحصائيات
    total: 'الإجمالي',
    today: 'اليوم',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    thisYear: 'هذه السنة',
    custom: 'مخصص',
    
    // الفترات الزمنية
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    yearly: 'سنوي',
    
    // الحالة
    active: 'نشط',
    inactive: 'غير نشط',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    
    // الأشهر
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    july: 'يوليو',
    august: 'أغسطس',
    september: 'سبتمبر',
    october: 'أكتوبر',
    november: 'نوفمبر',
    december: 'ديسمبر',
    
    // حقول نموذج إضافية
    selectAccount: 'اختر حساب',
    selectCategory: 'اختر فئة',
    enterAmount: 'أدخل المبلغ',
    enterDescription: 'أدخل وصف',
    selectDate: 'اختر تاريخ',
    recurring: 'متكرر',
    frequency: 'التكرار',
    endDateOptional: 'تاريخ الانتهاء (اختياري)',
    editTransaction: 'تعديل المعاملة',
    general: 'عام',
    notifications: 'الإشعارات',
    about: 'حول',
    version: 'الإصدار',
    help: 'مساعدة',
    terms: 'الشروط',
    password: 'كلمة المرور',
    biometric: 'القياسات الحيوية',
    pinCode: 'رمز PIN',
    pushNotifications: 'إشعارات فورية',
    backupAndRestore: 'نسخ واستعادة',
    user: 'مستخدم',

    // المصادقة
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    createAccount: 'إنشاء حساب',
    signIn: 'تسجيل الدخول',
    signUp: 'التسجيل',
    fullName: 'الاسم الكامل',
    country: 'البلد',
    selectCountry: 'اختر بلدك',
    searchCountry: 'ابحث عن بلد...',
    noCountryFound: 'لم يتم العثور على بلد',
    
    // رسائل المصادقة
    emailRequired: 'البريد الإلكتروني مطلوب',
    emailInvalid: 'صيغة البريد الإلكتروني غير صحيحة',
    passwordRequired: 'كلمة المرور مطلوبة',
    passwordMinLength: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل',
    passwordsNotMatch: 'كلمات المرور غير متطابقة',
    nameRequired: 'الاسم مطلوب',
    countryRequired: 'البلد مطلوب',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    registerSuccess: 'تم التسجيل بنجاح',
    loginError: 'خطأ في تسجيل الدخول',
    registerError: 'خطأ في التسجيل',
    
    // الترحيب
    welcomeTitle: 'مرحباً',
    welcomeDescription: 'إدارة مالية بكل سهولة',
    trackExpensesTitle: 'تتبع النفقات',
    trackExpensesDescription: 'راقب جميع معاملاتك المالية',
    budgetSavingsTitle: 'الميزانيات والمدخرات',
    budgetSavingsDescription: 'حقق أهدافك المالية',
    statisticsTitle: 'إحصائيات ورؤية واضحة',
    statisticsDescription: 'حلل عاداتك المالية',
    getStarted: 'ابدأ الآن',
    skip: 'تخطي',
    
    // رسائل عامة
    memberSince: 'عضو منذ',
    areYouSure: 'هل أنت متأكد؟',
    logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
    deleteConfirm: 'هل أنت متأكد من حذف',
    cannotPerformAction: 'لا يمكن تنفيذ هذا الإجراء',
    actionSuccess: 'تم الإجراء بنجاح',
    actionFailed: 'فشل الإجراء',
    creating: 'جاري الإنشاء...',
    adding: 'جاري الإضافة...',
    deleting: 'جاري الحذف...',
    create: 'إنشاء',
    
    // حالة الصحة المالية
    excellent: 'ممتاز',
    good: 'جيد',
    fair: 'مقبول',
    poor: 'ضعيف',
    critical: 'حرج',
    unknown: 'غير معروف',
    average: 'متوسط',
    needsImprovement: 'يحتاج تحسين',
    financialHealthExcellent: 'صحتك المالية ممتازة!',
    financialHealthGood: 'أنت على المسار الصحيح.',
    financialHealthAverage: 'بعض التعديلات قد تساعد.',
    
    // أقسام لوحة التحكم
    seeMore: 'عرض المزيد',
    seeAll: 'عرض الكل',
    dashboardUpdated: '✓ تم تحديث لوحة التحكم',
    upcomingAnnualCharges: 'الرسوم السنوية القادمة',
    financialOverview: 'نظرة مالية عامة',
    
    // فئات خاصة
    debtPayment: 'دفع الديون',
    savingsRefund: 'استرداد المدخرات',
    
    // صفحة المعاملات
    noTransaction: 'لا توجد معاملات',
    noTransactionFound: 'لم يتم العثور على معاملات لـ',
    loadingTransactions: 'جاري تحميل المعاملات...',
    transactionPlural: 'معاملة/معاملات',
    
    // صفحة الميزانيات
    manageLimits: 'إدارة حدود الإنفاق',
    usage: 'الاستخدام',
    activeBudgets: 'الميزانيات النشطة',
    inactiveBudgets: 'الميزانيات غير النشطة',
    loadingBudgets: 'جاري تحميل الميزانيات...',
    retry: 'إعادة المحاولة',
    createFirstBudget: 'أنشئ ميزانيتك الأولى لتتبع النفقات',
    
    // صفحة الفئات
    subcategory: 'فئة فرعية',
    loadingCategories: 'جاري تحميل الفئات...',
    searchCategory: 'بحث عن فئة...',
    expensesPlural: 'النفقات',
    mainCategory: 'فئة رئيسية',
    preview: 'معاينة',
    resetCategories: 'إعادة تعيين الفئات',
    resetCategoriesConfirm: 'هل أنت متأكد من إعادة تعيين كل الفئات؟ سيؤدي هذا إلى حذف جميع الفئات القديمة نهائيًا وتثبيت 50 فئة جديدة.',
    resetCategoriesButton: 'إعادة التعيين بجميع الفئات',
    resetCategoriesSuccess: 'تم تثبيت 50 فئة جديدة بنجاح!',
    resetCategoriesError: 'تعذر إعادة تعيين الفئات.',
    categoriesInstalled: 'الفئات المثبتة',
    
    // الرسوم السنوية
    allCharges: 'الكل',
    upcoming: 'قادم',
    addCharge: 'إضافة',
    annualBudget: 'الميزانية السنوية',
    totalCharges: 'إجمالي الرسوم',
    paidCharges: 'مدفوع',
    remainingCharges: 'متبقي',
    noCharge: 'لا توجد رسوم',
    addFirstCharge: 'أضف رسومك السنوية الأولى',
    noPendingCharges: 'لا توجد رسوم قيد الانتظار',
    noPaidCharges: 'لا توجد رسوم مدفوعة',
    noUpcomingCharges: 'لا توجد رسوم قادمة',
    allChargesList: 'جميع الرسوم',
    pendingChargesList: 'الرسوم قيد الانتظار',
    paidChargesList: 'الرسوم المدفوعة',
    upcomingChargesList: 'الرسوم القادمة',
    autoDeduct: 'خصم تلقائي',
    autoDeductEnabled: 'تم تفعيل الخصم التلقائي',
    autoDeductDisabled: 'تم تعطيل الخصم التلقائي',
    autoDeductError: 'تعذر تعديل الخصم التلقائي',
    deleteCharge: 'حذف الرسوم',
    deleteChargeConfirm: 'هل أنت متأكد من حذف',
    deleteChargeError: 'تعذر حذف الرسوم',
    annual: 'سنوي',
    chargesHint: '💡 نصيحة: الرسوم التي تحتوي على 📅 متكررة، ⚡ يشير إلى خصم تلقائي نشط',
    
    // الادخار والأهداف
    goals: 'الأهداف',
    totalSaved: 'إجمالي المدخرات',
    noSavingsGoal: 'لا توجد أهداف ادخار',
    createFirstGoal: 'أنشئ هدفك الأول لبدء الادخار.',
    createGoal: 'إنشاء هدف',
    target: 'الهدف',
    currentSavings: 'المدخرات الحالية',
    linkedSavingsAccount: 'حساب ادخار مرتبط',
    addContribution: 'إضافة مساهمة',
    markCompleted: 'وضع علامة مكتمل',
    goalMarkedCompleted: 'تم وضع علامة مكتمل على الهدف!',
    goalDeletedSuccess: 'تم حذف الهدف بنجاح',
    goalDeletedWithRefund: 'تم الاسترداد!',
    contributionAdded: 'تمت الإضافة بنجاح!',
    loadingSavingsGoals: 'جاري تحميل الأهداف...',
    fetchingGoals: 'جاري جلب أهدافك...',
    processingAction: 'جاري المعالجة...',
    goalDetails: 'تفاصيل الهدف',
    contributionHistory: 'سجل المساهمات',
    addAction: 'إضافة',
    modifyAction: 'تعديل',
    cannotLoadGoal: 'تعذر تحميل بيانات الهدف',
    cannotAddContribution: 'تعذر إضافة المساهمة',
    cannotDeleteGoal: 'تعذر حذف الهدف',
    deleteSavingsGoalConfirm: 'هل أنت متأكد من حذف',
    goalNotFound: 'لم يتم العثور على الهدف',
    deleteConfirmMessage: 'هذا الإجراء غير قابل للإلغاء.',
    contribution: 'مساهمة بقيمة',
    
    // تفاصيل الأهداف - تسميات إضافية
    on: 'من',
    saved: 'مدّخر',
    expectedDate: 'التاريخ المتوقّع',
    timeRemaining: 'الوقت المتبقي',
    year: 'سنة',
    month: 'شهر',
    lessThanMonth: 'أقل من شهر',
    monthlyProgress: 'التقدّم الشهري',
    congratulations: 'مبروك',
    goalAchievedOn: 'لقد حققت هدفك في',
    noContribution: 'لا توجد مساهمات حتى الآن',
    addFirstContribution: 'ابدأ بإضافة أول مساهمة',
    addedOn: 'أُضيفت في',
    totalContributed: 'إجمالي المساهمات',
    numberOfContributions: 'عدد المساهمات',
    averagePerContribution: 'متوسط لكل مساهمة',
    vacation: 'عطلة',
    emergency: 'صندوق طوارئ',
    house: 'منزل',
    car: 'سيارة',
    education: 'تعليم',
    retirement: 'تقاعد',
    other: 'أخرى',
    
    // نموذج إضافة مساهمة
    sourceAccount: 'الحساب المصدر',
    selectSourceAccount: 'يرجى اختيار حساب مصدر للمساهمة',
    selectSavingsAccount: 'يرجى اختيار حساب ادخار الوجهة',
    enterValidAmount: 'يرجى إدخال مبلغ صحيح',
    insufficientBalance: 'رصيد غير كاف',
    balanceOf: 'رصيد',
    is: 'هو',
    cannotTransfer: 'لا يمكنك تحويل',
    warning: 'تحذير',
    contributionExceedsGoal: 'هذه المساهمة ستتجاوز هدفك البالغ',
    continueQuestion: 'هل تريد المتابعة؟',
    destinationSavingsAccount: 'حساب ادخار الوجهة',
    noAccountWithBalance: 'لا يوجد حساب برصيد إيجابي متاح.',
    noSavingsAccount: 'لا يوجد حساب ادخار متاح.',
    customAmount: 'مبلغ مخصص',
    amountToTransfer: 'المبلغ المراد تحويله',
    from: 'من',
    to: 'إلى',
    newTotal: 'الإجمالي الجديد',
    goalWillBeReached: 'هذه المساهمة ستحقق هدفك',
    canceling: 'جاري الإلغاء...',
    transferring: 'جاري التحويل...',
    
    // صفحة الديون
    totalDebts: 'إجمالي الديون',
    activeDebts: 'ديون نشطة',
    debtsInProgress: 'الديون الجارية',
    allDebts: 'الكل',
    actives: 'نشط',
    overdue: 'متأخر',
    futures: 'مستقبلي',
    paidDebts: 'مدفوعة',
    noDebtFound: 'لا يوجد دين',
    debtActive: 'نشط',
    debtOverdue: 'متأخر',
    debtPaid: 'مدفوع',
    debtFuture: 'مستقبلي',
    paidAmount: 'مدفوع',
    
    // تنبيهات ونماذج الديون
    debtModifiedSuccess: 'تم تعديل الدين بنجاح',
    cannotModifyDebt: 'لا يمكن تعديل الدين',
    modifyDebt: 'تعديل الدين',
    debtType: 'نوع الدين',
    debtStartDate: 'تاريخ بدء الدين',
    cannotLoadDebtData: 'لا يمكن تحميل بيانات الدين',
    deleteDebt: 'حذف الدين',
    deleteDebtConfirm: 'هل أنت متأكد من حذف الدين',
    cannotDeleteDebt: 'لا يمكن حذف الدين',
    debtDetails: 'تفاصيل الدين',
    deletionIrreversible: 'هذا الإجراء غير قابل للإلغاء',
    paymentSuccess: 'تم الدفع بنجاح',
    cannotMakePayment: 'لا يمكن إجراء الدفع',
    fillAllFields: 'يرجى ملء جميع الحقول الإلزامية',
    selectPaymentAccount: 'يرجى اختيار حساب دفع للدفع التلقائي',
    initialAmountPositive: 'يجب أن يكون المبلغ الأولي رقماً إيجابياً',
    currentAmountPositive: 'يجب أن يكون المبلغ الحالي رقماً إيجابياً',
    monthlyPaymentPositive: 'يجب أن يكون الدفع الشهري رقماً إيجابياً',
    currentCannotExceedInitial: 'لا يمكن أن يتجاوز المبلغ الحالي المبلغ الأولي',
    invalidAmount: 'مبلغ غير صالح',
    amountCannotExceedBalance: 'لا يمكن أن يتجاوز المبلغ الرصيد المتبقي',
    debtAlreadyPaid: 'هذا الدين مسدد بالفعل',
    remainingBalance: 'متبقي للدفع',
    nextPayment: 'الدفعة القادمة',
    actions: 'إجراءات',
    pay: 'دفع',
    modify: 'تعديل',
    information: 'معلومات',
    automaticPayment: 'الدفع التلقائي',
    creditorName: 'اسم الدائن',
    enabled: 'مفعّل',
    disabled: 'معطّل',
    paymentAccount: 'حساب الدفع',
    unknownAccount: 'حساب غير معروف',
    paymentDay: 'يوم الدفع',
    dayOfEachMonth: 'من كل شهر',
    paymentHistory: 'سجل المدفوعات',
    noPaymentRecorded: 'لا توجد مدفوعات مسجلة',
    principal: 'الأصل',
    interest: 'الفائدة',
    dangerZone: 'منطقة الخطر',
    makePayment: 'إجراء دفعة',
    amountToPay: 'المبلغ المراد دفعه',
    remainingBalanceLabel: 'الرصيد المتبقي',
    noAccountSufficientBalance: 'لا يوجد حساب برصيد كافٍ',
    available: 'متاح',
    paying: 'جاري الدفع...',
    newDebt: 'دين جديد',
    debtAddedSuccess: 'تمت إضافة الدين بنجاح',
    cannotAddDebt: 'لا يمكن إضافة الدين',
    monthlyPaymentCannotExceedInitial: 'لا يمكن أن يتجاوز الدفع الشهري المبلغ الأولي',
    reimbursed: 'مسدد',
    nonePaid: 'لا شيء (مدفوع)',
    baseInformation: 'المعلومات الأساسية',
    typeAndCategory: 'النوع والفئة',
    financialDetails: 'التفاصيل المالية',
    paymentOptions: 'خيارات الدفع',
    interestRate: 'معدل الفائدة',
    selectAccountForAutoPay: 'اختر الحساب الذي سيدفع تلقائياً',
    dayOfMonthForPayment: 'يوم الشهر للدفع',
    automaticPaymentOnDay: 'سيتم الدفع تلقائياً في',
    automaticPaymentStart: 'بداية المدفوعات التلقائية',
    nextMonthRecommended: 'الشهر القادم (موصى به)',
    firstDebitOn: 'أول خصم في',
    asapPayment: 'في أقرب وقت ممكن',
    ifDueDatePassedImmediate: 'إذا تجاوز تاريخ الاستحقاق، خصم فوري',
    noAccountAvailable: 'لا يوجد حساب متاح. أنشئ حساباً أولاً.',
    createAccountFirst: 'أنشئ حساباً أولاً',
    dueDateFirstPayment: 'تاريخ الاستحقاق (الدفعة الأولى)',
    firstPaymentNextMonth: 'أول دفعة الشهر القادم',
    firstPaymentAsap: 'أول دفعة في أقرب وقت ممكن',
    
    // أنواع الديون
    debtTypePersonal: 'دين شخصي',
    debtTypeConsumerCredit: 'ائتمان استهلاكي',
    debtTypeRevolvingCredit: 'ائتمان متجدد',
    debtTypeCarLoan: 'قرض سيارة',
    debtTypeMortgage: 'قرض عقاري',
    debtTypeStudentLoan: 'قرض طلابي',
    debtTypeOverdraft: 'سحب على المكشوف',
    debtTypeTaxDebt: 'دين ضريبي',
    debtTypeSocialDebt: 'دين اجتماعي (الضمان الاجتماعي)',
    debtTypeSupplierDebt: 'دين مورّد',
    debtTypeFamilyDebt: 'دين عائلي',
    debtTypeMicrocredit: 'قرض صغير',
    debtTypeProfessionalDebt: 'دين مهني',
    debtTypePeerToPeer: 'قرض بين الأفراد',
    debtTypeJudicialDebt: 'ديون قضائية',
    debtTypeOther: 'أخرى',
    
    // فئات الديون
    debtCategoryHousing: 'ديون السكن',
    debtCategoryTransport: 'ديون النقل',
    debtCategoryEducation: 'ديون الدراسة / التدريب',
    debtCategoryConsumption: 'ديون الاستهلاك',
    debtCategoryEmergency: 'ديون الطوارئ / غير المتوقعة',
    debtCategoryProfessional: 'ديون مهنية',
    debtCategoryFamily: 'ديون عائلية',
    debtCategoryAdministrative: 'ديون إدارية',
    
    // حالات الديون
    debtStatusActive: 'نشط',
    debtStatusOverdue: 'متأخر',
    debtStatusPaid: 'مدفوع',
    debtStatusFuture: 'مستقبلي',
    
    // عرض الشهر
    period: 'الفترة',
    advancedFilters: 'فلاتر متقدمة',
    transactionType: 'نوع المعاملة',
    revenues: 'الإيرادات',
    yesterday: 'أمس',
    minutesAgo: 'منذ',
    hoursAgo: 'منذ',
    daysAgo: 'أيام',
    selectYear: 'اختر السنة',
    summary: 'الملخص',
    annualFinancialPerformance: 'الأداء المالي السنوي',
    annualBalance: 'الرصيد السنوي',
    savingsRate: 'معدل الادخار',
    noDataFor: 'لا توجد بيانات لسنة',
    transactionsWillAppearHere: 'ستظهر معاملات {year} هنا بمجرد إضافة البيانات.',
    startTracking: 'ابدأ التتبع',
    monthlyAnalysis: 'التحليل الشهري',
    monthByMonthDetails: 'تفاصيل شهر بشهر',
    months: 'شهر',
    loadingData: 'جاري تحميل البيانات...',
    analyzingMonthlyTransactions: 'تحليل المعاملات الشهرية',
    monthsOverview: 'عرض الأشهر',
    currentMonth: 'الشهر الحالي',
    positive: 'إيجابي',
    negative: 'سلبي',
    balanced: 'متوازن',
    ofIncome: 'من الإيرادات',
    noIncome: 'لا يوجد دخل',
    transactionSingular: 'معاملة',
    monthBalance: 'رصيد الشهر',
    filterTransactions: 'تصفية المعاملات',
    detailedExpenses: 'مصروفات تفصيلية',
    noTransactionsThisMonth: 'لا توجد معاملات هذا الشهر',
    addFirstTransaction: 'أضف معاملتك الأولى للبدء',
    monthDetail: 'تفاصيل الشهر',
    only: 'فقط',
    noTransactionFor: 'لا توجد معاملات لـ',
    incomeTransactionFor: 'لا توجد معاملات دخل لـ',
    expenseTransactionFor: 'لا توجد معاملات مصروفات لـ',
    
    // التقارير
    min: 'الأدنى',
    max: 'الأقصى',
    resetFilters: 'إعادة تعيين الفلاتر',
    recommendations: 'التوصيات',
    visualizations: 'المخططات البيانية',
    expensesByCategory: 'المصروفات حسب الفئة',
    expensesDistribution: 'توزيع المصروفات',
    expensesEvolution: 'تطور المصروفات',
    loadingReports: 'جاري تحميل التقارير...',
    noFinancialData: 'لا توجد بيانات مالية',
    addTransactionsToSeeReports: 'أضف معاملات لرؤية تقاريرك',
    noCategoryData: 'لا توجد بيانات فئات',
    noMonthlyData: 'لا توجد بيانات شهرية',
    monthlyTrends: 'الاتجاهات الشهرية',
    monthlySummary: 'ملخص شهري',
    annualSummary: 'ملخص سنوي',
    categoryAnalysisTitle: 'التحليل حسب الفئة',
    topCategories: 'أفضل الفئات',
    incomeVsExpenses: 'الإيرادات مقابل المصروفات',
    evolutionChart: 'التطور',
    distribution: 'التوزيع',
    threeMonths: '3 أشهر',
    sixMonths: '6 أشهر',
    monthlyEvolution: 'التطور الشهري',
    noDataAvailable: 'لا توجد بيانات متاحة',
    monthlyComparison: 'المقارنة الشهرية',
    trendsAndForecasts: 'الاتجاهات والتوقعات',
    monthlyAverage: 'المتوسط الشهري',
    basedOnLast: 'بناءً على آخر',
    lastMonths: 'أشهر',
    forecastJanuary: 'توقعات يناير',
    vsPrevious: 'مقابل',
    trendUp: 'اتجاه تصاعدي',
    trendDown: 'اتجاه تنازلي',
    recommendation: 'توصية',
    expensesIncreasing: 'مصروفاتك تزداد قليلاً. فكر في مراجعة ميزانيتك للحفاظ على توازنك المالي.',
    expensesDecreasing: 'أخبار جيدة! مصروفاتك تتناقص. استمر على هذا النحو لتحسين مدخراتك.',
    
    // الإشعارات
    allNotifications: 'الكل',
    unread: 'غير مقروءة',
    unreadNotifications: 'غير مقروءة',
    noNotifications: 'لا توجد إشعارات',
    markAllAsRead: 'وضع علامة قراءة على الكل',
    agoMin: 'منذ',
    agoHours: 'منذ',
    days: 'أيام',
    allNotificationsRead: 'تمت قراءة جميع إشعاراتك',
    noNotificationsYet: 'ليس لديك أي إشعارات حتى الآن',
    
    // الإعدادات
    preferences: 'التفضيلات',
    securitySettings: 'الأمان',
    support: 'الدعم',
    personalInfo: 'المعلومات الشخصية',
    currencyLanguageTheme: 'العملة، اللغة، السمة',
    notificationManagement: 'إدارة إشعارات الدفع',
    passwordBiometrics: 'كلمة المرور، البيومترية، رمز PIN',
    backupRestore: 'النسخ الاحتياطي والاستعادة',
    versionHelp: 'الإصدار، المساعدة، الشروط',
    notConnected: 'غير متصل',
    userRole: 'مستخدم',
    
    // الملف الشخصي
    activeAccounts: 'حسابات نشطة',
    modifyEmail: 'تعديل البريد الإلكتروني',
    changePassword: 'تغيير كلمة المرور',
    backupExport: 'النسخ الاحتياطي والتصدير',
    logoutAction: 'تسجيل الخروج',
    
    // النوافذ المنبثقة
    currentPasswordLabel: 'كلمة المرور الحالية',
    newPasswordLabel: 'كلمة المرور الجديدة',
    confirmPasswordLabel: 'تأكيد كلمة المرور الجديدة',
    currentPasswordRequired: 'كلمة المرور الحالية مطلوبة',
    newPasswordRequired: 'كلمة المرور الجديدة مطلوبة',
    atLeast6Chars: 'على الأقل 6 أحرف',
    confirmationRequired: 'التأكيد مطلوب',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    passwordChangedSuccess: 'تم تغيير كلمة المرور بنجاح',
    cannotChangePassword: 'لا يمكن تغيير كلمة المرور',
    repeatPassword: 'كرر كلمة المرور',
    currentEmail: 'البريد الإلكتروني الحالي',
    newEmail: 'البريد الإلكتروني الجديد',
    confirmWithPassword: 'أكد بكلمة المرور الخاصة بك',
    invalidEmailFormat: 'تنسيق بريد إلكتروني غير صالح',
    sameAsCurrentEmail: 'البريد الإلكتروني الجديد هو نفس الحالي',
    emailChangedSuccess: 'تم تغيير البريد الإلكتروني بنجاح',
    cannotChangeEmail: 'لا يمكن تغيير البريد الإلكتروني',
    
    // النسخ الاحتياطي
    autoBackupTitle: 'نسخ احتياطي تلقائي',
    dailyAutoBackup: 'نسخ احتياطي يومي تلقائي',
    lastBackup: 'آخر نسخة احتياطية',
    never: 'أبداً',
    createBackup: 'إنشاء نسخة احتياطية',
    completeBackupAllData: 'نسخة احتياطية كاملة لجميع بياناتك',
    exportJSON: 'تصدير بتنسيق JSON',
    structuredFormatReimport: 'تنسيق منظم لإعادة الاستيراد الكاملة',
    exportCSV: 'تصدير بتنسيق CSV',
    exportTransactionsCSV: 'تصدير المعاملات بتنسيق CSV',
    importData: 'استيراد البيانات',
    replaceCurrentData: 'ستستبدل هذه الميزة بياناتك الحالية. قم بإنشاء نسخة احتياطية قبل المتابعة.',
    importSuccess: 'نجح الاستيراد',
    protectFinancialData: 'حماية بياناتك المالية',
    autoBackupEnabledMessage: 'سيتم نسخ بياناتك احتياطياً تلقائياً كل يوم.',
    createBackupQuestion: 'هل تريد إنشاء نسخة احتياطية كاملة لبياناتك؟',
    createAction: 'إنشاء',
    backupCreated: 'تم إنشاء النسخة الاحتياطية بنجاح.',
    exportJSONQuestion: 'تصدير جميع البيانات بتنسيق JSON؟\n\nيشمل: الحسابات والمعاملات والفئات والميزانيات والديون وأهداف الادخار والرسوم السنوية والمعاملات المتكررة.',
    includesData: 'يشمل: الحسابات والمعاملات والفئات والميزانيات والديون وأهداف الادخار والرسوم السنوية والمعاملات المتكررة.',
    exportAction: 'تصدير',
    exportCSVQuestion: 'تصدير المعاملات بتنسيق CSV؟',
    importDataQuestion: 'ستستبدل هذه الميزة بياناتك الحالية. قم بإنشاء نسخة احتياطية قبل المتابعة.',
    importCompleted: 'اكتمل الاستيراد',
    
    // الإعدادات العامة
    mainCurrency: 'العملة الأساسية',
    appearance: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    maintenance: 'الصيانة',
    cleanDuplicates: 'تنظيف النسخ المكررة',
    cleanDuplicatesQuestion: 'حذف المعاملات المتكررة المكررة؟ هذا الإجراء لا رجعة فيه.',
    cleanDuplicatesDesc: 'حذف المعاملات المتكررة المكررة',
    cleaning: 'جاري التنظيف...',
    finished: 'انتهى',
    duplicatesDeleted: 'تم حذف المعاملة (المعاملات) المكررة',
    cannotCleanDuplicates: 'لا يمكن تنظيف النسخ المكررة',
    
    // إعدادات الإشعارات
    notificationPreferences: 'تفضيلات الإشعارات',
    transactionsNotif: 'المعاملات',
    budgetAlerts: 'تنبيهات الميزانية',
    debtReminders: 'تذكيرات الديون',
    savingsGoalsNotif: 'أهداف الادخار',
    reportsNotif: 'التقارير',
    soundEnabled: 'الصوت',
    vibrationEnabled: 'الاهتزاز',
    badgeEnabled: 'الشارة',
    testNotification: 'اختبار',
    testNotificationTitle: '🔔 إشعار تجريبي',
    testNotificationBody: 'الإشعارات تعمل بشكل صحيح!',
    testSuccess: 'نجح الاختبار!',
    notificationSent: 'تم إرسال الإشعار',
    clearAllNotifications: 'مسح الكل',
    clearNotificationsQuestion: 'هل تريد مسح جميع الإشعارات المجدولة؟',
    allNotificationsCleared: 'تم مسح جميع الإشعارات',
    scheduleDailyReminder: 'تذكير يومي',
    dailyReminderScheduled: 'تم جدولة التذكير',
    dailyReminderMessage: 'ستتلقى تذكيرًا يوميًا في الساعة 6:00 مساءً',
    viewScheduled: 'عرض المجدولة',
    scheduledNotifications: 'الإشعارات المجدولة',
    notificationSettings: 'إعدادات الإشعارات',
    activityNotifications: 'إشعارات النشاط',
    displayOptions: 'خيارات العرض',
    noScheduledNotifications: 'لا توجد إشعارات مجدولة',
    enableNotifications: 'تفعيل الإشعارات',
    receiveNotifications: 'تلقي إشعارات على جهازك',
    playSound: 'تشغيل صوت للإشعارات',
    vibrateForNotifications: 'الاهتزاز للإشعارات',
    showBadgeIcon: 'إظهار العدد على أيقونة التطبيق',
    transactionChanges: 'إضافة، تعديل، حذف',
    budgetExceeded: 'تجاوز الميزانية، تحذيرات',
    upcomingPayments: 'مواعيد قريبة، مدفوعات',
    progressAchieved: 'التقدم، تحقيق الأهداف',
    monthlyStats: 'التقارير الشهرية، الإحصائيات',
    notificationsDisabled: 'الإشعارات معطلة',
    enableInSettings: 'يرجى تفعيل الإشعارات في إعدادات جهازك',
    loadingSettings: 'تحميل الإعدادات...',
    pushNotifWork: 'الإشعارات الفورية تعمل فقط على جهاز فعلي.',
    locallyStored: 'يتم إرسال الإشعارات محليًا ولا تحتاج إلى اتصال بالإنترنت.',
    
    // إعدادات الأمان
    biometricAuth: 'المصادقة البيومترية',
    enableBiometric: 'تفعيل البصمة',
    protectWithBiometric: 'احمِ بياناتك ببصمة الإصبع',
    notAvailableDevice: 'غير متوفر على هذا الجهاز',
    autoLock: 'القفل التلقائي',
    autoLockDesc: 'قفل التطبيق بعد عدم النشاط',
    lockDelay: 'تأخير القفل',
    immediate: 'فوري',
    oneMinute: 'دقيقة واحدة',
    fiveMinutes: '5 دقائق',
    fifteenMinutes: '15 دقيقة',
    thirtyMinutes: '30 دقيقة',
    oneHour: 'ساعة واحدة',
    securityEnabled: 'تم تفعيل الأمان',
    biometricEnabledMessage: 'تم تفعيل المصادقة البيومترية. سيتم قفل التطبيق في كل مرة تبدأ فيها.',
    cannotEnableSecurity: 'لا يمكن تفعيل الأمان',
    cannotModifyAutoLock: 'لا يمكن تعديل القفل التلقائي',
    cannotModifyDelay: 'لا يمكن تعديل التأخير',
    lockDelayQuestion: 'تأخير القفل',
    afterImmediate: 'خروج فوري',
    afterOneMinute: 'دقيقة واحدة',
    afterXMinutes: 'دقائق',
    afterOneHour: 'ساعة واحدة',
    
    // شاشة حول
    helpSupport: 'المساعدة والدعم',
    getHelp: 'احصل على المساعدة',
    termsOfService: 'شروط الاستخدام',
    readTerms: 'قراءة الشروط',
    privacyPolicy: 'سياسة الخصوصية',
    dataProtection: 'حماية البيانات',
    comingSoon: 'ستكون هذه الميزة متاحة قريبًا',
    appInfo: 'معلومات',
    manageFinancesSmartly: 'إدارة أموالك بذكاء',
    madeWithLove: 'صنع بـ ❤️ من أجلك',
    
    // أسماء الفئات - الدخل
    cat_salary: '💼 الراتب',
    cat_secondary_income: '📈 دخل إضافي',
    cat_net_salary: 'الراتب الصافي',
    cat_bonus: 'مكافآت / عمل إضافي',
    cat_freelance: 'عمل حر',
    cat_commerce: 'تجارة / مبيعات',
    cat_commissions: 'عمولات',
    
    // أسماء الفئات - السكن
    cat_housing: '🏠 السكن والفواتير',
    cat_rent: 'إيجار / قرض',
    cat_electricity: 'كهرباء',
    cat_water: 'ماء',
    cat_internet: 'واي فاي / إنترنت',
    cat_syndic: 'رسوم المبنى',
    
    // أسماء الفئات - الطعام
    cat_food: '🛒 طعام ومشتريات',
    cat_groceries: 'بقالة',
    cat_vegetables: 'خضروات / فواكه',
    cat_meat: 'لحوم / أسماك',
    cat_cleaning_products: 'منتجات تنظيف',
    
    // أسماء الفئات - النقل
    cat_transport: '🚗 نقل وسيارة',
    cat_fuel: 'وقود',
    cat_maintenance: 'صيانة',
    cat_insurance: 'تأمين',
    cat_wash: 'غسيل السيارة',
    cat_parking: 'موقف',
    
    // أسماء الفئات - الصحة
    cat_health: '💊 الصحة',
    cat_pharmacy: 'صيدلية',
    cat_consultation: 'استشارة / تحاليل',
    cat_health_insurance: 'تأمين صحي',
    
    // أسماء الفئات - الطفل
    cat_child: '👶 طفل',
    cat_child_food: 'طعام',
    cat_hygiene: 'نظافة',
    cat_school: 'مدرسة / حضانة',
    cat_leisure: 'ترفيه',
    
    // أسماء الفئات - الاشتراكات
    cat_subscriptions: '📱 اشتراكات',
    cat_phone: 'هاتف',
    cat_apps: 'تطبيقات',
    cat_streaming: 'بث مباشر',
    
    // أسماء الفئات - شخصي
    cat_personal: '👤 نفقات شخصية',
    cat_clothes: 'ملابس',
    cat_haircut: 'حلاقة',
    cat_perfume: 'عطور',
    cat_outings: 'خروجات',
    
    // أسماء الفئات - المنزل
    cat_house: '🏡 منزل',
    cat_kitchen: 'مطبخ / أدوات',
    cat_decoration: 'ديكور',
    cat_tools: 'أدوات / إصلاحات',
    
    // أسماء الفئات - متنوع
    cat_misc: '🎁 متنوع وطوارئ',
    cat_gifts: 'هدايا',
    cat_family_help: 'مساعدة عائلية',
    cat_unexpected: 'غير متوقع',
  },
};

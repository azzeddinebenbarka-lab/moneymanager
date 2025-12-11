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
  analytics: string;
  appSlogan: string;
  lightMode: string;
  darkMode: string;
  
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
  transactionCreated: string;
  recurringTransactionCreated: string;
  cannotAddTransaction: string;
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
  
  // Annual charge categories
  ac_taxes: string;
  ac_insurance: string;
  ac_subscriptions: string;
  ac_maintenance: string;
  ac_education: string;
  ac_licenses: string;
  ac_memberships: string;
  ac_healthcare: string;
  ac_other: string;
  
  // Annual charge form
  fillAllRequiredFields: string;
  enterValidChargeAmount: string;
  selectAccountForAutoDeduct: string;
  recurrenceYearly: string;
  recurrenceMonthly: string;
  recurrenceQuarterly: string;
  recurrenceOneTime: string;
  normalType: string;
  obligatoryType: string;
  recommendedType: string;
  newAnnualCharge: string;
  newIslamicCharge: string;
  chargeCreatedSuccess: string;
  cannotCreateCharge: string;
  cannotLoadCharge: string;
  chargeUpdatedSuccess: string;
  cannotUpdateCharge: string;
  editCharge: string;
  newCharge: string;
  islamicChargeType: string;
  chargeName: string;
  chargeNamePlaceholder: string;
  arabicNameOptional: string;
  arabicNamePlaceholder: string;
  amountPlaceholder: string;
  associatedAccount: string;
  selectAccountHelper: string;
  autoDeductActive: string;
  manualPaymentRequired: string;
  recurrence: string;
  reminderDaysBefore: string;
  reminderPlaceholder: string;
  reminderHelper: string;
  notesPlaceholder: string;
  selectAnAccount: string;
  autoDeductHelper: string;
  recurrenceHelper: string;
  autoDeductActiveHelper: string;
  autoDeductInactiveHelper: string;
  
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
  
  // Search screen
  smartSearch: string;
  searchHint: string;
  noResults: string;
  tryDifferentSearch: string;
  result: string;
  results: string;
  all: string;
  annualCharges: string;
  noName: string;
  
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
  recurringTransaction: string;
  recurringTransactionHelper: string;
  frequency: string;
  endDateOptional: string;
  enable: string;
  disable: string;
  selectAccountRequired: string;
  loadingAccounts: string;
  loadingError: string;
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
  
  // Formulaires
  accountNameRequired: string;
  initialBalanceRequired: string;
  invalidBalance: string;
  accountSaveError: string;
  editAccount: string;
  newAccount: string;
  accountNameLabel: string;
  accountTypeLabelRequired: string;
  initialBalanceLabel: string;
  currencyLabel: string;
  colorLabel: string;
  accountStatusLabel: string;
  previewLabel: string;
  accountNamePlaceholder: string;
  balancePlaceholder: string;
  accountNamePreview: string;
  typePreview: string;
  selectCategoryRequired: string;
  invalidAmountForm: string;
  budgetNameLabel: string;
  budgetCategoryLabel: string;
  budgetAmountLabel: string;
  budgetAmountDisplay: string;
  periodLabel: string;
  startDateLabel: string;
  endDateOptionalLabel: string;
  activeBudgetLabel: string;
  budgetActiveHelper: string;
  budgetSuspendedHelper: string;
  targetAmountPositive: string;
  goalNameLabel: string;
  targetAmountLabel: string;
  targetDateLabel: string;
  selectSavingsAccountRequired: string;
  monthlyContributionPositive: string;
  categoryLabel: string;
  savingsAccountLabel: string;
  contributionSourceAccountLabel: string;
  monthlyContributionCalculationLabel: string;
  manualMode: string;
  autoMode: string;
  monthlyContributionLabel: string;
  estimatedAchievementLabel: string;
  deleteGoalTitle: string;
  refundToSourceAccount: string;
  deleteRelatedTransactions: string;
  deletingGoal: string;
  automaticSystemTransaction: string;
  transactionDetail: string;
  
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
  noCategoryFound: string;
  expensesPlural: string;
  mainCategory: string;
  preview: string;
  resetCategories: string;
  resetCategoriesConfirm: string;
  resetCategoriesButton: string;
  resetCategoriesSuccess: string;
  resetCategoriesError: string;
  categoriesInstalled: string;
  categoryNamePlaceholder: string;
  subcategoryNamePlaceholder: string;
  subcategoryOf: string;
  cancelButton: string;
  modifyButton: string;
  createButton: string;
  
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
  savingsGoalPlaceholder: string;
  targetAmountHint: string;
  noSavingsAccountFound: string;
  createSavingsAccountFirst: string;
  selectContributionSource: string;
  calculatedAutomatically: string;
  contributionPrefix: string;
  withThisContribution: string;
  youWillReachGoalOn: string;
  toReachGoalByDate: string;
  youMustSave: string;
  perMonth: string;
  creatingGoal: string;
  
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
  errorLabel: string;
  pleaseSelectSourceAccount: string;
  pleaseSelectSavingsDestination: string;
  pleaseEnterValidAmount: string;
  insufficientBalanceTitle: string;
  pleaseSelectSourceDestination: string;
  pleaseEnterCategoryName: string;
  tooManyAttempts: string;
  cannotScheduleReminder: string;
  cannotDeleteTransaction: string;
  cannotCreateBudget: string;
  cannotLoadBackups: string;
  cannotCreateBackup: string;
  cannotRestoreBackup: string;
  cannotDeleteBackup: string;
  cannotModifyCloudConfig: string;
  cannotResetPassword: string;
  cannotCreateAccount: string;
  cannotModifyAccount: string;
  cannotChangeCurrency: string;
  cannotDeleteCategory: string;
  pleaseCloseReopenApp: string;
  pleaseFillDescription: string;
  pleaseFillAmount: string;
  pleaseSelectCategory: string;
  pleaseSelectAccount: string;
  pleaseSelectFrequency: string;
  confirmPasswordRequired: string;
  
  // Transfer Screen
  transferBetweenAccounts: string;
  secureTransfer: string;
  secureTransferDescription: string;
  fromAccount: string;
  toAccount: string;
  transferAmount: string;
  descriptionOptional: string;
  transferSummary: string;
  from: string;
  to: string;
  newSourceBalance: string;
  newDestinationBalance: string;
  performTransfer: string;
  transferInProgress: string;
  transferSuccess: string;
  transferSuccessMessage: string;
  insufficientBalance: string;
  insufficientBalanceMessage: string;
  transferPlaceholder: string;
  balance: string;
  
  // Buttons and actions
  addButton: string;
  complete: string;
  addPayment: string;
  paymentAmount: string;
  goalReachedBadge: string;
  amountCannotExceedRemaining: string;
  
  // Account Detail Screen
  accountDetails: string;
  noDescription: string;
  noTransaction: string;
  addTransactionButton: string;
  automaticTransactions: string;
  automaticTransactionInfo: string;
  seeAll: string;
  accountNotFound: string;
  backButton: string;
  loadingAccount: string;
  accountSuccessModified: string;
  deleteAccountTitle: string;
  deleteAccountMessage: string;
  actions: string;
  expense: string;
  revenue: string;
  transfer: string;
  informations: string;
  accountType: string;
  creationDate: string;
  transactionCount: string;
  dangerZone: string;
  deletionWarning: string;
  deleteAccountButton: string;
  cash: string;
  bankAccount: string;
  cardAccount: string;
  savingsAccount: string;
  seeRemaining: string;
  insufficientBalanceMessage: string;
  warningLabel: string;
  exceedsGoalWarning: string;
  savedAmount: string;
  transactionsLinked: string;
  transactionAssociated: string;
  hideDetails: string;
  seeDetails: string;
  transactionsToDelete: string;
  moreTransactions: string;
  whatDoWithSavedMoney: string;
  moneyWillBeTransferred: string;
  keepOnSavingsAccount: string;
  moneyWillRemain: string;
  transactionsManagement: string;
  keepTransactions: string;
  transferHistoryKept: string;
  moneyWillStayWarning: string;
  transactionsContainingWillBeDeleted: string;
  linkedTransactionsWillBeKept: string;
  willBeDeleted: string;
  savingsTransfersWillBeDeleted: string;
  and: string;
  
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
  noAccounts: string;
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
  cannotModifySettings: string;
  exportJSONSuccess: string;
  exportFailed: string;
  cannotExportData: string;
  cannotExportTransactions: string;
  exportError: string;
  exportCompleted: string;
  cannotImportData: string;
  cloudBackup: string;
  cloudBackupTitle: string;
  cloudBackupMessage: string;
  configureCloud: string;
  cloudProviders: string;
  soon: string;
  importDataTitle: string;
  restoreBackup: string;
  importFromJSONorCSV: string;
  importWarning: string;
  dataSecurity: string;
  dataSecurityMessage: string;
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
  
  // Alert Messages
  budgetExceededTitle: string;
  budgetExceededMessage: string;
  budgetNearLimitTitle: string;
  budgetNearLimitMessage: string;
  unusualSpendingTitle: string;
  unusualSpendingMessage: string;
  largeTransactionTitle: string;
  largeTransactionMessage: string;
  debtPaymentDueTitle: string;
  debtPaymentDueMessage: string;
  savingsGoalNearTitle: string;
  savingsGoalNearMessage: string;
  lowBalanceTitle: string;
  lowBalanceMessage: string;
  dailySummaryTitle: string;
  dailySummaryMessage: string;
  goalReachedTitle: string;
  goalReachedMessage: string;
  billReminderTitle: string;
  billReminderMessage: string;
  debtDueTitle: string;
  debtDueMessage: string;
  monthlyReportTitle: string;
  monthlyReportMessage: string;
  endOfMonthTitle: string;
  endOfMonthMessage: string;
  
  // Form validation messages
  noTransactionSelected: string;
  transactionNotFound: string;
  cannotLoadTransaction: string;
  enterValidAmount: string;
  selectCategory: string;
  selectAccount: string;
  success: string;
  transactionUpdatedSuccess: string;
  cannotUpdateTransaction: string;
  confirmation: string;
  transactionDeletedSuccess: string;
  cannotDeleteTransaction: string;
  fillAllRequiredFields: string;
  budgetUpdatedSuccess: string;
  cannotUpdateBudget: string;
  cannotLoadBudget: string;
  transferError: string;
  transferErrorMessage: string;
  deleteTransactionTitle: string;
  deleteTransactionMessage: string;
  currentSavingsPositive: string;
  savingsGoalCreatedSuccess: string;
  cannotCreateSavingsGoal: string;
  cannotCreateAccount: string;
  missingIdentifier: string;
  accountUpdatedSuccess: string;
  cannotUpdateAccount: string;
  deleteAccountTitle: string;
  deleteAccountMessage: string;
  accountDeletedSuccess: string;
  cannotDeleteAccount: string;
  
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
  confirmButton: string;
  biometricInfoText: string;
  
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
  
  // Noms des catégories - Catégories simplifiées
  cat_entertainment: string;
  cat_business: string;
  cat_investment: string;
  cat_education: string;
  cat_bills: string;
  cat_other_income: string;
  
  // Catégories spéciales (système)
  cat_debt: string;
  cat_savings: string;
  cat_savings_refund: string;
  cat_transfer: string;
  cat_annual_charge: string;
  
  // Types de dettes
  debtPersonal: string;
  debtMortgage: string;
  debtCreditCard: string;
  debtLoan: string;
  
  // Périodes de budget
  dailyPeriod: string;
  weeklyPeriod: string;
  monthlyPeriod: string;
  yearlyPeriod: string;
  
  // Catégories d'épargne
  savingsVacation: string;
  savingsEmergency: string;
  savingsHouse: string;
  savingsCar: string;
  savingsEducation: string;
  savingsRetirement: string;
  savingsOther: string;
  
  // Labels de formulaires dettes
  progression: string;
  monthlyPaymentLabel: string;
  interestRate: string;
  typeLabel: string;
  nextDue: string;
  
  // Fréquences de récurrence
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
  recurring: string;
  
  // Status généraux
  statusActive: string;
  statusInactive: string;
  
  // Labels divers
  totalInterests: string;
  interestsPaid: string;
  amortizationPlan: string;
  month: string;
  monthlyPaymentColumn: string;
  capital: string;
  interests: string;
  remainingDue: string;
  seeLess: string;
  seeMore: string;
  paymentEligible: string;
  applyToNewDebt: string;
  manageMyDebts: string;
  averageMonthly: string;
  byMonth: string;
  perMonth: string;
  monthsCount: string;
  interestsEarned: string;
  savingsCalculator: string;
  viewByMonth: string;
  retry: string;
  validate: string;
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
    analytics: 'Analyses',
    appSlogan: 'Maîtrise ton budget, maîtrise ta vie',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    
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
    transactionCreated: 'Transaction ajoutée avec succès',
    recurringTransactionCreated: 'Transaction récurrente ajoutée avec succès',
    cannotAddTransaction: 'Impossible d\'ajouter la transaction',
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
    
    // Search screen
    smartSearch: 'Recherche intelligente',
    searchHint: 'Trouvez rapidement vos transactions, charges annuelles et catégories',
    noResults: 'Aucun résultat',
    tryDifferentSearch: 'Essayez avec d\'autres mots-clés',
    result: 'résultat',
    results: 'résultats',
    all: 'Tout',
    annualCharges: 'Charges',
    noName: 'Sans nom',
    
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
    recurringTransaction: 'Transaction récurrente',
    recurringTransactionHelper: 'Cette transaction sera automatiquement créée à chaque échéance (quotidienne, hebdomadaire, mensuelle ou annuelle)',
    frequency: 'Fréquence',
    endDateOptional: 'Date de fin (optionnelle)',
    enable: 'Activer',
    disable: 'Désactiver',
    selectAccountRequired: 'Veuillez sélectionner un compte',
    loadingAccounts: 'Chargement des comptes...',
    loadingError: 'Erreur de chargement',
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
    
    // Formulaire de compte
    accountNameRequired: 'Veuillez saisir un nom pour le compte',
    initialBalanceRequired: 'Veuillez saisir un solde initial',
    invalidBalance: 'Le solde doit être un nombre valide',
    accountSaveError: 'Impossible de sauvegarder le compte',
    editAccount: 'Modifier le compte',
    newAccount: 'Nouveau compte',
    accountNameLabel: 'Nom du compte *',
    accountTypeLabelRequired: 'Type de compte *',
    initialBalanceLabel: 'Solde initial *',
    currencyLabel: 'Devise',
    colorLabel: 'Couleur',
    accountStatusLabel: 'Statut du compte',
    previewLabel: 'Aperçu',
    accountNamePlaceholder: 'Ex: Compte courant, Portefeuille...',
    balancePlaceholder: '0,00',
    accountNamePreview: 'Nom du compte',
    typePreview: 'Type',
    
    // Formulaire de budget
    selectCategoryRequired: 'Veuillez sélectionner une catégorie',
    invalidAmountForm: 'Veuillez saisir un montant valide',
    budgetNameLabel: 'Nom du budget',
    budgetCategoryLabel: 'Catégorie',
    budgetAmountLabel: 'Montant du budget',
    budgetAmountDisplay: 'Montant',
    periodLabel: 'Période',
    startDateLabel: 'Date de début',
    endDateOptionalLabel: 'Date de fin (optionnelle)',
    activeBudgetLabel: 'Budget actif',
    budgetActiveHelper: 'Le budget sera pris en compte dans les alertes et statistiques',
    budgetSuspendedHelper: 'Le budget est suspendu',
    
    // Formulaire d'objectif d'épargne
    targetAmountPositive: 'Le montant cible doit être supérieur à 0',
    goalNameLabel: 'Nom de l\'objectif *',
    targetAmountLabel: 'Montant cible *',
    targetDateLabel: 'Date cible',
    selectSavingsAccountRequired: 'Veuillez sélectionner un compte d\'épargne',
    monthlyContributionPositive: 'La contribution mensuelle doit être supérieure à 0',
    categoryLabel: 'Catégorie',
    savingsAccountLabel: 'Compte d\'épargne *',
    contributionSourceAccountLabel: 'Compte source des contributions',
    monthlyContributionCalculationLabel: 'Calcul de la mensualité',
    manualMode: 'Manuel',
    autoMode: 'Automatique',
    monthlyContributionLabel: 'Contribution mensuelle',
    estimatedAchievementLabel: 'Atteinte estimée',
    deleteGoalTitle: 'Supprimer l\'objectif',
    refundToSourceAccount: '💸 Rembourser sur le compte source',
    deleteRelatedTransactions: '🗑️ Supprimer les transactions liées',
    deletingGoal: 'Suppression...',
    automaticSystemTransaction: 'Transaction automatique du système',
    transactionDetail: 'Détail de la transaction',
    
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
    noCategoryFound: 'Aucune catégorie trouvée',
    expensesPlural: 'Dépenses',
    mainCategory: 'Catégorie principale',
    preview: 'Aperçu',
    resetCategories: 'Réinitialiser les catégories',
    resetCategoriesConfirm: 'Êtes-vous sûr de vouloir réinitialiser toutes les catégories ? Cette action supprimera DÉFINITIVEMENT toutes les anciennes catégories et installera les 50 nouvelles catégories.',
    resetCategoriesButton: 'Réinitialiser avec toutes les catégories',
    resetCategoriesSuccess: 'Les 50 nouvelles catégories ont été installées avec succès !',
    resetCategoriesError: 'Impossible de réinitialiser les catégories.',
    categoriesInstalled: 'Catégories installées',
    categoryNamePlaceholder: 'Nom de la catégorie',
    subcategoryNamePlaceholder: 'Nom de la sous-catégorie',
    subcategoryOf: 'Sous-catégorie de:',
    cancelButton: 'Annuler',
    modifyButton: 'Modifier',
    createButton: 'Créer',
    
    // Catégories de charges annuelles
    ac_taxes: 'Impôts',
    ac_insurance: 'Assurances',
    ac_subscriptions: 'Abonnements',
    ac_maintenance: 'Maintenance',
    ac_education: 'Éducation',
    ac_licenses: 'Licences',
    ac_memberships: 'Adhésions',
    ac_healthcare: 'Santé',
    ac_other: 'Autres',
    
    // Formulaire de charges annuelles
    fillAllRequiredFields: 'Veuillez remplir tous les champs obligatoires',
    enterValidChargeAmount: 'Veuillez saisir un montant valide',
    selectAccountForAutoDeduct: 'Veuillez sélectionner un compte pour le prélèvement automatique',
    recurrenceYearly: 'Annuelle',
    recurrenceMonthly: 'Mensuelle',
    recurrenceQuarterly: 'Trimestrielle',
    recurrenceOneTime: 'Ponctuelle',
    normalType: 'Normale',
    obligatoryType: 'Obligatoire',
    recommendedType: 'Recommandée',
    newAnnualCharge: 'Nouvelle Charge Annuelle',
    newIslamicCharge: 'Nouvelle Charge Islamique',
    chargeCreatedSuccess: 'Charge annuelle créée avec succès',
    cannotCreateCharge: 'Impossible de créer la charge annuelle',
    cannotLoadCharge: 'Impossible de charger la charge annuelle',
    chargeUpdatedSuccess: 'Charge annuelle modifiée avec succès',
    cannotUpdateCharge: 'Impossible de modifier la charge annuelle',
    editCharge: 'Modifier la Charge',
    newCharge: 'Nouvelle Charge',
    islamicChargeType: 'Type de charge islamique *',
    chargeName: 'Nom de la charge *',
    chargeNamePlaceholder: 'Ex: Assurance habitation, Impôts, Aïd al-Fitr...',
    arabicNameOptional: 'Nom arabe (optionnel)',
    arabicNamePlaceholder: 'Ex: عيد الفطر',
    amountPlaceholder: '0,00',
    associatedAccount: 'Compte associé',
    selectAccountHelper: 'Sélectionnez le compte pour le prélèvement automatique',
    autoDeductActive: 'Le montant sera automatiquement débité à la date d\'échéance',
    manualPaymentRequired: 'Paiement manuel requis',
    recurrence: 'Récurrence',
    reminderDaysBefore: 'Rappel (jours avant)',
    reminderPlaceholder: '7',
    reminderHelper: 'Nombre de jours avant l\'échéance pour le rappel',
    notesPlaceholder: 'Informations supplémentaires...',
    selectAnAccount: 'Sélectionner un compte',
    autoDeductHelper: '⚡ Sélectionnez un compte pour activer le prélèvement automatique à la date d\'échéance',
    recurrenceHelper: '💡 Quand vous payez une charge récurrente, une nouvelle occurrence sera automatiquement créée pour la prochaine échéance',
    autoDeductActiveHelper: 'Le montant sera automatiquement débité du compte sélectionné à la date d\'échéance',
    autoDeductInactiveHelper: 'Activez pour débiter automatiquement le compte à l\'échéance',
    
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
    savingsGoalPlaceholder: 'Ex: Achat voiture, Vacances en Grèce...',
    targetAmountHint: 'Objectif:',
    noSavingsAccountFound: 'Aucun compte d\'épargne trouvé. Créez d\'abord un compte d\'épargne.',
    createSavingsAccountFirst: 'Créez d\'abord un compte d\'épargne',
    selectContributionSource: 'Sélectionnez le compte depuis lequel les fonds seront transférés',
    calculatedAutomatically: '(calculée automatiquement)',
    contributionPrefix: 'Contribution:',
    withThisContribution: 'Avec cette contribution, vous atteindrez votre objectif le',
    youWillReachGoalOn: 'Vous atteindrez votre objectif le',
    toReachGoalByDate: 'Pour atteindre votre objectif à la date choisie, vous devez épargner',
    youMustSave: 'vous devez épargner',
    perMonth: 'par mois',
    creatingGoal: 'Création en cours...',
    
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
    errorLabel: 'Erreur',
    pleaseSelectSourceAccount: 'Veuillez sélectionner un compte source pour la contribution',
    pleaseSelectSavingsDestination: 'Veuillez sélectionner un compte d\'épargne de destination',
    pleaseEnterValidAmount: 'Veuillez saisir un montant valide',
    insufficientBalanceTitle: 'Solde insuffisant',
    pleaseSelectSourceDestination: 'Veuillez sélectionner les comptes source et destination',
    pleaseEnterCategoryName: 'Veuillez saisir un nom pour la catégorie',
    tooManyAttempts: 'Trop de tentatives échouées. Veuillez réessayer.',
    cannotScheduleReminder: 'Impossible de programmer le rappel',
    cannotDeleteTransaction: 'Impossible de supprimer la transaction',
    cannotCreateBudget: 'Impossible de créer le budget',
    cannotLoadBackups: 'Impossible de charger les sauvegardes',
    cannotCreateBackup: 'Impossible de créer la sauvegarde',
    cannotRestoreBackup: 'Impossible de restaurer la sauvegarde',
    cannotDeleteBackup: 'Impossible de supprimer la sauvegarde',
    cannotModifyCloudConfig: 'Impossible de modifier la configuration cloud',
    cannotResetPassword: 'Impossible de réinitialiser le mot de passe',
    cannotCreateAccount: 'Impossible de créer le compte',
    cannotModifyAccount: 'Impossible de modifier le compte',
    cannotChangeCurrency: 'Impossible de changer la devise',
    cannotDeleteCategory: 'Impossible de supprimer la catégorie',
    pleaseCloseReopenApp: 'Veuillez fermer et rouvrir l\'application',
    pleaseFillDescription: 'Veuillez saisir une description',
    pleaseFillAmount: 'Veuillez saisir un montant valide',
    pleaseSelectCategory: 'Veuillez sélectionner une catégorie',
    pleaseSelectAccount: 'Veuillez sélectionner un compte',
    pleaseSelectFrequency: 'Veuillez sélectionner une fréquence pour la transaction récurrente',
    confirmPasswordRequired: 'Veuillez confirmer le mot de passe',
    
    // Transfer Screen
    transferBetweenAccounts: 'Transfert entre comptes',
    secureTransfer: 'Transfert sécurisé',
    secureTransferDescription: 'Transférez de l\'argent entre vos comptes en toute sécurité',
    fromAccount: 'Depuis le compte',
    toAccount: 'Vers le compte',
    transferAmount: 'Montant du transfert',
    descriptionOptional: 'Description (optionnelle)',
    transferSummary: 'Récapitulatif du transfert',
    from: 'De',
    to: 'Vers',
    newSourceBalance: 'Nouveau solde source',
    newDestinationBalance: 'Nouveau solde destination',
    performTransfer: 'Effectuer le transfert',
    transferInProgress: 'Transfert en cours...',
    transferSuccess: '✅ Transfert réussi',
    transferSuccessMessage: 'Transfert de {amount} effectué avec succès',
    insufficientBalance: '❌ Solde insuffisant',
    insufficientBalanceMessage: 'Solde disponible: {balance}',
    transferPlaceholder: 'Ex: Transfert mensuel d\'épargne',
    balance: 'Solde',
    
    // Buttons and actions
    addButton: 'Ajouter',
    complete: 'Terminer',
    addPayment: 'Ajouter un paiement',
    paymentAmount: 'Montant du paiement',
    goalReachedBadge: '🎉 Objectif Atteint !',
    amountCannotExceedRemaining: 'Le montant ne peut pas dépasser le solde restant',
    
    // Account Detail Screen
    accountDetails: 'Détails du compte',
    noDescription: 'Sans description',
    noTransaction: 'Aucune transaction',
    addTransactionButton: 'Ajouter une transaction',
    automaticTransactions: 'transaction(s) automatique(s)',
    automaticTransactionInfo: 'Les transactions de dettes, épargne et charges annuelles sont en lecture seule',
    seeAll: 'Voir tout',
    accountNotFound: 'Compte non trouvé',
    backButton: 'Retour',
    loadingAccount: 'Chargement du compte...',
    accountSuccessModified: 'Compte modifié avec succès',
    deleteAccountTitle: 'Supprimer le compte',
    deleteAccountMessage: 'Êtes-vous sûr de vouloir supprimer le compte "{accountName}" ?\n\nCette action est irréversible et supprimera toutes les données associées.',
    actions: 'Actions',
    expense: 'Dépense',
    revenue: 'Revenu',
    transfer: 'Transfert',
    informations: 'Informations',
    accountType: 'Type de compte',
    creationDate: 'Date de création',
    transactionCount: 'Nombre de transactions',
    dangerZone: 'Zone de danger',
    deletionWarning: 'La suppression est irréversible et supprimera toutes les données associées à ce compte.',
    deleteAccountButton: 'Supprimer le compte',
    cash: 'Espèces',
    bankAccount: 'Compte bancaire',
    cardAccount: 'Carte',
    savingsAccount: 'Compte épargne',
    seeRemaining: 'Voir les {count} transactions restantes',
    insufficientBalanceMessage: 'Le solde de {accountName} est de {balance}. Vous ne pouvez pas transférer {amount}.',
    warningLabel: 'Attention',
    exceedsGoalWarning: 'Cette contribution dépassera votre objectif de {targetAmount}. Souhaitez-vous continuer ?',
    savedAmount: 'Montant épargné',
    transactionsLinked: 'Transactions liées détectées',
    transactionAssociated: 'transaction associée',
    hideDetails: 'Masquer',
    seeDetails: 'Voir',
    transactionsToDelete: 'Transactions qui seront supprimées :',
    moreTransactions: 'autre transaction',
    whatDoWithSavedMoney: 'Que souhaitez-vous faire de l\'argent épargné ?',
    moneyWillBeTransferred: 'L\'argent sera transféré vers les comptes d\'origine',
    keepOnSavingsAccount: '💰 Garder sur le compte épargne',
    moneyWillRemain: 'L\'argent restera disponible pour d\'autres objectifs',
    transactionsManagement: 'Gestion des transactions',
    keepTransactions: '📊 Garder les transactions',
    transferHistoryKept: 'L\'historique des transferts sera conservé',
    moneyWillStayWarning: '⚠️ L\'argent restera sur votre compte épargne mais ne sera plus associé à un objectif.',
    transactionsContainingWillBeDeleted: 'transaction contenant "{goalName}" dans leur description seront supprimée',
    linkedTransactionsWillBeKept: 'Les {count} transaction liées seront conservées dans votre historique.',
    willBeDeleted: 'seront supprimée',
    savingsTransfersWillBeDeleted: 'Les transactions de transfert vers l\'\u00e9pargne seront supprimées',
    and: 'et',
    
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
    noAccounts: 'Aucun compte disponible',
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
    cannotModifySettings: 'Impossible de modifier les paramètres',
    exportJSONSuccess: 'Export JSON complet créé avec succès',
    exportFailed: 'Échec de l\'export',
    cannotExportData: 'Impossible d\'exporter les données',
    cannotExportTransactions: 'Impossible d\'exporter les transactions',
    exportError: 'Erreur',
    exportCompleted: 'Export terminé',
    cannotImportData: 'Impossible d\'importer les données',
    cloudBackup: 'Sauvegarde cloud',
    cloudBackupTitle: 'Sauvegarde cloud',
    cloudBackupMessage: 'Cette fonctionnalité sera disponible prochainement. Elle vous permettra de sauvegarder vos données sur Google Drive, iCloud ou Dropbox.',
    configureCloud: 'Configurer le cloud',
    cloudProviders: 'Google Drive, iCloud, Dropbox',
    soon: 'Bientôt',
    importDataTitle: 'Import de données',
    restoreBackup: 'Restaurer une sauvegarde',
    importFromJSONorCSV: 'Importer depuis JSON ou CSV',
    importWarning: 'L\'import remplacera toutes vos données actuelles. Créez une sauvegarde avant de procéder.',
    dataSecurity: 'Sécurité de vos données',
    dataSecurityMessage: 'Les sauvegardes sont stockées localement sur votre appareil. Pensez à exporter régulièrement vos données vers un stockage externe.',
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
    
    // Alert Messages
    budgetExceededTitle: 'Budget dépassé',
    budgetExceededMessage: 'Le budget "{budgetName}" ({categoryName}) a été dépassé de {amount}',
    budgetNearLimitTitle: 'Budget presque épuisé',
    budgetNearLimitMessage: 'Le budget "{budgetName}" ({categoryName}) est utilisé à {percentage}%',
    unusualSpendingTitle: 'Dépense inhabituelle',
    unusualSpendingMessage: 'Dépense inhabituelle de {amount} dans {categoryName}',
    largeTransactionTitle: '💸 Transaction importante détectée',
    largeTransactionMessage: 'Une transaction de {amount} a été enregistrée.',
    debtPaymentDueTitle: '📅 Paiement de dette imminent',
    debtPaymentDueMessage: 'Le paiement pour "{debtName}" est dû dans {days} jour(s).',
    savingsGoalNearTitle: '🎯 Objectif d\'épargne presque atteint',
    savingsGoalNearMessage: '"{goalName}" est complété à {progress}%.',
    lowBalanceTitle: '⚠️ Solde faible détecté',
    lowBalanceMessage: 'Le compte "{accountName}" a un solde faible: {balance}',
    dailySummaryTitle: '📊 Résumé financier du jour',
    dailySummaryMessage: 'Aujourd\'hui: {income} de revenus, {expenses} de dépenses. Solde: {netFlow}',
    goalReachedTitle: '🎉 Objectif atteint !',
    goalReachedMessage: 'Félicitations ! "{goalName}" - {amount}',
    billReminderTitle: '📅 Rappel de paiement',
    billReminderMessage: '{billName} - {amount} - Échéance: {dueDate}',
    debtDueTitle: '⏰ Dette à rembourser',
    debtDueMessage: '{debtName} - {amount} dans {daysLeft} jour(s)',
    monthlyReportTitle: '📊 Rapport mensuel disponible',
    monthlyReportMessage: 'Votre rapport pour {month} {year} est prêt',
    endOfMonthTitle: '📊 Fin du mois',
    endOfMonthMessage: 'Résumé de {month} {year}: {income} revenus, {expenses} dépenses',
    
    // Messages de validation des formulaires
    noTransactionSelected: 'Aucune transaction sélectionnée',
    transactionNotFound: 'Transaction non trouvée',
    cannotLoadTransaction: 'Impossible de charger la transaction',
    enterValidAmount: 'Veuillez saisir un montant valide',
    selectCategory: 'Veuillez sélectionner une catégorie',
    selectAccount: 'Veuillez sélectionner un compte',
    success: 'Succès',
    transactionUpdatedSuccess: 'Transaction modifiée avec succès',
    cannotUpdateTransaction: 'Impossible de modifier la transaction',
    confirmation: 'Confirmation',
    transactionDeletedSuccess: 'Transaction supprimée avec succès',
    cannotDeleteTransaction: 'Impossible de supprimer la transaction',
    fillAllRequiredFields: 'Veuillez remplir tous les champs obligatoires',
    budgetUpdatedSuccess: 'Budget modifié avec succès',
    cannotUpdateBudget: 'Impossible de modifier le budget',
    cannotLoadBudget: 'Impossible de charger le budget',
    
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
    confirmButton: 'Confirmer',
    biometricInfoText: 'L\'authentification biométrique utilise le matériel sécurisé de votre appareil pour protéger vos données financières.',
    
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
    
    // Noms des catégories - Catégories simplifiées
    cat_entertainment: '🎮 Loisirs',
    cat_business: '💼 Business',
    cat_investment: '📈 Investissement',
    cat_education: '🎓 Éducation',
    cat_bills: '📄 Factures',
    cat_other_income: '💰 Autres revenus',
    
    // Catégories spéciales (système)
    cat_debt: 'Dette',
    cat_savings: 'Épargne',
    cat_savings_refund: 'Remboursement épargne',
    cat_transfer: 'Transfert',
    cat_annual_charge: 'Charge annuelle',
    
    // Types de dettes
    debtPersonal: 'Personnel',
    debtMortgage: 'Immobilier',
    debtCreditCard: 'Carte crédit',
    debtLoan: 'Prêt',
    
    // Périodes de budget
    dailyPeriod: 'Quotidien',
    weeklyPeriod: 'Hebdomadaire',
    monthlyPeriod: 'Mensuel',
    yearlyPeriod: 'Annuel',
    
    // Catégories d'épargne
    savingsVacation: 'Vacances',
    savingsEmergency: 'Urgence',
    savingsHouse: 'Maison',
    savingsCar: 'Voiture',
    savingsEducation: 'Éducation',
    savingsRetirement: 'Retraite',
    savingsOther: 'Autre',
    
    // Labels de formulaires dettes
    progression: 'Progression',
    monthlyPaymentLabel: 'Mensualité',
    interestRate: 'Taux d\'intérêt',
    typeLabel: 'Type',
    nextDue: 'Prochaine échéance',
    
    // Fréquences de récurrence
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuelle',
    yearly: 'Annuelle',
    recurring: 'Récurrente',
    
    // Status généraux
    statusActive: 'Actif',
    statusInactive: 'Inactif',
    
    // Labels divers
    totalInterests: 'Intérêts totaux',
    interestsPaid: 'Intérêts payés',
    amortizationPlan: 'Plan d\'amortissement',
    month: 'Mois',
    monthlyPaymentColumn: 'Mensualité',
    capital: 'Capital',
    interests: 'Intérêts',
    remainingDue: 'Reste dû',
    seeLess: 'Voir moins',
    seeMore: 'Voir plus',
    paymentEligible: 'Paiement autorisé',
    applyToNewDebt: 'Appliquer à une nouvelle dette',
    manageMyDebts: 'Gérer mes dettes',
    averageMonthly: 'Moyenne mensuelle',
    byMonth: 'par mois',
    perMonth: '/mois',
    monthsCount: 'mois',
    interestsEarned: 'Intérêts gagnés',
    savingsCalculator: 'Calculateur d\'Épargne',
    viewByMonth: 'Vue par Mois',
    retry: 'Réessayer',
    validate: 'Valider',
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
    analytics: 'Analytics',
    appSlogan: 'Master your budget, master your life',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
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
    transactionCreated: 'Transaction added successfully',
    recurringTransactionCreated: 'Recurring transaction added successfully',
    cannotAddTransaction: 'Cannot add transaction',
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
    
    // Search screen
    smartSearch: 'Smart Search',
    searchHint: 'Quickly find your transactions, annual charges and categories',
    noResults: 'No results',
    tryDifferentSearch: 'Try different keywords',
    result: 'result',
    results: 'results',
    all: 'All',
    annualCharges: 'Charges',
    noName: 'No name',
    
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
    recurringTransaction: 'Recurring transaction',
    recurringTransactionHelper: 'This transaction will be automatically created at each scheduled date (daily, weekly, monthly or yearly)',
    frequency: 'Frequency',
    endDateOptional: 'End date (optional)',
    enable: 'Enable',
    disable: 'Disable',
    selectAccountRequired: 'Please select an account',
    loadingAccounts: 'Loading accounts...',
    loadingError: 'Loading error',
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
    
    // Account Form
    accountNameRequired: 'Please enter an account name',
    initialBalanceRequired: 'Please enter an initial balance',
    invalidBalance: 'Balance must be a valid number',
    accountSaveError: 'Unable to save account',
    editAccount: 'Edit Account',
    newAccount: 'New Account',
    accountNameLabel: 'Account Name *',
    accountTypeLabelRequired: 'Account Type *',
    initialBalanceLabel: 'Initial Balance *',
    currencyLabel: 'Currency',
    colorLabel: 'Color',
    accountStatusLabel: 'Account Status',
    previewLabel: 'Preview',
    accountNamePlaceholder: 'Ex: Checking account, Wallet...',
    balancePlaceholder: '0.00',
    accountNamePreview: 'Account Name',
    typePreview: 'Type',
    
    // Budget Form
    selectCategoryRequired: 'Please select a category',
    invalidAmountForm: 'Please enter a valid amount',
    budgetNameLabel: 'Budget Name',
    budgetCategoryLabel: 'Category',
    budgetAmountLabel: 'Budget Amount',
    budgetAmountDisplay: 'Amount',
    periodLabel: 'Period',
    startDateLabel: 'Start Date',
    endDateOptionalLabel: 'End Date (optional)',
    activeBudgetLabel: 'Active Budget',
    budgetActiveHelper: 'Budget will be included in alerts and statistics',
    budgetSuspendedHelper: 'Budget is suspended',
    
    // Savings Goal Form
    targetAmountPositive: 'Target amount must be greater than 0',
    goalNameLabel: 'Goal Name *',
    targetAmountLabel: 'Target Amount *',
    targetDateLabel: 'Target Date',
    selectSavingsAccountRequired: 'Please select a savings account',
    monthlyContributionPositive: 'Monthly contribution must be greater than 0',
    categoryLabel: 'Category',
    savingsAccountLabel: 'Savings Account *',
    contributionSourceAccountLabel: 'Contribution Source Account',
    monthlyContributionCalculationLabel: 'Monthly Contribution Calculation',
    manualMode: 'Manual',
    autoMode: 'Automatic',
    monthlyContributionLabel: 'Monthly Contribution',
    estimatedAchievementLabel: 'Estimated Achievement',
    deleteGoalTitle: 'Delete Goal',
    refundToSourceAccount: '💸 Refund to Source Account',
    deleteRelatedTransactions: '🗑️ Delete Related Transactions',
    deletingGoal: 'Deleting...',
    automaticSystemTransaction: 'Automatic system transaction',
    transactionDetail: 'Transaction Detail',
    
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
    noCategoryFound: 'No category found',
    expensesPlural: 'Expenses',
    mainCategory: 'Main category',
    preview: 'Preview',
    resetCategories: 'Reset categories',
    resetCategoriesConfirm: 'Are you sure you want to reset all categories? This will PERMANENTLY delete all old categories and install the 50 new categories.',
    resetCategoriesButton: 'Reset with all categories',
    resetCategoriesSuccess: 'The 50 new categories have been successfully installed!',
    resetCategoriesError: 'Unable to reset categories.',
    categoriesInstalled: 'Categories installed',
    categoryNamePlaceholder: 'Category name',
    subcategoryNamePlaceholder: 'Subcategory name',
    subcategoryOf: 'Subcategory of:',
    cancelButton: 'Cancel',
    modifyButton: 'Modify',
    createButton: 'Create',
    
    // Annual charge categories
    ac_taxes: 'Taxes',
    ac_insurance: 'Insurance',
    ac_subscriptions: 'Subscriptions',
    ac_maintenance: 'Maintenance',
    ac_education: 'Education',
    ac_licenses: 'Licenses',
    ac_memberships: 'Memberships',
    ac_healthcare: 'Healthcare',
    ac_other: 'Other',
    
    // Annual charge form
    fillAllRequiredFields: 'Please fill in all required fields',
    enterValidChargeAmount: 'Please enter a valid amount',
    selectAccountForAutoDeduct: 'Please select an account for automatic deduction',
    recurrenceYearly: 'Yearly',
    recurrenceMonthly: 'Monthly',
    recurrenceQuarterly: 'Quarterly',
    recurrenceOneTime: 'One-time',
    normalType: 'Normal',
    obligatoryType: 'Obligatory',
    recommendedType: 'Recommended',
    newAnnualCharge: 'New Annual Charge',
    newIslamicCharge: 'New Islamic Charge',
    chargeCreatedSuccess: 'Annual charge created successfully',
    cannotCreateCharge: 'Unable to create annual charge',
    cannotLoadCharge: 'Unable to load annual charge',
    chargeUpdatedSuccess: 'Annual charge updated successfully',
    cannotUpdateCharge: 'Unable to update annual charge',
    editCharge: 'Edit Charge',
    newCharge: 'New Charge',
    islamicChargeType: 'Islamic charge type *',
    chargeName: 'Charge name *',
    chargeNamePlaceholder: 'Ex: Home insurance, Taxes, Eid al-Fitr...',
    arabicNameOptional: 'Arabic name (optional)',
    arabicNamePlaceholder: 'Ex: عيد الفطر',
    amountPlaceholder: '0.00',
    associatedAccount: 'Associated account',
    selectAccountHelper: 'Select the account for automatic deduction',
    autoDeductActive: 'Amount will be automatically debited on due date',
    manualPaymentRequired: 'Manual payment required',
    recurrence: 'Recurrence',
    reminderDaysBefore: 'Reminder (days before)',
    reminderPlaceholder: '7',
    reminderHelper: 'Number of days before due date for reminder',
    notesPlaceholder: 'Additional information...',
    selectAnAccount: 'Select an account',
    autoDeductHelper: '⚡ Select an account to enable automatic deduction on due date',
    recurrenceHelper: '💡 When you pay a recurring charge, a new occurrence will be automatically created for the next due date',
    autoDeductActiveHelper: 'Amount will be automatically debited from the selected account on due date',
    autoDeductInactiveHelper: 'Enable to automatically debit the account on due date',
    
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
    savingsGoalPlaceholder: 'E.g., Car purchase, Trip to Greece...',
    targetAmountHint: 'Target:',
    noSavingsAccountFound: 'No savings account found. Create a savings account first.',
    createSavingsAccountFirst: 'Create a savings account first',
    selectContributionSource: 'Select the account from which funds will be transferred',
    calculatedAutomatically: '(calculated automatically)',
    contributionPrefix: 'Contribution:',
    withThisContribution: 'With this contribution, you will reach your goal on',
    youWillReachGoalOn: 'You will reach your goal on',
    toReachGoalByDate: 'To reach your goal by the chosen date, you must save',
    youMustSave: 'you must save',
    perMonth: 'per month',
    creatingGoal: 'Creating...',
    
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
    errorLabel: 'Error',
    pleaseSelectSourceAccount: 'Please select a source account for the contribution',
    pleaseSelectSavingsDestination: 'Please select a destination savings account',
    pleaseEnterValidAmount: 'Please enter a valid amount',
    insufficientBalanceTitle: 'Insufficient balance',
    pleaseSelectSourceDestination: 'Please select source and destination accounts',
    pleaseEnterCategoryName: 'Please enter a category name',
    tooManyAttempts: 'Too many failed attempts. Please try again.',
    cannotScheduleReminder: 'Cannot schedule reminder',
    cannotDeleteTransaction: 'Cannot delete transaction',
    cannotCreateBudget: 'Cannot create budget',
    cannotLoadBackups: 'Cannot load backups',
    cannotCreateBackup: 'Cannot create backup',
    cannotRestoreBackup: 'Cannot restore backup',
    cannotDeleteBackup: 'Cannot delete backup',
    cannotModifyCloudConfig: 'Cannot modify cloud configuration',
    cannotResetPassword: 'Cannot reset password',
    cannotCreateAccount: 'Cannot create account',
    cannotModifyAccount: 'Cannot modify account',
    cannotChangeCurrency: 'Cannot change currency',
    cannotDeleteCategory: 'Cannot delete category',
    pleaseCloseReopenApp: 'Please close and reopen the application',
    pleaseFillDescription: 'Please enter a description',
    pleaseFillAmount: 'Please enter a valid amount',
    pleaseSelectCategory: 'Please select a category',
    pleaseSelectAccount: 'Please select an account',
    pleaseSelectFrequency: 'Please select a frequency for the recurring transaction',
    confirmPasswordRequired: 'Please confirm the password',
    
    // Transfer Screen
    transferBetweenAccounts: 'Transfer between accounts',
    secureTransfer: 'Secure transfer',
    secureTransferDescription: 'Transfer money between your accounts securely',
    fromAccount: 'From account',
    toAccount: 'To account',
    transferAmount: 'Transfer amount',
    descriptionOptional: 'Description (optional)',
    transferSummary: 'Transfer summary',
    from: 'From',
    to: 'To',
    newSourceBalance: 'New source balance',
    newDestinationBalance: 'New destination balance',
    performTransfer: 'Perform transfer',
    transferInProgress: 'Transfer in progress...',
    transferSuccess: '✅ Transfer successful',
    transferSuccessMessage: 'Transfer of {amount} completed successfully',
    insufficientBalance: '❌ Insufficient balance',
    insufficientBalanceMessage: 'Available balance: {balance}',
    transferPlaceholder: 'E.g.: Monthly savings transfer',
    balance: 'Balance',
    
    // Buttons and actions
    addButton: 'Add',
    complete: 'Complete',
    addPayment: 'Add payment',
    paymentAmount: 'Payment amount',
    goalReachedBadge: '🎉 Goal Achieved!',
    amountCannotExceedRemaining: 'Amount cannot exceed remaining balance',
    
    // Account Detail Screen
    accountDetails: 'Account details',
    noDescription: 'No description',
    noTransaction: 'No transaction',
    addTransactionButton: 'Add a transaction',
    automaticTransactions: 'automatic transaction(s)',
    automaticTransactionInfo: 'Debt, savings and annual charge transactions are read-only',
    seeAll: 'See all',
    accountNotFound: 'Account not found',
    backButton: 'Back',
    loadingAccount: 'Loading account...',
    accountSuccessModified: 'Account successfully modified',
    deleteAccountTitle: 'Delete account',
    deleteAccountMessage: 'Are you sure you want to delete the account "{accountName}"?\n\nThis action is irreversible and will delete all associated data.',
    actions: 'Actions',
    expense: 'Expense',
    revenue: 'Income',
    transfer: 'Transfer',
    informations: 'Information',
    accountType: 'Account type',
    creationDate: 'Creation date',
    transactionCount: 'Number of transactions',
    dangerZone: 'Danger zone',
    deletionWarning: 'Deletion is irreversible and will delete all data associated with this account.',
    deleteAccountButton: 'Delete account',
    cash: 'Cash',
    bankAccount: 'Bank account',
    cardAccount: 'Card',
    savingsAccount: 'Savings account',
    seeRemaining: 'See {count} remaining transactions',
    insufficientBalanceMessage: 'The balance of {accountName} is {balance}. You cannot transfer {amount}.',
    warningLabel: 'Warning',
    exceedsGoalWarning: 'This contribution will exceed your goal of {targetAmount}. Do you want to continue?',
    savedAmount: 'Saved amount',
    transactionsLinked: 'Related transactions detected',
    transactionAssociated: 'associated transaction',
    hideDetails: 'Hide',
    seeDetails: 'See',
    transactionsToDelete: 'Transactions to be deleted:',
    moreTransactions: 'more transaction',
    whatDoWithSavedMoney: 'What do you want to do with the saved money?',
    moneyWillBeTransferred: 'Money will be transferred to original accounts',
    keepOnSavingsAccount: '💰 Keep on savings account',
    moneyWillRemain: 'Money will remain available for other goals',
    transactionsManagement: 'Transactions management',
    keepTransactions: '📊 Keep transactions',
    transferHistoryKept: 'Transfer history will be kept',
    moneyWillStayWarning: '⚠️ Money will remain in your savings account but will no longer be associated with a goal.',
    transactionsContainingWillBeDeleted: 'transaction containing "{goalName}" in their description will be deleted',
    linkedTransactionsWillBeKept: 'The {count} linked transactions will be kept in your history.',
    willBeDeleted: 'will be deleted',
    savingsTransfersWillBeDeleted: 'Savings transfer transactions will be deleted',
    and: 'and',
    
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
    noAccounts: 'No accounts available',
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
    cannotModifySettings: 'Cannot modify settings',
    exportJSONSuccess: 'Complete JSON export created successfully',
    exportFailed: 'Export failed',
    cannotExportData: 'Cannot export data',
    cannotExportTransactions: 'Cannot export transactions',
    exportError: 'Error',
    exportCompleted: 'Export completed',
    cannotImportData: 'Cannot import data',
    cloudBackup: 'Cloud backup',
    cloudBackupTitle: 'Cloud backup',
    cloudBackupMessage: 'This feature will be available soon. It will allow you to back up your data to Google Drive, iCloud or Dropbox.',
    configureCloud: 'Configure cloud',
    cloudProviders: 'Google Drive, iCloud, Dropbox',
    soon: 'Soon',
    importDataTitle: 'Data import',
    restoreBackup: 'Restore a backup',
    importFromJSONorCSV: 'Import from JSON or CSV',
    importWarning: 'Import will replace all your current data. Create a backup before proceeding.',
    dataSecurity: 'Data security',
    dataSecurityMessage: 'Backups are stored locally on your device. Remember to regularly export your data to external storage.',
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
    
    // Alert Messages
    budgetExceededTitle: 'Budget exceeded',
    budgetExceededMessage: 'Budget "{budgetName}" ({categoryName}) exceeded by {amount}',
    budgetNearLimitTitle: 'Budget nearly exhausted',
    budgetNearLimitMessage: 'Budget "{budgetName}" ({categoryName}) is {percentage}% used',
    unusualSpendingTitle: 'Unusual spending',
    unusualSpendingMessage: 'Unusual spending of {amount} in {categoryName}',
    largeTransactionTitle: '💸 Large transaction detected',
    largeTransactionMessage: 'A transaction of {amount} has been recorded.',
    debtPaymentDueTitle: '📅 Debt payment due soon',
    debtPaymentDueMessage: 'Payment for "{debtName}" is due in {days} day(s).',
    savingsGoalNearTitle: '🎯 Savings goal almost reached',
    savingsGoalNearMessage: '"{goalName}" is {progress}% complete.',
    lowBalanceTitle: '⚠️ Low balance detected',
    lowBalanceMessage: 'Account "{accountName}" has a low balance: {balance}',
    dailySummaryTitle: '📊 Daily financial summary',
    dailySummaryMessage: 'Today: {income} income, {expenses} expenses. Balance: {netFlow}',
    goalReachedTitle: '🎉 Goal reached!',
    goalReachedMessage: 'Congratulations! "{goalName}" - {amount}',
    billReminderTitle: '📅 Payment reminder',
    billReminderMessage: '{billName} - {amount} - Due: {dueDate}',
    debtDueTitle: '⏰ Debt repayment',
    debtDueMessage: '{debtName} - {amount} in {daysLeft} day(s)',
    monthlyReportTitle: '📊 Monthly report available',
    monthlyReportMessage: 'Your report for {month} {year} is ready',
    endOfMonthTitle: '📊 End of month',
    endOfMonthMessage: 'Summary for {month} {year}: {income} income, {expenses} expenses',
    
    // Form validation messages
    noTransactionSelected: 'No transaction selected',
    transactionNotFound: 'Transaction not found',
    cannotLoadTransaction: 'Cannot load transaction',
    enterValidAmount: 'Please enter a valid amount',
    selectCategory: 'Please select a category',
    selectAccount: 'Please select an account',
    success: 'Success',
    transactionUpdatedSuccess: 'Transaction updated successfully',
    cannotUpdateTransaction: 'Cannot update transaction',
    confirmation: 'Confirmation',
    transactionDeletedSuccess: 'Transaction deleted successfully',
    cannotDeleteTransaction: 'Cannot delete transaction',
    fillAllRequiredFields: 'Please fill all required fields',
    budgetUpdatedSuccess: 'Budget updated successfully',
    cannotUpdateBudget: 'Cannot update budget',
    cannotLoadBudget: 'Cannot load budget',
    transferError: '❌ Error',
    transferErrorMessage: 'Transfer error',
    deleteTransactionTitle: 'Delete transaction',
    deleteTransactionMessage: 'Do you want to delete "{description}"?',
    currentSavingsPositive: 'Current savings must be a positive number or zero',
    savingsGoalCreatedSuccess: 'Savings goal created successfully',
    cannotCreateSavingsGoal: 'Cannot create savings goal',
    cannotCreateAccount: 'Cannot create account',
    missingIdentifier: 'Missing identifier',
    accountUpdatedSuccess: 'Account updated successfully',
    cannotUpdateAccount: 'Cannot update account',
    deleteAccountTitle: 'Delete account',
    deleteAccountMessage: 'Are you sure you want to delete account "{accountName}"?\n\nThis action is irreversible.',
    accountDeletedSuccess: 'Account deleted successfully',
    cannotDeleteAccount: 'Cannot delete account',
    
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
    confirmButton: 'Confirm',
    biometricInfoText: 'Biometric authentication uses your device\'s secure hardware to protect your financial data.',
    
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
    
    // Category names - Simplified categories
    cat_entertainment: '🎮 Entertainment',
    cat_business: '💼 Business',
    cat_investment: '📈 Investment',
    cat_education: '🎓 Education',
    cat_bills: '📄 Bills',
    cat_other_income: '💰 Other Income',
    
    // Catégories spéciales (système)
    cat_debt: 'Debt',
    cat_savings: 'Savings',
    cat_savings_refund: 'Savings refund',
    cat_transfer: 'Transfer',
    cat_annual_charge: 'Annual charge',
    
    // Types de dettes
    debtPersonal: 'Personal',
    debtMortgage: 'Mortgage',
    debtCreditCard: 'Credit card',
    debtLoan: 'Loan',
    
    // Périodes de budget
    dailyPeriod: 'Daily',
    weeklyPeriod: 'Weekly',
    monthlyPeriod: 'Monthly',
    yearlyPeriod: 'Yearly',
    
    // Catégories d'épargne
    savingsVacation: 'Vacation',
    savingsEmergency: 'Emergency',
    savingsHouse: 'House',
    savingsCar: 'Car',
    savingsEducation: 'Education',
    savingsRetirement: 'Retirement',
    savingsOther: 'Other',
    
    // Labels de formulaires dettes
    progression: 'Progression',
    monthlyPaymentLabel: 'Monthly payment',
    interestRate: 'Interest rate',
    typeLabel: 'Type',
    nextDue: 'Next due',
    
    // Fréquences de récurrence
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    recurring: 'Recurring',
    
    // Status généraux
    statusActive: 'Active',
    statusInactive: 'Inactive',
    
    // Labels divers
    totalInterests: 'Total interests',
    interestsPaid: 'Interests paid',
    amortizationPlan: 'Amortization plan',
    month: 'Month',
    monthlyPaymentColumn: 'Monthly payment',
    capital: 'Principal',
    interests: 'Interests',
    remainingDue: 'Remaining due',
    seeLess: 'See less',
    seeMore: 'See more',
    paymentEligible: 'Payment eligible',
    applyToNewDebt: 'Apply to new debt',
    manageMyDebts: 'Manage my debts',
    averageMonthly: 'Monthly average',
    byMonth: 'per month',
    perMonth: '/month',
    monthsCount: 'months',
    interestsEarned: 'Interests earned',
    savingsCalculator: 'Savings Calculator',
    viewByMonth: 'View by Month',
    retry: 'Retry',
    validate: 'Validate',
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
    analytics: 'التحليلات',
    appSlogan: 'تحكم في ميزانيتك، تحكم في حياتك',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    
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
    transactionCreated: 'تمت إضافة المعاملة بنجاح',
    recurringTransactionCreated: 'تمت إضافة المعاملة المتكررة بنجاح',
    cannotAddTransaction: 'لا يمكن إضافة المعاملة',
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
      
      // Search screen
      smartSearch: 'بحث ذكي',
      searchHint: 'ابحث بسرعة عن معاملاتك والرسوم السنوية والفئات',
      noResults: 'لا توجد نتائج',
      tryDifferentSearch: 'جرب كلمات مفتاحية أخرى',
      result: 'نتيجة',
      results: 'نتائج',
      all: 'الكل',
      annualCharges: 'الرسوم',
      noName: 'بدون اسم',
    
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
    recurringTransaction: 'معاملة متكررة',
    recurringTransactionHelper: 'سيتم إنشاء هذه المعاملة تلقائيًا في كل موعد مجدول (يومي، أسبوعي، شهري أو سنوي)',
    frequency: 'التكرار',
    endDateOptional: 'تاريخ الانتهاء (اختياري)',
    enable: 'تفعيل',
    disable: 'تعطيل',
    selectAccountRequired: 'الرجاء اختيار حساب',
    loadingAccounts: 'جاري تحميل الحسابات...',
    loadingError: 'خطأ في التحميل',
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
    
    // نماذج الحساب
    accountNameRequired: 'يرجى إدخال اسم الحساب',
    initialBalanceRequired: 'يرجى إدخال الرصيد الأولي',
    invalidBalance: 'يجب أن يكون الرصيد رقمًا صالحًا',
    accountSaveError: 'تعذر حفظ الحساب',
    editAccount: 'تعديل الحساب',
    newAccount: 'حساب جديد',
    accountNameLabel: 'اسم الحساب *',
    accountTypeLabelRequired: 'نوع الحساب *',
    initialBalanceLabel: 'الرصيد الأولي *',
    currencyLabel: 'العملة',
    colorLabel: 'اللون',
    accountStatusLabel: 'حالة الحساب',
    previewLabel: 'معاينة',
    accountNamePlaceholder: 'مثال: حساب جاري، محفظة...',
    balancePlaceholder: '0,00',
    accountNamePreview: 'اسم الحساب',
    typePreview: 'النوع',
    
    // نموذج الميزانية
    selectCategoryRequired: 'يرجى اختيار فئة',
    invalidAmountForm: 'يرجى إدخال مبلغ صالح',
    budgetNameLabel: 'اسم الميزانية',
    budgetCategoryLabel: 'الفئة',
    budgetAmountLabel: 'مبلغ الميزانية',
    budgetAmountDisplay: 'المبلغ',
    periodLabel: 'الفترة',
    startDateLabel: 'تاريخ البدء',
    endDateOptionalLabel: 'تاريخ الانتهاء (اختياري)',
    activeBudgetLabel: 'ميزانية نشطة',
    budgetActiveHelper: 'ستؤخذ الميزانية في الاعتبار في التنبيهات والإحصائيات',
    budgetSuspendedHelper: 'الميزانية معلقة',
    
    // نموذج هدف الادخار
    targetAmountPositive: 'يجب أن يكون المبلغ المستهدف أكبر من 0',
    goalNameLabel: 'اسم الهدف *',
    targetAmountLabel: 'المبلغ المستهدف *',
    targetDateLabel: 'التاريخ المستهدف',
    selectSavingsAccountRequired: 'يرجى اختيار حساب ادخار',
    monthlyContributionPositive: 'يجب أن تكون المساهمة الشهرية أكبر من 0',
    categoryLabel: 'الفئة',
    savingsAccountLabel: 'حساب الادخار *',
    contributionSourceAccountLabel: 'حساب مصدر المساهمات',
    monthlyContributionCalculationLabel: 'حساب المساهمة الشهرية',
    manualMode: 'يدوي',
    autoMode: 'تلقائي',
    monthlyContributionLabel: 'المساهمة الشهرية',
    estimatedAchievementLabel: 'الإنجاز المقدر',
    deleteGoalTitle: 'حذف الهدف',
    refundToSourceAccount: '💸 إرجاع إلى الحساب المصدر',
    deleteRelatedTransactions: '🗑️ حذف المعاملات المرتبطة',
    deletingGoal: 'جاري الحذف...',
    automaticSystemTransaction: 'معاملة تلقائية من النظام',
    transactionDetail: 'تفاصيل المعاملة',
    
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
    noCategoryFound: 'لم يتم العثور على فئة',
    expensesPlural: 'النفقات',
    mainCategory: 'فئة رئيسية',
    preview: 'معاينة',
    resetCategories: 'إعادة تعيين الفئات',
    resetCategoriesConfirm: 'هل أنت متأكد من إعادة تعيين كل الفئات؟ سيؤدي هذا إلى حذف جميع الفئات القديمة نهائيًا وتثبيت 50 فئة جديدة.',
    resetCategoriesButton: 'إعادة التعيين بجميع الفئات',
    resetCategoriesSuccess: 'تم تثبيت 50 فئة جديدة بنجاح!',
    resetCategoriesError: 'تعذر إعادة تعيين الفئات.',
    categoriesInstalled: 'الفئات المثبتة',
    categoryNamePlaceholder: 'اسم الفئة',
    subcategoryNamePlaceholder: 'اسم الفئة الفرعية',
    subcategoryOf: 'فئة فرعية من:',
    cancelButton: 'إلغاء',
    modifyButton: 'تعديل',
    createButton: 'إنشاء',
    
    // فئات الرسوم السنوية
    ac_taxes: 'الضرائب',
    ac_insurance: 'التأمين',
    ac_subscriptions: 'الاشتراكات',
    ac_maintenance: 'الصيانة',
    ac_education: 'التعليم',
    ac_licenses: 'التراخيص',
    ac_memberships: 'العضويات',
    ac_healthcare: 'الصحة',
    ac_other: 'أخرى',
    
    // نموذج الرسوم السنوية
    fillAllRequiredFields: 'يرجى ملء جميع الحقول المطلوبة',
    enterValidChargeAmount: 'يرجى إدخال مبلغ صالح',
    selectAccountForAutoDeduct: 'يرجى اختيار حساب للخصم التلقائي',
    recurrenceYearly: 'سنوية',
    recurrenceMonthly: 'شهرية',
    recurrenceQuarterly: 'ربع سنوية',
    recurrenceOneTime: 'مرة واحدة',
    normalType: 'عادية',
    obligatoryType: 'واجبة',
    recommendedType: 'مستحبة',
    newAnnualCharge: 'رسوم سنوية جديدة',
    newIslamicCharge: 'رسوم إسلامية جديدة',
    chargeCreatedSuccess: 'تم إنشاء الرسوم السنوية بنجاح',
    cannotCreateCharge: 'تعذر إنشاء الرسوم السنوية',
    cannotLoadCharge: 'تعذر تحميل الرسوم السنوية',
    chargeUpdatedSuccess: 'تم تحديث الرسوم السنوية بنجاح',
    cannotUpdateCharge: 'تعذر تحديث الرسوم السنوية',
    editCharge: 'تعديل الرسوم',
    newCharge: 'رسوم جديدة',
    islamicChargeType: 'نوع الرسوم الإسلامية *',
    chargeName: 'اسم الرسوم *',
    chargeNamePlaceholder: 'مثال: تأمين المنزل، الضرائب، عيد الفطر...',
    arabicNameOptional: 'الاسم بالعربية (اختياري)',
    arabicNamePlaceholder: 'مثال: عيد الفطر',
    amountPlaceholder: '0.00',
    associatedAccount: 'الحساب المرتبط',
    selectAccountHelper: 'اختر الحساب للخصم التلقائي',
    autoDeductActive: 'سيتم خصم المبلغ تلقائيًا في تاريخ الاستحقاق',
    manualPaymentRequired: 'الدفع اليدوي مطلوب',
    recurrence: 'التكرار',
    reminderDaysBefore: 'التذكير (أيام قبل)',
    reminderPlaceholder: '7',
    reminderHelper: 'عدد الأيام قبل تاريخ الاستحقاق للتذكير',
    notesPlaceholder: 'معلومات إضافية...',
    selectAnAccount: 'اختر حساب',
    autoDeductHelper: '⚡ اختر حساب لتفعيل الخصم التلقائي في تاريخ الاستحقاق',
    recurrenceHelper: '💡 عند دفع رسوم متكررة، سيتم إنشاء مناسبة جديدة تلقائيًا للتاريخ التالي',
    autoDeductActiveHelper: 'سيتم خصم المبلغ تلقائيًا من الحساب المحدد في تاريخ الاستحقاق',
    autoDeductInactiveHelper: 'قم بالتفعيل للخصم التلقائي من الحساب عند الاستحقاق',
    
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
    savingsGoalPlaceholder: 'مثل: شراء سيارة، رحلة إلى اليونان...',
    targetAmountHint: 'الهدف:',
    noSavingsAccountFound: 'لم يتم العثور على حساب ادخار. أنشئ حساب ادخار أولاً.',
    createSavingsAccountFirst: 'أنشئ حساب ادخار أولاً',
    selectContributionSource: 'اختر الحساب الذي سيتم تحويل الأموال منه',
    calculatedAutomatically: '(محسوب تلقائياً)',
    contributionPrefix: 'المساهمة:',
    withThisContribution: 'مع هذه المساهمة، ستحقق هدفك في',
    youWillReachGoalOn: 'ستحقق هدفك في',
    toReachGoalByDate: 'لتحقيق هدفك في التاريخ المحدد، يجب أن توفر',
    youMustSave: 'يجب أن توفر',
    perMonth: 'شهرياً',
    creatingGoal: 'جاري الإنشاء...',
    
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
    errorLabel: 'خطأ',
    pleaseSelectSourceAccount: 'يرجى اختيار حساب مصدر للمساهمة',
    pleaseSelectSavingsDestination: 'يرجى اختيار حساب ادخار الوجهة',
    pleaseEnterValidAmount: 'يرجى إدخال مبلغ صحيح',
    insufficientBalanceTitle: 'رصيد غير كاف',
    pleaseSelectSourceDestination: 'يرجى اختيار حسابات المصدر والوجهة',
    pleaseEnterCategoryName: 'يرجى إدخال اسم للفئة',
    tooManyAttempts: 'عدد كبير جدًا من المحاولات الفاشلة. يرجى المحاولة مرة أخرى.',
    cannotScheduleReminder: 'تعذر جدولة التذكير',
    cannotDeleteTransaction: 'تعذر حذف المعاملة',
    cannotCreateBudget: 'تعذر إنشاء الميزانية',
    cannotLoadBackups: 'تعذر تحميل النسخ الاحتياطية',
    cannotCreateBackup: 'تعذر إنشاء نسخة احتياطية',
    cannotRestoreBackup: 'تعذر استعادة النسخة الاحتياطية',
    cannotDeleteBackup: 'تعذر حذف النسخة الاحتياطية',
    cannotModifyCloudConfig: 'تعذر تعديل إعدادات السحابة',
    cannotResetPassword: 'تعذر إعادة تعيين كلمة المرور',
    cannotCreateAccount: 'تعذر إنشاء الحساب',
    cannotModifyAccount: 'تعذر تعديل الحساب',
    cannotChangeCurrency: 'تعذر تغيير العملة',
    cannotDeleteCategory: 'تعذر حذف الفئة',
    pleaseCloseReopenApp: 'يرجى إغلاق التطبيق وإعادة فتحه',
    pleaseFillDescription: 'يرجى إدخال وصف',
    pleaseFillAmount: 'يرجى إدخال مبلغ صحيح',
    pleaseSelectCategory: 'يرجى اختيار فئة',
    pleaseSelectAccount: 'يرجى اختيار حساب',
    pleaseSelectFrequency: 'يرجى اختيار تكرار للمعاملة المتكررة',
    confirmPasswordRequired: 'يرجى تأكيد كلمة المرور',
    
    // Transfer Screen
    transferBetweenAccounts: 'تحويل بين الحسابات',
    secureTransfer: 'تحويل آمن',
    secureTransferDescription: 'قم بتحويل الأموال بين حساباتك بشكل آمن',
    fromAccount: 'من الحساب',
    toAccount: 'إلى الحساب',
    transferAmount: 'مبلغ التحويل',
    descriptionOptional: 'الوصف (اختياري)',
    transferSummary: 'ملخص التحويل',
    from: 'من',
    to: 'إلى',
    newSourceBalance: 'الرصيد الجديد للمصدر',
    newDestinationBalance: 'الرصيد الجديد للوجهة',
    performTransfer: 'تنفيذ التحويل',
    transferInProgress: 'التحويل قيد التنفيذ...',
    transferSuccess: '✅ تم التحويل بنجاح',
    transferSuccessMessage: 'تم تحويل {amount} بنجاح',
    insufficientBalance: '❌ رصيد غير كاف',
    insufficientBalanceMessage: 'الرصيد المتاح: {balance}',
    transferPlaceholder: 'مثال: تحويل شهري للادخار',
    balance: 'الرصيد',
    
    // Buttons and actions
    addButton: 'إضافة',
    complete: 'إكمال',
    addPayment: 'إضافة دفعة',
    paymentAmount: 'مبلغ الدفعة',
    goalReachedBadge: '🎉 تم تحقيق الهدف!',
    amountCannotExceedRemaining: 'لا يمكن أن يتجاوز المبلغ الرصيد المتبقي',
    
    // Account Detail Screen
    accountDetails: 'تفاصيل الحساب',
    noDescription: 'بدون وصف',
    noTransaction: 'لا توجد معاملات',
    addTransactionButton: 'إضافة معاملة',
    automaticTransactions: 'معاملة (معاملات) تلقائية',
    automaticTransactionInfo: 'معاملات الديون والادخار والرسوم السنوية للقراءة فقط',
    seeAll: 'عرض الكل',
    accountNotFound: 'الحساب غير موجود',
    backButton: 'رجوع',
    loadingAccount: 'جاري تحميل الحساب...',
    accountSuccessModified: 'تم تعديل الحساب بنجاح',
    deleteAccountTitle: 'حذف الحساب',
    deleteAccountMessage: 'هل أنت متأكد من حذف الحساب "{accountName}"؟\n\nهذا الإجراء لا رجعة فيه وسيحذف جميع البيانات المرتبطة.',
    actions: 'الإجراءات',
    expense: 'مصروف',
    revenue: 'إيراد',
    transfer: 'تحويل',
    informations: 'المعلومات',
    accountType: 'نوع الحساب',
    creationDate: 'تاريخ الإنشاء',
    transactionCount: 'عدد المعاملات',
    dangerZone: 'منطقة الخطر',
    deletionWarning: 'الحذف لا رجعة فيه وسيحذف جميع البيانات المرتبطة بهذا الحساب.',
    deleteAccountButton: 'حذف الحساب',
    cash: 'نقد',
    bankAccount: 'حساب بنكي',
    cardAccount: 'بطاقة',
    savingsAccount: 'حساب ادخار',
    seeRemaining: 'عرض {count} معاملة متبقية',
    insufficientBalanceMessage: 'رصيد {accountName} هو {balance}. لا يمكنك تحويل {amount}.',
    warningLabel: 'تحذير',
    exceedsGoalWarning: 'هذه المساهمة ستتجاوز هدفك البالغ {targetAmount}. هل تريد المتابعة؟',
    savedAmount: 'المبلغ المدخر',
    transactionsLinked: 'تم اكتشاف معاملات مرتبطة',
    transactionAssociated: 'معاملة مرتبطة',
    hideDetails: 'إخفاء',
    seeDetails: 'عرض',
    transactionsToDelete: 'المعاملات التي سيتم حذفها:',
    moreTransactions: 'معاملة أخرى',
    whatDoWithSavedMoney: 'ماذا تريد أن تفعل بالمال المدخر؟',
    moneyWillBeTransferred: 'سيتم تحويل الأموال إلى الحسابات الأصلية',
    keepOnSavingsAccount: '💰 الاحتفاظ بها في حساب الادخار',
    moneyWillRemain: 'ستبقى الأموال متاحة لأهداف أخرى',
    transactionsManagement: 'إدارة المعاملات',
    keepTransactions: '📊 الاحتفاظ بالمعاملات',
    transferHistoryKept: 'سيتم الاحتفاظ بسجل التحويلات',
    moneyWillStayWarning: '⚠️ ستبقى الأموال في حساب الادخار لكنها لن تعود مرتبطة بهدف.',
    transactionsContainingWillBeDeleted: 'معاملة تحتوي على "{goalName}" في وصفها سيتم حذفها',
    linkedTransactionsWillBeKept: 'سيتم الاحتفاظ بـ {count} معاملة مرتبطة في سجلك.',
    willBeDeleted: 'سيتم حذفها',
    savingsTransfersWillBeDeleted: 'سيتم حذف معاملات التحويل إلى الادخار',
    and: 'و',
    
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
    noAccounts: 'لا توجد حسابات متاحة',
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
    cannotModifySettings: 'لا يمكن تعديل الإعدادات',
    exportJSONSuccess: 'تم إنشاء تصدير JSON كامل بنجاح',
    exportFailed: 'فشل التصدير',
    cannotExportData: 'لا يمكن تصدير البيانات',
    cannotExportTransactions: 'لا يمكن تصدير المعاملات',
    exportError: 'خطأ',
    exportCompleted: 'اكتمل التصدير',
    cannotImportData: 'لا يمكن استيراد البيانات',
    cloudBackup: 'النسخ الاحتياطي السحابي',
    cloudBackupTitle: 'النسخ الاحتياطي السحابي',
    cloudBackupMessage: 'ستكون هذه الميزة متاحة قريباً. ستسمح لك بنسخ بياناتك احتياطياً على Google Drive أو iCloud أو Dropbox.',
    configureCloud: 'تكوين السحابة',
    cloudProviders: 'Google Drive، iCloud، Dropbox',
    soon: 'قريباً',
    importDataTitle: 'استيراد البيانات',
    restoreBackup: 'استعادة نسخة احتياطية',
    importFromJSONorCSV: 'استيراد من JSON أو CSV',
    importWarning: 'سيؤدي الاستيراد إلى استبدال جميع بياناتك الحالية. قم بإنشاء نسخة احتياطية قبل المتابعة.',
    dataSecurity: 'أمان بياناتك',
    dataSecurityMessage: 'يتم تخزين النسخ الاحتياطية محلياً على جهازك. تذكر تصدير بياناتك بانتظام إلى وحدة تخزين خارجية.',
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
    
    // رسائل التنبيهات
    budgetExceededTitle: 'تجاوز الميزانية',
    budgetExceededMessage: 'تم تجاوز الميزانية "{budgetName}" ({categoryName}) بمبلغ {amount}',
    budgetNearLimitTitle: 'الميزانية شبه مستنفدة',
    budgetNearLimitMessage: 'الميزانية "{budgetName}" ({categoryName}) مستخدمة بنسبة {percentage}%',
    unusualSpendingTitle: 'إنفاق غير عادي',
    unusualSpendingMessage: 'إنفاق غير عادي بمبلغ {amount} في {categoryName}',
    largeTransactionTitle: '💸 معاملة كبيرة مكتشفة',
    largeTransactionMessage: 'تم تسجيل معاملة بمبلغ {amount}.',
    debtPaymentDueTitle: '📅 موعد دفع الدين قريب',
    debtPaymentDueMessage: 'دفعة "{debtName}" مستحقة خلال {days} يوم.',
    savingsGoalNearTitle: '🎯 هدف الادخار على وشك التحقيق',
    savingsGoalNearMessage: '"{goalName}" مكتمل بنسبة {progress}%.',
    lowBalanceTitle: '⚠️ رصيد منخفض',
    lowBalanceMessage: 'الحساب "{accountName}" رصيده منخفض: {balance}',
    dailySummaryTitle: '📊 الملخص المالي اليومي',
    dailySummaryMessage: 'اليوم: {income} إيرادات، {expenses} مصروفات. الرصيد: {netFlow}',
    goalReachedTitle: '🎉 تم تحقيق الهدف!',
    goalReachedMessage: 'تهانينا! "{goalName}" - {amount}',
    billReminderTitle: '📅 تذكير بالدفع',
    billReminderMessage: '{billName} - {amount} - الاستحقاق: {dueDate}',
    debtDueTitle: '⏰ سداد الدين',
    debtDueMessage: '{debtName} - {amount} خلال {daysLeft} يوم',
    monthlyReportTitle: '📊 التقرير الشهري متاح',
    monthlyReportMessage: 'تقريرك لشهر {month} {year} جاهز',
    endOfMonthTitle: '📊 نهاية الشهر',
    endOfMonthMessage: 'ملخص {month} {year}: {income} إيرادات، {expenses} مصروفات',
    
    // رسائل التحقق من النماذج
    noTransactionSelected: 'لم يتم تحديد معاملة',
    transactionNotFound: 'المعاملة غير موجودة',
    cannotLoadTransaction: 'تعذر تحميل المعاملة',
    enterValidAmount: 'الرجاء إدخال مبلغ صالح',
    selectCategory: 'الرجاء اختيار فئة',
    selectAccount: 'الرجاء اختيار حساب',
    success: 'نجح',
    transactionUpdatedSuccess: 'تم تحديث المعاملة بنجاح',
    cannotUpdateTransaction: 'تعذر تحديث المعاملة',
    confirmation: 'تأكيد',
    transactionDeletedSuccess: 'تم حذف المعاملة بنجاح',
    cannotDeleteTransaction: 'تعذر حذف المعاملة',
    fillAllRequiredFields: 'الرجاء ملء جميع الحقول المطلوبة',
    budgetUpdatedSuccess: 'تم تحديث الميزانية بنجاح',
    cannotUpdateBudget: 'تعذر تحديث الميزانية',
    cannotLoadBudget: 'تعذر تحميل الميزانية',
    transferError: '❌ خطأ',
    transferErrorMessage: 'خطأ أثناء التحويل',
    deleteTransactionTitle: 'حذف المعاملة',
    deleteTransactionMessage: 'هل تريد حذف "{description}"؟',
    currentSavingsPositive: 'يجب أن يكون الادخار الحالي رقمًا موجبًا أو صفرًا',
    savingsGoalCreatedSuccess: 'تم إنشاء هدف الادخار بنجاح',
    cannotCreateSavingsGoal: 'تعذر إنشاء هدف الادخار',
    cannotCreateAccount: 'تعذر إنشاء الحساب',
    missingIdentifier: 'المعرف مفقود',
    accountUpdatedSuccess: 'تم تحديث الحساب بنجاح',
    cannotUpdateAccount: 'تعذر تحديث الحساب',
    deleteAccountTitle: 'حذف الحساب',
    deleteAccountMessage: 'هل أنت متأكد من حذف الحساب "{accountName}"؟\n\nهذا الإجراء لا رجعة فيه.',
    accountDeletedSuccess: 'تم حذف الحساب بنجاح',
    cannotDeleteAccount: 'تعذر حذف الحساب',
    
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
    confirmButton: 'تأكيد',
    biometricInfoText: 'تستخدم المصادقة البيومترية الأجهزة الآمنة في جهازك لحماية بياناتك المالية.',
    
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
    
    // أسماء الفئات - الفئات المبسطة
    cat_entertainment: '🎮 ترفيه',
    cat_business: '💼 أعمال',
    cat_investment: '📈 استثمار',
    cat_education: '🎓 تعليم',
    cat_bills: '📄 فواتير',
    cat_other_income: '💰 إيرادات أخرى',
    
    // الفئات الخاصة (النظام)
    cat_debt: 'الدين',
    cat_savings: 'الادخار',
    cat_savings_refund: 'استرجاع الادخار',
    cat_transfer: 'تحويل',
    cat_annual_charge: 'رسوم سنوية',
    
    // أنواع الديون
    debtPersonal: 'شخصي',
    debtMortgage: 'عقاري',
    debtCreditCard: 'بطاقة ائتمان',
    debtLoan: 'قرض',
    
    // فترات الميزانية
    dailyPeriod: 'يومي',
    weeklyPeriod: 'أسبوعي',
    monthlyPeriod: 'شهري',
    yearlyPeriod: 'سنوي',
    
    // فئات الادخار
    savingsVacation: 'عطلة',
    savingsEmergency: 'طوارئ',
    savingsHouse: 'منزل',
    savingsCar: 'سيارة',
    savingsEducation: 'تعليم',
    savingsRetirement: 'تقاعد',
    savingsOther: 'أخرى',
    
    // تسميات نماذج الديون
    progression: 'التقدم',
    monthlyPaymentLabel: 'الدفعة الشهرية',
    interestRate: 'معدل الفائدة',
    typeLabel: 'النوع',
    nextDue: 'الاستحقاق القادم',
    
    // تكرار التواتر
    daily: 'يومية',
    weekly: 'أسبوعية',
    monthly: 'شهرية',
    yearly: 'سنوية',
    recurring: 'متكررة',
    
    // الحالات العامة
    statusActive: 'نشط',
    statusInactive: 'غير نشط',
    
    // تسميات متنوعة
    totalInterests: 'إجمالي الفوائد',
    interestsPaid: 'الفوائد المدفوعة',
    amortizationPlan: 'خطة السداد',
    month: 'شهر',
    monthlyPaymentColumn: 'الدفعة الشهرية',
    capital: 'رأس المال',
    interests: 'الفوائد',
    remainingDue: 'المتبقي',
    seeLess: 'عرض أقل',
    seeMore: 'عرض المزيد',
    paymentEligible: 'مؤهل للدفع',
    applyToNewDebt: 'تطبيق على دين جديد',
    manageMyDebts: 'إدارة ديوني',
    averageMonthly: 'المتوسط الشهري',
    byMonth: 'في الشهر',
    perMonth: '/شهر',
    monthsCount: 'أشهر',
    interestsEarned: 'الفوائد المكتسبة',
    savingsCalculator: 'حاسبة الادخار',
    viewByMonth: 'عرض حسب الشهر',
    retry: 'إعادة المحاولة',
    validate: 'تأكيد',
  },
};

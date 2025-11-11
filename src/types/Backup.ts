// src/types/Backup.ts
// Types pour la sauvegarde et restauration

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    accounts: any[];
    transactions: any[];
    categories: any[];
    budgets: any[];
    recurringTransactions: any[];
    alerts: any[];
  };
  metadata: {
    totalRecords: number;
    appVersion: string;
    deviceInfo?: string;
    checksum?: string;
  };
}

export interface BackupOptions {
  encrypt: boolean;
  includeSensitiveData: boolean;
  compression: boolean;
  format: 'json' | 'csv' | 'xml';
}

export interface BackupResult {
  success: boolean;
  filePath?: string;
  backupInfo?: BackupData;
  error?: string;
  size?: number;
  duration?: number;
}

export interface RestoreOptions {
  backupSource: 'local' | 'cloud' | 'file';
  filePath?: string;
  cloudPath?: string;
  encryptionKey?: string;
  mergeData: boolean;
  backupBeforeRestore: boolean;
  conflictResolution: 'overwrite' | 'skip' | 'rename';
}

export interface RestoreResult {
  success: boolean;
  restoredRecords?: number;
  skippedRecords?: number;
  errors?: string[];
  warnings?: string[];
  duration?: number;
}

export interface CloudBackupConfig {
  provider: 'google_drive' | 'icloud' | 'dropbox' | 'onedrive';
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  encryptCloudBackups: boolean;
  lastSync?: string;
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface BackupStats {
  totalBackups: number;
  totalSize: number;
  lastBackup?: string;
  backupDirectory: string;
  cloudBackups: number;
  localBackups: number;
}

export interface BackupValidation {
  isValid: boolean;
  backupInfo?: BackupData;
  errors?: string[];
  warnings?: string[];
  integrityCheck: boolean;
  versionCompatible: boolean;
}

// Types pour la comparaison de données
export interface DataComparison {
  table: string;
  currentCount: number;
  backupCount: number;
  difference: number;
  conflicts?: DataConflict[];
}

export interface DataConflict {
  table: string;
  recordId: string;
  conflictType: 'duplicate' | 'modified' | 'missing' | 'version_mismatch';
  currentData?: any;
  backupData?: any;
}

// Types pour l'historique des sauvegardes
export interface BackupHistoryItem {
  timestamp: string;
  type: 'manual' | 'auto' | 'cloud';
  success: boolean;
  size: number;
  recordCount: number;
  filePath?: string;
  cloudPath?: string;
  error?: string;
}
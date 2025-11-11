// src/types/Sync.ts
// Types pour la synchronisation des données

export interface SyncData {
  version: string;
  timestamp: string;
  deviceId: string;
  changes: SyncChanges;
  metadata: SyncMetadata;
}

export interface SyncChanges {
  created: SyncItem[];
  updated: SyncItem[];
  deleted: string[];
}

export interface SyncItem {
  table: string;
  id: string;
  data: any;
  timestamp: string;
  version: number;
}

export interface SyncMetadata {
  totalChanges: number;
  syncId: string;
  previousSyncId?: string;
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  lastActive: string;
}

export interface SyncConfig {
  enabled: boolean;
  autoSync: boolean;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  conflictResolution: 'local_wins' | 'remote_wins' | 'manual';
  syncOnMobileData: boolean;
  maxRetries: number;
  providers: SyncProvider[];
}

export interface SyncProvider {
  id: string;
  type: 'cloud' | 'local' | 'webdav';
  name: string;
  config: any;
  isActive: boolean;
  lastSync?: string;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync?: string;
  nextSync?: string;
  pendingChanges: number;
  syncErrors: SyncError[];
  connectionStatus: 'online' | 'offline' | 'limited';
}

export interface SyncError {
  id: string;
  type: 'network' | 'conflict' | 'authentication' | 'quota';
  message: string;
  timestamp: string;
  itemId?: string;
  table?: string;
  retryCount: number;
}

export interface SyncConflict {
  id: string;
  table: string;
  localItem: SyncItem;
  remoteItem: SyncItem;
  differences: string[];
  resolved: boolean;
  resolution?: 'local' | 'remote' | 'merged';
}

export interface SyncHistory {
  timestamp: string;
  duration: number;
  changes: number;
  success: boolean;
  errors: SyncError[];
  deviceId: string;
}

// Types pour la résolution de conflits
export interface ConflictResolution {
  conflictId: string;
  resolution: 'local' | 'remote' | 'merged';
  mergedData?: any;
  timestamp: string;
  resolvedBy: string; // deviceId ou 'user'
}

// Types pour la gestion multi-appareils
export interface DeviceSync {
  deviceId: string;
  deviceName: string;
  lastActive: string;
  syncStatus: 'active' | 'inactive' | 'error';
  pendingChanges: number;
  isCurrentDevice: boolean;
}

export interface MultiDeviceConfig {
  maxDevices: number;
  allowedDevices: string[];
  syncAcrossDevices: boolean;
  deviceManagement: boolean;
}

// Types pour les Webhooks et notifications de sync
export interface SyncWebhook {
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
}

export interface SyncNotification {
  type: 'sync_complete' | 'sync_error' | 'conflict_detected' | 'device_added';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}
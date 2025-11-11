// services/sync/syncService.ts - VERSION CORRIGÉE
import { getDatabase } from '../database/sqlite';
import { PremiumService } from '../premium/premiumService';
import { secureStorage } from '../storage/secureStorage';

export interface SyncResult {
  success: boolean;
  conflicts: any[];
  changesApplied: number;
  error?: string;
}

export interface SyncConflict {
  id: string;
  local: any;
  remote: any;
  type: 'transaction' | 'account' | 'budget' | 'category';
  resolution?: 'local' | 'remote' | 'merged';
}

export class SyncService {
  private static readonly LAST_SYNC_KEY = 'last_sync_timestamp';
  private static readonly SYNC_CONFLICTS_KEY = 'sync_conflicts';
  private static readonly SYNC_ENABLED_KEY = 'sync_enabled';

  static async syncData(): Promise<SyncResult> {
    try {
      // Vérifier si la synchronisation est disponible
      const isAvailable = await this.isSyncAvailable();
      if (!isAvailable) {
        return {
          success: false,
          conflicts: [],
          changesApplied: 0,
          error: 'Synchronisation non disponible - Fonctionnalité Premium requise'
        };
      }

      const lastSync = await secureStorage.getItem(this.LAST_SYNC_KEY);
      const changes = await this.getLocalChangesSince(lastSync);
      
      // Simuler la synchro avec un serveur
      const result = await this.pushChangesToServer(changes);
      
      if (result.success) {
        await secureStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());
        await this.cleanupSyncData();
      }
      
      return {
        success: result.success,
        conflicts: result.conflicts,
        changesApplied: result.changesApplied || 0
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        conflicts: [],
        changesApplied: 0,
        error: error instanceof Error ? error.message : 'Erreur de synchronisation'
      };
    }
  }

  static async isSyncAvailable(): Promise<boolean> {
    try {
      return await PremiumService.isFeatureAvailable('multi_devices');
    } catch (error) {
      console.error('Error checking sync availability:', error);
      return false;
    }
  }

  static async enableSync(): Promise<boolean> {
    try {
      await secureStorage.setItem(this.SYNC_ENABLED_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error enabling sync:', error);
      return false;
    }
  }

  static async disableSync(): Promise<boolean> {
    try {
      await secureStorage.setItem(this.SYNC_ENABLED_KEY, 'false');
      return true;
    } catch (error) {
      console.error('Error disabling sync:', error);
      return false;
    }
  }

  static async getSyncStatus(): Promise<{
    enabled: boolean;
    available: boolean;
    lastSync?: string;
    conflictsCount: number;
  }> {
    try {
      const enabled = await secureStorage.getItem(this.SYNC_ENABLED_KEY) === 'true';
      const available = await this.isSyncAvailable();
      const lastSync = await secureStorage.getItem(this.LAST_SYNC_KEY);
      
      const conflicts = await this.getStoredConflicts();
      
      return {
        enabled,
        available,
        lastSync: lastSync || undefined,
        conflictsCount: conflicts.length
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        enabled: false,
        available: false,
        conflictsCount: 0
      };
    }
  }

  // ===== MÉTHODES PRIVÉES =====

  private static async getLocalChangesSince(timestamp: string | null): Promise<any> {
    try {
      const db = await getDatabase();
      const changes: any = {
        transactions: [],
        accounts: [],
        budgets: [],
        categories: [],
        recurringTransactions: []
      };

      if (!timestamp) {
        // Première synchronisation - récupérer toutes les données
        // ✅ CORRECTION : Utiliser db.getAllAsync au lieu de databaseUtils.selectAll
        changes.accounts = await db.getAllAsync('SELECT * FROM accounts');
        changes.transactions = await db.getAllAsync('SELECT * FROM transactions');
        changes.budgets = await db.getAllAsync('SELECT * FROM budgets');
        changes.categories = await db.getAllAsync('SELECT * FROM categories');
        changes.recurringTransactions = await db.getAllAsync('SELECT * FROM recurring_transactions');
      } else {
        // Synchronisation incrémentale
        changes.transactions = await db.getAllAsync(
          'SELECT * FROM transactions WHERE created_at > ? OR updated_at > ?',
          [timestamp, timestamp]
        );
      }

      return changes;
    } catch (error) {
      console.error('Error getting local changes:', error);
      return {};
    }
  }

  private static async pushChangesToServer(changes: any): Promise<{
    success: boolean;
    conflicts: any[];
    changesApplied?: number;
  }> {
    try {
      // Simulation - dans la réalité, appel API
      console.log('📡 Envoi des changements au serveur...', changes);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler quelques conflits
      const conflicts = changes.transactions && changes.transactions.length > 0 ? [
        {
          id: changes.transactions[0].id,
          local: changes.transactions[0],
          remote: { ...changes.transactions[0], amount: changes.transactions[0].amount * 1.1 },
          type: 'transaction'
        }
      ] : [];
      
      return {
        success: true,
        conflicts,
        changesApplied: Object.values(changes).flat().length
      };
    } catch (error) {
      console.error('Error pushing changes to server:', error);
      return {
        success: false,
        conflicts: []
      };
    }
  }

  private static async getStoredConflicts(): Promise<SyncConflict[]> {
    try {
      const conflictsStr = await secureStorage.getItem(this.SYNC_CONFLICTS_KEY);
      return conflictsStr ? JSON.parse(conflictsStr) : [];
    } catch (error) {
      return [];
    }
  }

  private static async cleanupSyncData(): Promise<void> {
    try {
      // Nettoyer les anciens conflits résolus
      const conflicts = await this.getStoredConflicts();
      const unresolvedConflicts = conflicts.filter(conflict => !conflict.resolution);
      
      await secureStorage.setItem(this.SYNC_CONFLICTS_KEY, JSON.stringify(unresolvedConflicts));
    } catch (error) {
      console.error('Error cleaning up sync data:', error);
    }
  }

  static async resolveConflict(conflictId: string, resolution: 'local' | 'remote'): Promise<boolean> {
    try {
      const conflicts = await this.getStoredConflicts();
      const conflictIndex = conflicts.findIndex(c => c.id === conflictId);
      
      if (conflictIndex !== -1) {
        conflicts[conflictIndex].resolution = resolution;
        await secureStorage.setItem(this.SYNC_CONFLICTS_KEY, JSON.stringify(conflicts));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error resolving conflict:', error);
      return false;
    }
  }
}
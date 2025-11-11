// src/services/notifications/NotificationService.ts - VERSION CORRIGÉE
import { Platform } from 'react-native';
import { Alert } from '../../types/Alert';

// Interfaces pour les préférences de notification
export interface NotificationPreferences {
  enabled: boolean;
  budgetAlerts: boolean;
  savingsAlerts: boolean;
  debtAlerts: boolean;
  systemAlerts: boolean;
  criticalAlerts: boolean;
  quietHours?: {
    enabled: boolean;
    start: string; // Format "HH:MM"
    end: string;   // Format "HH:MM"
  };
}

export interface ScheduledNotification {
  id: string;
  alert: Alert;
  scheduledTime: Date;
  delivered: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private preferences: Map<string, NotificationPreferences> = new Map();
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();

  // Méthode statique pour obtenir l'instance
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Pour la compatibilité avec l'import existant
  static get I(): NotificationService {
    return NotificationService.getInstance();
  }

  // Initialiser le service de notifications
  async initialize(): Promise<void> {
    try {
      console.log('🔔 Initialisation NotificationService...');

      // Charger les préférences utilisateur
      await this.loadDefaultPreferences();

      // Initialiser les notifications push (simulé)
      if (Platform.OS !== 'web') {
        await this.initializePushNotifications();
      }

      console.log('✅ NotificationService initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation NotificationService:', error);
      throw error;
    }
  }

  // Obtenir les préférences de notification
  async getNotificationPreferences(userId: string = 'default-user'): Promise<NotificationPreferences> {
    return this.preferences.get(userId) || this.getDefaultPreferences();
  }

  // Mettre à jour les préférences
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>,
    userId: string = 'default-user'
  ): Promise<void> {
    const current = await this.getNotificationPreferences(userId);
    this.preferences.set(userId, { ...current, ...preferences });
    
    console.log('✅ Préférences notifications mises à jour:', preferences);
  }

  // Planifier une notification d'alerte
  async scheduleAlertNotification(alert: Alert): Promise<string> {
    try {
      const preferences = await this.getNotificationPreferences(alert.userId);
      
      // Vérifier si les notifications sont activées pour ce type d'alerte
      if (!this.shouldSendNotification(alert, preferences)) {
        console.log('🔕 Notification ignorée selon préférences');
        return '';
      }

      // Vérifier les heures silencieuses
      if (this.isQuietHours(preferences)) {
        console.log('🌙 Notification différée (heures silencieuses)');
        // Planifier pour après les heures silencieuses
        return await this.scheduleForAfterQuietHours(alert, preferences);
      }

      const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simuler l'envoi d'une notification
      console.log(`📢 Notification envoyée: ${alert.title}`, {
        id: notificationId,
        priority: alert.priority,
        type: alert.type
      });

      // Stocker la notification planifiée
      const scheduledNotification: ScheduledNotification = {
        id: notificationId,
        alert,
        scheduledTime: new Date(),
        delivered: true,
      };

      this.scheduledNotifications.set(notificationId, scheduledNotification);

      return notificationId;

    } catch (error) {
      console.error('❌ Erreur planification notification:', error);
      return '';
    }
  }

  // Vérifier si une notification doit être envoyée
  async shouldSendNotification(alert: Alert, preferences: NotificationPreferences): Promise<boolean> {
    if (!preferences.enabled) return false;

    // Vérifications par type d'alerte
    switch (alert.type) {
      case 'budget':
        if (!preferences.budgetAlerts) return false;
        break;
      case 'savings':
        if (!preferences.savingsAlerts) return false;
        break;
      case 'debt':
        if (!preferences.debtAlerts) return false;
        break;
      case 'system':
        if (!preferences.systemAlerts) return false;
        break;
    }

    // Vérifications par priorité
    if (alert.priority === 'critical' && !preferences.criticalAlerts) {
      return false;
    }

    return true;
  }

  // Vérifier les heures silencieuses
  private isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHours?.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { start, end } = preferences.quietHours;

    // Si les heures silencieuses traversent minuit
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }
    
    return currentTime >= start && currentTime <= end;
  }

  // Planifier une notification après les heures silencieuses
  private async scheduleForAfterQuietHours(alert: Alert, preferences: NotificationPreferences): Promise<string> {
    if (!preferences.quietHours) return '';

    const now = new Date();
    const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
    
    const scheduledTime = new Date(now);
    scheduledTime.setHours(endHour, endMinute, 0, 0);
    
    // Si l'heure de fin est déjà passée, planifier pour demain
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delayMs = scheduledTime.getTime() - now.getTime();

    const notificationId = `delayed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scheduledNotification: ScheduledNotification = {
      id: notificationId,
      alert,
      scheduledTime,
      delivered: false,
    };

    this.scheduledNotifications.set(notificationId, scheduledNotification);

    // Planifier l'envoi réel
    setTimeout(async () => {
      await this.sendDelayedNotification(notificationId);
    }, delayMs);

    console.log(`⏰ Notification différée à ${scheduledTime.toLocaleTimeString()}`);
    
    return notificationId;
  }

  // Envoyer une notification différée
  private async sendDelayedNotification(notificationId: string): Promise<void> {
    const scheduled = this.scheduledNotifications.get(notificationId);
    if (!scheduled) return;

    try {
      console.log(`📢 Envoi notification différée: ${scheduled.alert.title}`);
      
      // Marquer comme livrée et envoyer
      scheduled.delivered = true;
      await this.scheduleAlertNotification(scheduled.alert);
      
    } catch (error) {
      console.error('❌ Erreur envoi notification différée:', error);
    }
  }

  // Annuler une notification planifiée
  async cancelScheduledNotification(notificationId: string): Promise<boolean> {
    const existed = this.scheduledNotifications.has(notificationId);
    this.scheduledNotifications.delete(notificationId);
    
    console.log(existed ? '❌ Notification annulée' : '⚠️ Notification non trouvée');
    return existed;
  }

  // Obtenir les notifications planifiées
  async getScheduledNotifications(userId?: string): Promise<ScheduledNotification[]> {
    const notifications = Array.from(this.scheduledNotifications.values());
    
    if (userId) {
      return notifications.filter(notif => notif.alert.userId === userId);
    }
    
    return notifications;
  }

  // Planifier les vérifications d'alertes
  async scheduleAlertChecks(): Promise<void> {
    try {
      console.log('📅 Planification des vérifications d\'alertes...');
      
      // Planifier une vérification quotidienne à 8h du matin
      await this.scheduleDailyAlertCheck();
      
      console.log('✅ Vérifications d\'alertes planifiées');
    } catch (error) {
      console.error('❌ Erreur planification vérifications:', error);
    }
  }

  private async scheduleDailyAlertCheck(): Promise<void> {
    // Cette méthode serait intégrée avec AlertScheduler
    console.log('🕗 Vérification quotidienne planifiée à 08:00');
  }

  // Méthodes privées d'initialisation
  private async loadDefaultPreferences(): Promise<void> {
    // Préférences par défaut
    const defaultPrefs: NotificationPreferences = {
      enabled: true,
      budgetAlerts: true,
      savingsAlerts: true,
      debtAlerts: true,
      systemAlerts: true,
      criticalAlerts: true,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
    };

    this.preferences.set('default-user', defaultPrefs);
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      enabled: true,
      budgetAlerts: true,
      savingsAlerts: true,
      debtAlerts: true,
      systemAlerts: true,
      criticalAlerts: true,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
    };
  }

  private async initializePushNotifications(): Promise<void> {
    // Simulation d'initialisation des notifications push
    console.log('📱 Initialisation notifications push (simulé)');
    
    // Dans une implémentation réelle, on utiliserait:
    // - expo-notifications pour Expo
    // - @react-native-firebase/messaging pour React Native Firebase
    // - push-notification-ios pour iOS natif
  }

  // Nettoyer les ressources
  cleanup(): void {
    this.scheduledNotifications.clear();
    console.log('🧹 NotificationService nettoyé');
  }
}

// Export pour la compatibilité
export default NotificationService;
// src/hooks/useAlerts.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import { alertService } from '../services/alertService';
import { Alert, AlertStats } from '../types';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    unread: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const alertsData = await alertService.getAlerts('default-user');
      const alertStats = await alertService.getAlertStats('default-user');
      
      setAlerts(alertsData);
      setStats(alertStats);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des alertes');
      console.error('Error loading alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FONCTIONS MANQUANTES AJOUTÉES
  const getAlertCounts = useCallback((): AlertStats => {
    return stats;
  }, [stats]);

  const getAlertsByPriority = useCallback((priority: Alert['priority']): Alert[] => {
    return alerts.filter(alert => alert.priority === priority);
  }, [alerts]);

  const markAsRead = useCallback(async (alertId: string) => {
    try {
      await alertService.markAsRead(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
      const alertStats = await alertService.getAlertStats('default-user');
      setStats(alertStats);
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await alertService.markAllAsRead('default-user');
      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
      const alertStats = await alertService.getAlertStats('default-user');
      setStats(alertStats);
    } catch (err) {
      console.error('Error marking all alerts as read:', err);
    }
  }, []);

  const deleteAlert = useCallback(async (alertId: string) => {
    try {
      await alertService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      const alertStats = await alertService.getAlertStats('default-user');
      setStats(alertStats);
    } catch (err) {
      console.error('Error deleting alert:', err);
    }
  }, []);

  const refreshAlerts = useCallback(async () => {
    await loadAlerts();
  }, [loadAlerts]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return {
    alerts,
    loading,
    error,
    stats,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    refreshAlerts,
    // ✅ FONCTIONS AJOUTÉES
    getAlertCounts,
    getAlertsByPriority,
    unreadCount: stats.unread,
  };
};
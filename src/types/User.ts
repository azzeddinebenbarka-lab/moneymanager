export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currency: string;
  language: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark';
  biometricAuth: boolean;
  monthlyReports: boolean;
  budgetAlerts: boolean;
  pushNotifications: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  hasPin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  currency?: string;
}
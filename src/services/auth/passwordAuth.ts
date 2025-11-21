// src/services/auth/passwordAuth.ts
import { EncryptionService } from '../storage/encryptionService';
import { secureStorage } from '../storage/secureStorage';

export interface AuthUser {
  username: string;
}

export class PasswordAuth {
  private static readonly USER_KEY = 'auth_user';
  private static readonly PASSWORD_KEY = 'auth_password_encrypted';
  private static readonly ENC_KEY = 'auth_encryption_key';
  private static readonly SESSION_KEY = 'auth_session';

  static async register(username: string, password: string): Promise<void> {
    if (!username || !password) throw new Error('Username and password are required');

    const encryptionKey = await EncryptionService.generateKey();
    const encrypted = await EncryptionService.encrypt(password, encryptionKey);

    await secureStorage.setItem(this.USER_KEY, JSON.stringify({ username }));
    await secureStorage.setItem(this.PASSWORD_KEY, encrypted);
    await secureStorage.setItem(this.ENC_KEY, encryptionKey);
  }

  static async login(username: string, password: string): Promise<boolean> {
    const userStr = await secureStorage.getItem(this.USER_KEY);
    const encrypted = await secureStorage.getItem(this.PASSWORD_KEY);
    const encKey = await secureStorage.getItem(this.ENC_KEY);

    if (!userStr || !encrypted || !encKey) return false;

    const user = JSON.parse(userStr) as AuthUser;
    if (user.username !== username) return false;

    const stored = await EncryptionService.decrypt(encrypted, encKey);
    const ok = stored === password;

    if (ok) {
      // create a simple session token
      const session = { username, createdAt: new Date().toISOString() };
      await secureStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    return ok;
  }

  static async logout(): Promise<void> {
    await secureStorage.deleteItem(this.SESSION_KEY);
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const session = await secureStorage.getItem(this.SESSION_KEY);
    if (!session) return null;
    try {
      const s = JSON.parse(session);
      return { username: s.username };
    } catch {
      return null;
    }
  }

  static async isRegistered(): Promise<boolean> {
    const user = await secureStorage.getItem(this.USER_KEY);
    const pwd = await secureStorage.getItem(this.PASSWORD_KEY);
    return !!(user && pwd);
  }
}

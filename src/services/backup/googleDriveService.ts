// src/services/backup/googleDriveService.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { secureStorage } from '../storage/secureStorage';

WebBrowser.maybeCompleteAuthSession();

// Configuration Google OAuth
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // À configurer dans app.json
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'mylife',
  path: 'redirect'
});

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file', // Accès aux fichiers créés par l'app
  'https://www.googleapis.com/auth/drive.appdata' // Accès au dossier caché de l'app
];

interface GoogleDriveFile {
  id: string;
  name: string;
  size: string;
  modifiedTime: string;
  mimeType: string;
}

export class GoogleDriveService {
  private static readonly TOKEN_KEY = 'google_drive_token';
  private static readonly REFRESH_TOKEN_KEY = 'google_drive_refresh_token';
  
  /**
   * Authentification Google OAuth
   */
  static async authenticate(): Promise<{ success: boolean; error?: string }> {
    try {
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: GOOGLE_CLIENT_ID,
          scopes: SCOPES,
          redirectUri: REDIRECT_URI,
          responseType: AuthSession.ResponseType.Code,
          usePKCE: true,
        },
        discovery
      );

      if (!request) {
        return { success: false, error: 'Impossible de créer la requête d\'authentification' };
      }

      const result = await promptAsync();

      if (result.type === 'success' && result.params.code) {
        // Échanger le code contre un token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code: result.params.code,
            redirectUri: REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
          },
          discovery
        );

        await secureStorage.setItem(this.TOKEN_KEY, tokenResponse.accessToken);
        if (tokenResponse.refreshToken) {
          await secureStorage.setItem(this.REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
        }

        return { success: true };
      }

      return { success: false, error: 'Authentification annulée' };
    } catch (error) {
      console.error('❌ Erreur authentification Google Drive:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await secureStorage.getItem(this.TOKEN_KEY);
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * Obtenir le token d'accès
   */
  private static async getAccessToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Upload un fichier vers Google Drive
   */
  static async uploadFile(
    fileName: string,
    fileContent: string
  ): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return { success: false, error: 'Non authentifié. Connectez-vous à Google Drive.' };
      }

      // Créer le fichier dans l'appDataFolder (dossier caché de l'app)
      const metadata = {
        name: fileName,
        parents: ['appDataFolder'],
        mimeType: 'application/json'
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: 'application/json' }));

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: form
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Erreur upload Drive:', error);
        return { success: false, error: 'Échec de l\'upload vers Google Drive' };
      }

      const result = await response.json();
      console.log('✅ Fichier uploadé sur Google Drive:', result.id);

      return { success: true, fileId: result.id };
    } catch (error) {
      console.error('❌ Erreur upload Google Drive:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Lister les fichiers de backup sur Google Drive
   */
  static async listBackups(): Promise<{
    success: boolean;
    files?: GoogleDriveFile[];
    error?: string;
  }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return { success: false, error: 'Non authentifié' };
      }

      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,size,modifiedTime,mimeType)&orderBy=modifiedTime desc',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        return { success: false, error: 'Échec de la récupération des fichiers' };
      }

      const data = await response.json();
      return { success: true, files: data.files || [] };
    } catch (error) {
      console.error('❌ Erreur liste Google Drive:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Télécharger un fichier depuis Google Drive
   */
  static async downloadFile(fileId: string): Promise<{
    success: boolean;
    content?: string;
    error?: string;
  }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return { success: false, error: 'Non authentifié' };
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        return { success: false, error: 'Échec du téléchargement' };
      }

      const content = await response.text();
      return { success: true, content };
    } catch (error) {
      console.error('❌ Erreur téléchargement Google Drive:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Supprimer un fichier de Google Drive
   */
  static async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return { success: false, error: 'Non authentifié' };
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        return { success: false, error: 'Échec de la suppression' };
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression Google Drive:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Déconnexion Google Drive
   */
  static async disconnect(): Promise<void> {
    try {
      await secureStorage.removeItem(this.TOKEN_KEY);
      await secureStorage.removeItem(this.REFRESH_TOKEN_KEY);
      console.log('✅ Déconnexion Google Drive réussie');
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
  }
}

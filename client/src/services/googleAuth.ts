// Google Identity Services (GSI) authentication service
interface GoogleAccounts {
  id: {
    initialize: (config: any) => void;
    prompt: (callback?: (notification: any) => void) => void;
    renderButton: (parent: HTMLElement, options: any) => void;
    disableAutoSelect: () => void;
    storeCredential: (credential: any, callback?: () => void) => void;
    cancel: () => void;
    onGoogleLibraryLoad: () => void;
  };
  oauth2: {
    initTokenClient: (config: any) => any;
    hasGrantedAllScopes: (token: any, ...scopes: string[]) => boolean;
    hasGrantedAnyScope: (token: any, ...scopes: string[]) => boolean;
    revoke: (accessToken: string, callback?: () => void) => void;
  };
}

declare global {
  interface Window {
    google?: {
      accounts?: GoogleAccounts;
    };
  }
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleCredential {
  credential: string;
  select_by: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private clientId: string;
  private isInitialized = false;
  private tokenClient: any = null;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  }

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  isConfigured(): boolean {
    return !!(this.clientId && this.clientId !== '' && this.clientId !== 'your-google-client-id.apps.googleusercontent.com');
  }

  private waitForGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        resolve();
        return;
      }

      const checkGoogle = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          resolve();
        } else {
          setTimeout(checkGoogle, 100);
        }
      };

      // Start checking immediately
      setTimeout(checkGoogle, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        reject(new Error('Google Identity Services failed to load'));
      }, 10000);
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.isConfigured()) {
      throw new Error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
    }

    try {
      await this.waitForGoogleScript();

      // Initialize Google Identity Services
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: () => {}, // We'll handle this in signIn method
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }

      // Initialize OAuth2 token client for additional scopes if needed
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'profile email',
          callback: () => {}, // We'll handle this in methods that need it
        });
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw error;
    }
  }

  private parseJwtPayload(credential: string): GoogleUser {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      throw new Error('Invalid credential token');
    }
  }

  async signIn(role: 'donor' | 'collector'): Promise<GoogleUser> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      // Create a temporary callback for this sign-in attempt
      const handleCredentialResponse = (response: GoogleCredential) => {
        try {
          const user = this.parseJwtPayload(response.credential);
          
          // Store user data with role
          const userData = { ...user, role };
          localStorage.setItem('googleUser', JSON.stringify(userData));
          localStorage.setItem('googleCredential', response.credential);
          
          resolve(user);
        } catch (error) {
          reject(error);
        }
      };

      // Re-initialize with our callback
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Trigger the sign-in prompt
        window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: try to render a button and simulate click
          const tempDiv = document.createElement('div');
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);
          
          if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.renderButton(tempDiv, {
              type: 'standard',
              size: 'large',
              text: 'signin_with',
              theme: 'outline',
              logo_alignment: 'left',
            });
          }
          
          // Simulate clicking the button
          const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
          if (button) {
            button.click();
          } else {
            document.body.removeChild(tempDiv);
            reject(new Error('Google sign-in failed to display. Please ensure popups are allowed and try again.'));
          }
          
          // Clean up after a delay
          setTimeout(() => {
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
            }
          }, 5000);
        }
        });
      } else {
        reject(new Error('Google Identity Services not available'));
      }

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Sign-in timeout. Please try again.'));
      }, 30000);
    });
  }

  getCurrentUser(): (GoogleUser & { role: 'donor' | 'collector' }) | null {
    try {
      const userData = localStorage.getItem('googleUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const credential = localStorage.getItem('googleCredential');
    return !!(user && credential);
  }

  signOut(): void {
    // Clear local storage
    localStorage.removeItem('googleUser');
    localStorage.removeItem('googleCredential');
    
    // Disable auto-select for next time
    if (this.isInitialized && window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  getCredential(): string | null {
    return localStorage.getItem('googleCredential');
  }
}

export const googleAuthService = GoogleAuthService.getInstance();
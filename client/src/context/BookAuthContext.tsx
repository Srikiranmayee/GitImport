import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleAuthService, GoogleUser } from '../services/googleAuth';

interface User extends GoogleUser {
  role: 'donor' | 'collector';
}

interface AuthContextType {
  user: User | null;
  login: (role: 'donor' | 'collector') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = googleAuthService.isConfigured();

  useEffect(() => {
    // Check for existing authentication on app load
    const initAuth = async () => {
      try {
        if (googleAuthService.isAuthenticated()) {
          const currentUser = googleAuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear potentially corrupted auth data
        googleAuthService.signOut();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (role: 'donor' | 'collector') => {
    if (!isConfigured) {
      setError('Google OAuth is not configured. Please set up your Google Client ID.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const googleUser = await googleAuthService.signIn(role);
      const userWithRole: User = { ...googleUser, role };
      setUser(userWithRole);
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage = 'Please allow popups for this site and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Login timed out. Please try again.';
        } else if (error.message.includes('cancelled') || error.message.includes('closed')) {
          errorMessage = 'Login was cancelled. Please try again.';
        } else if (error.message.includes('not configured')) {
          errorMessage = 'Google authentication is not properly configured.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    googleAuthService.signOut();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
    isConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
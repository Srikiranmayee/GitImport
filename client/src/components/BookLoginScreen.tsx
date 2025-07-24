import { useState } from 'react';
import { useAuth } from '../context/BookAuthContext';
import { Book, Loader2, AlertCircle, BookOpen, Search, ExternalLink } from 'lucide-react';

const BookLoginScreen = () => {
  const { login, isLoading, error, isConfigured } = useAuth();
  const [loginRole, setLoginRole] = useState<'donor' | 'collector' | null>(null);

  const handleLogin = async (role: 'donor' | 'collector') => {
    if (!isConfigured) {
      console.error('Google is not configured');
      return;
    }

    setLoginRole(role);
    try {
      await login(role);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoginRole(null);
    }
  };

  const isCurrentlyLoading = (role: 'donor' | 'collector') => {
    return isLoading && loginRole === role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl mb-4">
            <Book className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BookShare</h1>
          <p className="text-gray-600">Share books, build communities</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Choose Your Role & Sign In
          </h2>

          {!isConfigured && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium text-sm">Google OAuth Not Configured</p>
                  <div className="text-red-700 text-xs mt-1 space-y-1">
                    <p>• Google OAuth Client ID is not configured</p>
                    <p>• Please set up Google OAuth credentials</p>
                  </div>
                  <div className="mt-3 text-xs text-red-600">
                    <p className="font-medium">Setup Instructions:</p>
                    <div className="mt-1 space-y-1">
                      <p>1. Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></p>
                      <p>2. Create OAuth 2.0 Client ID (Web application)</p>
                      <p>3. Add authorized origins:</p>
                      <div className="bg-red-100 p-2 rounded mt-1 font-mono text-xs">
                        {window.location.origin}
                      </div>
                      <p>4. Add Client ID to .env file:</p>
                      <div className="bg-red-100 p-2 rounded mt-1 font-mono text-xs">
                        VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Authentication Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Book Donor Section */}
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Donor</h3>
                <p className="text-sm text-gray-600">Share your books with the community</p>
              </div>

              <button
                onClick={() => handleLogin('donor')}
                disabled={isLoading || !isConfigured}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isCurrentlyLoading('donor') ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue as Donor
              </button>
            </div>

            {/* Book Collector Section */}
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-3">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Collector</h3>
                <p className="text-sm text-gray-600">Discover and collect books</p>
              </div>

              <button
                onClick={() => handleLogin('collector')}
                disabled={isLoading || !isConfigured}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isCurrentlyLoading('collector') ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue as Collector
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Join thousands of book lovers sharing their collections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLoginScreen;
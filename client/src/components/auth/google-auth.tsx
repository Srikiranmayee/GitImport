import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleAuth() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();
  const { toast } = useToast();

  const googleAuthMutation = useMutation({
    mutationFn: async (credential: string) => {
      const response = await apiRequest("POST", "/api/auth/google", { token: credential });
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Authentication Successful",
        description: "You have been successfully logged in with Google.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate with Google. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Logout Failed",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
          callback: (response: any) => {
            googleAuthMutation.mutate(response.credential);
          },
        });
        setIsGoogleLoaded(true);
      }
    };

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleAuth();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogle);
          initializeGoogleAuth();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, []);

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast({
        title: "Google Sign-In Unavailable",
        description: "Google Sign-In is not available. Please refresh the page and try again.",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-secondary font-medium hover:bg-gray-50 hover:border-gray-400"
      >
        {logoutMutation.isPending ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3" />
        ) : (
          <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H8V6zm4 9c0 .55-.45 1-1 1s-1-.45-1-1v-3c0-.55.45-1 1-1s1 .45 1 1v3z"
            />
          </svg>
        )}
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={!isGoogleLoaded || googleAuthMutation.isPending}
      className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-secondary font-medium hover:bg-gray-50 hover:border-gray-400"
    >
      {googleAuthMutation.isPending ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3" />
      ) : (
        <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      Sign in with Google
    </Button>
  );
}
import { useAuth } from "@/hooks/use-auth";
import { Code, ChevronDown } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="bg-surface shadow-card border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Code className="text-primary text-2xl" />
            <h1 className="text-xl font-semibold text-secondary">Replit GitHub Importer</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span className="text-sm text-secondary">Checking authentication...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button className="flex items-center space-x-2 text-secondary hover:text-primary">
                  <img 
                    src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=32&h=32&fit=crop&crop=face"} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full" 
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown className="text-xs" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-secondary">Not authenticated</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
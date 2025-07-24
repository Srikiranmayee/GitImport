import { Card } from "@/components/ui/card";
import { GoogleAuth } from "@/components/auth/google-auth";
import { useAuth } from "@/hooks/use-auth";
import { Clock, CheckCircle, TriangleAlert } from "lucide-react";

export function AuthenticationCard() {
  const { isAuthenticated, isLoading, error } = useAuth();

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="mr-2 h-4 w-4" />
          Checking...
        </div>
      );
    }
    
    if (isAuthenticated) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="mr-2 h-4 w-4" />
          Authenticated
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="mr-2 h-4 w-4" />
        Not Authenticated
      </div>
    );
  };

  return (
    <div className="mb-8">
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-secondary mb-2">Authentication Status</h2>
            <p className="text-gray-600">Sign in with Google to import and manage your GitHub projects</p>
          </div>
          <div className="text-right">
            {getStatusBadge()}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-secondary mb-2">Google Authentication</h3>
              <p className="text-sm text-gray-600">Required for GitHub API access and project management</p>
            </div>
            
            <GoogleAuth />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <TriangleAlert className="text-error mt-1 mr-3" />
                <div>
                  <h4 className="text-error font-medium">Authentication Failed</h4>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="text-success mt-1 mr-3" />
                <div>
                  <h4 className="text-success font-medium">Successfully Authenticated</h4>
                  <p className="text-sm text-green-600 mt-1">
                    You are now logged in and can import GitHub projects.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
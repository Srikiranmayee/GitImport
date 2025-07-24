import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, Github } from "lucide-react";

interface ImportOptions {
  includeHistory: boolean;
  installDependencies: boolean;
  createReplit: boolean;
}

export function GitHubImportCard() {
  const [githubUrl, setGithubUrl] = useState("");
  const [options, setOptions] = useState<ImportOptions>({
    includeHistory: true,
    installDependencies: true,
    createReplit: false,
  });

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (data: { githubUrl: string } & ImportOptions) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Import Started",
        description: `Started importing ${data.name} from GitHub.`,
      });
      setGithubUrl("");
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to start project import. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateGitHubUrl = (url: string) => {
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubUrlPattern.test(url);
  };

  const handleImport = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with Google before importing projects.",
        variant: "destructive",
      });
      return;
    }

    if (!githubUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateGitHubUrl(githubUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    importMutation.mutate({
      githubUrl: githubUrl.trim(),
      ...options,
    });
  };

  const handleOptionChange = (key: keyof ImportOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mb-8">
      <Card className="p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-secondary mb-2">Import GitHub Project</h2>
          <p className="text-gray-600">Enter a GitHub repository URL to import your project to Replit</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="github-url" className="block text-sm font-medium text-secondary mb-2">
              GitHub Repository URL
            </Label>
            <div className="flex">
              <div className="relative flex-1">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="url"
                  id="github-url"
                  placeholder="https://github.com/username/repository"
                  className="pl-10 font-mono text-sm rounded-r-none border-r-0"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleImport}
                disabled={!isAuthenticated || importMutation.isPending}
                className="rounded-l-none"
              >
                {importMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Import
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supports public and private repositories (authentication required for private repos)
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-secondary mb-3">Import Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-history"
                  checked={options.includeHistory}
                  onCheckedChange={(checked) => handleOptionChange("includeHistory", !!checked)}
                />
                <Label htmlFor="include-history" className="text-sm text-gray-700">
                  Include Git history
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="install-dependencies"
                  checked={options.installDependencies}
                  onCheckedChange={(checked) => handleOptionChange("installDependencies", !!checked)}
                />
                <Label htmlFor="install-dependencies" className="text-sm text-gray-700">
                  Automatically install dependencies
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-replit"
                  checked={options.createReplit}
                  onCheckedChange={(checked) => handleOptionChange("createReplit", !!checked)}
                />
                <Label htmlFor="create-replit" className="text-sm text-gray-700">
                  Create new Replit project
                </Label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
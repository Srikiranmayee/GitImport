import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { type Project } from "@shared/schema";
import { Github, ExternalLink, ArrowRight, Check, TriangleAlert, Folder, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function RecentProjectsCard() {
  const { isAuthenticated } = useAuth();
  
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Ready
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <TriangleAlert className="mr-1 h-3 w-3" />
            Failed
          </span>
        );
      case "pending":
      case "cloning":
      case "setting_up":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            {status === "pending" ? "Starting" : status === "cloning" ? "Cloning" : "Setting Up"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="mb-8">
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-secondary">Recent Projects</h2>
          <Button variant="ghost" className="text-sm text-primary hover:text-blue-700 font-medium">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {recentProjects.length > 0 ? (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Github className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary">{project.name}</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-mono">{new URL(project.githubUrl).pathname}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(project.status)}
                  {project.replitUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.replitUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Folder className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg font-medium mb-2">No Projects Yet</p>
            <p className="text-sm">Import your first GitHub project to get started</p>
          </div>
        )}
      </Card>
    </div>
  );
}
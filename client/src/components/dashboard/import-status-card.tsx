import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { type Project } from "@shared/schema";
import { Clock, CheckCircle, XCircle, Loader2, FolderOpen } from "lucide-react";

const importSteps = [
  { key: "pending", label: "Validating Repository", description: "Checking repository access and permissions" },
  { key: "cloning", label: "Cloning Repository", description: "Downloading repository files and history" },
  { key: "setting_up", label: "Setting up Environment", description: "Installing dependencies and configuring project" },
  { key: "ready", label: "Creating Replit Project", description: "Finalizing project setup and configuration" },
];

export function ImportStatusCard() {
  const { isAuthenticated } = useAuth();
  
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const activeImport = projects.find(project => 
    project.status === "pending" || project.status === "cloning" || project.status === "setting_up"
  );

  const getStepStatus = (stepKey: string, projectStatus: string) => {
    const stepIndex = importSteps.findIndex(step => step.key === stepKey);
    const currentStepIndex = importSteps.findIndex(step => step.key === projectStatus);
    
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "active";
    return "pending";
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case "active":
        return <Loader2 className="text-blue-500 h-5 w-5 animate-spin" />;
      default:
        return <Clock className="text-gray-500 h-5 w-5" />;
    }
  };

  const getStepStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "active":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "active":
        return "text-blue-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="mb-8">
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-secondary">Import Progress</h2>
          <div className="text-sm text-gray-500">
            {activeImport ? `Importing: ${activeImport.name}` : "Last updated: Never"}
          </div>
        </div>

        {activeImport ? (
          <div className="space-y-4">
            {importSteps.map((step) => {
              const status = getStepStatus(step.key, activeImport.status);
              return (
                <div key={step.key} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getStepIcon(status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-secondary">{step.label}</h3>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  <div className={`text-xs ${getStepStatusColor(status)}`}>
                    {getStepStatusText(status)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FolderOpen className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg font-medium mb-2">No Active Import</p>
            <p className="text-sm">Start by entering a GitHub repository URL above</p>
          </div>
        )}
      </Card>
    </div>
  );
}
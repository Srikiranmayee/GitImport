import { Header } from "@/components/dashboard/header";
import { AuthenticationCard } from "@/components/dashboard/authentication-card";
import { GitHubImportCard } from "@/components/dashboard/github-import-card";
import { ImportStatusCard } from "@/components/dashboard/import-status-card";
import { RecentProjectsCard } from "@/components/dashboard/recent-projects-card";
import { TroubleshootingCard } from "@/components/dashboard/troubleshooting-card";

export default function Dashboard() {
  return (
    <div className="bg-background min-h-screen font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuthenticationCard />
        <GitHubImportCard />
        <ImportStatusCard />
        <RecentProjectsCard />
        <TroubleshootingCard />
      </main>
    </div>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Info } from "lucide-react";

interface TroubleshootingItem {
  title: string;
  content: string[];
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    title: "Authentication Issues",
    content: [
      "Ensure you're using HTTPS for production deployment",
      "Check that Google OAuth credentials are properly configured",
      "Verify callback URLs match your domain settings",
      "Clear browser cache and cookies if authentication fails",
    ],
  },
  {
    title: "Repository Access",
    content: [
      "Ensure the repository exists and is accessible",
      "Check repository permissions for private repos",
      "Verify GitHub personal access token has correct scopes",
      "Make sure repository URL format is correct",
    ],
  },
  {
    title: "Import Failures",
    content: [
      "Check network connectivity and firewall settings",
      "Verify repository size doesn't exceed limits",
      "Ensure project structure is compatible with Replit",
      "Review error logs for specific failure reasons",
    ],
  },
];

export function TroubleshootingCard() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const openConsoleInstructions = () => {
    const instructions = `
To check the browser console for error messages:

1. Chrome/Edge: Press F12 or right-click and select "Inspect"
2. Firefox: Press F12 or right-click and select "Inspect Element"
3. Safari: Press Cmd+Option+I (Mac) or enable Developer menu first
4. Click on the "Console" tab
5. Look for error messages (usually in red)
6. Copy any error messages to share with support

Common errors to look for:
- CORS errors
- Authentication failures
- Network connectivity issues
- JavaScript runtime errors
    `.trim();

    alert(instructions);
  };

  return (
    <div className="mb-8">
      <Card className="p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-secondary mb-2">Troubleshooting</h2>
          <p className="text-gray-600">Common issues and solutions for GitHub import and authentication</p>
        </div>

        <div className="space-y-4">
          {troubleshootingItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium text-secondary">{item.title}</span>
                <ChevronRight 
                  className={`text-gray-400 h-4 w-4 transform transition-transform ${
                    expandedItems.has(index) ? "rotate-90" : ""
                  }`} 
                />
              </button>
              {expandedItems.has(index) && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  <ul className="space-y-2 list-disc list-inside">
                    {item.content.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Info className="text-primary mt-1 mr-3 h-5 w-5" />
            <div className="flex-1">
              <h4 className="font-medium text-primary">Need More Help?</h4>
              <p className="text-sm text-blue-600 mt-1">
                If you're still experiencing issues, check the browser console for detailed error messages or contact support.
              </p>
              <Button
                variant="link"
                className="text-sm text-primary underline mt-2 hover:text-blue-800 p-0"
                onClick={openConsoleInstructions}
              >
                How to Check Browser Console
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
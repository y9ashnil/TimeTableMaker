"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application settings and API configurations."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gemini API Configuration</CardTitle>
            <CardDescription>
              The Google AI Gemini API key is configured for this application.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configuration Status</AlertTitle>
                <AlertDescription>
                  The Gemini API key has been hardcoded into the application's environment. The AI features are ready to use.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

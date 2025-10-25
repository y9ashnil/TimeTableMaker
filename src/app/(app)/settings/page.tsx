"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, TriangleAlert } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application settings."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>
              AI features have been disabled in this application.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>AI Services Are Offline</AlertTitle>
                <AlertDescription>
                  The Gemini API integration has been removed. All AI-powered features are currently unavailable.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

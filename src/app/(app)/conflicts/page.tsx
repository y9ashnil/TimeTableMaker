"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, TriangleAlert } from "lucide-react";

export default function ConflictsPage() {

  return (
    <>
      <PageHeader
        title="AI Conflict Solver"
        description="This feature is currently disabled."
      />

      <Card>
        <CardHeader>
          <CardTitle>Feature Unavailable</CardTitle>
          <CardDescription>
            The AI-powered conflict resolution feature has been removed from the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>AI Not Configured</AlertTitle>
            <AlertDescription>
              All AI-related features have been disabled in this version of the application.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
}

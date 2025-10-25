"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getConflictResolutionSuggestions } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Lightbulb, Loader2, TriangleAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const placeholderText = `Enter each conflict on a new line. For example:
- Dr. Sharma has a class conflict on Monday at 10 AM.
- Classroom A101 is double-booked on Wednesday at 2 PM.
- CSE-2A batch has two consecutive labs, which is not allowed.`;

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResolveConflicts = async () => {
    if (!conflicts.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter the conflicts you want to resolve.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSuggestions([]);

    const conflictLines = conflicts.split('\n').filter(line => line.trim() !== '');
    const result = await getConflictResolutionSuggestions(conflictLines);
    
    setIsLoading(false);

    if (result.success && result.suggestions) {
      setSuggestions(result.suggestions);
    } else {
      toast({
        title: "Error",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="AI Conflict Solver"
        description="Describe timetable conflicts and get intelligent suggestions for resolution."
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Conflicts</CardTitle>
            <CardDescription>
              Provide a list of conflicts that need resolution. Be as specific as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={placeholderText}
              className="min-h-[200px] font-mono text-sm"
              value={conflicts}
              onChange={(e) => setConflicts(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleResolveConflicts} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2" />
              )}
              Get Suggestions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Suggestions</CardTitle>
            <CardDescription>
              Here are potential rearrangements to resolve the conflicts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && suggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                 <Lightbulb className="h-8 w-8 mb-2" />
                <p>Suggestions will appear here once generated.</p>
              </div>
            )}
            {!isLoading && suggestions.length > 0 && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Resolution Suggestions</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc space-y-2 pl-5 mt-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

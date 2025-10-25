"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveApiKey } from "@/app/actions";
import { Loader2, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    
    // In a real app, we would save this to a secure backend.
    // For this example, we'll simulate saving and just update the UI.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where you would call a server action to save the key
    // For now, we will just use a placeholder function
    // await saveApiKey(apiKey);

    setIsLoading(false);
    toast({
      title: "API Key Saved (Simulated)",
      description: "Your Gemini API key has been configured for this session. Refreshing the page will clear it in this demo environment.",
    });
    
    // A real implementation would not need this next line. This is for the demo.
    // This makes the key available to the Genkit BE for the current session.
    process.env.GEMINI_API_KEY = apiKey;
  };

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
              Enter your Google AI Gemini API key to enable generative AI features.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Alert className="mb-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Developer Note</AlertTitle>
                <AlertDescription>
                  For this demo, the API key is stored in memory and will be cleared on page refresh. In a production environment, this key should be stored securely as a server-side environment variable.
                </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2" />
                )}
                Save API Key
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

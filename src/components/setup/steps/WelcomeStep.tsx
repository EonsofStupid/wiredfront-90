import { Card, CardContent } from "@/components/ui/card";

export function WelcomeStep() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Welcome to the Setup Wizard!</h3>
          <p className="text-muted-foreground">
            This wizard will help you configure your application. We'll guide you through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Setting up your API keys</li>
            <li>Configuring your preferences</li>
            <li>Customizing your experience</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Click "Next" to begin the setup process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
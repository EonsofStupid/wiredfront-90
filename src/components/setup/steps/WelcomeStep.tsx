import { Card, CardContent } from "@/components/ui/card";

interface WelcomeStepProps {
  isFirstTimeUser?: boolean;
}

export function WelcomeStep({ isFirstTimeUser = false }: WelcomeStepProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {isFirstTimeUser 
              ? "Welcome to wiredFRONT!" 
              : "Welcome to the Setup Wizard!"}
          </h3>
          <p className="text-muted-foreground">
            {isFirstTimeUser 
              ? "Let's get you started with your new account. We'll guide you through the initial setup process."
              : "This wizard will help you configure your application. We'll guide you through:"}
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
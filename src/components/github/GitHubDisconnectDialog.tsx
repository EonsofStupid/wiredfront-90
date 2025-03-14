
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Github, Info, ArrowRight, Shield, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface GitHubDisconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisconnect: () => void;
  username: string | null;
}

export function GitHubDisconnectDialog({
  open,
  onOpenChange,
  onDisconnect,
  username
}: GitHubDisconnectDialogProps) {
  const [step, setStep] = useState<'choice' | 'confirm'>("choice");
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  
  const handleAction = (action: 'disconnect' | 'add-new') => {
    if (action === 'disconnect') {
      setStep('confirm');
    } else {
      // Handle adding a new connection (close this dialog and open the connect dialog)
      onOpenChange(false);
      // You can add additional logic here to open the connect dialog if needed
    }
  };
  
  const handleDisconnect = () => {
    onDisconnect();
    onOpenChange(false);
    setStep('choice');
    setConfirmationChecked(false);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    setStep('choice');
    setConfirmationChecked(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-dark-lighter border-neon-blue/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neon-blue">
            <Github className="h-5 w-5" />
            {step === 'choice' ? 'GitHub Connection' : 'Confirm Disconnection'}
          </DialogTitle>
          <DialogDescription>
            {step === 'choice' 
              ? 'What would you like to do with your GitHub connection?' 
              : `You're about to disconnect from GitHub (@${username}).`}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'choice' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="justify-start border-neon-pink/30 hover:bg-neon-pink/10 hover:text-neon-pink group"
                onClick={() => handleAction('disconnect')}
              >
                <Shield className="h-4 w-4 mr-2 text-neon-pink group-hover:text-neon-pink" />
                Disconnect existing connection
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start border-neon-blue/30 hover:bg-neon-blue/10 hover:text-neon-blue group"
                onClick={() => handleAction('add-new')}
              >
                <Plus className="h-4 w-4 mr-2 text-neon-blue group-hover:text-neon-blue" />
                Add a new connection
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </div>
        )}
        
        {step === 'confirm' && (
          <div className="space-y-4 py-4">
            <Alert className="bg-neon-pink/10 text-neon-pink border-neon-pink/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Disconnecting from GitHub will prevent you from accessing your repositories. 
                You'll need to re-establish the connection to continue work on your projects.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-md border border-muted p-4 bg-card/50">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="confirmation" 
                  checked={confirmationChecked} 
                  onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
                  className="data-[state=checked]:bg-neon-pink data-[state=checked]:border-neon-pink"
                />
                <label 
                  htmlFor="confirmation" 
                  className="text-sm leading-tight cursor-pointer"
                >
                  I understand that disconnecting from GitHub will limit my ability to 
                  synchronize code changes until I reconnect my account.
                </label>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className={step === 'confirm' ? "flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-2" : ""}>
          {step === 'choice' ? (
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-2 w-full">
              <Button 
                variant="ghost" 
                onClick={() => setStep('choice')}
                className="text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                  disabled={!confirmationChecked}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

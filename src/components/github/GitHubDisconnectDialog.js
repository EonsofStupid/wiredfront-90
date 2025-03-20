import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Github, ArrowRight, Shield, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
export function GitHubDisconnectDialog({ open, onOpenChange, onDisconnect, username }) {
    const [step, setStep] = useState("choice");
    const [confirmationChecked, setConfirmationChecked] = useState(false);
    const handleAction = (action) => {
        if (action === 'disconnect') {
            setStep('confirm');
        }
        else {
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
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-dark-lighter border-neon-blue/30", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-neon-blue", children: [_jsx(Github, { className: "h-5 w-5" }), step === 'choice' ? 'GitHub Connection' : 'Confirm Disconnection'] }), _jsx(DialogDescription, { children: step === 'choice'
                                ? 'What would you like to do with your GitHub connection?'
                                : `You're about to disconnect from GitHub (@${username}).` })] }), step === 'choice' && (_jsx("div", { className: "space-y-4 py-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs(Button, { variant: "outline", className: "justify-start border-neon-pink/30 hover:bg-neon-pink/10 hover:text-neon-pink group", onClick: () => handleAction('disconnect'), children: [_jsx(Shield, { className: "h-4 w-4 mr-2 text-neon-pink group-hover:text-neon-pink" }), "Disconnect existing connection", _jsx(ArrowRight, { className: "h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" })] }), _jsxs(Button, { variant: "outline", className: "justify-start border-neon-blue/30 hover:bg-neon-blue/10 hover:text-neon-blue group", onClick: () => handleAction('add-new'), children: [_jsx(Plus, { className: "h-4 w-4 mr-2 text-neon-blue group-hover:text-neon-blue" }), "Add a new connection", _jsx(ArrowRight, { className: "h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" })] })] }) })), step === 'confirm' && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs(Alert, { className: "bg-neon-pink/10 text-neon-pink border-neon-pink/30", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "Disconnecting from GitHub will prevent you from accessing your repositories. You'll need to re-establish the connection to continue work on your projects." })] }), _jsx("div", { className: "rounded-md border border-muted p-4 bg-card/50", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(Checkbox, { id: "confirmation", checked: confirmationChecked, onCheckedChange: (checked) => setConfirmationChecked(checked === true), className: "data-[state=checked]:bg-neon-pink data-[state=checked]:border-neon-pink" }), _jsx("label", { htmlFor: "confirmation", className: "text-sm leading-tight cursor-pointer", children: "I understand that disconnecting from GitHub will limit my ability to synchronize code changes until I reconnect my account." })] }) })] })), _jsx(DialogFooter, { className: step === 'confirm' ? "flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-2" : "", children: step === 'choice' ? (_jsx(Button, { variant: "ghost", onClick: handleClose, children: "Cancel" })) : (_jsxs("div", { className: "flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-2 w-full", children: [_jsx(Button, { variant: "ghost", onClick: () => setStep('choice'), className: "text-muted-foreground hover:text-foreground", children: "Back" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "ghost", onClick: handleClose, children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: handleDisconnect, disabled: !confirmationChecked, className: "bg-red-500 hover:bg-red-600 text-white", children: "Disconnect" })] })] })) })] }) }));
}

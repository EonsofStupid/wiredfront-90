import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Github } from "lucide-react";
import { GitHubTokenForm } from "./components/GitHubTokenForm";
import { GitHubTokenValidation } from "./components/GitHubTokenValidation";
import { useGitHubTokenValidation } from "@/hooks/github/useGitHubTokenValidation";
export function GitHubTokenDialog({ isOpen, onClose, onTokenAdded }) {
    const { tokenName, setTokenName, token, setToken, isLoading, validationState, validationResult, error, handleSubmit, handleClose } = useGitHubTokenValidation(onTokenAdded, onClose);
    return (_jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center", children: [_jsx(Github, { className: "h-5 w-5 mr-2 text-[#8B5CF6]" }), "Add GitHub Token"] }), _jsx(DialogDescription, { children: "Enter a Personal Access Token (PAT) from GitHub to enable repository operations" })] }), _jsx(GitHubTokenForm, { tokenName: tokenName, token: token, isLoading: isLoading, validationState: validationState, onTokenNameChange: setTokenName, onTokenChange: setToken, onSubmit: handleSubmit, onClose: handleClose }), _jsx(GitHubTokenValidation, { error: error, validationState: validationState, validationResult: validationResult })] }) }));
}

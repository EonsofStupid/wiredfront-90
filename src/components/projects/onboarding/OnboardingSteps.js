import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
export function OnboardingSteps({ steps, currentStep }) {
    return (_jsx("div", { className: "flex items-center justify-center space-x-2", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center", children: [index > 0 && (_jsx("div", { className: cn("h-px w-12 mx-2", index <= currentStep ? "bg-neon-blue" : "bg-gray-600") })), _jsx("div", { className: cn("flex items-center justify-center w-8 h-8 rounded-full border", index < currentStep
                        ? "bg-neon-blue border-neon-blue text-white"
                        : index === currentStep
                            ? "border-neon-blue text-neon-blue"
                            : "border-gray-600 text-gray-500"), children: index < currentStep ? (_jsx(Check, { className: "w-4 h-4" })) : (_jsx("span", { className: "text-sm", children: index + 1 })) })] }, step))) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MainLayout } from "@/components/layout/MainLayout";
export default function Index() {
    console.log("Index page rendering");
    return (_jsx(MainLayout, { children: _jsxs("div", { className: "container mx-auto px-0", children: [_jsx(HeroSection, {}), _jsx(FeaturesSection, {})] }) }));
}

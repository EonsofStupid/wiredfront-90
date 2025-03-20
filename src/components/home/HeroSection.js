import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useReducedMotion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
export const HeroSection = () => {
    console.log("HeroSection rendering");
    const prefersReducedMotion = useReducedMotion();
    return (_jsxs("section", { className: "relative flex items-center justify-center py-28 w-full hero--neon-lines", children: [_jsxs(motion.div, { initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center z-10 px-4", children: [_jsxs("div", { className: "neon-border p-8 glass-card mb-8", children: [_jsx("h1", { className: "text-6xl md:text-8xl font-bold gradient-text mb-6", children: "wiredFRONT" }), _jsx("p", { className: "text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto", children: "The future of interface design, today." })] }), _jsx(Link, { to: "/login", children: _jsx(Button, { className: "neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 text-lg px-8 py-6 transform hover:scale-115 transition-all duration-300 animate-button-float", children: "Get Started" }) })] }), _jsx(BackgroundElements, {})] }));
};
const BackgroundElements = () => {
    console.log("BackgroundElements rendering");
    const prefersReducedMotion = useReducedMotion();
    const controls = useAnimation();
    const [mounted, setMounted] = useState(true);
    const performanceRef = useRef({
        startTime: performance.now(),
        frames: 0
    });
    useEffect(() => {
        console.log("BackgroundElements useEffect running");
        if (prefersReducedMotion) {
            console.log("Reduced motion enabled, skipping animations");
            return;
        }
        const cleanup = () => {
            console.log("BackgroundElements cleanup");
            controls.stop();
            setMounted(false);
        };
        const animate = async () => {
            try {
                console.log("Starting background animation");
                await controls.start({
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.6, 0.3],
                    transition: {
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }
                });
            }
            catch (error) {
                console.error("Animation error:", error);
            }
        };
        animate();
        const monitorPerformance = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - performanceRef.current.startTime;
            performanceRef.current.frames++;
            if (elapsed >= 1000) {
                const fps = Math.round((performanceRef.current.frames * 1000) / elapsed);
                console.log(`Background Animation FPS: ${fps}`);
                performanceRef.current = {
                    startTime: currentTime,
                    frames: 0
                };
            }
            if (mounted) {
                requestAnimationFrame(monitorPerformance);
            }
        };
        requestAnimationFrame(monitorPerformance);
        return cleanup;
    }, [prefersReducedMotion, controls, mounted]);
    if (prefersReducedMotion)
        return null;
    return (_jsx("div", { className: "absolute inset-0 pointer-events-none", children: _jsx(AnimatePresence, { children: [...Array(3)].map((_, i) => (_jsx(motion.div, { className: "absolute glass-card neon-glow w-32 h-32 transform", initial: { scale: 0.8, opacity: 0 }, animate: controls, exit: { scale: 0, opacity: 0 }, style: {
                    left: `${30 + i * 20}%`,
                    top: `${20 + i * 20}%`,
                    transform: `translate3d(0, 0, 0)`
                } }, i))) }) }));
};

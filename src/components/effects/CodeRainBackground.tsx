
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CodeRainProps {
  characters?: string;
  color?: string;
  fontSize?: number;
  density?: number;
  speed?: number;
  zIndex?: number;
  glitchEffect?: boolean;
  depthEffect?: boolean;
}

export const CodeRainBackground: React.FC<CodeRainProps> = ({
  characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$#@&%{}[]<>",
  color = 'rgba(0, 255, 255, 0.6)',
  fontSize = 14,
  density = 0.08,
  speed = 1.5,
  zIndex = -1,
  glitchEffect = true,
  depthEffect = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const columnsRef = useRef<number[]>([]);
  const dropsRef = useRef<number[]>([]);
  const depthRef = useRef<number[]>([]);
  const glitchTimerRef = useRef<number>(0);
  const glitchActiveRef = useRef<boolean>(false);

  // Set up the canvas dimensions and initialize the drops
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      setDimensions({ width, height });
      
      // Calculate number of columns based on density
      const columns = Math.floor(width * density);
      columnsRef.current = Array.from({ length: columns }, () => 0);
      dropsRef.current = Array.from({ length: columns }, () => 1);
      
      // Initialize depth values for 3D effect
      if (depthEffect) {
        depthRef.current = Array.from({ length: columns }, () => Math.random() * 0.6 + 0.4);
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [prefersReducedMotion, density, depthEffect]);

  // Glitch effect timer
  useEffect(() => {
    if (prefersReducedMotion || !glitchEffect) return;
    
    const triggerGlitch = () => {
      // Random glitch timing
      const nextGlitchTime = Math.random() * 5000 + 2000; // 2-7 seconds
      glitchActiveRef.current = true;
      
      // Set duration of the glitch effect
      setTimeout(() => {
        glitchActiveRef.current = false;
      }, Math.random() * 200 + 100); // 100-300ms glitch duration
      
      glitchTimerRef.current = window.setTimeout(triggerGlitch, nextGlitchTime);
    };
    
    glitchTimerRef.current = window.setTimeout(triggerGlitch, Math.random() * 3000 + 1000);
    
    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [prefersReducedMotion, glitchEffect]);

  // Animation loop
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current || !dimensions.width) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const charArray = characters.split('');
    
    const draw = () => {
      // Semi-transparent background to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;
      
      // Draw each drop
      for (let i = 0; i < columnsRef.current.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Calculate position
        const x = i * (fontSize * 1.5);
        const y = dropsRef.current[i] * fontSize;
        
        // Apply depth effect if enabled
        let currentFontSize = fontSize;
        let currentOpacity = 0.5 + Math.random() * 0.5;
        
        if (depthEffect) {
          const depth = depthRef.current[i];
          currentFontSize = fontSize * depth;
          currentOpacity *= depth;
        }
        
        // Apply glitch effect if active
        if (glitchEffect && glitchActiveRef.current && Math.random() > 0.7) {
          // Randomly shift position for some characters
          const glitchX = x + (Math.random() * 10 - 5);
          const glitchY = y + (Math.random() * 10 - 5);
          
          // Random color shift for glitch effect
          const glitchColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${currentOpacity})`;
          ctx.fillStyle = glitchColor;
          
          // Draw glitched character
          ctx.font = `${currentFontSize}px monospace`;
          ctx.fillText(char, glitchX, glitchY);
          
          // Reset style
          ctx.fillStyle = color.replace(')', `, ${currentOpacity})`).replace('rgba', 'rgba');
        } else {
          // Normal character drawing
          ctx.fillStyle = color.replace(')', `, ${currentOpacity})`).replace('rgba', 'rgba');
          ctx.font = `${currentFontSize}px monospace`;
          ctx.fillText(char, x, y);
        }
        
        // Add some variability to the drops' speed
        const currentSpeed = speed * (Math.random() * 0.5 + 0.75);
        
        // Reset drop if it reaches the bottom
        if (y > dimensions.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
          // Occasionally change the depth of a column
          if (depthEffect && Math.random() > 0.8) {
            depthRef.current[i] = Math.random() * 0.6 + 0.4;
          }
        }
        
        // Increment drop position
        dropsRef.current[i] += currentSpeed * 0.1;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, prefersReducedMotion, characters, color, fontSize, speed, depthEffect, glitchEffect]);

  // If user prefers reduced motion, don't render the canvas
  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex }}
    />
  );
};

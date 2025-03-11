
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CodeRainProps {
  characters?: string;
  color?: string;
  fontSize?: number;
  density?: number;
  speed?: number;
  zIndex?: number;
}

export const CodeRainBackground: React.FC<CodeRainProps> = ({
  characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$#@&%{}[]<>",
  color = 'rgba(0, 255, 255, 0.6)',
  fontSize = 14,
  density = 0.08,
  speed = 1.5,
  zIndex = -1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const columnsRef = useRef<number[]>([]);
  const dropsRef = useRef<number[]>([]);

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
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion, density]);

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
        
        // Random opacity for more dynamic effect
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = color.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
        
        // Draw the character
        ctx.fillText(char, x, y);
        
        // Reset drop if it reaches the bottom
        if (y > dimensions.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        
        // Increment drop position
        dropsRef.current[i] += Math.random() * speed;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, prefersReducedMotion, characters, color, fontSize, speed]);

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

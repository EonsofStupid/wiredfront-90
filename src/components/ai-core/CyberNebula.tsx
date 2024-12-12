import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from "framer-motion";

interface CyberNebulaProps {
  onExpand: () => void;
}

export const CyberNebula = ({ onExpand }: CyberNebulaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    rendererRef.current.setSize(window.innerWidth, 200);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create enhanced swirl geometry
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 4;
      const radius = 2 + Math.sin(angle * 2) * 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (i / 100) * 4 - 2;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#00FFFF") },
        color2: { value: new THREE.Color("#FF007F") }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        
        void main() {
          vec3 color = mix(color1, color2, sin(vUv.x * 10.0 + time) * 0.5 + 0.5);
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true
    });

    const swirl = new THREE.Mesh(geometry, material);
    sceneRef.current.add(swirl);

    cameraRef.current.position.z = 5;

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        time += 0.01;
        material.uniforms.time.value = time;
        swirl.rotation.z += 0.01;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onClick={onExpand}
      className="fixed top-0 left-0 w-full h-[200px] cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    />
  );
};
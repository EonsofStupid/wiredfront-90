import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AISwirlProps {
  onClick: () => void;
}

export const AISwirl = ({ onClick }: AISwirlProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(50, 50);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create swirl geometry
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(2, 0, 0),
      new THREE.Vector3(0, -2, 0),
      new THREE.Vector3(-2, 0, 0),
    ]);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.8,
    });

    const swirl = new THREE.Line(geometry, material);
    sceneRef.current.add(swirl);

    cameraRef.current.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
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
    <div
      ref={containerRef}
      onClick={onClick}
      className="cursor-pointer hover:scale-110 transition-transform"
      style={{ width: 50, height: 50 }}
    />
  );
};
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Cartoon3DSceneProps {
  className?: string;
}

export const Cartoon3DScene: React.FC<Cartoon3DSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Cartoon lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeb3b, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xff4081, 3, 20);
    pointLight.position.set(-6, -4, 5);
    scene.add(pointLight);

    // Floating 3D Cartoon Shapes
    const floatingObjects: { mesh: THREE.Mesh; speedX: number; speedY: number; rotSpeed: number; baseY: number; timeOffset: number }[] = [];

    // Colors: yellow, pink, cyan, green, purple
    const cartoonColors = [0xffe600, 0xff4081, 0x00e5ff, 0x76ff03, 0xb388ff, 0xff6d00];

    // Create 12 floating cartoon elements (donuts, stars, cubes, pyramids)
    for (let i = 0; i < 14; i++) {
      let geom: THREE.BufferGeometry;
      const r = Math.random();
      if (r < 0.3) {
        geom = new THREE.TorusGeometry(0.8, 0.32, 16, 24);
      } else if (r < 0.6) {
        geom = new THREE.DodecahedronGeometry(0.9, 0);
      } else if (r < 0.85) {
        geom = new THREE.ConeGeometry(0.8, 1.4, 4);
      } else {
        geom = new THREE.BoxGeometry(1.1, 1.1, 1.1);
      }

      const color = cartoonColors[i % cartoonColors.length];
      const mat = new THREE.MeshToonMaterial({ color });
      const mesh = new THREE.Mesh(geom, mat);

      // Black cartoon outline
      const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
      const outline = new THREE.Mesh(geom, outlineMat);
      outline.scale.set(1.12, 1.12, 1.12);
      mesh.add(outline);

      const posX = (Math.random() - 0.5) * 20;
      const posY = (Math.random() - 0.5) * 10;
      const posZ = (Math.random() - 0.5) * 6 - 1;
      mesh.position.set(posX, posY, posZ);

      scene.add(mesh);
      floatingObjects.push({
        mesh,
        speedX: (Math.random() - 0.5) * 0.015,
        speedY: (Math.random() - 0.5) * 0.015,
        rotSpeed: (Math.random() - 0.5) * 0.03 + 0.01,
        baseY: posY,
        timeOffset: Math.random() * 10,
      });
    }

    let reqId: number;
    let clock = new THREE.Clock();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      floatingObjects.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeed;
        item.mesh.rotation.y += item.rotSpeed * 1.2;
        item.mesh.position.y = item.baseY + Math.sin(elapsed * 1.5 + item.timeOffset) * 0.7;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      floatingObjects.forEach((item) => {
        item.mesh.geometry.dispose();
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} />;
};

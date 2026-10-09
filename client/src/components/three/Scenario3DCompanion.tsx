import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterMood } from '@vibequest/shared';
import { soundFx } from '../../services/soundFx.js';

interface Scenario3DCompanionProps {
  mood: CharacterMood;
  turnNumber: number;
  characterName: string;
  className?: string;
}

export const Scenario3DCompanion: React.FC<Scenario3DCompanionProps> = ({
  mood,
  turnNumber,
  characterName,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const moodMeshGroupRef = useRef<THREE.Group | null>(null);
  const starParticlesRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 180;
    const height = container.clientHeight || 120;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffe600, 2, 10);
    pointLight.position.set(-3, 3, 3);
    scene.add(pointLight);

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central 3D Cartoon Companion Orb / Core with bold cel-shading
    const coreGeo = new THREE.DodecahedronGeometry(1.3, 1);
    const coreMat = new THREE.MeshToonMaterial({
      color: 0xffe600,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Thick cartoon outline for core
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });
    const outlineMesh = new THREE.Mesh(coreGeo, outlineMat);
    outlineMesh.scale.set(1.09, 1.09, 1.09);
    masterGroup.add(outlineMesh);

    // Cute Cartoon 3D Big Googly Eyes
    const eyeGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const eyeWhiteMat = new THREE.MeshToonMaterial({ color: 0xffffff });
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    leftEye.position.set(-0.45, 0.35, 1.15);
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), eyePupilMat);
    leftPupil.position.set(-0.45, 0.35, 1.4);
    masterGroup.add(leftEye, leftPupil);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    rightEye.position.set(0.45, 0.35, 1.15);
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), eyePupilMat);
    rightPupil.position.set(0.45, 0.35, 1.4);
    masterGroup.add(rightEye, rightPupil);

    // 2. Dynamic 3D Mood Items Group (rebuilt on mood change)
    const moodGroup = new THREE.Group();
    masterGroup.add(moodGroup);
    moodMeshGroupRef.current = moodGroup;

    // 3. Orbiting Cartoon Speech/Star Particles
    const starGroup = new THREE.Group();
    masterGroup.add(starGroup);
    starParticlesRef.current = starGroup;

    const particleMat = new THREE.MeshToonMaterial({ color: 0x00e5ff });
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(new THREE.OctahedronGeometry(0.25, 0), particleMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.4;
      p.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.5);
      starGroup.add(p);
    }

    // Mouse tracking for 3D look-at
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isBouncing = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.5;
      targetRotationX = -y * 0.4;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Click on 3D buddy to trigger super 3D spin and squash
    const handleClick = () => {
      soundFx.playTap();
      soundFx.triggerHaptic(20);
      isBouncing = true;
      let startTime = performance.now();

      const spinLoop = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        if (elapsed < 0.6) {
          masterGroup.rotation.y += 0.35;
          const squash = 1 + Math.sin(elapsed * Math.PI * 4) * 0.25;
          masterGroup.scale.set(1 / squash, squash, 1 / squash);
          requestAnimationFrame(spinLoop);
        } else {
          masterGroup.scale.set(1, 1, 1);
          isBouncing = false;
        }
      };
      requestAnimationFrame(spinLoop);
    };

    container.addEventListener('click', handleClick);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (!isBouncing) {
        // Floating hover
        masterGroup.position.y = Math.sin(time * 2.5) * 0.15;

        // Smooth look-around
        masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * 0.08;
        masterGroup.rotation.y += (targetRotationY - masterGroup.rotation.y) * 0.08;
      }

      // Rotate orbiting mood crystals
      if (starGroup) {
        starGroup.rotation.z = time * 0.8;
      }

      if (moodGroup) {
        moodGroup.rotation.y = time * 1.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 180;
      const h = container.clientHeight || 120;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update 3D Mood Accents when characterMood changes
  useEffect(() => {
    const moodGroup = moodMeshGroupRef.current;
    if (!moodGroup) return;

    // Clear old mood items
    while (moodGroup.children.length > 0) {
      moodGroup.remove(moodGroup.children[0]);
    }

    if (mood === 'amused' || mood === 'warm') {
      // Golden 3D Floating Stars
      const starGeo = new THREE.TetrahedronGeometry(0.4, 0);
      const starMat = new THREE.MeshToonMaterial({ color: 0xffe600 });
      for (let i = 0; i < 3; i++) {
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(Math.cos(i * 2.1) * 1.8, 1.2 + Math.sin(i) * 0.4, Math.sin(i * 2.1) * 1.8);
        moodGroup.add(star);
      }
    } else if (mood === 'annoyed' || mood === 'guarded') {
      // 3D Cartoon Lightning / Tension Sparks
      const sparkGeo = new THREE.ConeGeometry(0.3, 0.8, 4);
      const sparkMat = new THREE.MeshToonMaterial({ color: 0xff4081 });
      for (let i = 0; i < 3; i++) {
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        spark.position.set(Math.cos(i * 2) * 1.7, 1.3, Math.sin(i * 2) * 1.7);
        spark.rotation.z = Math.PI / 4;
        moodGroup.add(spark);
      }
    } else if (mood === 'relieved') {
      // 3D Diamond Prism
      const gemGeo = new THREE.OctahedronGeometry(0.5, 0);
      const gemMat = new THREE.MeshToonMaterial({ color: 0x00e5ff });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(0, 1.6, 0);
      moodGroup.add(gem);
    } else {
      // Neutral / Hesitant: Floating question ring
      const ringGeo = new THREE.TorusGeometry(0.4, 0.12, 8, 16);
      const ringMat = new THREE.MeshToonMaterial({ color: 0xb388ff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 1.5, 0);
      moodGroup.add(ring);
    }
  }, [mood, turnNumber]);

  return (
    <div className={`relative flex flex-col items-center select-none cursor-pointer group ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-visible transition-transform group-hover:scale-105"
        title="Interactive 3D Vibe Companion! Click to bounce."
      />
      {/* Comic Badge below 3D Companion */}
      <div className="absolute -bottom-2 bg-comic-yellow text-black font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full border-2 border-black shadow-cartoon-sm uppercase tracking-wider">
        3D VIBE ORB • {characterName.split(' ')[0]}
      </div>
    </div>
  );
};

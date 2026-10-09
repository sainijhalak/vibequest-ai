import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Cartoon3DMascotProps {
  mood?: 'happy' | 'roasting' | 'shocked' | 'chill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  interactive?: boolean;
}

export const Cartoon3DMascot: React.FC<Cartoon3DMascotProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetEyeX: 0,
    targetEyeY: 0,
    squashFactor: 1,
  });

  const dimensions = {
    sm: { width: 120, height: 120 },
    md: { width: 220, height: 220 },
    lg: { width: 340, height: 340 },
  }[size];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      dimensions.width / dimensions.height,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Cartoon Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3a0, 2.2);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.8);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    // 3. Mascot Group
    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // Colors depending on mood
    let bodyColor = 0xffe600; // Cartoon yellow
    let eyeColor = 0x111111;
    let cheekColor = 0xff4081; // Bubblegum pink
    let accessoryColor = 0x00e5ff; // Cyan

    if (mood === 'roasting') {
      bodyColor = 0xff5252; // Spicy red/orange
      accessoryColor = 0xffd600;
    } else if (mood === 'shocked') {
      bodyColor = 0x7c4dff; // Electric purple
      accessoryColor = 0x69f0ae;
    } else if (mood === 'chill') {
      bodyColor = 0x00e5ff; // Cool cyan
      accessoryColor = 0x76ff03;
    }

    // A. Main Cartoon Body (Squashy rounded sphere)
    const bodyGeometry = new THREE.SphereGeometry(1.9, 32, 32);
    const bodyMaterial = new THREE.MeshToonMaterial({
      color: bodyColor,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    mascotGroup.add(bodyMesh);

    // Comic outline effect via slightly scaled black mesh with BackSide
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });
    const outlineMesh = new THREE.Mesh(bodyGeometry, outlineMat);
    outlineMesh.scale.set(1.08, 1.08, 1.08);
    mascotGroup.add(outlineMesh);

    // B. Cheeks (Cute pink comic circles)
    const cheekGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const cheekMat = new THREE.MeshBasicMaterial({ color: cheekColor });

    const leftCheek = new THREE.Mesh(cheekGeom, cheekMat);
    leftCheek.position.set(-1.1, -0.4, 1.45);
    mascotGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeom, cheekMat);
    rightCheek.position.set(1.1, -0.4, 1.45);
    mascotGroup.add(rightCheek);

    // C. Eyes (Big expressive cartoon eyes)
    const eyeWhiteGeom = new THREE.SphereGeometry(0.42, 20, 20);
    const eyeWhiteMat = new THREE.MeshToonMaterial({ color: 0xffffff });

    const pupilGeom = new THREE.SphereGeometry(0.24, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: eyeColor });

    const highlightGeom = new THREE.SphereGeometry(0.09, 10, 10);
    const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Left Eye Group
    const leftEyeGroup = new THREE.Group();
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
    const leftPupil = new THREE.Mesh(pupilGeom, pupilMat);
    const leftHighlight = new THREE.Mesh(highlightGeom, highlightMat);
    leftPupil.position.set(0, 0, 0.28);
    leftHighlight.position.set(0.08, 0.08, 0.44);
    leftEyeGroup.add(leftEyeWhite, leftPupil, leftHighlight);
    leftEyeGroup.position.set(-0.65, 0.2, 1.6);
    mascotGroup.add(leftEyeGroup);

    // Right Eye Group
    const rightEyeGroup = new THREE.Group();
    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
    const rightPupil = new THREE.Mesh(pupilGeom, pupilMat);
    const rightHighlight = new THREE.Mesh(highlightGeom, highlightMat);
    rightPupil.position.set(0, 0, 0.28);
    rightHighlight.position.set(0.08, 0.08, 0.44);
    rightEyeGroup.add(rightEyeWhite, rightPupil, rightHighlight);
    rightEyeGroup.position.set(0.65, 0.2, 1.6);
    mascotGroup.add(rightEyeGroup);

    // D. Cute Antenna with bobbing star / gem
    const antennaStemGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.9, 12);
    const antennaStemMat = new THREE.MeshToonMaterial({ color: 0x111111 });
    const antennaStem = new THREE.Mesh(antennaStemGeom, antennaStemMat);
    antennaStem.position.set(0, 2.2, 0);
    mascotGroup.add(antennaStem);

    const bobbleGeom = new THREE.OctahedronGeometry(0.4, 0);
    const bobbleMat = new THREE.MeshToonMaterial({
      color: accessoryColor,
    });
    const bobble = new THREE.Mesh(bobbleGeom, bobbleMat);
    bobble.position.set(0, 2.8, 0);
    mascotGroup.add(bobble);

    // E. Floating Comic Orbiting Stars
    const starGeom = new THREE.DodecahedronGeometry(0.24, 0);
    const starMat = new THREE.MeshToonMaterial({ color: 0xffffff });
    const orbitingStars: THREE.Mesh[] = [];

    for (let i = 0; i < 3; i++) {
      const star = new THREE.Mesh(starGeom, starMat);
      mascotGroup.add(star);
      orbitingStars.push(star);
    }

    // Mouse tracking for interactive eye look & head tilt
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseX = x;
      stateRef.current.mouseY = y;
    };

    const handleClick = () => {
      // Squash & stretch cartoon bounce
      stateRef.current.squashFactor = 0.75;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle cartoon floating bob
      const bobY = Math.sin(elapsedTime * 2.5) * 0.18;
      mascotGroup.position.y = bobY;

      // Antenna bobble spin
      bobble.rotation.y = elapsedTime * 3;
      bobble.rotation.x = elapsedTime * 1.5;

      // Orbiting stars animation
      orbitingStars.forEach((star, idx) => {
        const angle = elapsedTime * 2 + (idx * Math.PI * 2) / 3;
        const radius = 2.6;
        star.position.x = Math.cos(angle) * radius;
        star.position.z = Math.sin(angle) * radius;
        star.position.y = Math.sin(elapsedTime * 3 + idx) * 0.5;
        star.rotation.x += 0.05;
        star.rotation.y += 0.05;
      });

      // Smooth eye & head tracking
      const targetRotY = stateRef.current.mouseX * 0.45;
      const targetRotX = -stateRef.current.mouseY * 0.35;
      mascotGroup.rotation.y += (targetRotY - mascotGroup.rotation.y) * 0.1;
      mascotGroup.rotation.x += (targetRotX - mascotGroup.rotation.x) * 0.1;

      // Eye pupil tracking offset
      const eyeOffsetX = THREE.MathUtils.clamp(stateRef.current.mouseX * 0.12, -0.15, 0.15);
      const eyeOffsetY = THREE.MathUtils.clamp(stateRef.current.mouseY * 0.12, -0.15, 0.15);
      leftPupil.position.x = eyeOffsetX;
      leftPupil.position.y = eyeOffsetY;
      rightPupil.position.x = eyeOffsetX;
      rightPupil.position.y = eyeOffsetY;

      // Squash and stretch recovery
      stateRef.current.squashFactor += (1 - stateRef.current.squashFactor) * 0.15;
      const sf = stateRef.current.squashFactor;
      bodyMesh.scale.set(1 / Math.sqrt(sf), sf, 1 / Math.sqrt(sf));
      outlineMesh.scale.set(1.08 / Math.sqrt(sf), 1.08 * sf, 1.08 / Math.sqrt(sf));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      outlineMat.dispose();
      cheekGeom.dispose();
      cheekMat.dispose();
      eyeWhiteGeom.dispose();
      eyeWhiteMat.dispose();
      pupilGeom.dispose();
      pupilMat.dispose();
      highlightGeom.dispose();
      highlightMat.dispose();
      antennaStemGeom.dispose();
      antennaStemMat.dispose();
      bobbleGeom.dispose();
      bobbleMat.dispose();
      starGeom.dispose();
      starMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mood, size, interactive, dimensions.width, dimensions.height]);

  return (
    <div
      ref={mountRef}
      className={`inline-block relative cursor-pointer select-none transition-transform duration-150 hover:scale-105 active:scale-95 ${className}`}
      title="Click me for a cartoon bounce! Mouse tracks my eyes!"
    />
  );
};

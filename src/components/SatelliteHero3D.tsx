import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SatelliteHero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 24);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0f2038, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x93c5fd, 3.5);
    sunLight.position.set(20, 15, 20);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 50);
    rimLight.position.set(-15, 8, -10);
    scene.add(rimLight);

    // Earth Sphere (Subtle stylized deep space blue)
    const earthRadius = 7;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0c1b30,
      roughness: 0.85,
      metalness: 0.15,
      wireframe: false
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(0, -9.5, -4);
    scene.add(earth);

    // Atmosphere Glow Ring
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.04, 36, 36);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
    atmosphere.position.copy(earth.position);
    scene.add(atmosphere);

    // Orbital Path Ring
    const orbitRadius = 13.5;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.55, 0, 2 * Math.PI, false, 0);
    const orbitPoints = orbitCurve.getPoints(120);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(
      orbitPoints.map(p => new THREE.Vector3(p.x, p.y * 0.3, p.y))
    );
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      opacity: 0.35,
      transparent: true,
      dashSize: 0.5,
      gapSize: 0.3
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    orbitLine.rotation.x = Math.PI / 3.8;
    orbitLine.rotation.z = Math.PI / 10;
    scene.add(orbitLine);

    // Satellite Group
    const satellite = new THREE.Group();

    // Satellite Core Body (Main Bus)
    const bodyGeo = new THREE.BoxGeometry(1.6, 1.2, 1.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    satellite.add(body);

    // Golden Thermal Foil Cover Section
    const foilGeo = new THREE.BoxGeometry(1.4, 1.0, 0.4);
    const foilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.7,
      roughness: 0.3
    });
    const foil = new THREE.Mesh(foilGeo, foilMat);
    foil.position.set(0, 0, 0.6);
    satellite.add(foil);

    // Solar Panel Array Wings (Left & Right)
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      emissive: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9
    });

    // Left Panel
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), bodyMat);
    leftArm.rotation.z = Math.PI / 2;
    leftArm.position.set(-1.4, 0, 0);
    satellite.add(leftArm);

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.08), panelMat);
    leftPanel.position.set(-3.2, 0, 0);
    satellite.add(leftPanel);

    // Right Panel
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), bodyMat);
    rightArm.rotation.z = Math.PI / 2;
    rightArm.position.set(1.4, 0, 0);
    satellite.add(rightArm);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.08), panelMat);
    rightPanel.position.set(3.2, 0, 0);
    satellite.add(rightPanel);

    // Optical Sensor Aperture / Camera Lens pointing towards Earth
    const lensGeo = new THREE.CylinderGeometry(0.45, 0.35, 0.8, 24);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      metalness: 0.95,
      roughness: 0.1
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, -0.9, 0);
    satellite.add(lens);

    // Communication High-Gain Dish
    const dishGeo = new THREE.SphereGeometry(0.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      side: THREE.DoubleSide,
      metalness: 0.6
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI;
    dish.position.set(0, 0.9, -0.4);
    satellite.add(dish);

    scene.add(satellite);

    // Background Stars (Restrained & Scientific)
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 60;
      starPositions[i + 2] = -15 - Math.random() * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xa5f3fc,
      size: 0.25,
      transparent: true,
      opacity: 0.65
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Data / Signal Beams
    const beamCount = 40;
    const beamGeo = new THREE.BufferGeometry();
    const beamPositions = new Float32Array(beamCount * 3);
    for (let i = 0; i < beamCount * 3; i += 3) {
      beamPositions[i] = (Math.random() - 0.5) * 12;
      beamPositions[i + 1] = Math.random() * 8 - 4;
      beamPositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
    const beamMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.35,
      transparent: true,
      opacity: 0.75
    });
    const beams = new THREE.Points(beamGeo, beamMat);
    scene.add(beams);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Earth slow rotation
      earth.rotation.y = elapsed * 0.03;
      atmosphere.rotation.y = elapsed * 0.03;

      // Orbiting Satellite position
      const angle = elapsed * 0.25;
      const satX = Math.cos(angle) * orbitRadius;
      const satZ = Math.sin(angle) * (orbitRadius * 0.55);
      const satY = Math.sin(angle) * 2.8 + Math.cos(angle) * 1.2;

      satellite.position.set(satX, satY, satZ);
      satellite.rotation.y = -angle + Math.PI / 2;
      satellite.rotation.x = 0.2 + mouseY * 0.15;
      satellite.rotation.z = Math.sin(elapsed * 0.5) * 0.08 + mouseX * 0.15;

      // Pulse beams towards Earth
      beams.rotation.y = elapsed * 0.08;

      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 1.2 + 5 - camera.position.y) * 0.03;
      camera.lookAt(0, -1, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      ro.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="satellite-3d-canvas"
      className="w-full h-full min-h-[380px] lg:min-h-[460px] relative pointer-events-none"
    />
  );
};

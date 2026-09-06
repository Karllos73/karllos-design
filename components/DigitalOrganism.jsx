"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/**
 * PHASE 1 of the "digital organism" particle experience: an organic mass
 * built from thousands of independent instanced fragments (not a solid
 * sphere/gem), breathing continuously and lit with key + colored rim
 * lights. Later phases (satellite particles, cursor repulsion, scroll
 * morphing, pinned scenes, camera moves) build on top of this without
 * needing to rebuild the particle system itself.
 *
 * Perf notes: a single InstancedMesh, one JS loop per frame recomputing
 * every instance's matrix (the standard approach for a few thousand
 * instances — no per-particle React components, no DOM nodes). The
 * "organic noise" bump on the base shape and the per-particle wave are
 * both cheap layered sine functions rather than a real simplex/perlin
 * noise library, to avoid pulling in a new dependency for phase 1; swap
 * in real noise later if the layered-sine look isn't organic enough.
 */

const PALETTE = [
  { color: "#F7F7FA", weight: 0.55 },
  { color: "#8B2CF5", weight: 0.12 },
  { color: "#4C72FF", weight: 0.08 },
  { color: "#C449FF", weight: 0.08 },
  { color: "#E4B24B", weight: 0.08 },
  { color: "#C7C7CE", weight: 0.09 }, // subtle dimmer-white variation
];

function pickColor(rand) {
  let acc = 0;
  for (const p of PALETTE) {
    acc += p.weight;
    if (rand < acc) return p.color;
  }
  return PALETTE[0].color;
}

// Cheap organic "bump" field — layered sines over the unit direction
// vector, standing in for simplex/perlin noise for phase 1.
function organicBump(x, y, z) {
  return (
    Math.sin(x * 2.1 + z * 1.7) * 0.5 +
    Math.sin(y * 3.3 + x * 1.1) * 0.3 +
    Math.sin(z * 2.7 + y * 2.3) * 0.2
  );
}

function buildParticles(count, baseRadius) {
  const basePositions = new Array(count);
  const phases = new Float32Array(count);
  const scales = new Float32Array(count);
  const spinSpeeds = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const tmpColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere: even distribution of directions.
    const yUnit = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
    const theta = goldenAngle * i;
    const dirX = Math.cos(theta) * radiusAtY;
    const dirZ = Math.sin(theta) * radiusAtY;
    const dirY = yUnit;

    const bump = organicBump(dirX, dirY, dirZ);
    const jitter = 0.94 + Math.random() * 0.12; // slight volumetric thickness
    const r = baseRadius * (1 + bump * 0.22) * jitter;

    basePositions[i] = new THREE.Vector3(dirX * r, dirY * r, dirZ * r);
    phases[i] = Math.random() * Math.PI * 2;
    scales[i] = 0.55 + Math.random() * 0.9;
    spinSpeeds[i] = (Math.random() - 0.5) * 0.6;

    tmpColor.set(pickColor(Math.random()));
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }

  return { basePositions, phases, scales, spinSpeeds, colors };
}

export default function DigitalOrganism({ groupRef, reduceMotion, isDesktop }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef({ x: 0, y: 0 });
  const damped = useRef({ x: 0, y: 0 });

  const count = isDesktop ? 2600 : 700;
  const baseRadius = 1.65;

  const particles = useMemo(() => buildParticles(count, baseRadius), [count, baseRadius]);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.055, 0), []);

  useEffect(() => {
    if (!isDesktop || reduceMotion) return;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop, reduceMotion]);

  // Set instance colors once.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.instanceColor = new THREE.InstancedBufferAttribute(particles.colors, 3);
    mesh.instanceColor.needsUpdate = true;
  }, [particles]);

  // Entrance rotateY, same self-contained pattern as the rest of the site's
  // hero entrance (owned here so it can't race the DOM-driven timeline).
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.userData.introRotY = reduceMotion ? 0 : -10 * (Math.PI / 180);
    if (reduceMotion) return;
    gsap.to(g.userData, { introRotY: 0, duration: 0.8, delay: 0.7, ease: "power2.out" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Place every instance once up front so the shape is correct even if
  // reduced-motion skips the per-frame animation loop entirely.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      dummy.position.copy(particles.basePositions[i]);
      dummy.scale.setScalar(particles.scales[i]);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particles, count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;

    if (isDesktop && !reduceMotion) {
      damped.current.x += (mouse.current.x - damped.current.x) * 0.045;
      damped.current.y += (mouse.current.y - damped.current.y) * 0.045;
    }

    if (reduceMotion) return;

    // Group-level breathing: scale pulse, slow rotation, gentle float.
    const breathe = 1 + Math.sin(t * ((2 * Math.PI) / 8)) * 0.015;
    group.scale.setScalar(breathe);
    const idleY = t * 0.045 + Math.sin(t * ((2 * Math.PI) / 9)) * THREE.MathUtils.degToRad(2);
    const idleX = Math.sin(t * ((2 * Math.PI) / 6.5) + 1.3) * THREE.MathUtils.degToRad(1);
    const cursorY = damped.current.x * THREE.MathUtils.degToRad(6);
    const cursorX = -damped.current.y * THREE.MathUtils.degToRad(5);
    group.rotation.y = idleY + cursorY + (group.userData.introRotY || 0);
    group.rotation.x = idleX + cursorX;
    group.position.y = Math.sin(t * ((2 * Math.PI) / 7)) * 0.05;

    // Per-particle wave: a slow ripple of radial pulsing across the
    // surface, phase-offset per particle so it reads as one wave passing
    // through a collective, not synchronized flashing.
    const { basePositions, phases, scales, spinSpeeds } = particles;
    for (let i = 0; i < count; i++) {
      const radiusMod = 1 + Math.sin(t * 0.6 + phases[i]) * 0.045;
      dummy.position.copy(basePositions[i]).multiplyScalar(radiusMod);
      dummy.rotation.set(t * spinSpeeds[i], t * spinSpeeds[i] * 0.7, 0);
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
        <meshStandardMaterial vertexColors roughness={0.4} metalness={0.25} />
      </instancedMesh>
    </group>
  );
}

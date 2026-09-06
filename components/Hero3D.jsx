"use client";

import { useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import DigitalOrganism from "./DigitalOrganism";

/**
 * Phase 1 of the "digital organism" particle experience — see
 * DigitalOrganism.jsx for the particle system itself. This file just owns
 * the Canvas/scene/lighting shell so later phases (scroll-driven camera
 * moves, a promotion to a page-wide fixed canvas) have a stable place to
 * plug into without touching the particle logic.
 */
function Scene({ groupRef, reduceMotion, isDesktop }) {
  const { gl } = useThree();
  useMemo(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.55} />
      {/* key light */}
      <pointLight position={[2, 3, 5]} intensity={38} color="#F7F7FA" />
      {/* rim left: blue */}
      <pointLight position={[-4, 0.5, 2]} intensity={34} color="#4C72FF" />
      {/* rim right: magenta */}
      <pointLight position={[4, -1, 2]} intensity={34} color="#C449FF" />
      <DigitalOrganism groupRef={groupRef} reduceMotion={reduceMotion} isDesktop={isDesktop} />
    </>
  );
}

/**
 * groupRef is forwarded so the Hero entrance timeline (GSAP, driven from
 * the DOM) can tween the object's scale/rotation/opacity exactly like
 * every other entrance element on the page. materialRef is accepted for
 * interface compatibility with Hero.jsx but unused — the particle system
 * has no single material to hand back the same way the old solid gem did.
 */
export default function Hero3D({ groupRef, materialRef, reduceMotion, isDesktop }) {
  return (
    <Canvas
      dpr={[1, isDesktop ? 2 : 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene groupRef={groupRef} reduceMotion={reduceMotion} isDesktop={isDesktop} />
    </Canvas>
  );
}

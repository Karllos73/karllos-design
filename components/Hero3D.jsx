"use client";

import { useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import DigitalOrganism from "./DigitalOrganism";

/**
 * The "digital organism" particle experience — see DigitalOrganism.jsx for
 * the particle system itself. This file just owns the Canvas/scene/lighting
 * shell. It's mounted once, globally (GlobalOrganism.jsx), as a fixed
 * full-viewport background layer rather than scoped to the Hero.
 */
function Scene({ groupRef, reduceMotion, isDesktop, targetRef, explodeRef }) {
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
      <DigitalOrganism
        groupRef={groupRef}
        reduceMotion={reduceMotion}
        isDesktop={isDesktop}
        targetRef={targetRef}
        explodeRef={explodeRef}
      />
    </>
  );
}

/**
 * groupRef is forwarded so any future DOM-driven timeline could still tween
 * the object directly. materialRef is accepted for interface compatibility
 * but unused — the particle system has no single material to hand back the
 * same way the old solid gem did. targetRef carries the scroll-driven
 * scale/x/opacity target, and explodeRef the final-scene dissipation
 * progress (see GlobalOrganism.jsx).
 */
export default function Hero3D({ groupRef, materialRef, reduceMotion, isDesktop, targetRef, explodeRef }) {
  return (
    <Canvas
      dpr={[1, isDesktop ? 2 : 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene
        groupRef={groupRef}
        reduceMotion={reduceMotion}
        isDesktop={isDesktop}
        targetRef={targetRef}
        explodeRef={explodeRef}
      />
    </Canvas>
  );
}

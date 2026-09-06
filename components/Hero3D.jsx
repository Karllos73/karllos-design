"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Original abstract 3D object for the hero: a faceted gem (echoing the
 * brandmark diamond/play icon) with an inner counter-rotating ring,
 * glossy purple/magenta/blue material and soft colored lighting. No
 * external model/asset — built entirely from primitive geometry.
 */
function Gem({ groupRef, materialRef, reduceMotion, isDesktop }) {
  const innerRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const damped = useRef({ x: 0, y: 0 });

  useMemo(() => {
    if (!isDesktop || reduceMotion) return;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, reduceMotion]);

  const edgesGeo = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1.55, 0);
    return new THREE.EdgesGeometry(base);
  }, []);

  // Entrance: rotateY -10deg -> 0, owned entirely here so it never races
  // the DOM-driven timeline in Hero.jsx (which only fades/scales the
  // canvas wrapper). Written into userData so the continuous idle/cursor
  // rotation in useFrame below can add it in rather than fight over it.
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.userData.introRotY = reduceMotion ? 0 : -10 * (Math.PI / 180);
    if (reduceMotion) return;
    gsap.to(g.userData, { introRotY: 0, duration: 0.8, delay: 0.7, ease: "power2.out" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Damp the cursor target so the object never snaps — weight & inertia.
    if (isDesktop && !reduceMotion) {
      damped.current.x += (mouse.current.x - damped.current.x) * 0.045;
      damped.current.y += (mouse.current.y - damped.current.y) * 0.045;
    }

    if (!reduceMotion) {
      const idleY = Math.sin(t * ((2 * Math.PI) / 8)) * THREE.MathUtils.degToRad(2);
      const idleX = Math.sin(t * ((2 * Math.PI) / 6.5) + 1.3) * THREE.MathUtils.degToRad(1);
      const idleFloat = Math.sin(t * ((2 * Math.PI) / 7)) * 0.14;
      const cursorY = damped.current.x * THREE.MathUtils.degToRad(7);
      const cursorX = -damped.current.y * THREE.MathUtils.degToRad(6);

      groupRef.current.rotation.y = idleY + cursorY + (groupRef.current.userData.introRotY || 0);
      groupRef.current.rotation.x = idleX + cursorX;
      groupRef.current.position.y = idleFloat;
      if (innerRef.current) innerRef.current.rotation.y = -t * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.55, 0]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#7C3AED"
          roughness={0.18}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.15}
          transparent
          opacity={1}
          emissive="#3b0764"
          emissiveIntensity={0.25}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#C449FF" transparent opacity={0.55} />
      </lineSegments>
      <mesh ref={innerRef} rotation={[0.6, 0, 0.3]}>
        <torusGeometry args={[1.05, 0.035, 16, 100]} />
        <meshStandardMaterial color="#4C72FF" emissive="#4C72FF" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Scene({ groupRef, materialRef, reduceMotion, isDesktop }) {
  const { gl } = useThree();
  useMemo(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#C449FF" />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#4C72FF" />
      <pointLight position={[0, 4, -3]} intensity={18} color="#FF6B8A" />
      <Gem groupRef={groupRef} materialRef={materialRef} reduceMotion={reduceMotion} isDesktop={isDesktop} />
    </>
  );
}

/**
 * groupRef / materialRef are forwarded so the Hero entrance timeline (GSAP,
 * driven from the DOM) can tween the object's scale/rotation/opacity
 * exactly like every other entrance element on the page.
 */
export default function Hero3D({ groupRef, materialRef, reduceMotion, isDesktop }) {
  return (
    <Canvas
      dpr={[1, isDesktop ? 2 : 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene groupRef={groupRef} materialRef={materialRef} reduceMotion={reduceMotion} isDesktop={isDesktop} />
    </Canvas>
  );
}

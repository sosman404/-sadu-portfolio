"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Particle field ─────────────────────────────────────────── */
function Particles({ count = 420 }) {
  const mesh = useRef();
  const clock = useRef(0);

  // Build positions once
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread across a deep volume so they fill the whole viewport
      pos[i * 3 + 0] = (Math.random() - 0.5) * 28;   // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;   // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;   // z depth
      sz[i] = 0.012 + Math.random() * 0.032;
    }
    return [pos, sz];
  }, [count]);

  // Gentle idle drift — no scroll dependence here, camera handles that
  useFrame((_, delta) => {
    if (!mesh.current) return;
    clock.current += delta * 0.09;
    mesh.current.rotation.y = clock.current * 0.06;
    mesh.current.rotation.x = Math.sin(clock.current * 0.4) * 0.04;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.55}
        fog={false}
      />
    </points>
  );
}

/* Slightly larger, teal-tinted accent dots */
function AccentDots({ count = 60 }) {
  const mesh = useRef();
  const clock = useRef(0);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    clock.current += delta * 0.09;
    mesh.current.rotation.y = -clock.current * 0.04;
    mesh.current.rotation.x = Math.cos(clock.current * 0.35) * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#05A8A0"
        size={0.072}
        sizeAttenuation
        transparent
        opacity={0.38}
        fog={false}
      />
    </points>
  );
}

/* ─── Camera rig driven by scroll progress ───────────────────── */
function CameraRig({ progress }) {
  const targetRef = useRef({ x: 0, y: 0, z: 6 });

  useFrame(({ camera }) => {
    // Where we want the camera to be based on scroll
    const tx = Math.sin(progress * Math.PI * 1.8) * 2.2;
    const ty = Math.cos(progress * Math.PI * 1.4) * 1.1 - progress * 0.6;
    const tz = 6 - progress * 1.4;

    // Smooth lerp toward target
    targetRef.current.x += (tx - targetRef.current.x) * 0.06;
    targetRef.current.y += (ty - targetRef.current.y) * 0.06;
    targetRef.current.z += (tz - targetRef.current.z) * 0.06;

    camera.position.set(
      targetRef.current.x,
      targetRef.current.y,
      targetRef.current.z
    );

    // Gentle rotation to follow movement
    camera.rotation.y = Math.sin(progress * Math.PI) * 0.14;
    camera.rotation.x = -progress * 0.08;
  });

  return null;
}

/* ─── Scene ──────────────────────────────────────────────────── */
export default function ThreeScene({ progress }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 62 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CameraRig progress={progress} />
        <Particles count={480} />
        <AccentDots count={70} />
      </Canvas>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ClientsSection from "./ClientsSection";

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function getPhase(progress) {
  if (progress < 0.9) return "main";
  return "clients";
}

function TitleScene({ title, sub }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center">
      <div>
        <h2 className="text-[10vw] font-black text-white tracking-[-0.1em]">
          {title}
        </h2>
        <p className="mt-4 text-white/50 text-sm uppercase tracking-[0.3em]">
          {sub}
        </p>
      </div>
    </div>
  );
}

export default function PortfolioScene() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return smooth.on("change", setProgress);
  }, [smooth]);

  const phase = getPhase(progress);

  return (
    <main
      ref={ref}
      className="relative h-[500vh] bg-black text-white overflow-hidden"
    >
      <section className="sticky top-0 h-screen overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-black" />

        {/* MAIN CONTENT */}
        {phase === "main" && (
          <TitleScene
            title="SADU MEDIA"
            sub="Cinematic Portfolio"
          />
        )}

        {/* CLIENTS SECTION */}
        {phase === "clients" && (
          <ClientsSection progress={progress} />
        )}
      </section>
    </main>
  );
}
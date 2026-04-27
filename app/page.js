"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight, CirclePlay, Volume2, VolumeX } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const clientLogos = Array.from({ length: 42 }, (_, i) => i + 1)
  .filter((num) => num !== 36)
  .map((num) => ({ name: `Client ${num}`, logo: `/logos/logo${num}.png` }));

const projects = [
  {
    no: "01",
    title: "Formula e Jeddah E-Prix",
    tag: "CGI Motorsport Campaign",
    desc: "Speed, spectacle, and Saudi urban energy shaped into a high-CGI campaign world.",
    meta: "80% CGI · Mock-up formula car · Racing suit replica · Jeddah E-Prix",
    image: "/formula-e.jpg",
    logo: "/formula-e-logo.png",
    link: "https://vimeo.com/1066335130?fl=pl&fe=sh",
    featured: true,
  },
  {
    no: "02",
    title: "MBC Shahid Ramadan",
    tag: "Emotional Short Film",
    desc: "A heartfelt Ramadan story built on intimacy, family, and quiet emotional moments.",
    meta: "Narrative-driven · Cultural storytelling · Performance-led film",
    image: "/mbc-shahid.jpg",
    logo: "/shahid-logo.png",
    link: "https://vimeo.com/1186879871?share=copy&fl=sv&fe=ci",
  },
  {
    no: "03",
    title: "TMG Banan Al Riyadh",
    tag: "Brand Film",
    desc: "A cinematic expression of modern Saudi living, blending lifestyle, architecture, and aspiration.",
    meta: "Real estate storytelling · Lifestyle visuals · Premium brand positioning",
    image: "/tmg-banan.jpg",
    logo: "/tmg-banan-logo.png",
    link: "https://vimeo.com/1174987728?fl=pl&fe=sh",
  },
  {
    no: "04",
    title: "Events Investment Fund SND95",
    tag: "Saudi National Day Film",
    desc: "A cinematic Saudi National Day piece built around music, atmosphere, and cultural celebration.",
    meta: "SND95 · Cultural storytelling · Performance-led visuals",
    image: "/eif-snd95.jpg",
    link: "https://vimeo.com/1120554705?fl=pl&fe=sh",
  },
  {
    no: "05",
    title: "McDonald's Brand Trust",
    tag: "Brand Campaign",
    desc: "Human storytelling that makes trust feel visible, relatable, and real.",
    meta: "Employee-led scenes · Warm realism · Digital parallel unit · Tight CPS",
    image: "/mcdonalds.jpg",
    logo: "/mcdonalds-logo.png",
    link: "https://vimeo.com/1120555428?fl=pl&fe=sh",
  },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function getProjectIndex(progress) {
  const p = clamp((progress - 0.6) / 0.28, 0, 0.999);
  return Math.floor(p * projects.length);
}

/* ─────────────────────────────────────────────────────────────
   FILM GRAIN — animated noise overlay, cinematic feel
───────────────────────────────────────────────────────────── */
function FilmGrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 220, H = 220;
    canvas.width = W;
    canvas.height = H;

    // Pre-generate frames for performance (cycle at ~15fps)
    const FRAMES = 10;
    const frames = Array.from({ length: FRAMES }, () => {
      const img = ctx.createImageData(W, H);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.floor(Math.random() * 38);
      }
      return img;
    });

    let frame = 0, last = 0, rafId;
    const interval = 1000 / 15;

    function tick(now) {
      if (now - last > interval) {
        ctx.putImageData(frames[frame % FRAMES], 0, 0);
        frame++;
        last = now;
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.038]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────────────────────── */
function Preloader({ onComplete }) {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 700);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(onComplete, 2700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black"
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: phase === "exit" ? 0 : 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <img src="/sadu-logo.png" alt="Sadu Media" className="h-14 w-auto object-contain md:h-18" />
        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.5em] text-white/30">
          Loading experience
        </p>

        {/* Progress bar */}
        <div className="mt-6 h-px w-48 overflow-hidden bg-white/8 rounded-full">
          <motion.div
            className="h-full rounded-full bg-[#05A8A0]"
            initial={{ width: "0%" }}
            animate={{ width: phase === "enter" ? "30%" : phase === "hold" ? "85%" : "100%" }}
            transition={{ duration: phase === "hold" ? 1.1 : 0.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Cinematic bars top/bottom */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[7vh] bg-black"
        animate={{ scaleY: phase === "exit" ? 0 : 1 }}
        style={{ transformOrigin: "top" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[7vh] bg-black"
        animate={{ scaleY: phase === "exit" ? 0 : 1 }}
        style={{ transformOrigin: "bottom" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const lblRef  = useRef(null);

  useEffect(() => {
    // Hide native cursor globally
    document.body.style.cursor = "none";

    const mouse = { x: -200, y: -200 };
    const ring  = { x: -200, y: -200 };
    let size = 34, targetSize = 34, rafId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const el = e.target.closest("[data-cursor]");
      if (el) {
        const label = el.dataset.cursor;
        targetSize = label ? 62 : 44;
        if (lblRef.current)  lblRef.current.textContent = label || "";
        if (ringRef.current) ringRef.current.style.borderColor = "#05A8A0";
        if (ringRef.current) ringRef.current.style.background = "rgba(5,168,160,0.08)";
      } else {
        targetSize = 34;
        if (lblRef.current)  lblRef.current.textContent = "";
        if (ringRef.current) ringRef.current.style.borderColor = "rgba(255,255,255,0.28)";
        if (ringRef.current) ringRef.current.style.background = "transparent";
      }
    };

    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    const tick = () => {
      ring.x = lerp(ring.x, mouse.x, 0.11);
      ring.y = lerp(ring.y, mouse.y, 0.11);
      size   = lerp(size, targetSize, 0.13);
      const half = size / 2;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.x}px`;
        dotRef.current.style.top  = `${mouse.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left   = `${ring.x - half}px`;
        ringRef.current.style.top    = `${ring.y - half}px`;
        ringRef.current.style.width  = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot — follows mouse exactly */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", pointerEvents: "none", zIndex: 9999,
          width: 5, height: 5, borderRadius: "50%", background: "white",
          transform: "translate(-50%, -50%)", top: 0, left: 0,
          transition: "opacity 0.2s",
        }}
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          position: "fixed", pointerEvents: "none", zIndex: 9998,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.28)",
          transition: "border-color 0.25s, background 0.25s, opacity 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
          top: 0, left: 0,
        }}
      >
        <span
          ref={lblRef}
          style={{
            fontSize: 7, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#05A8A0",
          }}
        />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCROLL INDICATOR
───────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "intro",    label: "INTRO",    mid: 0.11 },
  { id: "awards",   label: "AWARDS",   mid: 0.34 },
  { id: "work",     label: "WORK",     mid: 0.53 },
  { id: "projects", label: "PROJECTS", mid: 0.74 },
  { id: "archive",  label: "ARCHIVE",  mid: 0.90 },
  { id: "clients",  label: "CLIENTS",  mid: 0.955 },
];

function ScrollIndicator({ progress }) {
  const active = SECTIONS.reduce((best, s) =>
    Math.abs(progress - s.mid) < Math.abs(progress - best.mid) ? s : best
  );

  return (
    <div className="pointer-events-none fixed right-7 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-[14px] md:flex">
      {SECTIONS.map((s) => {
        const isActive = s.id === active.id;
        return (
          <div key={s.id} className="flex items-center gap-2.5">
            <motion.span
              className="text-[7px] font-bold uppercase tracking-[0.32em] text-white/35"
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 6 }}
              transition={{ duration: 0.35 }}
            >
              {s.label}
            </motion.span>
            <motion.div
              className="rounded-full bg-[#05A8A0]"
              animate={{
                width:  isActive ? 20 : 4,
                height: isActive ? 4  : 4,
                opacity: isActive ? 1 : 0.22,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC WRAPPER — pulls buttons toward cursor
───────────────────────────────────────────────────────────── */
function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      style={{ display: "inline-flex" }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        setDelta({
          x: (e.clientX - r.left - r.width  / 2) * strength,
          y: (e.clientY - r.top  - r.height / 2) * strength,
        });
      }}
      onMouseLeave={() => setDelta({ x: 0, y: 0 })}
      animate={{ x: delta.x, y: delta.y }}
      transition={{ type: "spring", stiffness: 240, damping: 18, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────────────────────── */
function ParticleCanvas({ progress }) {
  const canvasRef   = useRef(null);
  const progressRef = useRef(progress);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const TOTAL = 500;
    const particles = Array.from({ length: TOTAL }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      z: 0.1 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.000035,
      vy: (Math.random() - 0.5) * 0.000025,
      teal: i < 65,
      baseOpacity: 0.25 + Math.random() * 0.55,
    }));

    let camX = 0, camY = 0, rafId;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      const p = progressRef.current;
      const W = canvas.width, H = canvas.height;

      const tCamX = Math.sin(p * Math.PI * 1.8) * 0.06;
      const tCamY = Math.cos(p * Math.PI * 1.4) * 0.03 - p * 0.02;
      camX += (tCamX - camX) * 0.04;
      camY += (tCamY - camY) * 0.04;

      ctx.clearRect(0, 0, W, H);

      for (const dot of particles) {
        dot.x += dot.vx; dot.y += dot.vy;
        if (dot.x < 0) dot.x = 1;
        if (dot.x > 1) dot.x = 0;
        if (dot.y < 0) dot.y = 1;
        if (dot.y > 1) dot.y = 0;

        const px    = (dot.x + camX * dot.z) * W;
        const py    = (dot.y + camY * dot.z) * H;
        const r     = dot.z * (dot.teal ? 1.6 : 1.1);
        const alpha = dot.baseOpacity * (0.35 + dot.z * 0.65);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = dot.teal
          ? `rgba(5,168,160,${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: "block" }} />
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <img src="/sadu-logo.png" alt="Sadu Media" className="h-12 w-auto object-contain md:h-16" />
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-white/60">
          <span className="hidden md:inline">Menu</span>
          <span className="h-px w-7 bg-white/50" />
          <span className="h-px w-5 bg-white/30" />
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   ATMOSPHERE — warm projector-light vignette
───────────────────────────────────────────────────────────── */
function Atmosphere({ progress }) {
  const driftX = (progress - 0.5) * 40;
  const driftY = Math.sin(progress * Math.PI * 2) * 14;

  return (
    <>
      <div className="absolute inset-0 bg-black" />

      {/* Teal ambient radial */}
      <motion.div
        className="absolute inset-0 opacity-70"
        style={{
          transform: `translate3d(${driftX * 0.12}px,${driftY * 0.12}px,0)`,
          background: "radial-gradient(circle at 50% 50%, rgba(5,168,160,.08), transparent 32%), #000",
        }}
      />

      {/* Warm projector centre — the "you are watching a film" feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(255,235,190,.028), transparent 70%)",
        }}
      />

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_50%,rgba(0,0,0,.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.08),transparent_45%,rgba(0,0,0,.72)_100%)]" />

      {/* Subtle scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,1) 0px,rgba(255,255,255,1) 1px,transparent 1px,transparent 3px)",
          backgroundSize: "100% 3px",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO — cinematic text entrance
───────────────────────────────────────────────────────────── */
const lineVariants = {
  hidden: { y: 70, opacity: 0, skewY: 2 },
  visible: (i) => ({
    y: 0, opacity: 1, skewY: 0,
    transition: { duration: 0.9, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Hero({ progress, ready }) {
  const videoRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  const fade = clamp(1 - progress / 0.23, 0, 1);

  async function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    try {
      const next = !soundOn;
      video.muted = !next;
      video.defaultMuted = !next;
      video.volume = next ? 1 : 0;
      if (next) video.removeAttribute("muted");
      await video.play();
      setSoundOn(next);
    } catch (err) {
      console.warn("Sound blocked:", err);
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-20"
      style={{ opacity: fade, pointerEvents: fade > 0.05 ? "auto" : "none" }}
    >
      <motion.video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/showreel.mp4"
        autoPlay muted loop playsInline preload="auto"
        style={{ scale: 1.02 + progress * 0.13 }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.48)_0%,rgba(0,0,0,.24)_28%,rgba(0,0,0,.02)_60%,rgba(0,0,0,.12)_100%)]" />

      <motion.div
        className="absolute inset-0 flex items-center px-6 pt-24 md:px-16"
        style={{ y: -progress * 140 }}
      >
        <div className="max-w-sm overflow-hidden md:max-w-md">
          {/* Label */}
          <motion.p
            className="mb-5 text-[10px] font-bold uppercase tracking-[0.42em] text-[#05A8A0]"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            SADU MEDIA
          </motion.p>

          {/* Headline — word by word */}
          <h1 className="max-w-md text-[34px] font-black uppercase leading-[0.9] tracking-[-0.045em] text-white md:text-5xl lg:text-[58px]">
            <div className="overflow-hidden">
              <motion.span className="block" custom={0} variants={lineVariants} initial="hidden" animate={ready ? "visible" : "hidden"}>
                We don't just
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span className="block" custom={1} variants={lineVariants} initial="hidden" animate={ready ? "visible" : "hidden"}>
                make content.
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span className="mt-2 block text-[#05A8A0]" custom={2} variants={lineVariants} initial="hidden" animate={ready ? "visible" : "hidden"}>
                We make it matter.
              </motion.span>
            </div>
          </h1>

          <motion.p
            className="mt-6 max-w-xs text-sm leading-7 text-white/82 md:text-[15px]"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            An award-winning production house crafting cinematic stories for brands that want to be seen, felt, and remembered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <button
              onClick={toggleSound}
              data-cursor={soundOn ? "MUTE" : "PLAY"}
              className="pointer-events-auto mt-8 inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white/90"
            >
              {soundOn ? "Sound on" : "Play with sound"}
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#05A8A0] text-[#05A8A0]">
                {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TITLE SCENE
───────────────────────────────────────────────────────────── */
function TitleScene({ progress, start, duration, title, sub }) {
  const local   = clamp((progress - start) / duration, 0, 1);
  const e       = easeInOut(local);
  const exit    = clamp((local - 0.78) / 0.22, 0, 1);
  const opacity = clamp(local / 0.1, 0, 1) * clamp((1 - local) / 0.1, 0, 1);
  const z       = -760 + e * 700;
  const rotateX = 24 - e * 19;
  const y       = (1 - e) * 190 - exit * 120;
  const sweepX  = -120 + e * 240;

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-6 pt-20"
      style={{ opacity, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[34vw] w-[34vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#05A8A0]/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-px w-[64vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-sm" />
      </div>
      <motion.div className="text-center [perspective:1800px]" style={{ y }}>
        <motion.div
          className="relative [transform-style:preserve-3d]"
          style={{ transform: `translateZ(${z}px) rotateX(${rotateX}deg)`, filter: `blur(${exit * 10}px)` }}
        >
          <h2 className="relative text-[17vw] font-black uppercase leading-none tracking-[-0.11em] text-white md:text-[11vw]">
            {title}
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent mix-blend-overlay blur-md"
              style={{ transform: `translateX(${sweepX}%)` }}
            />
          </h2>
          <h2
            className="pointer-events-none absolute inset-0 -z-10 text-[17vw] font-black uppercase leading-none tracking-[-0.11em] text-[#05A8A0]/12 blur-[2px] md:text-[11vw]"
            style={{ transform: "translateZ(-8px) translateX(2px)" }}
          >
            {title}
          </h2>
          <div className="mx-auto mt-6 h-px w-72 bg-gradient-to-r from-transparent via-[#05A8A0]/75 to-transparent" />
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.42em] text-white/36">{sub}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AWARDS SECTION
───────────────────────────────────────────────────────────── */
function AwardsSection({ progress }) {
  const local      = clamp((progress - 0.22) / 0.24, 0, 1);
  const trophyPhase = clamp((local - 0.38) / 0.42, 0, 1);
  const sectionOpacity =
    clamp((progress - 0.20) / 0.04, 0, 1) *
    clamp((0.47 - progress) / 0.05, 0, 1);

  const awards = [
    { title: "1x Vega Platinum Award",            image: "/award-vega.png",   position: "left-[6%] top-[15%]",   size: "max-h-[280px] max-w-[220px]" },
    { title: "1x Hermes Platinum Award",           image: "/award-hermes.png", position: "left-[19%] top-[47%]",  size: "max-h-[285px] max-w-[230px]" },
    { title: "6x Shortlisted",                    image: "/shortlist.png",    position: "left-[7%] top-[78%]",   size: "max-h-[210px] max-w-[190px]", shortlist: true },
    { title: "1x NYX Gold Award",                 image: "/award-nyx.png",    position: "right-[6%] top-[15%]",  size: "max-h-[280px] max-w-[220px]" },
    { title: "1x Clio Gold Award",                image: "/award-clio.png",   position: "right-[19%] top-[47%]", size: "max-h-[290px] max-w-[230px]" },
    { title: "Shortlisted — Startup of the Year", image: "/shortlist.png",    position: "right-[7%] top-[78%]",  size: "max-h-[210px] max-w-[190px]", shortlist: true },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden px-6 pt-20"
      style={{ opacity: sectionOpacity, pointerEvents: sectionOpacity > 0.02 ? "auto" : "none" }}
    >
      <TitleScene progress={progress} start={0.22} duration={0.24} title="OUR AWARDS" sub="Recognition & craft" />
      <div className="pointer-events-none absolute inset-0 z-30 hidden md:block [perspective:1800px]">
        {awards.map((award, i) => {
          const stagger    = clamp((trophyPhase - i * 0.055) / 0.45, 0, 1);
          const s          = easeInOut(stagger);
          const localFloat = Math.sin(local * Math.PI * 2 + i);
          return (
            <div
              key={award.title}
              className={`absolute ${award.position} flex flex-col items-center text-center [transform-style:preserve-3d]`}
              style={{
                transform: `translate3d(${localFloat * 5}px,${(1 - s) * 160 + localFloat * 7}px,${i * -35}px) rotateY(${localFloat * 5}deg) scale(${0.72 + s * 0.25})`,
                opacity: s,
              }}
            >
              <div className="absolute top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-[#05A8A0]/16 blur-3xl" />
              <img
                src={award.image}
                alt={award.title}
                className={`relative z-10 object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,.88)] ${award.size}`}
                style={{
                  filter: award.shortlist
                    ? "brightness(0) saturate(100%) invert(44%) sepia(63%) saturate(420%) hue-rotate(140deg) brightness(92%) contrast(95%) drop-shadow(0 35px 45px rgba(0,0,0,.75))"
                    : "contrast(1.12) saturate(1.08) drop-shadow(0 35px 45px rgba(0,0,0,.75))",
                }}
              />
              <p className="relative z-20 mt-5 max-w-[190px] text-[10px] font-bold uppercase leading-5 tracking-[0.22em] text-white/84">
                {award.title}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
function ProjectCard({ item, progress, velocity = 0 }) {
  const openProject = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.link) window.open(item.link, "_blank", "noopener,noreferrer");
  };

  const raw    = clamp((progress - 0.6) / 0.28, 0, 0.999) * projects.length;
  const local  = raw % 1;
  const enter  = easeInOut(clamp(local / 0.3, 0, 1));
  const leave  = easeInOut(clamp((local - 0.74) / 0.26, 0, 1));
  const opacity = enter * (1 - leave);
  const scrollBoost = clamp(Math.abs(velocity) * 0.0008, 0, 0.08);
  const impact = Math.sin(local * Math.PI) * 0.035;
  const y      = (1 - enter) * 230 - leave * 200 + Math.sin(local * Math.PI * 2) * 30;
  const x      = (1 - enter) * 210 - leave * 150 + Math.cos(local * Math.PI * 2) * 12;
  const rotate = (1 - enter) * 5 - leave * 4 + Math.sin(local * Math.PI) * 1.4 + scrollBoost * 12;
  const scale  = 0.84 + enter * 0.16 - leave * 0.08 + impact + scrollBoost;
  const blur   = leave * 8;
  const imageParallaxX = item.featured ? Math.cos(local * Math.PI * 2) * 18 : 0;
  const imageParallaxY = item.featured ? Math.sin(local * Math.PI * 2) * 12 : 0;
  const imageScale     = item.featured ? 1.08 + enter * 0.04 : 1.03;
  const speedLineX     = item.featured ? -35 + local * 155 : -45 + local * 120;
  const depthTilt      = Math.sin(local * Math.PI) * 7;
  const lightSweepX    = -80 + local * 180;

  return (
    <motion.article
      className="relative w-full max-w-6xl [perspective:1400px]"
      style={{ opacity, y, x, rotate, scale, filter: `blur(${blur}px)` }}
    >
      <div className="absolute inset-0 translate-y-8 scale-[.96] rounded-[2.75rem] bg-[#05A8A0]/10 blur-3xl" />
      <motion.div
        className="relative h-[66vh] min-h-[440px] overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.035] shadow-[0_80px_240px_rgba(0,0,0,.92)] backdrop-blur-xl"
        style={{ rotateX: depthTilt * 0.12, rotateY: depthTilt * 0.18, clipPath: "inset(0 round 2.75rem)" }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[2.75rem]">
          {item.image && (
            <motion.img
              src={item.image}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ x: imageParallaxX, y: imageParallaxY, scale: imageScale }}
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_28%,rgba(255,255,255,.25),transparent_30%),linear-gradient(to_top,rgba(0,0,0,.86),rgba(0,0,0,.12)_48%,rgba(0,0,0,.22))]" />
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay blur-lg"
            style={{ left: `${lightSweepX}%` }}
          />
          {item.featured && (
            <>
              <motion.div
                className="pointer-events-none absolute top-[18%] h-[2px] w-[55%] -rotate-6 bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent blur-[1px]"
                style={{ left: `${speedLineX}%`, opacity: opacity * 0.8 }}
              />
              <motion.div
                className="pointer-events-none absolute top-[38%] h-px w-[70%] -rotate-6 bg-gradient-to-r from-transparent via-[#05A8A0]/70 to-transparent blur-sm"
                style={{ left: `${speedLineX - 18}%`, opacity: opacity * 0.65 }}
              />
            </>
          )}
        </div>

        {item.logo && (
          <motion.img
            src={item.logo}
            className="absolute left-6 top-6 z-20 w-16 opacity-90 md:w-24"
            style={{
              filter: item.title === "McDonald's Brand Trust" ? "brightness(0) invert(1)" : "none",
              scale: item.featured ? 0.95 + enter * 0.05 : item.title === "TMG Banan Al Riyadh" ? 1.1 : 1,
            }}
          />
        )}

        <button
          type="button"
          onClick={openProject}
          data-cursor="PLAY"
          className="absolute right-6 top-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-white text-black shadow-2xl transition hover:scale-105"
        >
          <CirclePlay size={19} fill="black" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-7 md:p-10">
          <div className="mb-8 flex items-center gap-5">
            <span className="text-sm text-white/46">{item.no}</span>
            <span className="h-px w-20 bg-white/18" />
            <span className="text-[10px] font-bold uppercase tracking-[0.36em] text-[#05A8A0]">{item.tag}</span>
          </div>
          <h2 className="max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] text-white md:text-7xl lg:text-8xl">
            {item.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">{item.desc}</p>
          <p className="mt-5 max-w-3xl text-[10px] uppercase leading-6 tracking-[0.24em] text-white/38">{item.meta}</p>
          <Magnetic strength={0.2}>
            <button
              type="button"
              onClick={openProject}
              data-cursor="VIEW"
              className="relative z-[999] mt-7 inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/15 bg-black/35 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 backdrop-blur-xl transition hover:border-[#05A8A0]/60 hover:bg-[#05A8A0]/10 hover:text-white"
            >
              View project <ArrowUpRight size={15} className="text-[#05A8A0]" />
            </button>
          </Magnetic>
        </div>
      </motion.div>

      {item.image && (
        <div className="pointer-events-none absolute left-10 right-10 top-full h-[170px] origin-top scale-y-[-1] overflow-hidden rounded-[2.75rem] opacity-25 blur-[2px]">
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black" />
        </div>
      )}
    </motion.article>
  );
}

function ProjectStage({ progress, velocity = 0 }) {
  const idx  = getProjectIndex(progress);
  const item = projects[idx];
  const stageOpacity =
    clamp((progress - 0.58) / 0.04, 0, 1) *
    clamp((0.88 - progress) / 0.04, 0, 1);
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center px-6 pt-16 md:px-14"
      style={{ opacity: stageOpacity, pointerEvents: stageOpacity > 0.02 ? "auto" : "none" }}
    >
      <ProjectCard key={item.title} item={item} progress={progress} velocity={velocity} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIMEO SECTION
───────────────────────────────────────────────────────────── */
function VimeoSection({ progress }) {
  const opacity = clamp((progress - 0.87) / 0.03, 0, 1) * clamp((0.935 - progress) / 0.04, 0, 1);
  const entry   = clamp((progress - 0.87) / 0.03, 0, 1);
  const [hovered, setHovered] = useState(null);

  const previews = [
    { title: "Formula e Jeddah E-Prix", image: "/1.jpg" },
    { title: "MBC Shahid Ramadan",      image: "/2.jpg" },
    { title: "TMG Banan Al Riyadh",     image: "/3.jpg" },
    { title: "Events Investment Fund",  image: "/4.jpg" },
    { title: "McDonald's Brand Trust",  image: "/5.jpg" },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden px-6 text-center"
      style={{ opacity, y: (1 - entry) * 90, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <div className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:text-left">
        <div>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.42em] text-[#05A8A0]">More from Sadu</p>
          <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-7xl lg:text-8xl">
            The reel continues.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/68 md:text-lg">
            Explore the full Sadu Media archive on Vimeo — films, campaigns, launches, cultural stories, and cinematic work crafted across Saudi Arabia and beyond.
          </p>
          <Magnetic strength={0.22}>
            <a
              href="https://vimeo.com/sadumedia"
              target="_blank"
              rel="noreferrer"
              data-cursor="WATCH"
              className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/35 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white/85 backdrop-blur-xl transition hover:border-[#05A8A0]/70 hover:bg-[#05A8A0]/10 hover:text-white"
            >
              Open Vimeo portfolio <ArrowUpRight size={16} className="text-[#05A8A0]" />
            </a>
          </Magnetic>
        </div>

        <div className="relative h-[58vh] min-h-[430px] [perspective:1600px]">
          {previews.map((item, i) => {
            const baseX      = (i - 2) * 96;
            const baseY      = Math.sin(i) * 18;
            const baseRotate = (i - 2) * 4;
            const isHovered  = hovered === i;
            const isDim      = hovered !== null && !isHovered;
            return (
              <motion.a
                key={item.title}
                href="https://vimeo.com/sadumedia"
                target="_blank"
                rel="noreferrer"
                data-cursor="WATCH"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="absolute left-1/2 top-1/2 block h-[300px] w-[220px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.045] shadow-[0_45px_120px_rgba(0,0,0,.75)]"
                style={{ transformOrigin: "center bottom", zIndex: isHovered ? 50 : 10 + i }}
                animate={{
                  x:       baseX - 110,
                  y:       isHovered ? baseY - 175 : baseY - 150,
                  rotateY: isHovered ? 0 : baseRotate,
                  rotateZ: isHovered ? 0 : (i - 2) * 1.2,
                  scale:   isHovered ? 1.18 : isDim ? 0.88 : 1,
                  opacity: isDim ? 0.4 : 1,
                }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  animate={{ scale: isHovered ? 1.12 : 1.03 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.35),rgba(0,0,0,.04)_55%,rgba(0,0,0,.16))]" />
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05A8A0]/20 to-transparent" />
                )}
                <motion.div
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-2xl"
                  animate={{ scale: isHovered ? 1.15 : 0.9, opacity: isHovered ? 1 : 0.65 }}
                  transition={{ duration: 0.25 }}
                >
                  <CirclePlay size={16} fill="black" />
                </motion.div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CLIENTS SECTION
───────────────────────────────────────────────────────────── */
function ClientsSection({ progress }) {
  const local   = clamp((progress - 0.925) / 0.06, 0, 1);
  const opacity = clamp(local / 0.1, 0, 1) * clamp((1 - local) / 0.08, 0, 1);

  const logoPositions = [
    [-36,-30],[-22,-33],[-7,-36],[7,-33],[22,-30],[36,-27],
    [-42,-17],[-28,-18],[-15,-20],[15,-20],[28,-18],[42,-16],
    [-44,-5],[-33,-3],[-24,-6],[24,-6],[33,-3],[44,-5],
    [-44,8],[-33,10],[-24,7],[24,7],[33,10],[44,8],
    [-42,21],[-27,23],[-14,25],[14,25],[28,23],[42,21],
    [-36,32],[-21,34],[-7,36],[7,36],[21,34],[36,32],
    [-43,-25],[43,-25],[-43,27],[43,27],[-43,1],[43,1],
  ];

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden px-6 pt-20"
      style={{ opacity, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[42vw] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#05A8A0]/18 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-px w-[72vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm" />
      </div>

      <TitleScene progress={progress} start={0.925} duration={0.06} title="OUR CLIENTS" sub="Trusted by leading brands" />

      <div className="pointer-events-none absolute inset-0 z-30 hidden md:block [perspective:1800px]">
        {clientLogos.map((client, i) => {
          const [baseX, baseY] = logoPositions[i % logoPositions.length];
          const ring   = i % 4;
          const reveal = clamp((local - 0.08 - i * 0.004) / 0.5, 0, 1);
          const s      = easeInOut(reveal);
          const floatX = Math.sin(local * Math.PI * 2 + i * 0.7) * (1.2 + ring * 0.5);
          const floatY = Math.cos(local * Math.PI * 2 + i * 0.9) * (1.0 + ring * 0.4);
          const rotY   = Math.sin(local * Math.PI * 2 + i) * (2 + ring * 1);
          const rotX   = Math.cos(local * Math.PI * 2 + i) * 2;
          const z      = -60 - ring * 50;
          const entryY = (1 - s) * 60;
          const scale  = 0.82 + s * (0.18 - ring * 0.01);

          return (
            <motion.div
              key={client.logo}
              className="absolute left-1/2 top-1/2 flex items-center justify-center will-change-transform [transform-style:preserve-3d]"
              style={{
                transform: `translate3d(calc(-50% + ${baseX + floatX}vw),calc(-50% + ${baseY + entryY + floatY}vh),${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
                opacity: s * 0.92,
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-16 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#05A8A0]/12 blur-2xl" />
              <img
                src={client.logo}
                alt={client.name}
                className="relative z-10 h-10 w-28 object-contain lg:h-12 lg:w-36"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.78 }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="absolute bottom-8 left-1/2 z-30 grid w-[88vw] -translate-x-1/2 grid-cols-3 gap-6 md:hidden">
        {clientLogos.slice(0, 18).map((client, i) => {
          const reveal = clamp((local - i * 0.018) / 0.36, 0, 1);
          const s      = easeInOut(reveal);
          return (
            <div key={client.logo} className="relative flex h-12 items-center justify-center" style={{ opacity: s }}>
              <div className="absolute left-1/2 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#05A8A0]/10 blur-xl" />
              <img
                src={client.logo}
                alt={client.name}
                className="relative z-10 max-h-7 max-w-[5rem] object-contain"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.78 }}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FINAL CTA — with contact form
───────────────────────────────────────────────────────────── */
function FinalCTA({ progress }) {
  const opacity = clamp((progress - 0.985) / 0.015, 0, 1);
  const reveal  = easeInOut(opacity);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", brand: "", type: "Brand Film", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Brief from ${form.name} — ${form.brand}`;
    const body    = `Name: ${form.name}\nBrand: ${form.brand}\nProject Type: ${form.type}\n\nBrief:\n${form.message}`;
    window.location.href = `mailto:hello@sadumedia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => { setShowForm(false); setSent(false); }, 2500);
  };

  const inputCls = "w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-white/28 outline-none backdrop-blur-xl transition focus:border-[#05A8A0]/55 focus:bg-white/[0.09]";

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden px-6 text-center"
      style={{ opacity, pointerEvents: opacity > 0.05 ? "auto" : "none" }}
    >
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: reveal }} />
      <motion.div
        className="relative z-20 w-full max-w-4xl"
        style={{ y: (1 - reveal) * 70, scale: 0.95 + reveal * 0.05 }}
      >
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.46em] text-[#05A8A0]">Final frame</p>
        <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-white md:text-8xl lg:text-[9rem]">
          Let's create
          <span className="block text-[#05A8A0]">what lasts.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
          Bring us the brief. We'll bring the craft, the crew, the camera, and the cinematic precision to make it unforgettable.
        </p>

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="ctas"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Magnetic strength={0.25}>
                <button
                  onClick={() => setShowForm(true)}
                  data-cursor="START"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-[0_30px_90px_rgba(255,255,255,.18)] transition hover:scale-[1.03]"
                >
                  Start a project <ArrowUpRight size={17} />
                </button>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href="https://vimeo.com/sadumedia"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="WATCH"
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-bold text-white/85 backdrop-blur-xl transition hover:border-[#05A8A0]/60 hover:bg-[#05A8A0]/10"
                >
                  Watch more work <CirclePlay size={17} />
                </a>
              </Magnetic>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="mt-10 grid gap-3 text-left sm:grid-cols-2"
            >
              <input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className={inputCls}
              />
              <input
                placeholder="Brand / company"
                value={form.brand}
                onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                required
                className={inputCls}
              />
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-[#080808] px-5 py-3.5 text-sm text-white/70 outline-none transition focus:border-[#05A8A0]/55"
              >
                {["Brand Film","Campaign","Social Content","Event Coverage","CGI / VFX","Other"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <textarea
                placeholder="Tell us about the brief…"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                rows={3}
                className={`${inputCls} resize-none sm:col-span-2`}
              />
              <div className="flex items-center justify-center gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-white/10 px-6 py-3 text-sm text-white/40 transition hover:text-white/70"
                >
                  Cancel
                </button>
                <Magnetic strength={0.2}>
                  <button
                    type="submit"
                    data-cursor="SEND"
                    className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:scale-[1.03]"
                  >
                    {sent ? "Opening your email…" : "Send brief"}
                    <ArrowUpRight size={16} />
                  </button>
                </Magnetic>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────── */
export default function App() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth   = useSpring(scrollYProgress, { stiffness: 74, damping: 25, mass: 0.26 });
  const velocity = useVelocity(scrollYProgress);
  const [p, setP] = useState(0);
  const [v, setV] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => smooth.on("change", setP), [smooth]);
  useEffect(() => velocity.on("change", setV), [velocity]);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Always-on overlays */}
      <FilmGrain />
      {mounted && <CustomCursor />}
      {mounted && !preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      {mounted && <ScrollIndicator progress={p} />}

      <main
        ref={ref}
        className="relative h-[1000vh] bg-black text-white selection:bg-[#05A8A0] selection:text-black"
      >
        <Nav />
        <section className="sticky top-0 h-screen overflow-hidden bg-black">
          <Atmosphere progress={p} />
          <ParticleCanvas progress={p} />
          <Hero progress={p} ready={preloaderDone} />

          {mounted && <AwardsSection progress={p} />}
          <TitleScene progress={p} start={0.46} duration={0.14} title="OUR WORK" sub="Cinematic portfolio" />
          {mounted && <ProjectStage progress={p} velocity={v} />}
          <VimeoSection progress={p} />
          {mounted && <ClientsSection progress={p} />}
          <FinalCTA progress={p} />

          <div className="absolute bottom-8 left-8 z-40 hidden items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-white/42 backdrop-blur-xl md:flex">
            <VolumeX size={15} /> Preview sound off
          </div>
        </section>
      </main>
    </>
  );
}

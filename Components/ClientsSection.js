"use client";

import React from "react";

import { motion } from "framer-motion";

function clamp(v, min, max) {

  return Math.min(Math.max(v, min), max);

}

function easeInOut(t) {

  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

}

const clientLogos = Array.from({ length: 42 }, (_, i) => i + 1)

  .filter((n) => n !== 36)

  .map((n) => ({

    name: `Client ${n}`,

    logo: `/logos/logo${n}.png`,

  }));

export default function ClientsSection({ progress }) {

  const local = clamp((progress - 0.9) / 0.1, 0, 1);

  const opacity =

    clamp(local / 0.2, 0, 1) *

    clamp((1 - local) / 0.2, 0, 1);

  const left = clientLogos.slice(0, 20);

  const right = clientLogos.slice(20);

  return (

    <motion.div

      className="absolute inset-0 z-30"

      style={{ opacity }}

    >

      {/* CENTER TITLE */}

      <div className="absolute inset-0 flex items-center justify-center text-center z-20">

        <div>

          <h2 className="text-[10vw] font-black tracking-[-0.1em]">

            OUR CLIENTS

          </h2>

          <p className="mt-4 text-white/50 text-sm uppercase tracking-[0.3em]">

            Trusted by leading brands

          </p>

        </div>

      </div>

      {/* LEFT GRID */}

      <div className="absolute left-10 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-6">

        {left.map((client, i) => {

          const delay = i * 0.02;

          const t = clamp((local - delay) / 0.4, 0, 1);

          const s = easeInOut(t);

          return (

            <motion.div

              key={client.logo}

              className="w-40 h-24 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"

              style={{

                opacity: s,

                transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,

              }}

            >

              <img

                src={client.logo}

                className="max-h-12 object-contain"

                style={{

                  filter: "brightness(0) invert(1)",

                }}

              />

            </motion.div>

          );

        })}

      </div>

      {/* RIGHT GRID */}

      <div className="absolute right-10 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-6">

        {right.map((client, i) => {

          const delay = i * 0.02;

          const t = clamp((local - delay) / 0.4, 0, 1);

          const s = easeInOut(t);

          return (

            <motion.div

              key={client.logo}

              className="w-40 h-24 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"

              style={{

                opacity: s,

                transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,

              }}

            >

              <img

                src={client.logo}

                className="max-h-12 object-contain"

                style={{

                  filter: "brightness(0) invert(1)",

                }}

              />

            </motion.div>

          );

        })}

      </div>

    </motion.div>

  );

}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const smokeParticles = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  left: `${8 + index * 9}%`,
  delay: index * 0.4,
  duration: 4.5 + index * 0.2
}));

export function HomeHero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-poster.jpg')"
        }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero-cinematic.mp4" type="video/mp4" />
      </video>
      <div className="smoke-overlay absolute inset-0 animate-float-smoke" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,2,3,0.82)_0%,rgba(11,9,9,0.46)_34%,rgba(16,12,11,0.32)_50%,rgba(12,10,10,0.5)_66%,rgba(3,3,3,0.86)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_47%,rgba(198,88,28,0.22),transparent_10%),radial-gradient(circle_at_72%_84%,rgba(201,148,52,0.16),transparent_12%),radial-gradient(circle_at_center,rgba(48,22,12,0.1),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0.28)_24%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.78)_100%)]" />

      {smokeParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="smoke-plume absolute bottom-14 h-24 w-24 rounded-full bg-white/10 blur-3xl"
          style={{ left: particle.left }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.2, 0], y: [-10, -90], x: [0, 12, -8] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}

      <div className="relative mx-auto flex min-h-[100vh] w-full max-w-7xl items-center justify-center px-4 py-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-[70rem] text-center"
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.42em] text-yisos-gold/90 md:text-xs">
            Private Reserve Collection
          </p>
          <h1 className="text-balance font-display text-[3.35rem] leading-[0.95] tracking-[-0.03em] text-[#f5ead7] md:text-[5.1rem] xl:text-[6.6rem]">
            Premium Cigars.
            <br />
            Timeless Ritual.
          </h1>
          <p className="mx-auto mt-8 max-w-5xl text-lg leading-relaxed text-[#f0e2cf]/88 md:text-[1.7rem]">
            Crafted for men of intent. Limited blends. Private drops. Lounge culture.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[16rem] rounded-lg border-yisos-gold/75 bg-[linear-gradient(180deg,rgba(53,30,20,0.58),rgba(33,19,15,0.78))] px-10 font-display text-[1.75rem] font-medium text-[#f5ead7] shadow-[0_14px_40px_rgba(0,0,0,0.25)] hover:border-yisos-gold hover:bg-[linear-gradient(180deg,rgba(67,39,26,0.72),rgba(43,25,18,0.92))] md:min-w-[22rem]"
            >
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[16rem] rounded-lg border-yisos-gold/75 bg-[linear-gradient(180deg,rgba(105,63,23,0.62),rgba(71,40,18,0.86))] px-10 font-display text-[1.75rem] font-medium text-[#f5ead7] shadow-[0_14px_40px_rgba(0,0,0,0.25)] hover:border-yisos-gold hover:bg-[linear-gradient(180deg,rgba(123,73,25,0.78),rgba(82,46,19,0.94))] md:min-w-[22rem]"
            >
              <Link href="/membership">
                <Crown className="mr-2 h-4 w-4" />
                Join VIP Cellar
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-6 text-[11px] uppercase tracking-[0.28em] text-yisos-bone/58">
            <span>Whiskey Pairings</span>
            <span className="h-px w-10 bg-yisos-gold/35" />
            <span>Limited Blends</span>
            <span className="h-px w-10 bg-yisos-gold/35" />
            <span>Private Drops</span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 hidden justify-center md:flex">
            <div className="rounded-full border border-yisos-gold/20 bg-black/25 px-5 py-2 text-[10px] uppercase tracking-[0.28em] text-yisos-bone/55 backdrop-blur-sm">
              Lounge atmosphere. Smoke texture. Night ritual.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

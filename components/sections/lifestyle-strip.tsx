import Image from "next/image";

export function LifestyleStrip() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="mx-auto w-full max-w-[96rem] px-4 md:px-8">
        <div className="relative min-h-[36rem] overflow-hidden rounded-[2rem] border border-yisos-gold/15 bg-[#0b0908] shadow-panel md:min-h-[46rem]">
          <Image
            src="/lifestyle-lounge.jpg"
            alt="YISOS lounge lifestyle"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,8,0.5)_0%,rgba(10,8,8,0.22)_18%,rgba(12,9,9,0.16)_42%,rgba(11,9,9,0.42)_68%,rgba(8,7,8,0.78)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(240,240,240,0.12),transparent_16%),radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.08),transparent_12%),radial-gradient(circle_at_72%_72%,rgba(198,144,52,0.12),transparent_14%)]" />
          <div className="smoke-overlay absolute inset-0" />

          <div className="relative flex min-h-[36rem] flex-col justify-between p-8 md:min-h-[46rem] md:p-14">
            <div className="pt-2 text-center md:pt-4">
              <p className="mb-4 text-[10px] uppercase tracking-[0.42em] text-yisos-gold/90 md:text-xs">
                Lounge Culture
              </p>
              <h2 className="mx-auto max-w-6xl font-display text-[2.6rem] leading-[0.96] tracking-[-0.03em] text-[#f2dfbf] md:text-[4.4rem] xl:text-[5.5rem]">
                THE LOUNGE IS A LIFESTYLE
              </h2>
            </div>

            <div className="mx-auto max-w-5xl text-center">
              <p className="font-display text-[1.6rem] leading-[1.28] text-[#f3e4ca]/94 md:text-[2.35rem] xl:text-[2.9rem]">
                Late nights. Whiskey pairings. Conversations worth having.
              </p>
              <p className="mt-3 font-display text-[1.35rem] leading-[1.25] text-[#f3e4ca]/92 md:text-[2.05rem] xl:text-[2.55rem]">
                The ritual takes center stage.
              </p>

              <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.28em] text-yisos-bone/60 md:gap-6">
                <span>Private Club Energy</span>
                <span className="h-px w-10 bg-yisos-gold/35" />
                <span>Whiskey Reflections</span>
                <span className="h-px w-10 bg-yisos-gold/35" />
                <span>Night Ritual</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

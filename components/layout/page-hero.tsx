import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "surface-2 relative overflow-hidden border-b border-border/75 py-18 md:py-24",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(188,150,72,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(82,95,54,0.16),transparent_24%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yisos-gold/60 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-yisos-gold">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-5xl font-display text-5xl leading-[0.92] text-yisos-stitch md:text-7xl">
          {title}
        </h1>
        {description ? <p className="mt-5 max-w-3xl text-lg leading-relaxed text-yisos-bone/80">{description}</p> : null}
      </div>
    </section>
  );
}

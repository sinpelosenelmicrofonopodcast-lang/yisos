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
    <section className={cn("surface-2 border-b border-border/75 py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-yisos-gold">{eyebrow}</p> : null}
        <h1 className="mt-3 font-display text-5xl text-yisos-stitch md:text-6xl">{title}</h1>
        {description ? <p className="mt-4 max-w-3xl text-yisos-bone/80">{description}</p> : null}
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";

export function SectionHeading({
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
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-yisos-gold">{eyebrow}</p>
      ) : null}
      <h2 className="gold-line font-display text-4xl leading-tight text-yisos-bone md:text-5xl">{title}</h2>
      {description ? <p className="mt-6 text-base text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}

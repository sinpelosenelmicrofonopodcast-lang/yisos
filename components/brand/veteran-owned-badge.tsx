import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type VeteranOwnedBadgeProps = {
  compact?: boolean;
  variant?: "patch" | "mono";
  className?: string;
};

export function VeteranOwnedBadge({
  compact = false,
  variant = "patch",
  className
}: VeteranOwnedBadgeProps) {
  const isMono = variant === "mono";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.65rem] shadow-panel",
        isMono
          ? "border border-yisos-bone/15 bg-[linear-gradient(180deg,rgba(26,21,19,0.96),rgba(11,10,11,0.98))]"
          : "border border-yisos-gold/25 bg-[linear-gradient(180deg,rgba(31,24,22,0.94),rgba(12,11,11,0.98))]",
        compact ? "max-w-[23rem]" : "max-w-[34rem]",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-[6px] rounded-[1.25rem]",
          isMono ? "border border-dashed border-yisos-bone/10" : "border border-dashed border-yisos-gold/14"
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.06),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_80%_78%,rgba(200,148,52,0.1),transparent_14%)]" />

      <div className="relative grid grid-cols-[auto,1fr]">
        <div
          className={cn(
            "relative flex items-center justify-center border-r px-4 py-4",
            compact ? "min-w-[5.5rem]" : "min-w-[7rem]",
            isMono
              ? "border-yisos-bone/12 bg-[linear-gradient(180deg,rgba(59,51,46,0.55),rgba(18,16,15,0.96))]"
              : "border-yisos-gold/20 bg-[linear-gradient(180deg,rgba(90,98,15,0.32),rgba(26,21,19,0.96))]"
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-full border",
              compact ? "h-12 w-12" : "h-16 w-16",
              isMono ? "border-yisos-bone/20 bg-black/30" : "border-yisos-gold/35 bg-black/25"
            )}
          >
            <Image
              src="/yisos-logo.png"
              alt="YISOS insignia"
              fill
              sizes={compact ? "48px" : "64px"}
              className={cn(
                "object-cover",
                isMono ? "grayscale sepia-[0.15] brightness-[0.86] contrast-125" : "saturate-[0.9] contrast-110"
              )}
            />
            <div
              className={cn(
                "absolute inset-0",
                isMono
                  ? "bg-[linear-gradient(180deg,rgba(13,12,12,0.12),rgba(13,12,12,0.36))]"
                  : "bg-[linear-gradient(180deg,rgba(13,12,12,0.04),rgba(13,12,12,0.22))]"
              )}
            />
          </div>
        </div>

        <div>
          <div
            className={cn(
              "border-b px-5 py-3",
              isMono
                ? "border-yisos-bone/12 bg-[linear-gradient(90deg,rgba(61,54,49,0.76),rgba(26,21,19,0.94))]"
                : "border-yisos-gold/20 bg-[linear-gradient(90deg,rgba(100,55,29,0.9),rgba(155,79,35,0.76))]"
            )}
          >
            <div className="mb-1 flex items-center gap-1.5 text-yisos-gold">
              <Star className={compact ? "h-3 w-3 fill-current" : "h-3.5 w-3.5 fill-current"} />
              <Star className={compact ? "h-3 w-3 fill-current" : "h-3.5 w-3.5 fill-current"} />
              <Star className={compact ? "h-3 w-3 fill-current" : "h-3.5 w-3.5 fill-current"} />
            </div>
            <p
              className={cn(
                "font-display uppercase leading-none tracking-[0.14em] text-yisos-stitch",
                compact ? "text-base" : "text-[1.45rem]"
              )}
            >
              Veteran Owned
            </p>
          </div>
          <div
            className={cn(
              "px-5 py-3",
              isMono
                ? "bg-[linear-gradient(90deg,rgba(36,32,30,0.94),rgba(12,11,11,0.98))]"
                : "bg-[linear-gradient(90deg,rgba(90,98,15,0.86),rgba(26,21,19,0.98))]"
            )}
          >
            <p
              className={cn(
                "font-display uppercase leading-none tracking-[0.14em] text-yisos-stitch",
                compact ? "text-base" : "text-[1.45rem]"
              )}
            >
              & Operated
            </p>
            <p
              className={cn(
                "mt-2 text-[10px] uppercase tracking-[0.26em]",
                isMono ? "text-yisos-bone/55" : "text-yisos-bone/65"
              )}
            >
              Discipline. Ritual. Brotherhood.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandWordmark } from "@/components/layout/brand-wordmark";

const LOGO_SRC = "/yisos-logo.png";

export function BrandLogo({
  compact = false,
  className
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          compact ? "h-11 w-11" : "h-14 w-14"
        )}
      >
        <Image
          src={LOGO_SRC}
          alt="YISOS CIGARS logo"
          fill
          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
          sizes={compact ? "44px" : "56px"}
          priority
        />
      </div>
      <div className="flex flex-col justify-center">
        <BrandWordmark className={cn(compact ? "hidden h-7 w-[132px] sm:block" : "h-9 w-[180px] md:h-10 md:w-[220px]")} />
        <p className="mt-1 text-[10px] uppercase tracking-[0.23em] text-yisos-bone/70">Premium Ritual House</p>
      </div>
    </Link>
  );
}

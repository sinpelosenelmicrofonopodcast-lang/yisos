import Image from "next/image";
import { cn } from "@/lib/utils";

const WORDMARK_SRC = "/yisos-banner.png";

export function BrandWordmark({
  className,
  priority = false
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative h-12 w-[220px]", className)}>
      <Image
        src={WORDMARK_SRC}
        alt="YISOS wordmark"
        fill
        className="object-contain object-left"
        sizes="(max-width: 768px) 220px, 420px"
        priority={priority}
      />
    </div>
  );
}

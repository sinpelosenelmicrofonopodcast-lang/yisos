import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-yisos-gold">404</p>
      <h1 className="mt-3 font-display text-5xl text-yisos-bone">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">The page you requested does not exist in this collection.</p>
      <Button asChild variant="luxury" className="mt-6">
        <Link href="/shop">Back To Shop</Link>
      </Button>
    </section>
  );
}

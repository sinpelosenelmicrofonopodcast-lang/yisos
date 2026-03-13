import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  return (
    <>
      <PageHero
        eyebrow="Confirmed"
        title="Order Received"
        description="Your YISOS order is confirmed. We sent details to your inbox and will update you on shipment status."
      />
      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-8">
        <div className="rounded-2xl border border-border bg-yisos-charcoal/70 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-yisos-gold" />
          <p className="mt-4 text-muted-foreground">Thank you for choosing YISOS CIGARS.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="luxury">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

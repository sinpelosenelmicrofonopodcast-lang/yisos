import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const options = [50, 100, 250, 500];

export const metadata = buildMetadata({
  title: "Gift Cards",
  description: "Luxury digital gift cards for premium cigar gifting.",
  path: "/gift-cards"
});

export default function GiftCardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Gifting"
        title="YISOS Gift Cards"
        description="Deliver a premium cigar experience instantly with elegant digital gift cards."
      />
      <section className="mx-auto w-full max-w-5xl px-4 py-16 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((amount) => (
            <Card key={amount} className="bg-yisos-charcoal/70">
              <CardContent className="p-5 text-center">
                <p className="font-display text-4xl text-yisos-bone">${amount}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Digital Delivery</p>
                <Button className="mt-4 w-full" variant="luxury">
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

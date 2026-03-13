import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact YISOS concierge for events, private gifting, or order support.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Concierge"
        title="Contact YISOS"
        description="For private sourcing, events, gifting programs, and support."
      />
      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-8">
        <ContactForm />
      </section>
    </>
  );
}

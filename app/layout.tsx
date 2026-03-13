import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";
import { getCurrentUser, getUserProfile } from "@/lib/services/auth-service";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Premium Cigars. Timeless Ritual.",
    description:
      "YISOS CIGARS is a premium online cigar house featuring exclusive blends, luxury gifting, and private lounge culture.",
    path: "/"
  }),
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const profile = user ? await getUserProfile(user.id) : null;
  const isAdmin = profile?.role === "admin";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "YISOS CIGARS",
    description: "Premium cigar brand and online store",
    telephone: "+1-312-555-0198",
    address: {
      "@type": "PostalAddress",
      streetAddress: "145 Gold Leaf Row",
      addressLocality: "Chicago",
      addressRegion: "IL",
      postalCode: "60601",
      addressCountry: "US"
    },
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  };

  return (
    <html lang="en" className={`${cinzel.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        <AppProviders>
          <SiteHeader isAdmin={isAdmin} />
          <main>{children}</main>
          <SiteFooter />
        </AppProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export function buildMetadata({
  title,
  description,
  path = "",
  image
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const fullDescription = description || siteConfig.description;
  const url = new URL(path || "/", siteConfig.url).toString();
  const ogImage = new URL(image || siteConfig.ogImage, siteConfig.url).toString();

  return {
    title: fullTitle,
    description: fullDescription,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage }],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage]
    }
  };
}

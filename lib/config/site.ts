export const siteConfig = {
  name: "YISOS CIGARS",
  description:
    "Premium hand-selected cigars built for elevated rituals, private lounges, and collectors who demand flavor with presence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/opengraph-image",
  email: "concierge@yisoscigars.com",
  phone: "+1 (312) 555-0198",
  social: {
    instagram: "https://instagram.com/yisoscigars"
  },
  address: {
    locality: "Chicago",
    region: "IL",
    postalCode: "60601",
    country: "US",
    streetAddress: "145 Gold Leaf Row"
  }
};

export const mainNav = [
  { href: "/shop", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/contact", label: "Contact" }
];

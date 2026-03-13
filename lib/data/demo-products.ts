import { Product, Category, EventItem, MembershipTier } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-best-sellers",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Most sought-after YISOS blends"
  },
  {
    id: "cat-limited",
    name: "Limited Editions",
    slug: "limited-editions",
    description: "Rare drops for collectors"
  },
  {
    id: "cat-lounge",
    name: "Lounge Favorites",
    slug: "lounge-favorites",
    description: "Balanced cigars for long evenings"
  },
  {
    id: "cat-new",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh arrivals with bold character"
  },
  {
    id: "cat-gifts",
    name: "Gift Picks",
    slug: "gift-picks",
    description: "Elegant gifts for cigar enthusiasts"
  }
];

export const products: Product[] = [
  {
    id: "prod-imperial-noir",
    name: "Imperial Noir Toro",
    slug: "imperial-noir-toro",
    sku: "YIS-INO-TORO",
    description:
      "A rich medium-full blend layered with espresso, cedar, and dark cocoa. Built for long nights, low light, and deliberate conversation.",
    price: 29,
    salePrice: null,
    stock: 78,
    rating: 4.9,
    reviewCount: 184,
    origin: "Nicaragua",
    size: "6 x 52 Toro",
    wrapper: "Habano Oscuro",
    binder: "Nicaraguan",
    filler: "Nicaraguan Ligero",
    strength: "Medium-Full",
    tastingNotes: ["Espresso", "Dark Cocoa", "Cedar", "Pepper Finish"],
    pairingSuggestions: ["Single Malt Scotch", "Aged Rum", "Cold Brew"],
    images: [
      "https://images.unsplash.com/photo-1611414199850-38910880e76e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80"
    ],
    badges: ["Best Seller"],
    featured: true,
    bestSeller: true,
    categorySlugs: ["best-sellers", "lounge-favorites"]
  },
  {
    id: "prod-gold-reserve",
    name: "Gold Reserve Churchill",
    slug: "gold-reserve-churchill",
    sku: "YIS-GR-CHUR",
    description:
      "An elegant long-format cigar with cream, toasted almond, and floral spice. Reserved for collectors and celebration tables.",
    price: 36,
    salePrice: 32,
    stock: 33,
    rating: 4.8,
    reviewCount: 112,
    origin: "Dominican Republic",
    size: "7 x 48 Churchill",
    wrapper: "Ecuadorian Connecticut",
    binder: "Dominican",
    filler: "Dominican & Nicaraguan",
    strength: "Medium",
    tastingNotes: ["Cream", "Toasted Almond", "Floral Spice", "Honey"],
    pairingSuggestions: ["Irish Whiskey", "Champagne", "Vanilla Latte"],
    images: [
      "https://images.unsplash.com/photo-1611414199850-38910880e76e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80"
    ],
    badges: ["Limited"],
    featured: true,
    limitedEdition: true,
    categorySlugs: ["limited-editions", "gift-picks"]
  },
  {
    id: "prod-lounge-olive",
    name: "Lounge Olive Robusto",
    slug: "lounge-olive-robusto",
    sku: "YIS-LO-ROB",
    description:
      "Balanced draw with roasted nuts, leather, and a smooth wood-forward finish designed for repeat evenings.",
    price: 24,
    salePrice: null,
    stock: 120,
    rating: 4.7,
    reviewCount: 241,
    origin: "Honduras",
    size: "5 x 50 Robusto",
    wrapper: "Mexican San Andres",
    binder: "Honduran",
    filler: "Honduran & Nicaraguan",
    strength: "Medium",
    tastingNotes: ["Roasted Nuts", "Leather", "Oak", "Sweet Spice"],
    pairingSuggestions: ["Bourbon", "Espresso Martini", "Black Coffee"],
    images: [
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1611414199850-38910880e76e?auto=format&fit=crop&w=1200&q=80"
    ],
    badges: ["Lounge Favorite"],
    featured: true,
    categorySlugs: ["lounge-favorites", "best-sellers"]
  },
  {
    id: "prod-midnight-drop",
    name: "Midnight Drop Lancero",
    slug: "midnight-drop-lancero",
    sku: "YIS-MD-LAN",
    description:
      "A slender, concentrated profile with peppered cocoa and molasses depth. Small-batch nightly release.",
    price: 42,
    salePrice: null,
    stock: 12,
    rating: 4.95,
    reviewCount: 57,
    origin: "Nicaragua",
    size: "7.5 x 38 Lancero",
    wrapper: "Habano Maduro",
    binder: "Nicaraguan",
    filler: "Nicaraguan",
    strength: "Full",
    tastingNotes: ["Molasses", "Pepper", "Dark Chocolate", "Charred Oak"],
    pairingSuggestions: ["Rye Whiskey", "Negroni", "Cortado"],
    images: [
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1611414199850-38910880e76e?auto=format&fit=crop&w=1200&q=80"
    ],
    badges: ["New"],
    featured: true,
    newArrival: true,
    limitedEdition: true,
    categorySlugs: ["new-arrivals", "limited-editions"]
  },
  {
    id: "prod-ritual-petite",
    name: "Ritual Petite Corona",
    slug: "ritual-petite-corona",
    sku: "YIS-RP-COR",
    description:
      "Short-format cigar for polished breaks. Notes of cocoa cream, toast, and mild spice.",
    price: 19,
    salePrice: null,
    stock: 205,
    rating: 4.6,
    reviewCount: 98,
    origin: "Dominican Republic",
    size: "4.5 x 42 Petite Corona",
    wrapper: "Connecticut Shade",
    binder: "Dominican",
    filler: "Dominican",
    strength: "Mild",
    tastingNotes: ["Cocoa Cream", "Toasted Bread", "Cashew", "Vanilla"],
    pairingSuggestions: ["Cappuccino", "Cognac", "Oolong Tea"],
    images: [
      "https://images.unsplash.com/photo-1611414199850-38910880e76e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80"
    ],
    badges: ["Gift Pick"],
    featured: false,
    categorySlugs: ["gift-picks"]
  },
  {
    id: "prod-commandante-gordo",
    name: "Commandante Gordo",
    slug: "commandante-gordo",
    sku: "YIS-CMD-GOR",
    description:
      "Military-inspired bold blend with earth, spice, and leather. Commanding presence with smooth combustion.",
    price: 31,
    salePrice: null,
    stock: 65,
    rating: 4.85,
    reviewCount: 141,
    origin: "Nicaragua",
    size: "6 x 60 Gordo",
    wrapper: "Brazilian Maduro",
    binder: "Nicaraguan",
    filler: "Nicaraguan & Honduran",
    strength: "Full",
    tastingNotes: ["Earth", "Black Pepper", "Leather", "Dark Fruit"],
    pairingSuggestions: ["Bourbon", "Port Wine", "Double Espresso"],
    images: [
      "https://images.unsplash.com/photo-1611414199850-38910880e76e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80"
    ],
    badges: ["Best Seller"],
    featured: true,
    bestSeller: true,
    categorySlugs: ["best-sellers"]
  }
];

export const events: EventItem[] = [
  {
    id: "event-chicago-lounge-night",
    title: "Private Lounge Night: Chicago",
    slug: "private-lounge-night-chicago",
    description:
      "An intimate evening of curated pairings, live jazz, and first access to limited releases.",
    date: "2026-04-18T20:00:00.000Z",
    location: "River North Private Club, Chicago",
    capacity: 90,
    ticketPrice: 180,
    featuredImage:
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "event-vault-release",
    title: "The Vault Release Preview",
    slug: "vault-release-preview",
    description:
      "First taste of a collector-only blend released to members before public inventory opens.",
    date: "2026-05-05T19:00:00.000Z",
    location: "YISOS Private Tasting Room",
    capacity: 60,
    ticketPrice: 240,
    featuredImage:
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=80"
  }
];

export const membershipTiers: MembershipTier[] = [
  {
    id: "tier-black-label",
    name: "Black Label",
    monthlyPrice: 79,
    annualPrice: 790,
    perks: [
      "Early access to every limited drop",
      "Members-only pricing on core line",
      "Priority access to lounge events",
      "Quarterly curated pairing box"
    ]
  },
  {
    id: "tier-command-reserve",
    name: "Command Reserve",
    monthlyPrice: 149,
    annualPrice: 1490,
    perks: [
      "All Black Label benefits",
      "Private concierge ordering",
      "Exclusive annual reserve blend",
      "Complimentary event seat upgrades"
    ]
  }
];

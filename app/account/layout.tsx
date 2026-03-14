import { SectionSidebarNav } from "@/components/layout/section-sidebar-nav";

export const dynamic = "force-dynamic";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/favorites", label: "Favorites" },
  { href: "/account/notifications", label: "Notifications" }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[230px,1fr] md:px-8">
      <SectionSidebarNav label="Account" links={links} />
      <div>{children}</div>
    </div>
  );
}

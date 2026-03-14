import { requireAdmin } from "@/lib/services/auth-service";
import { SectionSidebarNav } from "@/components/layout/section-sidebar-nav";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/analytics", label: "Analytics" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[240px,1fr] md:px-8">
      <SectionSidebarNav label="Admin" links={links} />
      <div>{children}</div>
    </div>
  );
}

import { getAdminCustomers } from "@/lib/services/admin-service";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MembershipEventsManager } from "@/components/admin/membership-events-manager";

interface AdminCustomer {
  id: string;
  full_name: string | null;
  email: string | null;
  membership_tier: string | null;
  created_at: string;
}

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-4xl text-yisos-bone">Customers</h1>
      <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(customers as AdminCustomer[]).length ? (
              (customers as AdminCustomer[]).map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.full_name || "-"}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                  <TableCell>{customer.membership_tier || "none"}</TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-yisos-bone/70">
                  No customers found in Supabase.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <MembershipEventsManager />
    </div>
  );
}

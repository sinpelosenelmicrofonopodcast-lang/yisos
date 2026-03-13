import { getAdminOrders } from "@/lib/services/admin-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderManager } from "@/components/admin/order-manager";
import { CommerceManager } from "@/components/admin/commerce-manager";

interface AdminOrder {
  id: string;
  order_number: string;
  customer_email: string | null;
  total: number;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-4xl text-yisos-bone">Orders</h1>
      <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Fulfillment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(orders as AdminOrder[]).length ? (
              (orders as AdminOrder[]).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.customer_email || "Guest"}</TableCell>
                  <TableCell>{formatCurrency(Number(order.total || 0))}</TableCell>
                  <TableCell>{order.payment_status}</TableCell>
                  <TableCell>{order.fulfillment_status}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-yisos-bone/70">
                  No orders found in Supabase.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <OrderManager />
      <CommerceManager />
    </div>
  );
}

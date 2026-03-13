import { requireUser } from "@/lib/services/auth-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AccountOrder {
  id: string;
  order_number: string;
  total: number;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
}

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const orders = supabase
    ? (
        await supabase
          .from("orders")
          .select("id, order_number, total, payment_status, fulfillment_status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      ).data || []
    : [];

  return (
    <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-6">
      <h1 className="font-display text-4xl text-yisos-bone">Order History</h1>
      <div className="mt-5 space-y-3">
        {orders.length ? (
          (orders as AccountOrder[]).map((order) => (
            <div key={order.id} className="rounded-lg border border-border bg-yisos-black/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-yisos-bone">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.payment_status} • {order.fulfillment_status}
              </p>
              <p className="mt-2 text-lg font-semibold text-yisos-bone">{formatCurrency(Number(order.total || 0))}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

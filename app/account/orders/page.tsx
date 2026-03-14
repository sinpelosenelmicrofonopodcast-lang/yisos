import { requireUser } from "@/lib/services/auth-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-border bg-[linear-gradient(145deg,rgba(31,26,22,0.95),rgba(10,10,10,0.98))] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-yisos-gold">Account</p>
        <h1 className="mt-3 font-display text-4xl text-yisos-bone">Order History</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Review every order, confirm payment status, and keep track of what has shipped versus what is still being prepared.
        </p>
      </div>

      <div className="space-y-3">
        {orders.length ? (
          (orders as AccountOrder[]).map((order) => (
            <div key={order.id} className="rounded-[1.25rem] border border-border bg-yisos-charcoal/75 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl text-yisos-bone">{order.order_number}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <p className="text-xl font-semibold text-yisos-bone">{formatCurrency(Number(order.total || 0))}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="gold">{order.payment_status.replace(/_/g, " ")}</Badge>
                <Badge variant="outline">{order.fulfillment_status.replace(/_/g, " ")}</Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-border bg-yisos-charcoal/75 p-8">
            <p className="font-display text-3xl text-yisos-bone">No orders yet.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Once you check out, your payments and shipping progress will appear here.
            </p>
            <Button asChild variant="luxury" className="mt-5">
              <Link href="/shop">Shop The Collection</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

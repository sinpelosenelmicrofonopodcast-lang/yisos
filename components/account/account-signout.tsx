"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AccountSignout() {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={signOut}>
      Sign Out
    </Button>
  );
}

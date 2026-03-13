"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase auth is not configured.");
      return;
    }

    let mounted = true;

    const bootstrap = async () => {
      await supabase.auth.getSession();

      if (mounted) {
        setReady(true);
      }
    };

    void bootstrap();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase auth is not configured.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Password updated. You can now continue into your account.");
      window.location.href = "/account";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-6">
      <h1 className="font-display text-4xl text-yisos-bone">Reset Password</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Open this page from the password reset link in your email, then set a new password for your account.
      </p>

      {!ready ? (
        <div className="mt-6 rounded-xl border border-border bg-black/20 p-4 text-sm text-muted-foreground">
          Waiting for a valid recovery session. If you came here manually, use the reset link from your email.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-password">New Password</Label>
            <Input
              id="reset-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-password-confirm">Confirm New Password</Label>
            <Input
              id="reset-password-confirm"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
            Save New Password
          </Button>
        </form>
      )}

      {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

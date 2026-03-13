"use client";

import { useMemo, useState } from "react";
import { Check, KeyRound, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "signin" | "signup";
const PENDING_PROFILE_KEY = "yisos-pending-signup-profile";

function isAtLeast21(dateOfBirth: string) {
  const dob = new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(dob.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 21;
}

export function AccountSignin() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitLabel = useMemo(() => {
    return mode === "signin" ? "Sign In" : "Create Account";
  }, [mode]);

  const callbackUrl = typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/account` : "";

  const handlePasswordAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase auth is not configured. Add env keys to enable account login.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (mode === "signup" && (!fullName.trim() || !dateOfBirth)) {
      setMessage("Full name and date of birth are required.");
      return;
    }

    if (mode === "signup" && !isAtLeast21(dateOfBirth)) {
      setMessage("You must be at least 21 years old to create an account.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        window.location.href = "/account";
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            date_of_birth: dateOfBirth
          },
          emailRedirectTo: callbackUrl
        }
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        window.location.href = "/account";
        return;
      }

      setMessage("Account created. Check your email to verify your address, then sign in.");
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase auth is not configured. Add env keys to enable account login.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim() || !dateOfBirth) {
        setMessage("Full name and date of birth are required for sign up.");
        return;
      }

      if (!isAtLeast21(dateOfBirth)) {
        setMessage("You must be at least 21 years old to create an account.");
        return;
      }

      window.localStorage.setItem(
        PENDING_PROFILE_KEY,
        JSON.stringify({
          fullName: fullName.trim(),
          dateOfBirth,
          createdAt: Date.now()
        })
      );
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl
        }
      });

      if (error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase auth is not configured. Add env keys to enable account login.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: callbackUrl
        }
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Check your email for a secure magic link.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase auth is not configured. Add env keys to enable account login.");
      return;
    }

    if (!email) {
      setMessage("Enter your email first, then request a password reset.");
      return;
    }

    setLoading(true);

    try {
      const resetUrl = `${window.location.origin}/account/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Password reset email sent. Open the link in your inbox to choose a new password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-xl border border-border bg-yisos-charcoal/70 p-6">
      <div className="flex items-center gap-3 text-yisos-gold">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-xs uppercase tracking-[0.26em]">Account Access</span>
      </div>

      <div>
        <h2 className="font-display text-3xl text-yisos-bone">Sign In Or Create Account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use email and password as the primary flow. Google is available for faster access, and magic link remains optional.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-lg px-4 py-3 text-sm transition ${
            mode === "signin" ? "bg-yisos-gold/15 text-yisos-stitch" : "text-muted-foreground hover:text-yisos-bone"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-lg px-4 py-3 text-sm transition ${
            mode === "signup" ? "bg-yisos-gold/15 text-yisos-stitch" : "text-muted-foreground hover:text-yisos-bone"
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="grid gap-3 text-sm text-yisos-bone/78 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-black/20 p-4">
          <p className="flex items-center gap-2 font-medium text-yisos-stitch">
            <Sparkles className="h-4 w-4 text-yisos-gold" />
            Google OAuth
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Fastest path for returning customers and mobile users.</p>
        </div>
        <div className="rounded-xl border border-border bg-black/20 p-4">
          <p className="flex items-center gap-2 font-medium text-yisos-stitch">
            <Check className="h-4 w-4 text-yisos-gold" />
            Password Access
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Standard e-commerce auth flow for account, orders, and favorites.</p>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
        Continue With Google
      </Button>

      <form onSubmit={handlePasswordAuth} className="space-y-4">
        {mode === "signup" ? (
          <div className="space-y-2">
            <Label htmlFor="account-full-name">Full Name</Label>
            <Input
              id="account-full-name"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="account-email">Email</Label>
          <Input
            id="account-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        {mode === "signup" ? (
          <div className="space-y-2">
            <Label htmlFor="account-date-of-birth">Date Of Birth</Label>
            <Input
              id="account-date-of-birth"
              type="date"
              required
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="account-password">Password</Label>
          <Input
            id="account-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {mode === "signin" ? (
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-sm text-yisos-gold transition hover:text-yisos-bone"
            disabled={loading}
          >
            Forgot password?
          </button>
        ) : null}

        {mode === "signup" ? (
          <div className="space-y-2">
            <Label htmlFor="account-confirm-password">Confirm Password</Label>
            <Input
              id="account-confirm-password"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        ) : null}

        <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
          <KeyRound className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </form>

      <div className="rounded-xl border border-border bg-black/20 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-yisos-stitch">
          <Mail className="h-4 w-4 text-yisos-gold" />
          Magic Link Fallback
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Prefer passwordless access once in a while? Enter your email above and request a secure one-time sign-in link.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full"
          onClick={handleMagicLink}
          disabled={loading || !email}
        >
          Send Magic Link Instead
        </Button>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

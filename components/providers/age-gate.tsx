"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "yisos-age-verified";
const COOKIE_KEY = "yisos-age-verified";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function safeRead(storage: Storage | null, key: string) {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(storage: Storage | null, key: string, value: string) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // Ignore browsers that block storage access.
  }
}

function hasAgeApproval() {
  if (typeof window === "undefined") {
    return false;
  }

  const localApproved = safeRead(window.localStorage, STORAGE_KEY) === "true";
  const sessionApproved = safeRead(window.sessionStorage, STORAGE_KEY) === "true";
  const cookieApproved = document.cookie
    .split("; ")
    .some((entry) => entry.startsWith(`${COOKIE_KEY}=true`));

  return localApproved || sessionApproved || cookieApproved;
}

export function AgeGate() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const approved = hasAgeApproval();
    setOpen(!approved);
    setReady(true);
  }, []);

  const confirm = () => {
    safeWrite(window.localStorage, STORAGE_KEY, "true");
    safeWrite(window.sessionStorage, STORAGE_KEY, "true");
    document.cookie = `${COOKIE_KEY}=true; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {ready && open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel relative w-full max-w-xl overflow-hidden rounded-2xl border border-yisos-gold/30 p-8"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yisos-gold/10 blur-3xl" />
            <div className="mb-5 flex items-center gap-3 text-yisos-gold">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.26em]">Age Verification</span>
            </div>
            <h2 className="font-display text-4xl text-yisos-bone">Enter the Lounge</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              YISOS CIGARS serves only adults 21+. Confirm your age to continue into a private selection of premium cigars and limited releases.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="luxury" size="lg" onClick={confirm}>
                <Flame className="mr-2 h-4 w-4" />
                I Am 21+
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://www.google.com">Exit</a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

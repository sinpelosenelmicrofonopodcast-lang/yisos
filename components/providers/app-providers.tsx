"use client";

import { CartProvider } from "@/components/cart/cart-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AgeGate } from "@/components/providers/age-gate";
import { OneSignalPrompt } from "@/components/notifications/onesignal-prompt";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <AgeGate />
        <OneSignalPrompt />
      </CartProvider>
    </PostHogProvider>
  );
}

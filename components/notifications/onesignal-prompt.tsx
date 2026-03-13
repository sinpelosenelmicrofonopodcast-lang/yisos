"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OneSignalClient {
  init: (options: Record<string, unknown>) => Promise<void>;
  User: {
    PushSubscription: {
      optedIn: boolean;
      id?: string;
      addEventListener: (event: "change", cb: () => void) => void;
    };
  };
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalClient) => void>;
    OneSignal?: {
      Slidedown?: {
        promptPush: () => void;
      };
    };
  }
}

export function OneSignalPrompt() {
  const [available, setAvailable] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId) return;

    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    script.onload = () => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        await OneSignal.init({
          appId,
          notifyButton: { enable: false },
          serviceWorkerPath: "OneSignalSDKWorker.js",
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== "production"
        });

        const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
        setSubscribed(Boolean(isSubscribed));
        setAvailable(true);

        OneSignal.User.PushSubscription.addEventListener("change", async () => {
          const subId = OneSignal.User.PushSubscription.id;
          const optedIn = OneSignal.User.PushSubscription.optedIn;

          setSubscribed(Boolean(optedIn));

          if (subId) {
            await fetch("/api/push-subscriptions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscriptionId: subId, optedIn })
            });
          }
        });
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!available || subscribed) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm rounded-xl border border-yisos-gold/30 bg-yisos-charcoal/95 p-4 shadow-panel backdrop-blur">
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 h-5 w-5 text-yisos-gold" />
        <div>
          <p className="text-sm font-semibold text-yisos-bone">Get drop alerts first</p>
          <p className="mt-1 text-xs text-muted-foreground">Enable push notifications for limited releases and event invitations.</p>
          <Button
            className="mt-3"
            size="sm"
            variant="luxury"
            onClick={() => window.OneSignal?.Slidedown?.promptPush()}
          >
            Enable Notifications
          </Button>
        </div>
      </div>
    </div>
  );
}

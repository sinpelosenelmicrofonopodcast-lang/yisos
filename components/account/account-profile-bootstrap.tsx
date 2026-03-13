"use client";

import { useEffect } from "react";

const PENDING_PROFILE_KEY = "yisos-pending-signup-profile";

export function AccountProfileBootstrap() {
  useEffect(() => {
    const payload = window.localStorage.getItem(PENDING_PROFILE_KEY);

    if (!payload) {
      return;
    }

    const run = async () => {
      try {
        const data = JSON.parse(payload) as {
          fullName?: string;
          dateOfBirth?: string;
          createdAt?: number;
        };

        if (!data.fullName || !data.dateOfBirth) {
          window.localStorage.removeItem(PENDING_PROFILE_KEY);
          return;
        }

        if (data.createdAt && Date.now() - data.createdAt > 1000 * 60 * 60) {
          window.localStorage.removeItem(PENDING_PROFILE_KEY);
          return;
        }

        const response = await fetch("/api/account/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: data.fullName,
            dateOfBirth: data.dateOfBirth
          })
        });

        if (response.ok) {
          window.localStorage.removeItem(PENDING_PROFILE_KEY);
          window.location.reload();
        }
      } catch {
        window.localStorage.removeItem(PENDING_PROFILE_KEY);
      }
    };

    void run();
  }, []);

  return null;
}

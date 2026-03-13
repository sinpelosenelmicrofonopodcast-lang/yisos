"use client";

import { useEffect, useState } from "react";

function getTimeLeft(targetDate: string) {
  const distance = new Date(targetDate).getTime() - Date.now();

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
}

export function DropCountdown({
  targetDate = "2026-04-25T20:00:00.000Z"
}: {
  targetDate?: string;
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ];

  return (
    <div className="surface-1 rounded-2xl border border-yisos-gold/20 p-5">
      <p className="text-xs uppercase tracking-[0.32em] text-yisos-gold">Next Private Drop</p>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border/80 bg-black/20 p-3 text-center">
            <div className="font-display text-3xl text-yisos-stitch md:text-4xl">
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-yisos-bone/65">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

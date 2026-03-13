"use client";

import { useState } from "react";
import { Send, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickPrompts = [
  "Recommend a cigar for a whiskey night",
  "I need cigars for a private event",
  "Help me choose a luxury gift set"
];

const conciergeReplies: Record<string, string> = {
  "Recommend a cigar for a whiskey night":
    "For whiskey service tonight, start with a medium-full Toro that brings cedar, cocoa, and a slower finish. Imperial Noir is the strongest fit.",
  "I need cigars for a private event":
    "For events, curate three strengths: an approachable opening blend, a lounge favorite, and one full-bodied closer. We can build that mix around your guest count.",
  "Help me choose a luxury gift set":
    "For gifting, use Gold Reserve or a limited release box with a digital card. It lands better than a generic sampler."
};

export function ConciergeExperience() {
  const [message, setMessage] = useState("");
  const [selectedReply, setSelectedReply] = useState(conciergeReplies[quickPrompts[0]]);

  const submitMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setSelectedReply(
      "A concierge specialist would start with your preferred strength, the setting, and what you are pairing tonight. For now, I would guide you toward a medium-full lounge profile and a reserve option."
    );
    setMessage("");
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <SectionHeading
          eyebrow="Concierge"
          title="Private Guidance, Like A Members Lounge Host"
          description="Not every customer wants to browse. Some want a recommendation with taste, context, and confidence. This is where YISOS feels like service."
        />
        <div className="surface-2 rounded-[28px] border border-yisos-gold/20 p-6 shadow-panel">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-yisos-gold">Concierge Line</p>
              <p className="mt-1 font-display text-2xl text-yisos-stitch">YISOS Private Recommendations</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-yisos-bone/75">
              <ShieldCheck className="h-3.5 w-3.5 text-yisos-gold" />
              Response Style
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm border border-yisos-gold/20 bg-yisos-gold/10 px-4 py-3 text-sm text-yisos-stitch">
              I want something for tonight. Whiskey, low light, two hours.
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-border/80 bg-black/25 px-4 py-3 text-sm leading-7 text-yisos-bone/80">
              {selectedReply}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSelectedReply(conciergeReplies[prompt])}
                className="rounded-full border border-border/80 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.18em] text-yisos-bone/75 transition hover:border-yisos-gold/40 hover:text-yisos-stitch"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={submitMessage} className="mt-6 flex gap-3">
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask for event, gifting, or pairing guidance"
              className="h-12"
            />
            <Button type="submit" variant="luxury" className="h-12 px-5">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </form>

          <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-yisos-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Concierge ordering available to VIP Cellar members
          </div>
        </div>
      </div>
    </section>
  );
}

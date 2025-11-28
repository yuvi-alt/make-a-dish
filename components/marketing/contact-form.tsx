"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      sentAt: new Date().toISOString(),
    };
    console.log("[ContactForm] Submission", payload);
    setStatus("success");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-surface space-y-5 p-6">
      <div>
        <label className="text-sm font-semibold text-brand-charcoal" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-brand-charcoal/10 bg-white/80 px-4 py-3 text-base shadow-inner shadow-white/40 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/50"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-charcoal" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-brand-charcoal/10 bg-white/80 px-4 py-3 text-base shadow-inner shadow-white/40 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/50"
          placeholder="hello@example.com"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-charcoal" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-2 w-full rounded-2xl border border-brand-charcoal/10 bg-white/80 px-4 py-3 text-base shadow-inner shadow-white/40 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/50"
          placeholder="Tell us about your food business..."
        />
      </div>
      <Button type="submit" className="w-full">
        {status === "success" ? "Message sent — we'll reply soon" : "Send message"}
      </Button>
    </form>
  );
}


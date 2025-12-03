"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin/registrations");
        router.refresh();
      } else {
        setError(data.error || "Invalid email address");
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
      <div className="glass-surface w-full rounded-[32px] bg-white/90 p-8 shadow-brand">
        <h1 className="mb-6 text-2xl font-semibold text-brand-charcoal">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-brand-charcoal">
              Admin Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your admin email"
            />
            <p className="mt-2 text-xs text-brand-charcoal/60">
              Enter the email address set in ADMIN_EMAIL environment variable
            </p>
          </div>
          {error && (
            <p className="text-sm text-[#C2483C]">{error}</p>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}


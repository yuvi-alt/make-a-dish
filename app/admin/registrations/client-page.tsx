"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Registration = {
  registrationId: string;
  email?: string;
  postcode?: string;
  entityType?: { entityType: string };
  submittedAt?: string;
};

type AdminRegistrationsClientProps = {
  registrations: Registration[];
};

export function AdminRegistrationsClient({
  registrations: initialRegistrations,
}: AdminRegistrationsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState(initialRegistrations);

  // Normalize registration data
  const normalizedRegistrations = useMemo(() => {
    return registrations.map((reg: any) => {
      let postcode = "";
      if (typeof reg.postcode === "string") {
        postcode = reg.postcode;
      } else if (reg.postcode && typeof reg.postcode === "object") {
        postcode = reg.postcode.postcode || "";
      }
      
      let email = "";
      if (typeof reg.email === "string") {
        email = reg.email;
      }
      
      let entityTypeStr = "Not provided";
      if (reg.entityType) {
        if (typeof reg.entityType === "object" && reg.entityType !== null && "entityType" in reg.entityType) {
          entityTypeStr = String(reg.entityType.entityType || "Not provided");
        } else if (typeof reg.entityType === "string") {
          entityTypeStr = reg.entityType;
        }
      }
      
      const submittedAt = typeof reg.submittedAt === "string" ? reg.submittedAt : undefined;
      
      return {
        registrationId: String(reg.registrationId || ""),
        email: email || "Not provided",
        postcode: postcode || "Not provided",
        entityType: entityTypeStr,
        submittedAt,
      };
    });
  }, [registrations]);

  // Filter registrations based on search query
  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) {
      return normalizedRegistrations;
    }

    const query = searchQuery.toLowerCase();
    return normalizedRegistrations.filter((reg) => {
      return (
        reg.email.toLowerCase().includes(query) ||
        reg.postcode.toLowerCase().includes(query) ||
        reg.entityType.toLowerCase().includes(query) ||
        reg.registrationId.toLowerCase().includes(query) ||
        (reg.submittedAt &&
          new Date(reg.submittedAt).toLocaleDateString().toLowerCase().includes(query))
      );
    });
  }, [normalizedRegistrations, searchQuery]);

  // Sort by submitted date (newest first)
  const sortedRegistrations = useMemo(() => {
    return [...filteredRegistrations].sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [filteredRegistrations]);

  const handleDelete = async (registrationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete registration ${registrationId}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(registrationId);

    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete registration");
      }

      // Remove from local state
      setRegistrations((prev) =>
        prev.filter((reg) => reg.registrationId !== registrationId),
      );

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete registration. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-brand-charcoal">All Registrations</h1>
            <p className="mt-2 text-lg text-brand-charcoal/70">
              {sortedRegistrations.length} of {normalizedRegistrations.length} registration
              {normalizedRegistrations.length !== 1 ? "s" : ""} found
              {searchQuery && ` (filtered)`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/test-email"
              className="text-sm font-semibold text-brand-tangerine underline underline-offset-4"
            >
              Test Email
            </Link>
            <Link
              href="/admin/logout"
              className="text-sm font-semibold text-brand-tangerine underline underline-offset-4"
            >
              Logout
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by email, postcode, business type, registration ID, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {sortedRegistrations.length === 0 ? (
          <p className="text-lg text-brand-charcoal/70">
            {searchQuery
              ? "No registrations match your search."
              : "No registrations found."}
          </p>
        ) : (
          <div className="space-y-4">
            {sortedRegistrations.map((registration) => (
              <div
                key={registration.registrationId}
                className="group relative glass-surface rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft transition hover:shadow-brand"
              >
                <Link
                  href={`/admin/registrations/${registration.registrationId}`}
                  className="block"
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                        Email
                      </p>
                      <p className="mt-1 text-base font-medium text-brand-charcoal">
                        {registration.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                        Postcode
                      </p>
                      <p className="mt-1 text-base font-medium text-brand-charcoal">
                        {registration.postcode || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                        Business Type
                      </p>
                      <p className="mt-1 text-base font-medium text-brand-charcoal">
                        {registration.entityType || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                        Submitted
                      </p>
                      <p className="mt-1 text-base font-medium text-brand-charcoal">
                        {registration.submittedAt
                          ? new Date(registration.submittedAt).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="destructive"
                  onClick={(e) => handleDelete(registration.registrationId, e)}
                  disabled={deletingId === registration.registrationId}
                  className="absolute right-4 top-4 text-xs px-3 py-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  {deletingId === registration.registrationId ? "Deleting..." : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


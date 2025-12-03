"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Trash2,
  Printer,
  CheckSquare,
  Square,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ENTITY_OPTIONS } from "@/lib/steps";
import { Toast } from "@/components/ui/toast";

// Simple toast hook
function useSimpleToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}

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

const ITEMS_PER_PAGE = 20;

export function AdminRegistrationsClient({
  registrations: initialRegistrations,
}: AdminRegistrationsClientProps) {
  const router = useRouter();
  const { toasts, showToast, removeToast } = useSimpleToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        if (
          typeof reg.entityType === "object" &&
          reg.entityType !== null &&
          "entityType" in reg.entityType
        ) {
          entityTypeStr = String(reg.entityType.entityType || "Not provided");
        } else if (typeof reg.entityType === "string") {
          entityTypeStr = reg.entityType;
        }
      }

      const submittedAt =
        typeof reg.submittedAt === "string" ? reg.submittedAt : undefined;

      return {
        registrationId: String(reg.registrationId || ""),
        email: email || "Not provided",
        postcode: postcode || "Not provided",
        entityType: entityTypeStr,
        submittedAt,
      };
    });
  }, [registrations]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    let filtered = normalizedRegistrations;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((reg) => {
        return (
          reg.email.toLowerCase().includes(query) ||
          reg.postcode.toLowerCase().includes(query) ||
          reg.entityType.toLowerCase().includes(query) ||
          reg.registrationId.toLowerCase().includes(query) ||
          (reg.submittedAt &&
            new Date(reg.submittedAt)
              .toLocaleDateString()
              .toLowerCase()
              .includes(query))
        );
      });
    }

    // Entity type filter
    if (entityFilter) {
      filtered = filtered.filter((reg) => reg.entityType === entityFilter);
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom).setHours(0, 0, 0, 0);
      filtered = filtered.filter((reg) => {
        if (!reg.submittedAt) return false;
        const regDate = new Date(reg.submittedAt).setHours(0, 0, 0, 0);
        return regDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo).setHours(23, 59, 59, 999);
      filtered = filtered.filter((reg) => {
        if (!reg.submittedAt) return false;
        const regDate = new Date(reg.submittedAt).getTime();
        return regDate <= toDate;
      });
    }

    return filtered;
  }, [
    normalizedRegistrations,
    searchQuery,
    entityFilter,
    dateFrom,
    dateTo,
  ]);

  // Sort by submitted date (newest first)
  const sortedRegistrations = useMemo(() => {
    return [...filteredRegistrations].sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [filteredRegistrations]);

  // Pagination
  const totalPages = Math.ceil(sortedRegistrations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRegistrations = sortedRegistrations.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, entityFilter, dateFrom, dateTo]);

  const handleDelete = async (registrationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        `Are you sure you want to delete registration ${registrationId}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(registrationId);

    try {
      const response = await fetch(
        `/api/admin/registrations/${registrationId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete registration");
      }

      setRegistrations((prev) =>
        prev.filter((reg) => reg.registrationId !== registrationId),
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(registrationId);
        return next;
      });

      router.refresh();
      showToast("Registration deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting registration:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete registration. Please try again.",
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      showToast("No registrations selected", "info");
      return;
    }

    const count = selectedIds.size;
    if (
      !confirm(
        `Are you sure you want to delete ${count} registration${count > 1 ? "s" : ""}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setBulkDeleting(true);

    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/registrations/${id}`, {
          method: "DELETE",
        }),
      );

      const results = await Promise.all(deletePromises);
      const failed = results.filter((r) => !r.ok);

      if (failed.length > 0) {
        throw new Error(
          `Failed to delete ${failed.length} registration${failed.length > 1 ? "s" : ""}`,
        );
      }

      setRegistrations((prev) =>
        prev.filter((reg) => !selectedIds.has(reg.registrationId)),
      );
      setSelectedIds(new Set());
      router.refresh();

      showToast(
        `Successfully deleted ${count} registration${count > 1 ? "s" : ""}`,
        "success",
      );
    } catch (error) {
      console.error("Error bulk deleting:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete registrations. Please try again.",
        "error",
      );
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/registrations/export");
      if (!response.ok) {
        throw new Error("Failed to export registrations");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast("Registrations exported successfully", "success");
    } catch (error) {
      console.error("Error exporting:", error);
      showToast("Failed to export registrations", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleCopyId = async (registrationId: string) => {
    try {
      await navigator.clipboard.writeText(registrationId);
      setCopiedId(registrationId);
      showToast("Registration ID copied to clipboard", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Error copying:", error);
      showToast("Failed to copy registration ID", "error");
    }
  };

  const handlePrint = (registrationId: string) => {
    window.open(`/admin/registrations/${registrationId}/print`, "_blank");
  };

  const toggleSelect = (registrationId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(registrationId)) {
        next.delete(registrationId);
      } else {
        next.add(registrationId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedRegistrations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRegistrations.map((r) => r.registrationId)));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setEntityFilter("");
    setDateFrom("");
    setDateTo("");
    setShowFilters(false);
  };

  const hasActiveFilters =
    searchQuery || entityFilter || dateFrom || dateTo;

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-brand-charcoal">
                All Registrations
              </h1>
              <p className="mt-2 text-lg text-brand-charcoal/70">
                {sortedRegistrations.length} of{" "}
                {normalizedRegistrations.length} registration
                {normalizedRegistrations.length !== 1 ? "s" : ""} found
                {hasActiveFilters && " (filtered)"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </Button>
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

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Search by email, postcode, business type, registration ID, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-brand-tangerine px-2 py-0.5 text-xs text-white">
                    {[
                      searchQuery,
                      entityFilter,
                      dateFrom,
                      dateTo,
                    ].filter(Boolean).length}
                  </span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="glass-surface rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-brand-charcoal/70">
                      Entity Type
                    </label>
                    <select
                      value={entityFilter}
                      onChange={(e) => setEntityFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-tangerine/20"
                    >
                      <option value="">All Types</option>
                      {ENTITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-brand-charcoal/70">
                      From Date
                    </label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-brand-charcoal/70">
                      To Date
                    </label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-peach/20 p-4">
              <span className="font-semibold text-brand-charcoal">
                {selectedIds.size} registration
                {selectedIds.size > 1 ? "s" : ""} selected
              </span>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {bulkDeleting ? "Deleting..." : "Delete Selected"}
              </Button>
            </div>
          )}

          {sortedRegistrations.length === 0 ? (
            <p className="text-lg text-brand-charcoal/70">
              {hasActiveFilters
                ? "No registrations match your filters."
                : "No registrations found."}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedRegistrations.map((registration) => (
                  <div
                    key={registration.registrationId}
                    className="group relative glass-surface rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft transition hover:shadow-brand"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(registration.registrationId);
                        }}
                        className="mt-1"
                      >
                        {selectedIds.has(registration.registrationId) ? (
                          <CheckSquare className="h-5 w-5 text-brand-tangerine" />
                        ) : (
                          <Square className="h-5 w-5 text-brand-charcoal/40" />
                        )}
                      </button>
                      <Link
                        href={`/admin/registrations/${registration.registrationId}`}
                        className="flex-1"
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
                                ? new Date(
                                    registration.submittedAt,
                                  ).toLocaleDateString()
                                : "Not available"}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyId(registration.registrationId);
                          }}
                          className="rounded-lg p-2 text-brand-charcoal/60 transition hover:bg-brand-cream hover:text-brand-tangerine"
                          title="Copy Registration ID"
                        >
                          {copiedId === registration.registrationId ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(registration.registrationId);
                          }}
                          className="rounded-lg p-2 text-brand-charcoal/60 transition hover:bg-brand-cream hover:text-brand-tangerine"
                          title="Print"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) =>
                            handleDelete(registration.registrationId, e)
                          }
                          disabled={deletingId === registration.registrationId}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          {deletingId === registration.registrationId ? (
                            "Deleting..."
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-brand-charcoal/70">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, sortedRegistrations.length)} of{" "}
                    {sortedRegistrations.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2),
                        )
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center gap-1">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-brand-charcoal/40">
                                ...
                              </span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => setCurrentPage(page)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          </div>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Select All */}
              {paginatedRegistrations.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-sm text-brand-charcoal/70 hover:text-brand-tangerine"
                  >
                    {selectedIds.size === paginatedRegistrations.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    Select All (Page)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
}

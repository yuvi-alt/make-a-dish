"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/logout", { method: "POST" })
      .then(() => {
        router.push("/admin/login");
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
      <p className="text-brand-charcoal">Logging out...</p>
    </div>
  );
}


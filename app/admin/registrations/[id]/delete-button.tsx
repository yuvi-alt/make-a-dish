"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteRegistrationButton({
  registrationId,
}: {
  registrationId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete registration ${registrationId}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete registration");
      }

      // Redirect to registrations list
      router.push("/admin/registrations");
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete registration. Please try again.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
      className="mt-4"
    >
      {isDeleting ? "Deleting..." : "Delete Registration"}
    </Button>
  );
}


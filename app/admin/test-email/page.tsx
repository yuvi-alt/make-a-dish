"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    config?: Record<string, string>;
  } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
      });

      const data = await response.json();

      setResult({
        success: data.success,
        message: data.message,
        error: data.error,
        config: data.config,
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to test email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-brand-charcoal">
              Test Email Configuration
            </h1>
            <p className="mt-2 text-lg text-brand-charcoal/70">
              Send a test email to verify your email configuration is working
            </p>
          </div>
          <Link
            href="/admin/registrations"
            className="text-sm font-semibold text-brand-tangerine underline underline-offset-4"
          >
            ← Back to Registrations
          </Link>
        </div>

        <div className="space-y-6">
          <Button onClick={handleTest} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Sending Test Email..." : "Send Test Email"}
          </Button>

          {result && (
            <div
              className={`rounded-2xl border p-6 ${
                result.success
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <h2
                className={`mb-4 text-xl font-semibold ${
                  result.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {result.success ? "✅ Success" : "❌ Error"}
              </h2>

              {result.message && (
                <p className={`mb-4 ${result.success ? "text-green-700" : "text-red-700"}`}>
                  {result.message}
                </p>
              )}

              {result.error && (
                <div className="mb-4">
                  <p className="font-semibold text-red-800">Error Details:</p>
                  <p className="text-red-700">{result.error}</p>
                </div>
              )}

              {result.config && (
                <div className="mt-4">
                  <p className="mb-2 font-semibold text-brand-charcoal">
                    Email Configuration Status:
                  </p>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(result.config).map(([key, value]) => (
                      <li key={key} className="text-brand-charcoal/80">
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-3 font-semibold text-blue-900">Setup Instructions:</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-blue-800">
              <li>Make sure you have set all email environment variables in your <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
              <li>For Gmail, you need to use an "App Password" (not your regular password)</li>
              <li>To generate an App Password: Google Account → Security → 2-Step Verification → App Passwords</li>
              <li>Check your spam folder if the email doesn't arrive</li>
              <li>Check server logs for detailed error messages</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}


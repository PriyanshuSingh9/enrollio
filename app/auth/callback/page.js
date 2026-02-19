"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function CallbackContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const setupAndRedirect = async () => {
      if (role && (role === "user" || role === "admin")) {
        // New sign-up — set the role via API
        await fetch("/api/auth/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });
      }

      // Redirect based on role
      const activeRole = role || user.publicMetadata?.role || "user";
      router.push(activeRole === "admin" ? "/admin" : "/home");
    };

    setupAndRedirect();
  }, [isLoaded, user, role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm font-light">Setting up your account…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

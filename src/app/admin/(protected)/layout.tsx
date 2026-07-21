"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "@/components/icons";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-ink">
        <Loader2 className="animate-spin text-neon" size={28} />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-ink sm:flex-row">
      <AdminSidebar />
      <div className="flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { siteConfig } from "@/lib/site-config";

export default function AdminLoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-ink px-4 py-20">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5"
      >
        <p className="font-display text-2xl tracking-[0.15em] text-neon">
          {siteConfig.name}
        </p>
        <h1 className="font-display text-lg tracking-[0.1em] text-off-white">
          ACCESO ADMINISTRADOR
        </h1>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Correo</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Contraseña</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
          />
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-solid w-full"
        >
          {submitting ? "ENTRANDO..." : "ENTRAR"}
        </button>
      </form>
    </div>
  );
}

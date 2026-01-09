"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

async function updateProfile(payload: {
  email?: string;
  currentPassword: string;
  newPassword?: string;
}) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? "No se pudo actualizar");
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  if (!session?.user) {
    redirect("/login");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!currentPassword) {
      setError("Ingresa tu contraseña actual");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!email && !newPassword) {
      setError("No hay cambios para aplicar");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        email: email || undefined,
        currentPassword,
        newPassword: newPassword || undefined,
      });
      setMessage("Datos actualizados");
      if (newPassword || email !== session?.user?.email) {
        // Refrescar sesión forzando signOut para re-login con credenciales nuevas
        await signOut({ callbackUrl: "/login" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">Perfil</p>
            <h2 className="text-xl font-semibold text-foreground">Cambiar Datos</h2>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Para modificar datos debes confirmar tu contraseña actual. Si cambias correo o contraseña, se cerrará la sesión.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-white/90 p-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="email">Nuevo correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="correo@empresa.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="currentPassword">Contraseña actual (requerida)</label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="newPassword">Nueva contraseña</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Repite la nueva contraseña"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail(session?.user?.email ?? "");
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setError(null);
              setMessage(null);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/60"
          >
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}

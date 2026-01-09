import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white/80 px-5 py-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-primary">Meet Rooms</p>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
            <Link className="rounded-lg px-3 py-2 hover:bg-primary/10 hover:text-primary" href="/dashboard/reservations">
              Reservas
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-primary/10 hover:text-primary" href="/dashboard/rooms">
              Salas
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-primary/10 hover:text-primary" href="/dashboard/profile">
              Perfil
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-primary/10 hover:text-primary" href="/">
              Inicio
            </Link>
            <div className="h-6 w-px bg-border" aria-hidden />
            <LogoutButton />
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}

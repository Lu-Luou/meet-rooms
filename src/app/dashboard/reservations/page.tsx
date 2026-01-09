import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: session.user.id },
    include: { room: true },
    orderBy: { startTime: "asc" },
  });

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">Reservas</p>
            <h2 className="text-xl font-semibold text-foreground">Listado y gestión</h2>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {reservations.length} reservas
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Tus reservas en orden cronológico. Próximamente podrás editarlas y cancelarlas desde aquí.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white/60 p-10 text-center text-sm text-muted-foreground">
          No tienes reservas aún. Crea la primera desde el flujo de creación.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white/90 shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-border text-sm text-foreground">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="grid gap-3 p-4 sm:grid-cols-[1.1fr_0.9fr_0.8fr] sm:items-center">
                <div className="space-y-1">
                  <p className="text-base font-semibold">{reservation.title}</p>
                  {reservation.description && <p className="text-xs text-muted-foreground">{reservation.description}</p>}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">{reservation.room.name}</p>
                  <p>
                    {formatDate(reservation.startTime)} · {formatTime(reservation.startTime)} — {formatTime(reservation.endTime)}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>ID: {reservation.id.slice(0, 8)}</p>
                  <p>Creada: {formatDate(reservation.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

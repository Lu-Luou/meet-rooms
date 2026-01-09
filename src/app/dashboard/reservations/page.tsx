import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ReservationsList } from "@/components/reservations/reservations-list";
import { ReservationFormModal } from "@/components/reservations/reservation-form-modal";

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const rooms = await prisma.room.findMany({
    orderBy: [{ location: "asc" }, { name: "asc" }],
  });

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
          Crea, consulta y cancela tus reservas. Las validaciones de disponibilidad se aplican automáticamente.
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Tus reservas</h3>
          <ReservationFormModal
            mode="create"
            rooms={rooms}
            triggerLabel="Nueva reserva"
            submitLabel="Crear reserva"
          />
        </div>
        <ReservationsList reservations={reservations} rooms={rooms} />
      </div>
    </section>
  );
}

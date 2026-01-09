import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function RoomsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">Salas</p>
            <h2 className="text-xl font-semibold text-foreground">Disponibilidad y detalles</h2>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {rooms.length} salas
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Consulta disponibilidad de horarios y detalles de cada sala registrada en el sistema.
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white/60 p-10 text-center text-sm text-muted-foreground">
          No hay salas registradas aún. Agrega salas desde tu seed o un flujo de administración.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-xl border border-border bg-white/90 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-primary">{room.location ?? "Sin ubicación"}</p>
                  <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                  {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Capacidad: {room.capacity} Personas
                </span>
              </div>
              {room.amenities.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

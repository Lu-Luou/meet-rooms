"use client";

import type { Reservation, Room } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReservationFormModal } from "./reservation-form-modal";

type ReservationWithRoom = Reservation & { room: Room };

function formatDateRange(reservation: ReservationWithRoom) {
  const start = new Date(reservation.startTime);
  const end = new Date(reservation.endTime);
  const formatter = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function ReservationsList({ reservations, rooms }: { reservations: ReservationWithRoom[]; rooms: Room[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setError(null);
    setLoadingId(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo eliminar la reserva");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la reserva");
    } finally {
      setLoadingId(null);
    }
  };

  if (reservations.length === 0) {
    return <p className="rounded-xl border border-dashed border-border bg-white/60 p-6 text-sm text-muted-foreground">Sin reservas aún. Crea tu primera reserva.</p>;
  }

  return (
    <div className="space-y-3">
      {reservations.map((reservation) => (
        <article key={reservation.id} className="flex items-start justify-between rounded-xl border border-border bg-white/80 p-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{reservation.room.name} · {reservation.room.location ?? "Sin ubicación"}</p>
            <h3 className="text-lg font-semibold text-foreground">{reservation.title}</h3>
            <p className="text-sm text-muted-foreground">{formatDateRange(reservation)}</p>
            {reservation.description && <p className="text-sm text-foreground">{reservation.description}</p>}
          </div>
          <div className="flex gap-2">
            <ReservationFormModal
              mode="edit"
              rooms={rooms}
              triggerLabel="Editar"
              submitLabel="Guardar cambios"
              reservationId={reservation.id}
              triggerClassName="rounded-lg border border-blue-200 bg-white px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60 shadow-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              initial={{
                title: reservation.title,
                description: reservation.description ?? "",
                date: toDateInputValue(new Date(reservation.startTime)),
                start: toTimeInputValue(new Date(reservation.startTime)),
                end: toTimeInputValue(new Date(reservation.endTime)),
                roomId: reservation.roomId,
              }}
            />
            <button
              onClick={() => handleDelete(reservation.id)}
              disabled={loadingId === reservation.id}
              className="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {loadingId === reservation.id ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </article>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

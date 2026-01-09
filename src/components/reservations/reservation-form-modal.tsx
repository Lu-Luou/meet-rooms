"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Room } from "@prisma/client";

type Mode = "create" | "edit";

type ReservationFormModalProps = {
  mode: Mode;
  rooms: Room[];
  triggerLabel: string;
  submitLabel: string;
  reservationId?: string;
  initial?: {
    title: string;
    description: string;
    date: string;
    start: string;
    end: string;
    roomId: string;
  };
  triggerClassName?: string;
};

function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ReservationFormModal({
  mode,
  rooms,
  triggerLabel,
  submitLabel,
  reservationId,
  initial,
  triggerClassName,
}: ReservationFormModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [start, setStart] = useState(initial?.start ?? "09:00");
  const [end, setEnd] = useState(initial?.end ?? "10:00");
  const [roomId, setRoomId] = useState(initial?.roomId ?? rooms[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const disabled = rooms.length === 0;

  useEffect(() => {
    if (open && initial) {
      setTitle(initial.title);
      setDescription(initial.description ?? "");
      setDate(initial.date);
      setStart(initial.start);
      setEnd(initial.end);
      setRoomId(initial.roomId);
    }
  }, [open, initial]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!roomId) {
      setError("Selecciona una sala");
      return;
    }

    setLoading(true);
    try {
      const body = { title, description, date, start, end, roomId };
      const response = await fetch(mode === "create" ? "/api/reservations" : `/api/reservations/${reservationId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? (mode === "create" ? "No se pudo crear la reserva" : "No se pudo actualizar la reserva"));
      }

      setMessage(mode === "create" ? "Reserva creada" : "Reserva actualizada");
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setDate(todayISO());
        setStart("09:00");
        setEnd("10:00");
        setRoomId(rooms[0]?.id ?? "");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setLoading(false);
    }
  };

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60 ${triggerClassName ?? ""}`.trim()}
      >
        {triggerLabel}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
          setMessage(null);
        }}
        className={`rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 ${triggerClassName ?? ""}`.trim()}
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{mode === "create" ? "Crea una nueva reserva" : "Actualiza esta reserva"}</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="title">Nombre del evento</label>
                  <input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Reunión semanal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="room">Sala</label>
                  <select
                    id="room"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="" disabled>Selecciona una sala</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} · {room.location ?? "Sin ubicación"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="date">Fecha</label>
                  <input
                    id="date"
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="start">Inicio</label>
                  <input
                    id="start"
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="end">Fin</label>
                  <input
                    id="end"
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="description">Notas (opcional)</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={500}
                  placeholder="Contexto, agenda o enlaces"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-emerald-600">{message}</p>}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Guardando..." : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

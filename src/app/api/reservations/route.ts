import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations";

function toDate(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: session.user.id },
    include: { room: true },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reservationSchema.parse(body);

    const start = toDate(parsed.date, parsed.start);
    const end = toDate(parsed.date, parsed.end);

    if (end <= start) {
      return NextResponse.json({ error: "La hora de término debe ser posterior" }, { status: 400 });
    }

    if (start < new Date()) {
      return NextResponse.json({ error: "No podes crear reservas en el pasado" }, { status: 400 });
    }

    const conflict = await prisma.reservation.findFirst({
      where: {
        roomId: parsed.roomId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      return NextResponse.json({ error: "La sala no está disponible en ese horario" }, { status: 409 });
    }

    const created = await prisma.reservation.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        startTime: start,
        endTime: end,
        userId: session.user.id,
        roomId: parsed.roomId,
      },
      include: { room: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      return NextResponse.json({ error: issue?.message ?? "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "No se pudo crear la reserva" }, { status: 400 });
  }
}

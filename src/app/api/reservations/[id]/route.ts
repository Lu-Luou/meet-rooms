import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations";

function toDate(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reservationSchema.parse(body);

    const existing = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const start = toDate(parsed.date, parsed.start);
    const end = toDate(parsed.date, parsed.end);

    if (end <= start) {
      return NextResponse.json({ error: "La hora de término debe ser posterior" }, { status: 400 });
    }

    if (start < new Date()) {
      return NextResponse.json({ error: "No podes mover la reserva al pasado" }, { status: 400 });
    }

    const conflict = await prisma.reservation.findFirst({
      where: {
        roomId: parsed.roomId,
        startTime: { lt: end },
        endTime: { gt: start },
        NOT: { id: params.id },
      },
    });

    if (conflict) {
      return NextResponse.json({ error: "La sala no está disponible en ese horario" }, { status: 409 });
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        title: parsed.title,
        description: parsed.description,
        startTime: start,
        endTime: end,
        roomId: parsed.roomId,
      },
      include: { room: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      return NextResponse.json({ error: issue?.message ?? "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const existing = await prisma.reservation.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await prisma.reservation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

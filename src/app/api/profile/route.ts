import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.hashedPassword) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const valid = await bcrypt.compare(parsed.currentPassword, user.hashedPassword);
    if (!valid) {
      return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
    }

    const data: { email?: string; hashedPassword?: string } = {};

    if (parsed.email && parsed.email !== user.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: parsed.email } });
      if (emailTaken) {
        return NextResponse.json({ error: "El correo ya está en uso" }, { status: 409 });
      }
      data.email = parsed.email;
    }

    if (parsed.newPassword) {
      data.hashedPassword = await bcrypt.hash(parsed.newPassword, 10);
    }

    if (!data.email && !data.hashedPassword) {
      return NextResponse.json({ error: "No hay cambios para aplicar" }, { status: 400 });
    }

    await prisma.user.update({ where: { id: user.id }, data });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

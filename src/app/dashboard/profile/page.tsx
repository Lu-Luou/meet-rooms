import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">Perfil</p>
            <h2 className="text-xl font-semibold text-foreground">Cambiar datos</h2>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Próximamente</span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Aquí podrás actualizar tu nombre, correo o contraseña. Implementa tu formulario seguro cuando estés listo.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-white/60 p-10 text-center text-sm text-muted-foreground">
        Sección placeholder. Conecta mutaciones de Prisma y validaciones cuando definas el flujo de perfil.
      </div>
    </section>
  );
}

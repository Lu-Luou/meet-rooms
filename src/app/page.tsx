import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const highlights = [
  "Autenticación con NextAuth",
  "Base de datos Prisma + Postgres",
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard/reservations");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Meet Rooms · Demo listo
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Agenda salas, valida horarios y mantén el orden del equipo. (Chatgpt)
              </h1>
              <p className="text-lg text-muted-foreground">
                App base con Next.js, TypeScript, Tailwind, Prisma y NextAuth. Conectada con Postgres y ayudado por Copilot.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                Crear cuenta
              </a>
              <a
                href="/login"
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/60"
              >
                Iniciar sesión
              </a>
              <a
                href="/dashboard/reservations"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-primary underline underline-offset-4"
              >
                Ver dashboard
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-white/80 px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resumen</p>
                <p className="text-2xl font-semibold text-foreground">Panel de reservas</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Vista previa</span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Salas activas</span>
                <span className="font-semibold text-foreground">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>El 4 esta hardcodeado</span>
                <span className="font-semibold text-foreground">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Me gusta el celeste</span>
                <span className="font-semibold text-foreground">4</span>
              </div>
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-muted-foreground">
                Creo que se conecta de entrada con el .env
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-white/80 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Páginas listas</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>/login y /register</li>
              <li>/dashboard/reservations</li>
              <li>/dashboard/rooms</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-white/80 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Stack</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Next.js 14 (App Router)</li>
              <li>NextAuth credenciales</li>
              <li>Prisma + Postgres</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

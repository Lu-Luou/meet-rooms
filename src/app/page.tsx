export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Meet Rooms · Inicializado
        </p>
        <h1 className="text-4xl font-semibold text-foreground">Sistema de reservas de salas</h1>
        <p className="text-lg text-muted-foreground">
          Base de proyecto con Next.js, TypeScript, Tailwind, Prisma y NextAuth lista para continuar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-white/80 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Siguientes pasos</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. Configura variables en .env</li>
              <li>2. Ejecuta npm install</li>
              <li>3. Genera prisma client: npm run prisma:generate</li>
              <li>4. Poblado demo: npm run prisma:seed</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-white/80 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Stack listo</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Next.js + TS</li>
              <li>Tailwind configurado</li>
              <li>Prisma + SQLite</li>
              <li>NextAuth (a completar)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

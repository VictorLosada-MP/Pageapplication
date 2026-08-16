import { ApplicationForm } from '@/components/application-form'

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-5 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-14">
        <header className="flex flex-col gap-5">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground text-balance sm:text-4xl">
            Aplicación para trabajar juntos
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            Esta no es una solicitud abierta. Es un filtro para determinar si
            tiene sentido trabajar juntos.
          </p>
        </header>

        <section
          aria-label="Mensaje de honestidad"
          className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <p className="text-base font-semibold text-foreground">
            Responde con total honestidad.
          </p>
          <div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground">
            <p>
              Esta aplicación existe para filtrar. Si no eres el perfil
              correcto, es mejor que lo sepamos ahora y no después.
            </p>
            <p>
              No se trata de dar las respuestas “correctas”. Se trata de que
              ambas partes sepamos si este proceso realmente tiene sentido para
              ti y para mí.
            </p>

          </div>
        </section>

        <ApplicationForm />
      </div>
    </main>
  )
}

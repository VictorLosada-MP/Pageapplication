'use client'

import { useState } from 'react'
import {
  FieldShell,
  RadioGroupField,
  TextAreaField,
  TextField,
} from '@/components/form-fields'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  )
}

function MultiChoiceField({
  name,
  label,
  hint,
  options,
  max = 2,
}: {
  name: string
  label: string
  hint?: string
  options: string[]
  max?: number
}) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(option: string) {
    setSelected((prev) => {
      if (prev.includes(option)) {
        return prev.filter((o) => o !== option)
      }
      if (prev.length >= max) {
        return prev
      }
      return [...prev, option]
    })
  }

  return (
    <FieldShell label={label} hint={hint}>
      <input type="hidden" name={name} value={selected.join(' | ')} />
      <div className="flex flex-col gap-2.5">
        {options.map((option, i) => {
          const active = selected.includes(option)
          const disabled = !active && selected.length >= max
          return (
            <button
              key={`${name}-${i}`}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={active}
              disabled={disabled}
              className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-left text-[0.95rem] leading-relaxed shadow-sm transition-colors ${
                active
                  ? 'border-accent bg-card text-foreground ring-2 ring-accent/15'
                  : disabled
                    ? 'cursor-not-allowed border-border bg-card text-muted-foreground/60'
                    : 'border-border bg-card text-foreground hover:border-accent/40'
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                  active
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-muted-foreground/40 bg-card'
                }`}
                aria-hidden="true"
              >
                {active ? (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                  </svg>
                ) : null}
              </span>
              <span className="text-pretty">{option}</span>
            </button>
          )
        })}
      </div>
    </FieldShell>
  )
}

function ScaleField() {
  const [value, setValue] = useState<number | null>(null)
  return (
    <FieldShell label="5. En una escala del 1 al 10, ¿qué tan dispuesto estás a aprender y usar un sistema propio?">
      <input type="hidden" name="disposicion_aprender" value={value ?? ''} />
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => setValue(n)}
              aria-pressed={active}
              className={`flex h-11 items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-colors ${
                active
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-card text-foreground hover:border-accent/40'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Poco dispuesto</span>
        <span>Totalmente dispuesto</span>
      </div>
    </FieldShell>
  )
}

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  
    const form = e.currentTarget
    const formData = new FormData(form)
  
    // Armamos el objeto que espera el backend
    const payload = {
      name: formData.get('nombre'),
      business_name: formData.get('negocio'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('correo'),
      answers: {
        ventas_constantes: formData.get('ventas_constantes'),
        principal_freno: formData.get('principal_freno'),
        canales_actuales: formData.get('canales_actuales'),
        intentos_previos: formData.get('intentos_previos'),
        disposicion_aprender: formData.get('disposicion_aprender'),
        costo_actual: formData.get('costo_actual'),
        toma_decision: formData.get('toma_decision'),
        involucramiento: formData.get('involucramiento'),
        tiempo_resolver: formData.get('tiempo_resolver'),
        inversion: formData.get('inversion'),
        disponibilidad_conversacion: formData.get('disponibilidad_conversacion'),
      },
    }
  
    try {
      const res = await fetch('/api/applications', {  // ← ajusta la ruta si es diferente
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
  
      const result = await res.json()
  
      if (!res.ok) {
        console.error('Error del servidor:', result)
        alert('Hubo un error al enviar la aplicación. Intenta de nuevo.')
        return
      }
  
      // Solo si todo salió bien
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error de red:', error)
      alert('No se pudo conectar con el servidor.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Aplicación recibida
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-foreground text-balance">
          Gracias por completar la aplicación.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Revisaremos tu información y te enviaremos una respuesta a tu correo
          electrónico en un plazo máximo de 24 horas.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12" noValidate>
      {/* Datos básicos */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Datos básicos</SectionLabel>
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre completo"
          autoComplete="name"
          required
        />
        <TextField
          id="negocio"
          name="negocio"
          label="Negocio o @ de redes sociales"
          placeholder="Mi Negocio  ·  @minegocio"
          required
        />
        <TextField
          id="whatsapp"
          name="whatsapp"
          label="WhatsApp"
          type="tel"
          placeholder="+52 55 1234 5678"
          autoComplete="tel"
          hint="Tanto el WhatsApp como el correo deben ser de contacto directo, donde revises tus mensajes a diario. Ahí te responderemos."
          required
        />
        <TextField
          id="correo"
          name="correo"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          required
        />
      </section>

      <div className="h-px w-full bg-border" />

      {/* Preguntas */}
      <section className="flex flex-col gap-10">
        <SectionLabel>Preguntas</SectionLabel>

        <RadioGroupField
          name="ventas_constantes"
          label="1. ¿Tu negocio ya genera ventas de forma relativamente constante?"
          options={['Sí', 'No', 'Aún no de forma estable']}
          required
        />

        <MultiChoiceField
          name="principal_freno"
          label="2. ¿Cuál es el principal freno que sientes hoy para que tu negocio crezca más?"
          hint="Puedes elegir máximo dos opciones."
          max={2}
          options={[
            'No tengo un sistema propio para generar ventas',
            'Dependo de terceros o de plataformas externas',
            'Me falta tiempo para atender todo',
            'No logro atraer clientes de forma constante',
            'No sé cómo escalar lo que ya funciona',
            'Otro',
          ]}
        />

        <TextAreaField
          id="canales_actuales"
          name="canales_actuales"
          label="3. ¿Cómo generas actualmente las ventas y el contenido?"
          hint="Describe brevemente las herramientas o canales que usas."
          required
        />

        <TextAreaField
          id="intentos_previos"
          name="intentos_previos"
          label="4. ¿Qué has intentado hasta ahora para resolver el freno que mencionaste antes?"
          required
        />

        <ScaleField />

        <TextAreaField
          id="costo_actual"
          name="costo_actual"
          label="6. ¿Qué te está costando actualmente (en tiempo, dinero u oportunidades) no tener un sistema propio y depender de improvisar o de terceros?"
          required
        />

        <RadioGroupField
          name="toma_decision"
          label="7. ¿Eres la persona que toma la decisión final sobre este tipo de inversiones?"
          options={[
            'Sí',
            'No, tengo que consultarlo',
            'Compartimos la decisión',
          ]}
          required
        />

        <RadioGroupField
          name="involucramiento"
          label="8. ¿Entiendes que este proceso requiere que tú también te involucres para aprender y usar el sistema?"
          options={[
            'Sí, lo entiendo',
            'Prefiero una solución donde casi no tenga que participar',
          ]}
          required
        />

        <RadioGroupField
          name="tiempo_resolver"
          label="9. ¿En cuánto tiempo te gustaría tener esto resuelto?"
          options={[
            'Lo antes posible',
            '30-60 días',
            '3-6 meses',
            'Solo estoy explorando',
          ]}
          required
        />

        <RadioGroupField
          name="inversion"
          label="10. Si existiera un sistema que te diera control total e independencia para generar ventas y contenido… ¿cuánto estarías dispuesto a invertir?"
          options={[
            'Menos de $1,000 USD',
            '$1,000 - $3,000 USD',
            '$3,000 - $6,000 USD',
            '$6,000 - $10,000 USD',
            'Más de $10,000 USD',
            'Prefiero hablarlo',
          ]}
          required
        />

        <RadioGroupField
          name="disponibilidad_conversacion"
          label="11. Si tu aplicación es aprobada, ¿estás disponible para una conversación corta en los próximos 2-3 días?"
          options={[
            'Sí',
            'Depende de mi agenda',
            'Prefiero solo por escrito',
          ]}
          required
        />
      </section>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          className="w-full rounded-md bg-accent px-6 py-4 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background"
        >
          Enviar aplicación
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Responde con total honestidad. Toda la información es confidencial.
        </p>
      </div>
    </form>
  )
}
